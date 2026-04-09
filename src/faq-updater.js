import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const CONVERSATION_LOG = path.join(projectRoot, "data/conversation-log.jsonl");
const FAQ_SUGGESTIONS_FILE = path.join(projectRoot, "data/faq-suggestions.json");
const KB_FILE = path.join(projectRoot, "data/knowledge-base.json");

// ---------------------------------------------------------------------------
// Read helpers
// ---------------------------------------------------------------------------

async function readConversationLog(sinceMs) {
  try {
    const raw = await fs.readFile(CONVERSATION_LOG, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => { try { return JSON.parse(line); } catch { return null; } })
      .filter((e) => e && new Date(e.ts).getTime() >= sinceMs);
  } catch {
    return [];
  }
}

async function readSuggestions() {
  try {
    return JSON.parse(await fs.readFile(FAQ_SUGGESTIONS_FILE, "utf8"));
  } catch {
    return [];
  }
}

async function writeSuggestions(suggestions) {
  await fs.writeFile(FAQ_SUGGESTIONS_FILE, JSON.stringify(suggestions, null, 2));
}

async function readKnowledgeBase() {
  return JSON.parse(await fs.readFile(KB_FILE, "utf8"));
}

async function writeKnowledgeBase(kb) {
  await fs.writeFile(KB_FILE, JSON.stringify(kb, null, 2));
}

// ---------------------------------------------------------------------------
// AI draft generation
// ---------------------------------------------------------------------------

async function draftFaqSuggestions(gapQuestions, kb, anthropicClient, model) {
  if (!gapQuestions.length) return [];

  const existingFaqs = kb.faqs.map((f) => `- ${f.question}`).join("\n");
  const questionList = gapQuestions
    .slice(0, 30) // cap to avoid token overload
    .map((q, i) => `${i + 1}. "${q.user_message}" (asked ${q.count} time${q.count > 1 ? "s" : ""})`)
    .join("\n");

  const prompt = `You are helping improve a customer support knowledge base for Webot, a US-based crypto trading platform.

The following questions were asked by users but the bot could not answer them (handoff or fallback):
${questionList}

Existing FAQ topics (do not duplicate these):
${existingFaqs}

For each question that represents a genuinely new, answerable topic not already covered, draft a FAQ entry.
Skip questions that are too vague, account-specific, or already covered.

Respond with a JSON array of up to 5 FAQ drafts. Each item:
{
  "question": "clear FAQ question",
  "answer": "helpful, warm answer in plain text. no markdown.",
  "category": one of: account|deposits|withdrawals|trading-bots|crypto-assets|security|platform|support,
  "keywords": ["keyword1", "keyword2", ...],
  "source_questions": ["original question 1", "original question 2"]
}

If there are no good new FAQ candidates, return an empty array [].
Return only valid JSON, no extra text.`;

  const res = await anthropicClient.messages.create({
    model,
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }]
  });

  const raw = res.content.find((b) => b.type === "text")?.text || "[]";
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Group similar questions (simple dedup by normalized text)
// ---------------------------------------------------------------------------

function groupGapQuestions(entries) {
  const counts = {};
  for (const e of entries) {
    const key = e.user_message.toLowerCase().trim().slice(0, 100);
    if (!counts[key]) counts[key] = { user_message: e.user_message, count: 0 };
    counts[key].count++;
  }
  return Object.values(counts).sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------------
// Main: run daily analysis
// ---------------------------------------------------------------------------

export async function runDailyFaqAnalysis({ anthropicClient, model, notifyAgents }) {
  console.log("[faq-updater] Running daily FAQ gap analysis...");

  const since = Date.now() - 24 * 60 * 60 * 1000;
  const entries = await readConversationLog(since);
  const gaps = entries.filter((e) => ["handoff", "fallback"].includes(e.intent));

  console.log(`[faq-updater] ${entries.length} conversations, ${gaps.length} gaps in last 24h`);

  if (!gaps.length) {
    console.log("[faq-updater] No gaps found, skipping.");
    return;
  }

  const grouped = groupGapQuestions(gaps);
  const kb = await readKnowledgeBase();
  const drafts = await draftFaqSuggestions(grouped, kb, anthropicClient, model);

  if (!drafts.length) {
    console.log("[faq-updater] AI found no new FAQ candidates.");
    return;
  }

  // Save suggestions
  const existing = await readSuggestions();
  const newSuggestions = drafts.map((draft, i) => ({
    id: `S${Date.now()}-${i}`,
    status: "pending",
    created_at: new Date().toISOString(),
    source_questions: draft.source_questions || [],
    draft: {
      id: draft.question.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40),
      category: draft.category || "general",
      question: draft.question,
      answer: draft.answer,
      keywords: draft.keywords || []
    }
  }));

  await writeSuggestions([...existing, ...newSuggestions]);
  console.log(`[faq-updater] Saved ${newSuggestions.length} suggestions`);

  // Notify agents
  const lines = [
    `📊 Daily FAQ Review — ${new Date().toLocaleDateString()}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `${gaps.length} unanswered questions in the last 24h.`,
    `${newSuggestions.length} new FAQ suggestion${newSuggestions.length > 1 ? "s" : ""} drafted:\n`
  ];

  newSuggestions.forEach((s, i) => {
    lines.push(`#${i + 1} [${s.draft.category}] ${s.draft.question}`);
    lines.push(`   "${s.draft.answer.slice(0, 100)}..."`);
  });

  lines.push(`\nReview: SUGGESTIONS`);
  lines.push(`Approve: APPROVE ALL  or  APPROVE #1 #2`);
  lines.push(`Reject:  REJECT #1`);

  await notifyAgents(lines.join("\n"));
  console.log("[faq-updater] Notified agents.");
}

// ---------------------------------------------------------------------------
// Approve suggestions (moves to awaiting_confirm — preview before publishing)
// ---------------------------------------------------------------------------

export async function approveSuggestions(indices) {
  const suggestions = await readSuggestions();
  const pending = suggestions.filter((s) => s.status === "pending");

  const toApprove = indices === "all"
    ? pending
    : indices.map((i) => pending[i - 1]).filter(Boolean);

  if (!toApprove.length) return { approved: 0, message: "No matching pending suggestions found." };

  for (const s of toApprove) {
    s.status = "awaiting_confirm";
  }

  await writeSuggestions(suggestions);

  const previews = toApprove.map((s, i) => {
    const awaitingList = suggestions.filter((x) => x.status === "awaiting_confirm");
    const num = awaitingList.indexOf(s) + 1;
    return (
      `✏️ Preview #${num} [${s.draft.category}]\n` +
      `Q: ${s.draft.question}\n` +
      `A: ${s.draft.answer}\n` +
      `Keywords: ${(s.draft.keywords || []).join(", ")}`
    );
  }).join("\n\n");

  return {
    approved: toApprove.length,
    message:
      `${toApprove.length} suggestion${toApprove.length > 1 ? "s" : ""} moved to preview.\n\n` +
      previews +
      `\n\nUse CONFIRM #1 or CONFIRM ALL to publish, CANCEL #1 to go back, EDIT #1 ANSWER <text> to edit.`
  };
}

// ---------------------------------------------------------------------------
// Confirm suggestions (publishes to knowledge base)
// ---------------------------------------------------------------------------

export async function confirmSuggestions(indices) {
  const suggestions = await readSuggestions();
  const kb = await readKnowledgeBase();
  const awaiting = suggestions.filter((s) => s.status === "awaiting_confirm");

  const toConfirm = indices === "all"
    ? awaiting
    : indices.map((i) => awaiting[i - 1]).filter(Boolean);

  if (!toConfirm.length) return { confirmed: 0, message: "No matching suggestions awaiting confirmation." };

  for (const s of toConfirm) {
    s.status = "approved";
    kb.faqs.push(s.draft);
  }

  await writeSuggestions(suggestions);
  await writeKnowledgeBase(kb);

  return {
    confirmed: toConfirm.length,
    message:
      `✅ Published ${toConfirm.length} FAQ${toConfirm.length > 1 ? "s" : ""} to knowledge base:\n` +
      toConfirm.map((s) => `- ${s.draft.question}`).join("\n")
  };
}

// ---------------------------------------------------------------------------
// Cancel awaiting_confirm → back to pending
// ---------------------------------------------------------------------------

export async function cancelSuggestions(indices) {
  const suggestions = await readSuggestions();
  const awaiting = suggestions.filter((s) => s.status === "awaiting_confirm");

  const toCancel = indices === "all"
    ? awaiting
    : indices.map((i) => awaiting[i - 1]).filter(Boolean);

  if (!toCancel.length) return { cancelled: 0, message: "No matching suggestions awaiting confirmation." };

  for (const s of toCancel) s.status = "pending";
  await writeSuggestions(suggestions);

  return {
    cancelled: toCancel.length,
    message: `↩️ ${toCancel.length} suggestion${toCancel.length > 1 ? "s" : ""} returned to pending.`
  };
}

// ---------------------------------------------------------------------------
// Edit a pending or awaiting_confirm suggestion
// ---------------------------------------------------------------------------

export async function editSuggestion(index, field, newText) {
  const suggestions = await readSuggestions();
  const editable = suggestions.filter((s) => ["pending", "awaiting_confirm"].includes(s.status));
  const s = editable[index - 1];

  if (!s) return { error: `No editable suggestion at position #${index}.` };

  const allowed = ["question", "answer", "category", "keywords"];
  if (!allowed.includes(field)) {
    return { error: `Unknown field "${field}". Allowed: ${allowed.join(", ")}` };
  }

  if (field === "keywords") {
    s.draft.keywords = newText.split(",").map((k) => k.trim()).filter(Boolean);
  } else {
    s.draft[field] = newText;
  }

  await writeSuggestions(suggestions);

  return {
    message:
      `✏️ Updated ${field} of suggestion #${index}:\n` +
      `Q: ${s.draft.question}\n` +
      `A: ${s.draft.answer}\n` +
      `Category: ${s.draft.category} | Keywords: ${(s.draft.keywords || []).join(", ")}`
  };
}

// ---------------------------------------------------------------------------
// Reject suggestions
// ---------------------------------------------------------------------------

export async function rejectSuggestions(indices) {
  const suggestions = await readSuggestions();
  const pending = suggestions.filter((s) => s.status === "pending");

  const toReject = indices === "all"
    ? pending
    : indices.map((i) => pending[i - 1]).filter(Boolean);

  for (const s of toReject) s.status = "rejected";
  await writeSuggestions(suggestions);

  return {
    rejected: toReject.length,
    message: `Rejected ${toReject.length} suggestion${toReject.length > 1 ? "s" : ""}.`
  };
}

// ---------------------------------------------------------------------------
// List pending suggestions
// ---------------------------------------------------------------------------

export async function listPendingSuggestions() {
  const suggestions = await readSuggestions();
  const pending = suggestions.filter((s) => s.status === "pending");
  return pending;
}

// ---------------------------------------------------------------------------
// List awaiting_confirm suggestions
// ---------------------------------------------------------------------------

export async function listAwaitingConfirm() {
  const suggestions = await readSuggestions();
  return suggestions.filter((s) => s.status === "awaiting_confirm");
}

// ---------------------------------------------------------------------------
// Scheduler — checks every hour, runs at FAQ_UPDATE_HOUR
// ---------------------------------------------------------------------------

export function startFaqUpdateScheduler({ anthropicClient, model, notifyAgents }) {
  const targetHour = Number(process.env.FAQ_UPDATE_HOUR || 9);
  let lastRunDate = null;

  setInterval(async () => {
    const now = new Date();
    const today = now.toDateString();
    if (now.getHours() === targetHour && lastRunDate !== today) {
      lastRunDate = today;
      try {
        await runDailyFaqAnalysis({ anthropicClient, model, notifyAgents });
      } catch (err) {
        console.error("[faq-updater] Error during daily analysis:", err.message);
      }
    }
  }, 60 * 60 * 1000); // check every hour

  console.log(`[faq-updater] Scheduler started — runs daily at ${targetHour}:00`);
}
