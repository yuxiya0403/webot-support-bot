import { config as dotenvConfig } from "dotenv";
dotenvConfig({ override: true });
import express from "express";
import axios from "axios";
import AnthropicBedrock from "@anthropic-ai/bedrock-sdk";
import OpenAI from "openai";
import { TOOL_DEFINITIONS, executeToolCall } from "./tools.js";
import { scoreDocsBySimilarity } from "./embeddings.js";
import { startFaqUpdateScheduler, listPendingSuggestions, approveSuggestions, confirmSuggestions, cancelSuggestions, editSuggestion, rejectSuggestions, listAwaitingConfirm } from "./faq-updater.js";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const env = {
  mode: (process.env.MODE || "ai").trim().toLowerCase(),
  telegramMode: (process.env.TELEGRAM_MODE || "polling").trim().toLowerCase(),
  port: Number(process.env.PORT || 3000),
  baseUrl: process.env.BASE_URL || "",
  dataFile: resolveProjectPath(process.env.DATA_FILE || "./data/mappings.json"),
  knowledgeBaseFile: resolveProjectPath(process.env.KNOWLEDGE_BASE_FILE || "./data/knowledge-base.json"),
  telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || "",
  telegramWebhookSecret: process.env.TELEGRAM_WEBHOOK_SECRET || "",
  telegramPollingTimeoutSeconds: Number(process.env.TELEGRAM_POLLING_TIMEOUT_SECONDS || 30),
  intercomAccessToken: process.env.INTERCOM_ACCESS_TOKEN || "",
  intercomApiBaseUrl: process.env.INTERCOM_API_BASE_URL || "https://api.intercom.io",
  intercomApiVersion: process.env.INTERCOM_API_VERSION || "2.14",
  intercomWebhookSecret: process.env.INTERCOM_WEBHOOK_SECRET || "",
  awsRegion: process.env.AWS_REGION || "us-east-1",
  aiProvider: (process.env.AI_PROVIDER || "bedrock").trim().toLowerCase(),
  aiModel: process.env.AI_MODEL || "anthropic.claude-haiku-4-5-20251001",
  openaiApiKey: process.env.OPENAI_API_KEY || "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  aiSystemPrompt: process.env.AI_SYSTEM_PROMPT || "",
  documentPaths: parseCsv(process.env.DOCUMENT_PATHS) || [],
  knowledgeDocsDir: resolveProjectPath(process.env.KNOWLEDGE_DOCS_DIR || "./data/docs"),
  gapLogFile: resolveProjectPath(process.env.GAP_LOG_FILE || "./data/gap-log.jsonl"),
  agentChatIds: parseCsv(process.env.AGENT_CHAT_IDS) || [],
  agentBotToken: process.env.AGENT_BOT_TOKEN || "",
  historyMaxTurns: Number(process.env.HISTORY_MAX_TURNS || 10),
  historyInactivityMs: Number(process.env.HISTORY_INACTIVITY_MINUTES || 30) * 60 * 1000,
  handoffKeywords: parseCsv(process.env.HANDOFF_KEYWORDS) || [
    "人工",
    "转人工",
    "人工客服",
    "投诉",
    "退款",
    "合作",
    "紧急",
    "urgent",
    "human",
    "agent"
  ],
  humanHandoffText:
    process.env.HUMAN_HANDOFF_TEXT ||
    "这个问题我先记录，稍后由人工客服跟进。请留下你的联系方式或更具体的问题描述。",
  fallbackText:
    process.env.FALLBACK_TEXT ||
    "我暂时没有足够信息回答这个问题。你可以换个问法，或者我可以帮你转人工。"
};

const requiredVars = [
  "TELEGRAM_BOT_TOKEN"
].filter((name) => !process.env[name]);

if (requiredVars.length > 0) {
  console.warn(`Missing env vars: ${requiredVars.join(", ")}`);
}

const app = express();
app.use(express.json({ limit: "1mb" }));

const anthropicClient = new AnthropicBedrock({
  awsRegion: env.awsRegion,
  timeout: 60000 // 60s timeout
});

const openaiClient = env.aiProvider === "openai"
  ? new OpenAI({ apiKey: env.openaiApiKey, timeout: 60000 })
  : null;

const intercomClient = axios.create({
  baseURL: env.intercomApiBaseUrl,
  headers: {
    Authorization: `Bearer ${env.intercomAccessToken}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "Intercom-Version": env.intercomApiVersion
  },
  timeout: 15000
});

const telegramClient = axios.create({
  baseURL: `https://api.telegram.org/bot${env.telegramBotToken}`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000
});

// Agent bot — separate bot token for sending notifications/replies to agents
const agentBotToken = env.agentBotToken || env.telegramBotToken;
const agentBotClient = axios.create({
  baseURL: `https://api.telegram.org/bot${agentBotToken}`,
  headers: { "Content-Type": "application/json" },
  timeout: 15000
});

let writeChain = Promise.resolve();
let telegramPollingOffset = 0;
let agentBotPollingOffset = 0;
let botUsername = ""; // fetched on startup via getMe
let botUserId = 0;

// Users who have been prompted to enter feedback (chatId -> true)
const feedbackPending = new Map();

// ---------------------------------------------------------------------------
// Handoff sessions — in-memory relay between users and agents
// ---------------------------------------------------------------------------

const handoffSessions = new Map(); // ref -> session
const userHandoffMap = new Map();  // userChatId -> ref

function generateSessionRef() {
  let ref;
  do { ref = Math.random().toString(36).substring(2, 6).toUpperCase(); }
  while (handoffSessions.has(ref));
  return ref;
}

function createHandoffSession(message) {
  const ref = generateSessionRef();
  const session = {
    ref,
    userChatId: String(message.chat.id),
    userName: buildTelegramDisplayName(message.from),
    startedAt: new Date().toISOString(),
    lastActivityAt: Date.now(),
    lastUserMessageAt: Date.now(), // tracks user's last message for inactivity check
    status: "open",       // "open" | "claimed" | "resolved"
    claimedBy: null,      // { id, name } when claimed
    claimedAt: null,
    lastMessage: null,    // most recent user message for reminders
    lastReminderAt: null, // timestamp of last reminder sent
    userReminderSentAt: null // timestamp of last user inactivity reminder
  };
  handoffSessions.set(ref, session);
  userHandoffMap.set(session.userChatId, ref);
  return session;
}

function closeHandoffSession(ref) {
  const session = handoffSessions.get(ref);
  if (session) {
    userHandoffMap.delete(session.userChatId);
    handoffSessions.delete(ref);
  }
  return session;
}

function getSessionByUserChatId(chatId) {
  const ref = userHandoffMap.get(String(chatId));
  return ref ? handoffSessions.get(ref) : null;
}

function isAgentChat(chatId) {
  return env.agentChatIds.includes(String(chatId));
}

// ---------------------------------------------------------------------------
// Conversation history — in-memory, keyed by Telegram chat ID
// ---------------------------------------------------------------------------

const conversationHistories = new Map();

function getConversationHistory(chatId) {
  const entry = conversationHistories.get(String(chatId));
  if (!entry) return [];
  if (Date.now() - entry.lastActivityAt > env.historyInactivityMs) {
    conversationHistories.delete(String(chatId));
    return [];
  }
  return entry.messages;
}

function appendConversationHistory(chatId, userText, assistantText, intent) {
  const id = String(chatId);
  const entry = conversationHistories.get(id) || { messages: [], lastActivityAt: 0 };
  // Store assistant message as JSON to stay consistent with the response format the AI produces
  const assistantJson = JSON.stringify({ intent: intent || "answer", reply: assistantText });
  entry.messages.push(
    { role: "user", content: userText },
    { role: "assistant", content: assistantJson }
  );
  const maxMessages = env.historyMaxTurns * 2;
  if (entry.messages.length > maxMessages) {
    entry.messages = entry.messages.slice(-maxMessages);
  }
  entry.lastActivityAt = Date.now();
  conversationHistories.set(id, entry);
}

function clearConversationHistory(chatId) {
  conversationHistories.delete(String(chatId));
}

// ---------------------------------------------------------------------------
// Gap logging — unanswered / handed-off questions saved for KB review
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Intercom — create contact + conversation on handoff
// ---------------------------------------------------------------------------

async function createIntercomHandoffConversation({ message, userText, historyText, intent }) {
  if (!env.intercomAccessToken) {
    console.log("[intercom] no access token configured, skipping");
    return null;
  }

  const telegramUser = message.from || {};
  const userName = [telegramUser.first_name, telegramUser.last_name].filter(Boolean).join(" ") || "Telegram User";
  const externalId = `telegram_${message.chat.id}`;
  const headers = {
    Authorization: `Bearer ${env.intercomAccessToken}`,
    "Content-Type": "application/json",
    "Intercom-Version": env.intercomApiVersion
  };

  // Create or update contact
  let contactId;
  const fakeEmail = `telegram_${message.chat.id}@webot.telegram`;
  try {
    const upsertRes = await axios.post(
      `${env.intercomApiBaseUrl}/contacts`,
      { role: "user", external_id: externalId, name: userName, email: fakeEmail },
      { headers }
    );
    contactId = upsertRes.data?.id;
  } catch (err) {
    // Contact may already exist — try to find by external_id
    try {
      const searchRes = await axios.post(
        `${env.intercomApiBaseUrl}/contacts/search`,
        { query: { field: "external_id", operator: "=", value: externalId } },
        { headers }
      );
      contactId = searchRes.data?.data?.[0]?.id;
    } catch (e) {
      console.error("[intercom] failed to find/create contact:", e.response?.data || e.message);
      return null;
    }
  }

  if (!contactId) {
    console.error("[intercom] could not resolve contact ID");
    return null;
  }

  // Create conversation
  const body = [
    `Source: Telegram`,
    `User: ${userName} (chat_id: ${message.chat.id})`,
    `Reason: ${intent === "user_requested" ? "User requested human agent" : "AI could not resolve"}`,
    ``,
    `User's message: "${userText}"`,
    ``,
    `Recent conversation:`,
    historyText
  ].join("\n");

  try {
    const msgRes = await axios.post(
      `${env.intercomApiBaseUrl}/messages`,
      { message_type: "inapp", body, from: { type: "user", id: contactId } },
      { headers }
    );
    const convoId = msgRes.data?.id;
    console.log(`[intercom] created handoff conversation ${convoId} for contact ${contactId}`);
    return convoId;
  } catch (err) {
    console.error("[intercom] failed to create handoff conversation:", err.response?.data || err.message);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Agent notification — sends handoff alert to all configured agent chats
// ---------------------------------------------------------------------------

async function notifyAgents({ message, userText, intent, skipIntercom = false }) {
  console.log(`[notifyAgents] agentChatIds=${JSON.stringify(env.agentChatIds)} intent=${intent}`);
  if (!env.agentChatIds.length) {
    console.log("[notifyAgents] no agent chat IDs configured, skipping");
    return null;
  }

  const session = createHandoffSession(message);
  const history = getConversationHistory(message.chat.id);
  const recentTurns = history.slice(-6);
  const historyText = recentTurns.length
    ? recentTurns.map((m) => `${m.role === "user" ? "User" : "Bot"}: ${m.content}`).join("\n")
    : "(no prior history)";

  session.lastMessage = userText;

  // Create Intercom conversation and save mapping so follow-up messages get forwarded
  // Skip for group chats — group handoffs are handled by @webot_cs_bot, not Intercom
  if (skipIntercom) return null;
  createIntercomHandoffConversation({ message, userText, historyText, intent }).then(async (convoId) => {
    if (!convoId) return;
    const contact = await getOrCreateIntercomContact(message.from).catch(() => null);
    await upsertMapping({
      telegramChatId: String(message.chat.id),
      telegramUserId: String(message.from?.id || message.chat.id),
      telegramUsername: message.from?.username || "",
      telegramName: buildTelegramDisplayName(message.from),
      intercomContactId: contact?.id,
      intercomConversationId: String(convoId),
      lastInboundText: userText,
      lastActivityAt: new Date().toISOString(),
      status: "handoff_requested"
    });
    console.log(`[intercom] saved mapping chatId=${message.chat.id} → convoId=${convoId}`);
  }).catch((e) => console.error("[intercom] background error:", e.message));

  const notification = [
    `🎫 New Ticket [#${session.ref}] — OPEN`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 User: ${session.userName}`,
    `📋 Reason: ${intent === "user_requested" ? "User requested human agent" : "AI could not resolve"}`,
    ``,
    `💬 User's message:`,
    `"${userText}"`,
    ``,
    `📜 Recent conversation:`,
    historyText,
    `━━━━━━━━━━━━━━━━━━━━`,
    `Claim this ticket:  TAKE #${session.ref}`,
    `Reply to user:      REPLY #${session.ref} your message`,
    `Close ticket:       RESOLVE #${session.ref}`,
    `All open tickets:   SESSIONS`
  ].join("\n");

  const results = await Promise.allSettled(
    env.agentChatIds.map((chatId) =>
      agentBotClient.post("/sendMessage", { chat_id: chatId, text: notification })
    )
  );
  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.error(`[notifyAgents] failed to notify ${env.agentChatIds[i]}:`, r.reason?.response?.data || r.reason?.message);
    } else {
      console.log(`[notifyAgents] notified ${env.agentChatIds[i]} OK`);
    }
  });

  return session;
}

async function sendAgentMessage(chatId, text) {
  await agentBotClient.post("/sendMessage", { chat_id: chatId, text });
}

async function handleAgentCommand(agentChatId, text, from = null) {
  const cmd = text.trim().replace(/^\//, ""); // strip leading slash if present
  const upper = cmd.toUpperCase();
  const agentName = from ? (from.username ? `@${from.username}` : from.first_name) : "Agent";

  // SESSIONS — list active sessions
  if (upper === "SESSIONS" || upper === "STATUS" || upper === "QUEUE") {
    if (handoffSessions.size === 0) {
      await sendAgentMessage(agentChatId, "No active tickets in the queue.");
      return;
    }
    const open = [...handoffSessions.values()].filter((s) => s.status === "open");
    const claimed = [...handoffSessions.values()].filter((s) => s.status === "claimed");
    const lines = ["Support Queue", "━━━━━━━━━━━━━━━━━━━━"];
    if (open.length) {
      lines.push(`🔴 OPEN (${open.length})`);
      open.forEach((s) => {
        const age = Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 60000);
        lines.push(`  #${s.ref} — ${s.userName} (${age}m ago)`);
        lines.push(`  Claim: TAKE #${s.ref}`);
      });
    }
    if (claimed.length) {
      lines.push(`🟢 CLAIMED (${claimed.length})`);
      claimed.forEach((s) => {
        const age = Math.floor((Date.now() - new Date(s.startedAt).getTime()) / 60000);
        lines.push(`  #${s.ref} — ${s.userName} → ${s.claimedBy.name} (${age}m ago)`);
      });
    }
    await sendAgentMessage(agentChatId, lines.join("\n"));
    return;
  }

  // TAKE #REF — agent claims a ticket
  if (upper.startsWith("TAKE")) {
    const refMatch = cmd.match(/TAKE\s+#?([A-Z0-9]{4})/i);
    const session = refMatch
      ? handoffSessions.get(refMatch[1].toUpperCase())
      : handoffSessions.size === 1 ? [...handoffSessions.values()][0] : null;

    if (!session) {
      const hint = handoffSessions.size > 1 ? " Use TAKE #REF to specify." : "";
      await sendAgentMessage(agentChatId, `Ticket not found.${hint}`);
      return;
    }
    if (session.status === "claimed") {
      await sendAgentMessage(agentChatId, `Ticket #${session.ref} is already claimed by ${session.claimedBy.name}.`);
      return;
    }
    session.status = "claimed";
    session.claimedBy = { id: from?.id, name: agentName };
    session.claimedAt = Date.now();
    // Announce claim to all agent chats
    const claimMsg = `✅ Ticket #${session.ref} claimed by ${agentName}\n👤 User: ${session.userName}\nReply: REPLY #${session.ref} your message`;
    await Promise.allSettled(
      env.agentChatIds.map((id) => agentBotClient.post("/sendMessage", { chat_id: id, text: claimMsg }))
    );
    return;
  }

  // RESOLVE ALL — close every open ticket
  if (upper === "RESOLVE ALL") {
    if (handoffSessions.size === 0) {
      await sendAgentMessage(agentChatId, "No active tickets to close.");
      return;
    }
    const sessions = [...handoffSessions.values()];
    await Promise.allSettled(sessions.map(async (s) => {
      closeHandoffSession(s.ref);
      await sendTelegramMessage(s.userChatId, "Your support session has ended. Thank you for contacting Webot support. Feel free to ask if you have more questions!");
      await closeIntercomConversation(s.userChatId);
    }));
    await sendAgentMessage(agentChatId, `Closed ${sessions.length} ticket(s): ${sessions.map(s => "#" + s.ref).join(", ")}`);
    return;
  }

  // RESOLVE [#REF]
  if (upper.startsWith("RESOLVE")) {
    const refMatch = cmd.match(/RESOLVE\s+#?([A-Z0-9]{4})/i);
    const session = refMatch
      ? handoffSessions.get(refMatch[1].toUpperCase())
      : handoffSessions.size === 1 ? [...handoffSessions.values()][0] : null;

    if (!session) {
      const hint = handoffSessions.size > 1 ? " Use RESOLVE #REF when multiple sessions are active." : "";
      await sendAgentMessage(agentChatId, `No active session found.${hint}`);
      return;
    }
    closeHandoffSession(session.ref);
    await sendTelegramMessage(session.userChatId, "Your support session has ended. Thank you for contacting Webot support. Feel free to ask if you have more questions!");
    await closeIntercomConversation(session.userChatId);
    await sendAgentMessage(agentChatId, `Session #${session.ref} resolved.`);
    return;
  }

  // REPLY [#REF] <message>
  if (upper.startsWith("REPLY")) {
    const withoutCmd = cmd.slice(5).trim();
    const refMatch = withoutCmd.match(/^#?([A-Z0-9]{4})\s+([\s\S]+)$/i);
    let session, messageText;

    if (refMatch) {
      session = handoffSessions.get(refMatch[1].toUpperCase());
      messageText = refMatch[2];
    } else if (handoffSessions.size === 1) {
      session = [...handoffSessions.values()][0];
      messageText = withoutCmd;
    } else if (handoffSessions.size === 0) {
      await sendAgentMessage(agentChatId, "No active sessions.");
      return;
    } else {
      const list = [...handoffSessions.values()].map((s) => `#${s.ref}: ${s.userName}`).join("\n");
      await sendAgentMessage(agentChatId, `Multiple active sessions. Use REPLY #REF <message>:\n${list}`);
      return;
    }

    if (!session) {
      await sendAgentMessage(agentChatId, `Session not found. Type SESSIONS to see active sessions.`);
      return;
    }
    if (!messageText?.trim()) {
      await sendAgentMessage(agentChatId, "Message cannot be empty.");
      return;
    }

    console.log(`[relay] sending to userChatId=${session.userChatId} msg="${messageText.trim()}"`);
    await sendTelegramMessage(session.userChatId, messageText.trim());
    await sendAgentMessage(agentChatId, `Sent to #${session.ref}.`);
    session.lastActivityAt = Date.now();
    return;
  }

  // SUGGESTIONS — list pending and awaiting_confirm FAQ suggestions
  if (upper === "SUGGESTIONS" || upper === "SUGGEST") {
    const pending = await listPendingSuggestions();
    const awaiting = await listAwaitingConfirm();

    if (!pending.length && !awaiting.length) {
      await sendAgentMessage(agentChatId, "No pending FAQ suggestions right now.");
      return;
    }

    if (awaiting.length) {
      await sendAgentMessage(agentChatId, `⏳ Awaiting Confirmation (${awaiting.length})\n━━━━━━━━━━━━━━━━━━━━`);
      for (let i = 0; i < awaiting.length; i++) {
        const s = awaiting[i];
        const msg = [
          `#${i + 1} [${s.draft.category}] — awaiting confirm`,
          `Question: ${s.draft.question}`,
          ``,
          `Answer:`,
          s.draft.answer,
          ``,
          `Keywords: ${(s.draft.keywords || []).join(", ")}`
        ].join("\n");
        await sendAgentMessage(agentChatId, msg);
      }
      await sendAgentMessage(agentChatId, "CONFIRM ALL  |  CONFIRM #1  |  CANCEL #1  |  EDIT #1 ANSWER <text>");
    }

    if (pending.length) {
      await sendAgentMessage(agentChatId, `📝 Pending Suggestions (${pending.length})\n━━━━━━━━━━━━━━━━━━━━`);
      for (let i = 0; i < pending.length; i++) {
        const s = pending[i];
        const msg = [
          `#${i + 1} [${s.draft.category}]`,
          `Question: ${s.draft.question}`,
          ``,
          `Answer:`,
          s.draft.answer,
          ``,
          `Keywords: ${(s.draft.keywords || []).join(", ")}`,
          `Sources: ${(s.source_questions || []).slice(0, 3).join(" / ")}`
        ].join("\n");
        await sendAgentMessage(agentChatId, msg);
      }
      await sendAgentMessage(agentChatId, "APPROVE ALL  |  APPROVE #1 #2  |  REJECT #1  |  EDIT #1 ANSWER <text>");
    }
    return;
  }

  // APPROVE [ALL | #1 #2 ...] — moves to awaiting_confirm for preview
  if (upper.startsWith("APPROVE")) {
    const rest = cmd.slice(7).trim().toUpperCase();
    const indices = rest === "ALL" ? "all" : (rest.match(/\d+/g) || []).map(Number);
    if (!indices || (Array.isArray(indices) && !indices.length)) {
      await sendAgentMessage(agentChatId, "Usage: APPROVE ALL  or  APPROVE #1 #2");
      return;
    }
    const result = await approveSuggestions(indices);
    await sendAgentMessage(agentChatId, result.message);
    return;
  }

  // CONFIRM [ALL | #1 #2 ...] — publishes to knowledge base
  if (upper.startsWith("CONFIRM")) {
    const rest = cmd.slice(7).trim().toUpperCase();
    const indices = rest === "ALL" ? "all" : (rest.match(/\d+/g) || []).map(Number);
    if (!indices || (Array.isArray(indices) && !indices.length)) {
      await sendAgentMessage(agentChatId, "Usage: CONFIRM ALL  or  CONFIRM #1 #2");
      return;
    }
    const result = await confirmSuggestions(indices);
    await sendAgentMessage(agentChatId, result.message);
    return;
  }

  // CANCEL [ALL | #1 #2 ...] — returns awaiting_confirm back to pending
  if (upper.startsWith("CANCEL")) {
    const rest = cmd.slice(6).trim().toUpperCase();
    const indices = rest === "ALL" ? "all" : (rest.match(/\d+/g) || []).map(Number);
    if (!indices || (Array.isArray(indices) && !indices.length)) {
      await sendAgentMessage(agentChatId, "Usage: CANCEL ALL  or  CANCEL #1");
      return;
    }
    const result = await cancelSuggestions(indices);
    await sendAgentMessage(agentChatId, result.message);
    return;
  }

  // EDIT #1 FIELD <text>
  // e.g. EDIT #1 ANSWER The fee is 0.1%
  //      EDIT #2 QUESTION How do I deposit?
  //      EDIT #1 KEYWORDS fee, trading, cost
  if (upper.startsWith("EDIT")) {
    const editMatch = cmd.match(/^EDIT\s+#?(\d+)\s+(ANSWER|QUESTION|CATEGORY|KEYWORDS)\s+([\s\S]+)$/i);
    if (!editMatch) {
      await sendAgentMessage(agentChatId,
        "Usage: EDIT #1 ANSWER <new answer text>\n" +
        "       EDIT #1 QUESTION <new question text>\n" +
        "       EDIT #1 CATEGORY <category>\n" +
        "       EDIT #1 KEYWORDS keyword1, keyword2"
      );
      return;
    }
    const [, indexStr, field, newText] = editMatch;
    const result = await editSuggestion(Number(indexStr), field.toLowerCase(), newText.trim());
    await sendAgentMessage(agentChatId, result.error ? `⚠️ ${result.error}` : result.message);
    return;
  }

  // REJECT [ALL | #1 #2 ...]
  if (upper.startsWith("REJECT")) {
    const rest = cmd.slice(6).trim().toUpperCase();
    const indices = rest === "ALL" ? "all" : (rest.match(/\d+/g) || []).map(Number);
    if (!indices || (Array.isArray(indices) && !indices.length)) {
      await sendAgentMessage(agentChatId, "Usage: REJECT ALL  or  REJECT #1 #2");
      return;
    }
    const result = await rejectSuggestions(indices);
    await sendAgentMessage(agentChatId, `🗑️ ${result.message}`);
    return;
  }

  // Unknown command — show help
  await sendAgentMessage(agentChatId, [
    "Webot Agent Commands",
    "━━━━━━━━━━━━━━━━━━━━",
    "TAKE #REF         — claim a ticket",
    "REPLY #REF msg    — reply to a user",
    "RESOLVE #REF      — close a ticket",
    "SESSIONS          — view the full queue",
    "",
    "FAQ Suggestions:",
    "SUGGESTIONS       — view all suggestions",
    "APPROVE ALL       — stage all for preview",
    "APPROVE #1 #2     — stage specific suggestions",
    "EDIT #1 ANSWER … — edit before confirming",
    "CONFIRM ALL       — publish to knowledge base",
    "CONFIRM #1        — publish specific suggestion",
    "CANCEL #1         — return to pending",
    "REJECT #1         — reject a suggestion",
    "",
    "Example flow:",
    "  SUGGESTIONS",
    "  EDIT #2 ANSWER The fee is 0.1% per trade.",
    "  APPROVE #1 #2",
    "  CONFIRM ALL",
    "",
    "(#REF is optional when only 1 ticket is active)"
  ].join("\n"));
}

async function forwardUserMessageToAgent(session, userText) {
  session.lastMessage = userText;
  session.lastUserMessageAt = Date.now();
  session.userReminderSentAt = null; // reset reminder on new message
  const claimedInfo = session.claimedBy ? ` → ${session.claimedBy.name}` : " (OPEN — use TAKE #" + session.ref + " to claim)";
  const notification = `💬 [#${session.ref}]${claimedInfo}\n${session.userName}: ${userText}\n\nReply: REPLY #${session.ref} your message`;
  await Promise.allSettled(
    env.agentChatIds.map((chatId) =>
      agentBotClient.post("/sendMessage", { chat_id: chatId, text: notification })
    )
  );

  // Also forward to Intercom if we have a saved conversation
  if (env.intercomAccessToken) {
    try {
      const store = await readStore();
      const mapping = store.byTelegramChatId?.[String(session.userChatId)];
      if (mapping?.intercomConversationId && mapping?.intercomContactId) {
        await replyToIntercomConversation(mapping.intercomConversationId, mapping.intercomContactId, userText);
        console.log(`[intercom] forwarded follow-up to convo ${mapping.intercomConversationId}`);
      }
    } catch (e) {
      console.error("[intercom] failed to forward follow-up:", e.message);
    }
  }
}

async function logGap({ userText, intent, hadPartialFaqMatch }) {
  const entry = {
    ts: new Date().toISOString(),
    intent,
    hadPartialFaqMatch,
    question: userText
  };
  try {
    await fs.mkdir(path.dirname(env.gapLogFile), { recursive: true });
    await fs.appendFile(env.gapLogFile, JSON.stringify(entry) + "\n");
  } catch (err) {
    console.error("Failed to write gap log", err.message);
  }
}

async function logConversation({ chatId, userName, userText, botReply, intent, faqMatched, inGroup, lang }) {
  const entry = {
    ts: new Date().toISOString(),
    chat_id: String(chatId),
    user_name: userName || null,
    in_group: inGroup,
    lang,
    user_message: userText,
    bot_reply: botReply,
    intent,                          // answer | handoff | fallback | ignore | welcome
    faq_matched: faqMatched || null  // FAQ id if a match was used
  };
  try {
    const logFile = path.join(path.dirname(env.gapLogFile), "conversation-log.jsonl");
    await fs.mkdir(path.dirname(logFile), { recursive: true });
    await fs.appendFile(logFile, JSON.stringify(entry) + "\n");
  } catch (err) {
    console.error("Failed to write conversation log", err.message);
  }
}

app.get("/", async (_req, res) => {
  res.json({
    ok: true,
    service: env.mode === "intercom" ? "tg-intercom-bridge" : "tg-ai-demo-bot",
    mode: env.mode,
    telegramMode: env.telegramMode,
    telegramWebhook: joinBaseUrl("/webhooks/telegram"),
    intercomWebhook: joinBaseUrl(`/webhooks/intercom?secret=${env.intercomWebhookSecret || "YOUR_SECRET"}`)
  });
});

app.head("/webhooks/intercom", async (_req, res) => {
  res.sendStatus(200);
});

app.post("/webhooks/telegram", async (req, res) => {
  try {
    verifyTelegramSecret(req);

    const message = extractTelegramMessage(req.body);
    if (!message) {
      res.status(200).json({ ok: true, ignored: "unsupported_update" });
      return;
    }

    const inGroup = isGroupChat(message);

    const rawText = message.text?.trim();
    const userText = inGroup ? stripBotMention(rawText || "") : rawText;
    const replyToMessageId = inGroup ? message.message_id : undefined;

    if (!userText) {
      await sendTelegramMessage(message.chat.id, "Only text messages are supported right now.", replyToMessageId);
      res.status(200).json({ ok: true, ignored: "non_text_message" });
      return;
    }

    // Agent chat — handle commands
    if (isAgentChat(String(message.chat.id))) {
      await handleAgentCommand(String(message.chat.id), userText);
      res.status(200).json({ ok: true, mode: "agent_command" });
      return;
    }

    // User in active handoff — forward to agent
    const activeSession = getSessionByUserChatId(message.chat.id);
    if (activeSession) {
      await forwardUserMessageToAgent(activeSession, userText);
      await sendTelegramMessage(message.chat.id, "Your message has been forwarded to our support agent.", replyToMessageId);
      res.status(200).json({ ok: true, mode: "relay" });
      return;
    }

    if (env.mode === "ai") {
      const messageWithStrippedText = { ...message, text: userText };
      const isMentioned = inGroup && isBotMentioned(message);
      const reply = await buildAiReply(messageWithStrippedText, inGroup, isMentioned);
      if (reply.intent === "ignore") {
        res.status(200).json({ ok: true, mode: env.mode, intent: reply.intent });
        return;
      }
      if (!reply.skipSend) {
        await sendTelegramMessage(message.chat.id, reply.text, replyToMessageId);
      }
      await upsertMapping({
        telegramChatId: String(message.chat.id),
        telegramUserId: String(message.from.id),
        telegramUsername: message.from.username || "",
        telegramName: buildTelegramDisplayName(message.from),
        lastInboundText: userText,
        lastOutboundText: reply.text,
        lastIntent: reply.intent,
        lastActivityAt: new Date().toISOString(),
        status: reply.intent === "handoff" ? "handoff_requested" : "open"
      });
      res.status(200).json({ ok: true, mode: env.mode, intent: reply.intent });
      return;
    }

    const contact = await getOrCreateIntercomContact(message.from);
    const store = await readStore();
    const existingMapping = store.byTelegramChatId[String(message.chat.id)];

    let conversationId = existingMapping?.intercomConversationId;
    if (conversationId) {
      await replyToIntercomConversation(conversationId, contact.id, userText);
    } else {
      const createdMessage = await createIntercomConversation(contact.id, userText);
      conversationId = extractConversationId(createdMessage);
      if (!conversationId) {
        throw new Error("Intercom did not return a conversation_id for the new conversation.");
      }
    }

    await upsertMapping({
      telegramChatId: String(message.chat.id),
      telegramUserId: String(message.from.id),
      telegramUsername: message.from.username || "",
      telegramName: buildTelegramDisplayName(message.from),
      intercomContactId: contact.id,
      intercomConversationId: conversationId,
      lastInboundText: userText,
      lastActivityAt: new Date().toISOString(),
      status: "open"
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error", formatError(error));
    res.status(error.status || 500).json({ ok: false });
  }
});

app.post("/webhooks/intercom", async (req, res) => {
  try {
    verifyIntercomSecret(req);

    const topic = req.body?.topic || req.body?.data?.topic || "";
    if (!["conversation.admin.replied", "conversation.operator.replied"].includes(topic)) {
      res.status(200).json({ ok: true, ignored: "topic_not_forwarded" });
      return;
    }

    const conversationId = extractConversationId(req.body);
    if (!conversationId) {
      res.status(200).json({ ok: true, ignored: "no_conversation_id" });
      return;
    }

    const store = await readStore();
    const mapping = store.byConversationId[String(conversationId)];
    if (!mapping) {
      res.status(200).json({ ok: true, ignored: "unmapped_conversation" });
      return;
    }

    let text = extractReplyText(req.body);
    if (!text) {
      const conversation = await getIntercomConversation(conversationId);
      text = extractReplyText(conversation);
    }

    if (!text) {
      res.status(200).json({ ok: true, ignored: "empty_reply" });
      return;
    }

    await sendTelegramMessage(mapping.telegramChatId, text);
    await upsertMapping({
      ...mapping,
      lastOutboundText: text,
      lastActivityAt: new Date().toISOString()
    });

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Intercom webhook error", formatError(error));
    res.status(error.status || 500).json({ ok: false });
  }
});

app.listen(env.port, async () => {
  await ensureStore();
  await fetchBotInfo();
  console.log(`Listening on port ${env.port}`);
  if (env.telegramMode === "polling") {
    await deleteTelegramWebhook();
    await sleep(3000); // wait for any stale polling connections to expire
    startTelegramPollingLoop().catch((error) => {
      console.error("Telegram polling loop stopped", formatError(error));
    });
    if (env.agentBotToken) {
      startAgentBotPollingLoop().catch((error) => {
        console.error("Agent bot polling loop stopped", formatError(error));
      });
    }
  }
  startTicketReminderLoop();
  startUserInactivityLoop();
  startFaqUpdateScheduler({
    anthropicClient,
    model: env.aiModel,
    notifyAgents: (text) => Promise.allSettled(
      env.agentChatIds.map((id) => agentBotClient.post("/sendMessage", { chat_id: id, text }))
    )
  });
});

function startUserInactivityLoop() {
  const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutes
  setInterval(async () => {
    const now = Date.now();
    for (const session of [...handoffSessions.values()]) {
      const lastMsg = session.lastUserMessageAt || new Date(session.startedAt).getTime();
      if (now - lastMsg < INACTIVITY_MS) continue;
      console.log(`[inactivity] auto-closing ticket #${session.ref} after 10min inactivity`);
      closeHandoffSession(session.ref);
      await Promise.allSettled(
        env.agentChatIds.map((id) =>
          agentBotClient.post("/sendMessage", { chat_id: id, text: `🕐 Ticket #${session.ref} auto-closed — user inactive for 10 minutes.` })
        )
      );
      try {
        await sendWithKeyboard(session.userChatId,
          "Your support session has been automatically closed as we haven't heard from you in a while. If you still need help, feel free to reach out anytime!",
          [[{ text: "« Back to menu", callback_data: "home" }]]
        );
      } catch (err) {
        console.error(`[inactivity] failed to notify user for #${session.ref}:`, err.message);
      }
    }
  }, 60 * 1000); // check every minute
}

function startTicketReminderLoop() {
  const REMINDER_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes
  setInterval(async () => {
    const now = Date.now();
    for (const session of handoffSessions.values()) {
      if (session.status !== "open") continue;
      const age = now - new Date(session.startedAt).getTime();
      if (age < REMINDER_INTERVAL_MS) continue;
      const lastReminder = session.lastReminderAt || new Date(session.startedAt).getTime();
      if (now - lastReminder < REMINDER_INTERVAL_MS) continue;
      session.lastReminderAt = now;
      const ageMin = Math.floor(age / 60000);
      const reminder = [
        `⏰ Reminder: Ticket [#${session.ref}] is still UNCLAIMED (${ageMin} min)`,
        `👤 ${session.userName}: "${session.lastMessage || "..."}"`,
        `Claim now: TAKE #${session.ref}`
      ].join("\n");
      await Promise.allSettled(
        env.agentChatIds.map((id) => agentBotClient.post("/sendMessage", { chat_id: id, text: reminder }))
      );
      console.log(`[reminder] sent for unclaimed ticket #${session.ref}`);
    }
  }, 60 * 1000); // check every minute
}

async function fetchBotInfo() {
  try {
    const res = await telegramClient.get("/getMe");
    botUsername = res.data?.result?.username || "";
    botUserId = res.data?.result?.id || 0;
    console.log(`Bot username: @${botUsername} (id: ${botUserId})`);
  } catch (err) {
    console.error("Failed to fetch bot info", err.message);
  }
}

function isGroupChat(message) {
  return ["group", "supergroup"].includes(message.chat?.type);
}

function isBotMentioned(message) {
  if (!botUsername) return false;
  const mention = `@${botUsername}`.toLowerCase();
  const text = (message.text || "").toLowerCase();
  if (text.includes(mention)) return true;
  // Also check entities for explicit @mention
  const entities = message.entities || [];
  return entities.some((e) => e.type === "mention" && text.slice(e.offset, e.offset + e.length) === mention);
}

function stripBotMention(text) {
  if (!botUsername) return text;
  return text.replace(new RegExp(`@${botUsername}\\s*`, "gi"), "").trim();
}

function resolveProjectPath(filePath) {
  return path.isAbsolute(filePath) ? filePath : path.resolve(projectRoot, filePath);
}

function joinBaseUrl(route) {
  if (!env.baseUrl) {
    return route;
  }
  return `${env.baseUrl.replace(/\/$/, "")}${route}`;
}

async function ensureStore() {
  await fs.mkdir(path.dirname(env.dataFile), { recursive: true });
  try {
    await fs.access(env.dataFile);
  } catch {
    await fs.writeFile(
      env.dataFile,
      JSON.stringify({ byTelegramChatId: {}, byConversationId: {} }, null, 2)
    );
  }

  await ensureKnowledgeBase();
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(env.dataFile, "utf8");
  return JSON.parse(raw);
}

async function writeStore(nextStore) {
  writeChain = writeChain.then(async () => {
    await fs.mkdir(path.dirname(env.dataFile), { recursive: true });
    await fs.writeFile(env.dataFile, JSON.stringify(nextStore, null, 2));
  });
  await writeChain;
}

async function upsertMapping(mapping) {
  const store = await readStore();
  store.byTelegramChatId[mapping.telegramChatId] = mapping;
  if (mapping.intercomConversationId) {
    store.byConversationId[mapping.intercomConversationId] = mapping;
  }
  await writeStore(store);
}

async function ensureKnowledgeBase() {
  await fs.mkdir(path.dirname(env.knowledgeBaseFile), { recursive: true });
  if (fsSync.existsSync(env.knowledgeBaseFile)) {
    return;
  }

  const seed = {
    businessName: "Webot (formerly Pionex.US)",
    summary: "Webot (formerly Pionex.US) is a US-based cryptocurrency trading platform offering automated trading bots, spot trading, and portfolio management tools.",
    handoffContact: "@webot_cs_bot",
    faqs: []
  };

  await fs.writeFile(env.knowledgeBaseFile, JSON.stringify(seed, null, 2));
}

function verifyTelegramSecret(req) {
  if (!env.telegramWebhookSecret) {
    return;
  }
  const providedSecret = req.get("x-telegram-bot-api-secret-token");
  if (providedSecret !== env.telegramWebhookSecret) {
    const error = new Error("Telegram webhook secret mismatch.");
    error.status = 401;
    throw error;
  }
}

function verifyIntercomSecret(req) {
  if (!env.intercomWebhookSecret) {
    return;
  }
  if (req.query.secret !== env.intercomWebhookSecret) {
    const error = new Error("Intercom webhook secret mismatch.");
    error.status = 401;
    throw error;
  }
}

function extractTelegramMessage(update) {
  return update?.message || update?.edited_message || null;
}

function buildTelegramDisplayName(user) {
  return [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username || `Telegram ${user.id}`;
}

async function getOrCreateIntercomContact(telegramUser) {
  const externalId = `telegram:${telegramUser.id}`;

  try {
    const existing = await intercomClient.get(`/contacts/find_by_external_id/${encodeURIComponent(externalId)}`);
    return existing.data;
  } catch (error) {
    if (error.response?.status !== 404) {
      throw error;
    }
  }

  const created = await intercomClient.post("/contacts", {
    role: "user",
    external_id: externalId,
    name: buildTelegramDisplayName(telegramUser)
  });

  return created.data;
}

async function createIntercomConversation(contactId, text) {
  const response = await intercomClient.post("/conversations", {
    from: {
      type: "user",
      id: contactId
    },
    body: text
  });

  return response.data;
}

async function replyToIntercomConversation(conversationId, contactId, text) {
  const response = await intercomClient.post(`/conversations/${conversationId}/reply`, {
    message_type: "comment",
    type: "user",
    intercom_user_id: contactId,
    body: text
  });

  return response.data;
}

async function getIntercomConversation(conversationId) {
  const response = await intercomClient.get(`/conversations/${conversationId}`);
  return response.data;
}

async function closeIntercomConversation(telegramChatId) {
  if (!env.intercomAccessToken) return;
  try {
    const store = await readStore();
    const mapping = store.byTelegramChatId?.[String(telegramChatId)];
    if (!mapping?.intercomConversationId) return;
    const headers = {
      Authorization: `Bearer ${env.intercomAccessToken}`,
      "Content-Type": "application/json",
      "Intercom-Version": env.intercomApiVersion
    };
    await axios.post(
      `${env.intercomApiBaseUrl}/conversations/${mapping.intercomConversationId}/parts`,
      { message_type: "close", type: "admin", admin_id: "255522" },
      { headers }
    );
    console.log(`[intercom] closed conversation ${mapping.intercomConversationId}`);
  } catch (e) {
    console.error("[intercom] failed to close conversation:", e.response?.data || e.message);
  }
}

function extractConversationId(payload) {
  const directConversationId = payload?.type === "conversation" ? payload.id : null;
  const value =
    payload?.conversation_id ||
    directConversationId ||
    payload?.data?.item?.id ||
    payload?.data?.conversation?.id ||
    payload?.conversation?.id ||
    payload?.data?.item?.conversation_id ||
    "";

  return String(value).trim() || null;
}

function extractReplyText(payload) {
  const candidates = [];

  const conversation = payload?.data?.item?.type === "conversation" ? payload.data.item : payload;
  const parts = conversation?.conversation_parts?.conversation_parts || [];
  const latestPart = [...parts].reverse().find(isOutboundPart);

  if (latestPart?.body) {
    candidates.push(latestPart.body);
  }
  if (conversation?.body) {
    candidates.push(conversation.body);
  }
  if (payload?.data?.item?.body) {
    candidates.push(payload.data.item.body);
  }

  for (const value of candidates) {
    const normalized = normalizeIntercomText(value);
    if (normalized) {
      return normalized;
    }
  }

  return "";
}

function isOutboundPart(part) {
  const authorType = part?.author?.type || part?.admin?.type || "";
  const partType = part?.part_type || "";
  return ["admin", "teammate_reference"].includes(authorType) || partType === "operator_reply";
}

function normalizeIntercomText(text) {
  if (!text) {
    return "";
  }

  return decodeHtmlEntities(
    String(text)
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  );
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function stripMarkdown(text) {
  // Preserve code blocks and URLs before stripping markdown (underscores in URLs must not be treated as italic)
  const codeBlocks = [];
  const urls = [];
  const withPlaceholders = text
    .replace(/```[\s\S]*?```/g, (m) => {
      codeBlocks.push(m);
      return `\x00CB${codeBlocks.length - 1}\x00`;
    })
    .replace(/https?:\/\/[^\s)>\]"]+/g, (m) => {
      urls.push(m);
      return `\x00URL${urls.length - 1}\x00`;
    });
  const stripped = withPlaceholders
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/_(.+?)_/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .trim();
  return stripped
    .replace(/\x00URL(\d+)\x00/g, (_, i) => urls[Number(i)])
    .replace(/\x00CB(\d+)\x00/g, (_, i) => codeBlocks[Number(i)]);
}

async function sendTyping(chatId) {
  try {
    await telegramClient.post("/sendChatAction", { chat_id: chatId, action: "typing" });
  } catch { /* non-critical */ }
}

async function sendTelegramMessage(chatId, text, replyToMessageId) {
  const processed = stripMarkdown(text);
  const payload = { chat_id: chatId, text: processed };
  if (replyToMessageId) payload.reply_to_message_id = replyToMessageId;
  if (processed.includes("```")) payload.parse_mode = "Markdown";
  await telegramClient.post("/sendMessage", payload);
}

async function sendTelegramPhoto(chatId, fileId, caption) {
  await telegramClient.post("/sendPhoto", { chat_id: chatId, photo: fileId, caption: caption || "" });
}

async function sendWithKeyboard(chatId, text, inlineKeyboard) {
  await telegramClient.post("/sendMessage", {
    chat_id: chatId,
    text,
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

async function editMessageKeyboard(chatId, messageId, text, inlineKeyboard) {
  await telegramClient.post("/editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    reply_markup: { inline_keyboard: inlineKeyboard }
  });
}

async function answerCallback(callbackQueryId, text = "") {
  await telegramClient.post("/answerCallbackQuery", { callback_query_id: callbackQueryId, text });
}

const CATEGORY_LABELS = {
  "account":      "👤 Account",
  "deposits":     "💰 Deposits",
  "withdrawals":  "💸 Withdrawals",
  "trading-bots": "🤖 Trading Bots",
  "trading":      "📈 Trading",
  "crypto-assets":"🪙 Crypto Assets",
  "security":     "🔒 Security",
  "tax":          "🧾 Tax",
  "platform":     "🏠 Platform",
  "support":      "🎧 Support"
};

async function processCallbackQuery(cbq) {
  const chatId = String(cbq.message.chat.id);
  const msgId = cbq.message.message_id;
  const data = cbq.data;
  const lang = detectLanguage("", cbq.message?.text || "");

  await answerCallback(cbq.id);

  // Show category list
  if (data === "browse_faqs") {
    const kb = await loadKnowledgeBase();
    const categories = [...new Set(kb.faqs.map((f) => f.category).filter(Boolean))];
    const buttons = categories.map((c) => [{
      text: CATEGORY_LABELS[c] || c,
      callback_data: `cat_${c}`
    }]);
    buttons.push([{ text: "« Back", callback_data: "home" }]);
    await editMessageKeyboard(chatId, msgId, "Choose a category:", buttons);
    return;
  }

  // Show FAQs in a category
  if (data.startsWith("cat_")) {
    const category = data.slice(4);
    const kb = await loadKnowledgeBase();
    const faqs = kb.faqs.filter((f) => f.category === category);
    if (!faqs.length) {
      await sendTelegramMessage(chatId, "No FAQs found in this category.");
      return;
    }
    const buttons = faqs.map((f) => [{ text: f.question, callback_data: `faq_${f.id}` }]);
    buttons.push([{ text: "« Categories", callback_data: "browse_faqs" }]);
    const label = CATEGORY_LABELS[category] || category;
    await editMessageKeyboard(chatId, msgId, `${label} — select a question:`, buttons);
    return;
  }

  // Show a specific FAQ answer
  if (data.startsWith("faq_")) {
    const faqId = data.slice(4);
    const kb = await loadKnowledgeBase();
    const faq = kb.faqs.find((f) => f.id === faqId);
    if (!faq) {
      await sendTelegramMessage(chatId, "FAQ not found.");
      return;
    }
    await editMessageKeyboard(chatId, msgId,
      `${faq.question}\n\n${faq.answer}`,
      [[{ text: "« Back to category", callback_data: `cat_${faq.category}` }]]
    );
    // Send images if any
    if (faq.images?.length) {
      await sendFaqImages(chatId, faqId, kb.faqs);
    }
    return;
  }

  // Human agent
  if (data === "human_agent") {
    const lang = detectLanguage("", "");
    await editMessageKeyboard(chatId, msgId,
      buildHandoffMessage(lang),
      [[{ text: "« Back", callback_data: "home" }]]
    );
    return;
  }

  // Business partnerships
  if (data === "partnerships") {
    await editMessageKeyboard(chatId, msgId,
      "For business partnerships and collaboration inquiries, please reach out to us at:\n\npartnerships@webot.com\n\nWe typically respond within 1-2 business days.",
      [[{ text: "« Back", callback_data: "home" }]]
    );
    return;
  }

  // Feedback prompt
  if (data === "feedback") {
    feedbackPending.set(chatId, true);
    await editMessageKeyboard(chatId, msgId,
      "We'd love to hear from you! Please type your feedback and send it:",
      [[{ text: "« Cancel", callback_data: "home" }]]
    );
    return;
  }

  // User closes their own ticket
  if (data.startsWith("close_ticket_")) {
    const ref = data.slice("close_ticket_".length);
    const session = handoffSessions.get(ref);
    if (session) {
      closeHandoffSession(ref);
      await Promise.allSettled(
        env.agentChatIds.map((id) =>
          agentBotClient.post("/sendMessage", { chat_id: id, text: `✅ Ticket #${ref} closed by user — problem resolved.` })
        )
      );
    }
    await editMessageKeyboard(chatId, msgId,
      "Great, glad your problem is solved! Feel free to reach out anytime if you need help.",
      [[{ text: "« Back to menu", callback_data: "home" }]]
    );
    return;
  }

  // User is still waiting
  if (data.startsWith("still_waiting_")) {
    const ref = data.slice("still_waiting_".length);
    const session = handoffSessions.get(ref);
    if (session) session.userReminderSentAt = null; // allow re-reminder later
    await editMessageKeyboard(chatId, msgId,
      "Thanks for your patience! Our agents are working on your request and will get back to you soon.",
      []
    );
    return;
  }

  // Back to home
  if (data === "home") {
    const kb = await loadKnowledgeBase();
    const text = buildWelcomeMessage(kb, lang);
    const keyboard = buildHomeKeyboard();
    await editMessageKeyboard(chatId, msgId, text, keyboard);
    return;
  }
}

function buildHomeKeyboard() {
  return [
    [{ text: "❓ Browse FAQs", callback_data: "browse_faqs" }],
    [{ text: "👤 Human Agent", callback_data: "human_agent" }],
    [{ text: "🤝 Business Partnerships", callback_data: "partnerships" }],
    [{ text: "💬 Leave Feedback", callback_data: "feedback" }]
  ];
}

async function sendFaqImages(chatId, faqId, faqs) {
  if (!faqId) return;
  const faq = faqs.find((f) => f.id === faqId);
  if (!faq?.images?.length) return;
  for (const img of faq.images) {
    try {
      await sendTelegramPhoto(chatId, img.file_id, img.caption || "");
    } catch (err) {
      console.error(`[images] failed to send image for FAQ ${faqId}:`, err.message);
    }
  }
}

async function startTelegramPollingLoop() {
  console.log("Telegram polling mode enabled.");

  while (true) {
    try {
      const response = await telegramClient.get("/getUpdates", {
        params: {
          offset: telegramPollingOffset,
          timeout: env.telegramPollingTimeoutSeconds
        },
        timeout: (env.telegramPollingTimeoutSeconds + 10) * 1000
      });

      const updates = response.data?.result || [];
      for (const update of updates) {
        telegramPollingOffset = Number(update.update_id) + 1;
        try {
          if (update.callback_query) {
            await processCallbackQuery(update.callback_query);
          } else {
            await processTelegramUpdate(update);
          }
        } catch (err) {
          console.error("processTelegramUpdate error", err.stack || err.message);
        }
      }
    } catch (error) {
      console.error("Telegram polling error", formatError(error));
      await sleep(3000);
    }
  }
}

async function startAgentBotPollingLoop() {
  console.log("Agent bot polling mode enabled.");
  try {
    await agentBotClient.post("/deleteWebhook", { drop_pending_updates: false });
  } catch {}

  while (true) {
    try {
      const response = await agentBotClient.get("/getUpdates", {
        params: { offset: agentBotPollingOffset, timeout: env.telegramPollingTimeoutSeconds },
        timeout: (env.telegramPollingTimeoutSeconds + 10) * 1000
      });
      const updates = response.data?.result || [];
      for (const update of updates) {
        agentBotPollingOffset = Number(update.update_id) + 1;
        const message = extractTelegramMessage(update);
        if (!message) continue;
        if (!isAgentChat(String(message.chat.id))) {
          console.log(`[agent-bot] ignored unauthorized chatId=${message.chat.id}`);
          continue;
        }
        // Photo upload — re-upload via user bot to get a valid file_id
        if (message.photo?.length) {
          const largest = message.photo[message.photo.length - 1];
          const agentFileId = largest.file_id;
          console.log(`[agent-bot] photo received, re-uploading via user bot...`);
          try {
            // Get download URL from agent bot
            const fileInfo = await agentBotClient.get(`/getFile?file_id=${agentFileId}`);
            const filePath = fileInfo.data.result.file_path;
            const fileUrl = `https://api.telegram.org/file/bot${agentBotToken}/${filePath}`;
            // Download the file bytes
            const fileRes = await axios.get(fileUrl, { responseType: "arraybuffer" });
            const fileBytes = Buffer.from(fileRes.data);
            // Re-upload via user bot using multipart form
            const FormData = (await import("form-data")).default;
            const form = new FormData();
            form.append("chat_id", String(message.chat.id));
            form.append("photo", fileBytes, { filename: "photo.jpg", contentType: "image/jpeg" });
            const sent = await telegramClient.post("/sendPhoto", form, { headers: form.getHeaders() });
            const userBotFileId = sent.data.result.photo.slice(-1)[0].file_id;
            await sendAgentMessage(String(message.chat.id),
              `File ID (user bot — ready to use):\n${userBotFileId}\n\nAdd to knowledge base:\n"images": [{ "file_id": "${userBotFileId}", "caption": "description" }]`
            );
          } catch (err) {
            console.error("[agent-bot] photo re-upload failed:", err.message);
            await sendAgentMessage(String(message.chat.id), `Failed to re-upload photo: ${err.message}`);
          }
          continue;
        }
        if (!message.text?.trim()) continue;
        console.log(`[agent-bot] from chatId=${message.chat.id}: ${message.text.trim()}`);
        await handleAgentCommand(String(message.chat.id), message.text.trim(), message.from);
      }
    } catch (error) {
      console.error("Agent bot polling error", formatError(error));
      await sleep(3000);
    }
  }
}

async function deleteTelegramWebhook() {
  try {
    await telegramClient.post("/deleteWebhook", {
      drop_pending_updates: false
    });
  } catch (error) {
    console.error("Failed to delete Telegram webhook before polling", formatError(error));
  }
}

async function processTelegramUpdate(update) {
  const message = extractTelegramMessage(update);
  if (!message) return;

  const chatId = message.chat.id;
  const inGroup = isGroupChat(message);

  const rawText = message.text?.trim();
  const userText = inGroup ? stripBotMention(rawText || "") : rawText;
  const replyToMessageId = inGroup ? message.message_id : undefined;

  // Photo upload from agent — return file_id for knowledge base use
  // Agents DM the user bot with a screenshot to get a valid file_id
  if (!inGroup && message.photo?.length && env.agentChatIds.includes(String(chatId))) {
    const largest = message.photo[message.photo.length - 1];
    const fileId = largest.file_id;
    console.log(`[upload] agent photo file_id=${fileId} from chatId=${chatId}`);
    await sendTelegramMessage(chatId,
      `File ID (use with user bot):\n${fileId}\n\nAdd to knowledge base:\n"images": [{ "file_id": "${fileId}", "caption": "description" }]`
    );
    return;
  }

  if (!userText) {
    if (inGroup) return; // Ignore empty messages in group (join events, deleted messages, etc.)
    await sendTelegramMessage(chatId, "Only text messages are supported right now.", replyToMessageId);
    return;
  }

  // Feedback collection
  if (feedbackPending.get(String(chatId)) && userText) {
    feedbackPending.delete(String(chatId));
    const userName = buildTelegramDisplayName(message.from);
    const feedbackMsg = `💬 New Feedback\nFrom: ${userName} (${chatId})\n\n${userText}`;
    await Promise.allSettled(
      env.agentChatIds.map((id) => agentBotClient.post("/sendMessage", { chat_id: id, text: feedbackMsg }))
    );
    await sendWithKeyboard(chatId,
      "Thank you for your feedback! We really appreciate it.",
      [[{ text: "« Back to menu", callback_data: "home" }]]
    );
    return;
  }

  // Agent group chat — handle commands (group chats only, not personal DMs)
  if (inGroup && isAgentChat(String(chatId))) {
    console.log(`[agent-cmd] from chatId=${chatId}: ${userText}`);
    await handleAgentCommand(String(chatId), userText);
    return;
  }

  // User in active handoff session — /start or /close exits it, other messages forward to agent
  const activeSession = getSessionByUserChatId(chatId);
  // In group, ignore "close" if there's no active session — it's someone else's conversation
  if (!activeSession && inGroup && /\bclose\b/i.test(userText)) return;
  if (activeSession) {
    if (userText.toLowerCase() === "/close" || userText.toLowerCase() === "close") {
      closeHandoffSession(activeSession.ref);
      await Promise.allSettled(
        env.agentChatIds.map((id) =>
          agentBotClient.post("/sendMessage", { chat_id: id, text: `✅ Ticket #${activeSession.ref} closed by user — problem resolved.` })
        )
      );
      await sendWithKeyboard(chatId,
        "Great, glad your problem is resolved! Feel free to reach out anytime.",
        [[{ text: "« Back to menu", callback_data: "home" }]]
      );
      return;
    }
    if (isStartCommand(userText)) {
      closeHandoffSession(activeSession.ref);
      clearConversationHistory(chatId);
      const kb = await loadKnowledgeBase();
      await sendWithKeyboard(chatId, buildWelcomeMessage(kb, "en"), buildHomeKeyboard());
      return;
    }
    await forwardUserMessageToAgent(activeSession, userText);
    const lang = detectLanguage("", message.text || "");
    const forwardedText = lang === "zh"
      ? "您的消息已转发给客服人员。"
      : "Your message has been forwarded to our support agent.";
    await sendTelegramMessage(chatId, forwardedText, replyToMessageId);
    return;
  }

  console.log(`[user-msg] from chatId=${chatId} user=${buildTelegramDisplayName(message.from)}: ${userText}`);

  if (env.mode === "ai") {
    const messageWithStrippedText = { ...message, text: userText };
    const isMentioned = inGroup && isBotMentioned(message);
    // Only show typing when the message looks like a question — avoids phantom typing for ignored messages
    const shouldType = looksLikeQuestion(userText) || isMentioned || !inGroup;
    if (shouldType) await sendTyping(chatId);
    const typingInterval = shouldType ? setInterval(() => sendTyping(chatId), 4000) : null;
    const reply = await buildAiReply(messageWithStrippedText, inGroup, isMentioned);
    clearInterval(typingInterval);
    // Silently ignore unrelated or unanswerable messages
    if (reply.intent === "ignore") return;
    // Log bot reply to stdout so Railway retains it
    console.log(`[bot-reply] chatId=${chatId} intent=${reply.intent} faq=${reply.faqId || "none"}: ${reply.text.slice(0, 200)}`);
    // Skip sending if already sent with keyboard (e.g. /start in private chat)
    if (!reply.skipSend) {
      try {
        await sendTelegramMessage(message.chat.id, reply.text, replyToMessageId);
      } catch (sendErr) {
        console.error(`[send-error] chatId=${chatId}: ${sendErr.response?.data?.description || sendErr.message}`);
      }
    }
    // Send tutorial images if the matched FAQ has any
    let faqHadImages = false;
    if (reply.faqId) {
      const kb = await loadKnowledgeBase();
      const faq = (kb.faqs || []).find((f) => f.id === reply.faqId);
      faqHadImages = !!(faq?.images?.length);
      await sendFaqImages(message.chat.id, reply.faqId, kb.faqs || []);
    }
    // Only send doc images if the FAQ didn't already send its own images
    if (!faqHadImages && reply.imageUrls?.length) {
      const imgCache = await loadImageCache();
      for (const url of reply.imageUrls) {
        if (url in imgCache && !imgCache[url]) continue; // null means previously failed
        const photo = imgCache[url] || url; // use file_id if cached, else raw URL
        try {
          await telegramClient.post("/sendPhoto", { chat_id: message.chat.id, photo });
        } catch (err) {
          console.error("[doc-image] failed to send:", err.message);
          await markImageFailed(url); // mark URL as permanently failed, skip next time
        }
      }
    }
    await upsertMapping({
      telegramChatId: String(message.chat.id),
      telegramUserId: String(message.from.id),
      telegramUsername: message.from.username || "",
      telegramName: buildTelegramDisplayName(message.from),
      lastInboundText: message.text.trim(),
      lastOutboundText: reply.text,
      lastIntent: reply.intent,
      lastActivityAt: new Date().toISOString(),
      status: reply.intent === "handoff" ? "handoff_requested" : "open"
    });
    return;
  }

  const contact = await getOrCreateIntercomContact(message.from);
  const store = await readStore();
  const existingMapping = store.byTelegramChatId[String(message.chat.id)];

  let conversationId = existingMapping?.intercomConversationId;
  if (conversationId) {
    await replyToIntercomConversation(conversationId, contact.id, message.text.trim());
  } else {
    const createdMessage = await createIntercomConversation(contact.id, message.text.trim());
    conversationId = extractConversationId(createdMessage);
    if (!conversationId) {
      throw new Error("Intercom did not return a conversation_id for the new conversation.");
    }
  }

  await upsertMapping({
    telegramChatId: String(message.chat.id),
    telegramUserId: String(message.from.id),
    telegramUsername: message.from.username || "",
    telegramName: buildTelegramDisplayName(message.from),
    intercomContactId: contact.id,
    intercomConversationId: conversationId,
    lastInboundText: message.text.trim(),
    lastActivityAt: new Date().toISOString(),
    status: "open"
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function buildAiReply(message, inGroup = false, isMentioned = false) {
  const userText = message.text.trim();
  const chatId = message.chat.id;
  const userName = buildTelegramDisplayName(message.from);
  const lang = detectLanguage("", message.text || "");
  const knowledgeBase = await loadKnowledgeBase();
  // In groups each user gets their own history so context doesn't bleed between users
  const historyKey = inGroup
    ? `${chatId}_${message.from?.id}`
    : String(chatId);

  if (isStartCommand(userText)) {
    clearConversationHistory(historyKey);
    const welcomeText = buildWelcomeMessage(knowledgeBase, lang);
    if (!inGroup) {
      await sendWithKeyboard(chatId, welcomeText, buildHomeKeyboard());
    }
    const reply = { intent: "welcome", text: welcomeText, skipSend: !inGroup };
    await logConversation({ chatId, userName, userText, botReply: welcomeText, intent: "welcome", inGroup, lang });
    return reply;
  }

  if (isChatIdCommand(userText)) {
    return { intent: "chatid", text: `Your chat ID is: ${chatId}` };
  }

  // Pre-filter: ignore greetings/chit-chat before calling AI
  if (isIgnorableMessage(userText, inGroup, message)) {
    return { intent: "ignore", text: "" };
  }

  if (shouldRequestHumanHandoff(userText)) {
    return {
      intent: "handoff",
      handoffReason: "user_requested",
      text: buildHandoffMessage(lang)
    };
  }

  const matchedFaq = findBestFaqMatch(userText, knowledgeBase.faqs || []);
  const aiReply = await generateAiResponse({ userText, historyKey, knowledgeBase, matchedFaq, lang, inGroup });

  if (["handoff", "fallback"].includes(aiReply.intent)) {
    if (inGroup) {
      await logGap({ userText, intent: aiReply.intent, hadPartialFaqMatch: !!matchedFaq });
      // In group: only handoff if bot was directly mentioned, otherwise stay silent
      if (!isMentioned) return { intent: "ignore", text: "" };
      const lang = detectLanguage("", userText);
      await notifyAgents({ message, userText, intent: aiReply.handoffReason || aiReply.intent, skipIntercom: true });
      return { intent: "handoff", text: buildHandoffMessage(lang) };
    }
    await notifyAgents({ message, userText, intent: aiReply.handoffReason || aiReply.intent });
    await logGap({ userText, intent: aiReply.intent, hadPartialFaqMatch: !!matchedFaq });
  }

  // Log all messages except ignored ones in group chat (casual chat, off-topic)
  // Group "ignore" messages are skipped — they're not support questions
  if (aiReply.intent !== "ignore") {
    await logConversation({
      chatId, userName, userText,
      botReply: aiReply.text,
      intent: aiReply.intent,
      faqMatched: matchedFaq?.id || null,
      inGroup,
      lang
    });
  }

  appendConversationHistory(historyKey, userText, aiReply.text, aiReply.intent);
  return aiReply;
}

let imageCacheData = null;
async function loadImageCache() {
  if (imageCacheData) return imageCacheData;
  try {
    const raw = await fs.readFile(resolveProjectPath("./data/image-cache.json"), "utf8");
    imageCacheData = JSON.parse(raw);
  } catch {
    imageCacheData = {};
  }
  return imageCacheData;
}

async function markImageFailed(url) {
  const cache = await loadImageCache();
  cache[url] = null; // null = permanently failed, skip on future attempts
  try {
    await fs.writeFile(resolveProjectPath("./data/image-cache.json"), JSON.stringify(cache));
  } catch {}
}

async function loadKnowledgeBase() {
  await ensureKnowledgeBase();
  const raw = await fs.readFile(env.knowledgeBaseFile, "utf8");
  return JSON.parse(raw);
}

function isStartCommand(text) {
  return ["/start", "start", "/help", "help"].includes(text.trim().toLowerCase());
}

function isChatIdCommand(text) {
  return text.trim().toLowerCase() === "/chatid";
}

function buildWelcomeMessage(knowledgeBase, lang) {
  const businessName = knowledgeBase.businessName || "Webot";
  const exampleQuestions = (knowledgeBase.faqs || [])
    .slice(0, 3)
    .map((item) => `- ${item.question}`)
    .join("\n");

  if (lang === "en") {
    return [
      `Hi, welcome to ${businessName} AI Support.`,
      "I can help you with questions like:",
      exampleQuestions || "- What do you do?",
      "",
      "How can I help you today?"
    ].join("\n");
  }

  return [
    `你好，这里是 ${businessName} AI 客服。`,
    "我可以帮你解答以下类型的问题，例如：",
    exampleQuestions || "- 你们是做什么的？",
    "",
    "请问有什么我可以帮你的？"
  ].join("\n");
}

const GREETING_PATTERNS = /^(hi+|hey+|hello|helo|hola|yo|sup|howdy|greetings|good\s?(morning|afternoon|evening|night|day)|thanks?|thank\s?you|thx|ty|ok|okay|k|lol|haha|hehe|nice|cool|great|awesome|👍|🙏|😊|😀|😁|🤙|✌️|👋|🫡|😂|🤣)[!?.]*$/i;

function isIgnorableMessage(text, inGroup, message) {
  if (!inGroup) return false;
  // If replying to the bot's own message, always process it — user is engaging with us
  if (message?.reply_to_message && !isReplyToOtherUser(message)) return false;
  const t = text.trim();
  if (t.length <= 3) return true;
  if (GREETING_PATTERNS.test(t)) return true;
  // If the message @mentions someone else (not our bot), it's directed at another user — ignore
  if (mentionsOtherUser(message)) return true;
  // If replying to another user's message (not the bot's), it's a conversation between users — ignore
  if (isReplyToOtherUser(message)) return true;
  // Filter out casual chat / non-question messages in group
  // Only keep messages that look like a question or contain Webot-related keywords
  if (!looksLikeSupportQuestion(t)) return true;
  return false;
}

function mentionsOtherUser(message) {
  const entities = message?.entities || [];
  const text = (message?.text || "").toLowerCase();
  const ourMention = botUsername ? `@${botUsername}`.toLowerCase() : null;
  for (const e of entities) {
    if (e.type === "mention") {
      const mentioned = text.slice(e.offset, e.offset + e.length).toLowerCase();
      // Skip our own bot mention
      if (ourMention && mentioned === ourMention) continue;
      // Another user/bot is being tagged
      return true;
    }
  }
  return false;
}

function isReplyToOtherUser(message) {
  const replyTo = message?.reply_to_message;
  if (!replyTo) return false;
  // If replying to the bot's own message, that's directed at us — don't ignore
  if (botUserId && replyTo.from?.id === botUserId) return false;
  // Replying to someone else's message — it's a user-to-user conversation
  return true;
}

// Heuristic: does this message look like something the bot should answer?
const SUPPORT_KEYWORDS = /\b(webot|pionex|deposit|withdraw|transfer|fee|fees|listed|listing|list|trade|trading|bot|grid|dca|martingale|twap|moon|rebalanc|kyc|verif|2fa|authenticat|password|login|log\s?in|sign\s?up|register|account|balance|fund|wallet|coin|token|crypto|btc|eth|usdt|usdc|sol|ada|xrp|doge|ach|wire|debit|bank|stuck|pending|missing|frozen|suspend|scam|hack|support|agent|human|help|how\s?(do|can|to)|what\s?(is|are)|where|when|why|can\s?i|is\s?(there|it|my)|do\s?(you|i)|does|充值|提现|转账|手续费|上架|交易|机器人|钱包|币|账户|密码|登录|注册|验证|人工|客服|怎么|为什么|什么|可以|能不能|如何)\b/i;

function looksLikeQuestion(text) {
  if (/[?？]/.test(text)) return true;
  if (/^(how|what|where|when|why|can|does|do|is|are|will|should|could|would)\b/i.test(text)) return true;
  if (/[\u4e00-\u9fff].*(吗|呢|嘛|么|怎|哪|谁|几|多少|为啥|啥)/.test(text)) return true;
  return false;
}

function looksLikeSupportQuestion(text) {
  // Contains a question mark — likely a question
  if (/[?？]/.test(text)) return true;
  // Contains Webot/crypto/support keywords
  if (SUPPORT_KEYWORDS.test(text)) return true;
  // Starts with question words
  if (/^(how|what|where|when|why|can|does|do|is|are|will|should|could|would)\b/i.test(text)) return true;
  // Chinese question patterns
  if (/[\u4e00-\u9fff].*(吗|呢|嘛|么|没|不|怎|哪|谁|几|多少|为啥|啥)/.test(text)) return true;
  return false;
}

function detectLanguage(_languageCode, messageText = "") {
  // Detect from message content first — most reliable
  if (/[\u4e00-\u9fff\u3400-\u4dbf]/.test(messageText)) return "zh";
  return "en"; // default to English
}

function buildFallbackMessage(lang) {
  if (process.env.FALLBACK_TEXT) {
    return env.fallbackText;
  }
  if (lang === "zh") {
    return "抱歉，我暂时没有足够信息回答这个问题。你可以换个问法，或者我可以帮你转人工。";
  }
  return env.fallbackText;
}

function buildLanguageInstruction(lang) {
  if (lang === "en") return "Respond in English.";
  if (lang === "zh") return "Respond in Chinese (Simplified).";
  return `Respond in the user's language (language code: ${lang}).`;
}

function buildHandoffMessage(lang) {
  const supportLink = "https://t.me/webot_cs_bot";
  if (process.env.HUMAN_HANDOFF_TEXT) {
    const custom = env.humanHandoffText;
    if (custom.includes("http://") || custom.includes("https://")) return custom;
    return `${custom} ${supportLink}`.trim();
  }
  return lang === "zh"
    ? `我们将为您提供人工客服服务，请点击以下链接联系我们的客服人员：${supportLink}`
    : `We'll have a human agent assist you. Please click the link below to reach our support team: ${supportLink}`;
}

function shouldRequestHumanHandoff(userText) {
  const normalized = normalizeForSearch(userText);
  if (!normalized) return false;
  return env.handoffKeywords.some((keyword) => {
    const normalizedKeyword = normalizeForSearch(keyword);
    return normalizedKeyword && normalized.includes(normalizedKeyword);
  });
}

function findBestFaqMatch(userText, faqs) {
  const normalized = normalizeForSearch(userText);
  // Skip FAQ matching for very short or greeting-style inputs
  if (normalized.length < 4) return null;
  let bestMatch = null;

  for (const faq of faqs) {
    const terms = [faq.question, ...(faq.keywords || [])].map(normalizeForSearch);
    let score = 0;

    for (const term of terms) {
      if (!term) {
        continue;
      }
      if (normalized.includes(term) || term.includes(normalized)) {
        score += Math.max(term.length, normalized.length);
      } else if (hasAnyTokenOverlap(normalized, term)) {
        score += 1;
      }
    }

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { ...faq, score };
    }
  }

  if (!bestMatch || bestMatch.score <= 0) {
    return null;
  }

  return bestMatch;
}

function normalizeForSearch(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function hasAnyTokenOverlap(left, right) {
  const leftTokens = new Set(left.split(" ").filter(Boolean));
  return right
    .split(" ")
    .filter(Boolean)
    .some((token) => leftTokens.has(token));
}




// ---------------------------------------------------------------------------
// Shared helpers for AI response parsing
// ---------------------------------------------------------------------------

function toOpenAiTools(toolDefs) {
  return toolDefs.map((t) => ({
    type: "function",
    function: { name: t.name, description: t.description, parameters: t.input_schema }
  }));
}

function parseAiJsonResponse(raw, _matchedFaq, matchedDocuments, lang) {
  // Find all JSON object candidates and use the last valid one
  const jsonCandidates = [...raw.matchAll(/\{[^{}]*\}/g)].map((m) => m[0]);
  let parsed = null;
  for (const candidate of jsonCandidates) {
    try { parsed = JSON.parse(candidate); } catch { /* skip */ }
  }
  if (!parsed) {
    const greedyMatch = raw.match(/\{[\s\S]*\}/);
    try { parsed = JSON.parse(greedyMatch?.[0] || "{}"); } catch {
      return { intent: "answer", text: raw.replace(/\{[\s\S]*\}/g, "").trim() || raw.trim() };
    }
  }
  const replyText = String(parsed.reply || "").trim();
  const intent = parsed.intent === "handoff" ? "handoff"
    : parsed.intent === "ignore" ? "ignore"
    : "answer";
  if (intent === "ignore") return { intent: "ignore", text: "" };
  if (!replyText) {
    return { intent: "answer", text: buildFallbackMessage(lang) };
  }
  const showImages = parsed.show_images === true;
  const docImageUrls = (intent === "answer" && showImages) ? (matchedDocuments[0]?.imageUrls || []) : [];
  // Trust the AI's faq_id over the keyword-based matchedFaq
  const aiFaqId = showImages ? (parsed.faq_id || null) : null;
  return {
    intent,
    faqId: aiFaqId,
    imageUrls: docImageUrls,
    text: replyText
  };
}

// Detect queries about a specific coin (listing / deposit / withdrawal availability)
// For these, we skip FAQ context so the AI is forced to call webot_check_pair
const COIN_QUERY_RE = /\b(listed|listing|list|available|support|supported|deposit|withdraw|trade|buy|sell)\b/i;
function isCoinQuery(text) {
  // Structural match: "is X listed?", "is $BDAG available?", "can I trade soon?"
  if (/\b(?:is|are|does|do|can)\s+(?:i\s+)?\$?[a-z]{2,10}\s+(?:listed|available|supported|traded)\b/i.test(text)) return true;
  // "do you support/list/have X?"
  if (/\b(?:do you|does webot|do we)\s+(?:support|list|have|offer)\s+\$?[a-z]{2,10}\b/i.test(text)) return true;
  if (!COIN_QUERY_RE.test(text)) return false;
  // Uppercase ticker: "BTC listed?", "check DOGE"
  if (/\b[A-Z]{2,10}\b/.test(text)) return true;
  // $-prefixed symbol: "$SOON listed?"
  if (/\$[a-z]{1,10}\b/i.test(text)) return true;
  // Generic coin word: "is this coin listed?"
  if (/\b(coin|token|crypto)\b/i.test(text)) return true;
  return false;
}

async function generateAiResponse({ userText, historyKey, knowledgeBase, matchedFaq, lang, inGroup = false }) {
  const matchedDocuments = await findRelevantDocuments(userText);
  const coinQuery = isCoinQuery(userText);

  // For coin listing/availability queries skip FAQ context entirely — forces AI to call the tool
  // Always pass all FAQs so the AI can reason about full intent, not just keyword similarity
  let relevantFaqs = [];
  if (!coinQuery) {
    relevantFaqs = knowledgeBase.faqs || [];
  }
  const faqContext = relevantFaqs
    .map((item) => `[${item.id}] Q: ${item.question}\nA: ${item.answer}`)
    .join("\n\n");
  const documentContext = matchedDocuments
    .map((item) => `Source: ${item.path}\n${item.excerpt}`)
    .join("\n\n");

  const languageInstruction = buildLanguageInstruction(lang);
  const baseInstructions = env.aiSystemPrompt || knowledgeBase.systemPrompt ||
    [
      "You are a concise Telegram AI customer support agent.",
      languageInstruction,
      "Only answer based on the provided business summary and FAQ context.",
      "Write replies naturally and conversationally — do NOT copy-paste FAQ answers verbatim. Rephrase in your own words while keeping the meaning accurate.",
      "If the question is completely unrelated to the business (e.g. general knowledge, news, weather, other companies), set intent to 'ignore' and reply to empty string — do not reply at all.",
      "If the question is about the business but you cannot answer it from the provided context, set intent to 'handoff'.",
      "When referring users to human support, always use the exact Telegram username @webot_cs_bot — never shorten or alter it.",
      "Do not invent prices, policies, or guarantees.",
      'Always respond with JSON: {"intent": "answer", "handoff", or "ignore", "reply": "<your reply or empty string>"}.'
    ].join(" ");

  const groupInstruction = inGroup
    ? "\nGROUP CHAT MODE: This is a public Webot community group. Users chat with each other — most messages are NOT directed at you. ONLY reply if the message is clearly asking for help with Webot (account, deposits, withdrawals, trading bots, fees, KYC, etc.). If someone is chatting with another user, sharing opinions, reacting, or discussing anything not related to Webot support, set intent to 'ignore' with empty reply. When in doubt, ignore — it is much better to stay silent than to interrupt a conversation. Only genuine support questions deserve a reply."
    : "";

  const systemPrompt = [
    baseInstructions,
    groupInstruction,
    `\nBusiness: ${knowledgeBase.businessName || "Unknown business"}`,
    `Summary: ${knowledgeBase.summary || ""}`,
    faqContext ? `\nFAQ context:\n${faqContext}` : "",
    documentContext ? `\nDocument context:\n${documentContext}` : ""
  ].filter(Boolean).join("\n");

  const history = getConversationHistory(historyKey);
  const MAX_TURNS = 8;

  // ---------------------------------------------------------------------------
  // OpenAI path
  // ---------------------------------------------------------------------------
  if (env.aiProvider === "openai") {
    const activeTools = toOpenAiTools(TOOL_DEFINITIONS.filter((t) =>
      !(t.name.startsWith("superset_") && !process.env.SUPERSET_BASE_URL)
    ));
    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userText }
    ];
    try {
      for (let turn = 0; turn < MAX_TURNS; turn++) {
        console.log(`[ai] calling openai model=${env.openaiModel} turn=${turn}`);
        const response = await openaiClient.chat.completions.create({
          model: env.openaiModel,
          max_completion_tokens: 2048,
          messages,
          tools: activeTools.length ? activeTools : undefined,
          tool_choice: activeTools.length ? "auto" : undefined
        });
        const choice = response.choices[0];
        messages.push(choice.message);

        if (choice.finish_reason === "tool_calls") {
          const toolCalls = choice.message.tool_calls || [];
          console.log("Tool calls:", toolCalls.map((tc) => tc.function.name).join(", "));
          const toolResults = await Promise.all(
            toolCalls.map(async (tc) => {
              const input = JSON.parse(tc.function.arguments);
              const result = await executeToolCall({ id: tc.id, name: tc.function.name, input });
              return { role: "tool", tool_call_id: tc.id, content: result.content };
            })
          );
          messages.push(...toolResults);
          continue;
        }

        if (choice.finish_reason === "stop") {
          return parseAiJsonResponse(choice.message.content || "{}", matchedFaq, matchedDocuments, lang);
        }

        break;
      }
      throw new Error("OpenAI agentic loop exceeded max turns.");
    } catch (error) {
      console.error("⚠️ AI generation error (openai)", formatError(error));
      console.error("⚠️ Falling back to FAQ match for query:", userText);
      if (matchedFaq) {
        console.error("⚠️ FAQ fallback matched:", matchedFaq.id, matchedFaq.question);
        return { intent: "faq", text: matchedFaq.answer };
      }
      console.error("⚠️ No FAQ match, returning handoff");
      return { intent: "handoff", text: buildFallbackMessage(lang) };
    }
  }

  // ---------------------------------------------------------------------------
  // Bedrock / Claude path (AI_PROVIDER=bedrock, default)
  // ---------------------------------------------------------------------------
  const messages = [...history, { role: "user", content: userText }];
  try {
    for (let turn = 0; turn < MAX_TURNS; turn++) {
      console.log(`[ai] calling bedrock model=${env.aiModel} turn=${turn}`);
      const response = await anthropicClient.messages.create({
        model: env.aiModel,
        max_tokens: 2048,
        system: systemPrompt,
        tools: TOOL_DEFINITIONS.filter((t) =>
          !(t.name.startsWith("superset_") && !process.env.SUPERSET_BASE_URL)
        ),
        messages
      });

      messages.push({ role: "assistant", content: response.content });

      if (response.stop_reason === "end_turn") {
        return parseAiJsonResponse(
          response.content.find((b) => b.type === "text")?.text || "{}",
          matchedFaq, matchedDocuments, lang
        );
      }

      if (response.stop_reason === "tool_use") {
        const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");
        console.log("Tool calls:", toolUseBlocks.map((b) => b.name).join(", "));
        const toolResults = await Promise.all(toolUseBlocks.map(executeToolCall));
        messages.push({ role: "user", content: toolResults });
        continue;
      }

      break;
    }

    throw new Error("Agentic loop exceeded max turns.");
  } catch (error) {
    console.error("⚠️ AI generation error (bedrock)", formatError(error));
    console.error("⚠️ Falling back to FAQ match for query:", userText);
    if (matchedFaq) {
      console.error("⚠️ FAQ fallback matched:", matchedFaq.id, matchedFaq.question);
      return { intent: "faq", text: matchedFaq.answer };
    }
    console.error("⚠️ No FAQ match, returning handoff");
    return { intent: "handoff", text: buildFallbackMessage(lang) };
  }
}

function parseCsv(value) {
  if (!value) {
    return null;
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Cache all docs in memory after first load
let docCache = null;

async function loadAllDocs() {
  if (docCache) return docCache;
  const allPaths = await collectDocumentPaths();
  const docs = [];
  for (const filePath of allPaths) {
    const loaded = await loadDocument(filePath);
    if (!loaded) continue;
    docs.push({
      path: path.relative(projectRoot, filePath),
      text: loaded.text,
      imageUrls: extractImageUrls(loaded.text),
      kind: classifyDocument(filePath, loaded.text)
    });
  }
  docCache = docs;
  console.log(`[docs] loaded ${docs.length} documents into cache`);
  return docs;
}

async function findRelevantDocuments(userText) {
  const allDocs = await loadAllDocs();
  if (!allDocs.length) return [];

  const topDocs = rerankDocumentsByFreshnessIntent(
    userText,
    await scoreDocsBySimilarity(userText, allDocs, 12)
  ).slice(0, 8);
  return topDocs.map((doc) => ({
    path: doc.path,
    excerpt: buildExcerpt(userText, doc.text),
    imageUrls: doc.imageUrls
  }));
}

function classifyDocument(filePath, text) {
  const source = `${path.basename(filePath).toLowerCase()} ${(text || "").slice(0, 300).toLowerCase()}`;
  if (/\b(listed|is-listed|will-list|trading-pairs?)\b/.test(source)) return "listing";
  if (/\b(announcement|notice|maintenance|upgrade|suspension|suspend|delist|rebrand)\b/.test(source)) return "announcement";
  if (/\b(fee|deposit|withdraw|account|kyc|bot|security|support|faq|guide|how-to)\b/.test(source)) return "evergreen";
  return "general";
}

function userAskedForTimeSensitiveInfo(userText) {
  const normalized = normalizeForSearch(userText);
  return [
    "announcement",
    "announcements",
    "maintenance",
    "suspended",
    "suspension",
    "delist",
    "delisted",
    "upgrade",
    "rebrand",
    "listing",
    "listed",
    "latest",
    "new pair",
    "new pairs"
  ].some((term) => normalized.includes(term));
}

function rerankDocumentsByFreshnessIntent(userText, docs) {
  const allowTimeSensitive = userAskedForTimeSensitiveInfo(userText);
  return docs
    .filter((doc) => allowTimeSensitive || !["announcement", "listing"].includes(doc.kind))
    .sort((left, right) => {
      const rank = { evergreen: 3, general: 2, announcement: 1, listing: 0 };
      return (rank[right.kind] || 0) - (rank[left.kind] || 0);
    });
}

async function collectDocumentPaths() {
  const paths = new Set();

  // Auto-scan KNOWLEDGE_DOCS_DIR
  try {
    const entries = await fs.readdir(env.knowledgeDocsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const ext = path.extname(entry.name).toLowerCase();
      if ([".txt", ".md", ".json", ".csv"].includes(ext)) {
        paths.add(path.join(env.knowledgeDocsDir, entry.name));
      }
    }
  } catch {
    // dir doesn't exist yet — no-op
  }

  // Also include any explicit DOCUMENT_PATHS
  for (const rawPath of env.documentPaths.slice(0, 20)) {
    paths.add(resolveProjectPath(rawPath));
  }

  return [...paths];
}

async function loadDocument(filePath) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile()) {
      return null;
    }

    const extension = path.extname(filePath).toLowerCase();
    if (![".txt", ".md", ".json", ".csv"].includes(extension)) {
      return null;
    }

    const text = await fs.readFile(filePath, "utf8");
    return {
      path: filePath,
      text: text.slice(0, 20000)
    };
  } catch {
    return null;
  }
}


function extractImageUrls(text) {
  const urls = [];
  const regex = /!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    urls.push(match[1]);
  }
  return urls.slice(0, 3); // max 3 images per doc
}

function buildExcerpt(userText, documentText) {
  const normalizedQuestion = normalizeForSearch(userText);
  const raw = String(documentText || "").replace(/\s+/g, " ").trim();
  if (!raw) {
    return "";
  }

  const lowerRaw = raw.toLowerCase();
  const index = normalizedQuestion ? lowerRaw.indexOf(normalizedQuestion) : -1;
  if (index >= 0) {
    return raw.slice(Math.max(0, index - 300), index + 900);
  }

  return raw.slice(0, 3000);
}

function formatError(error) {
  return {
    message: error.message,
    status: error.response?.status || error.status || 500,
    data: error.response?.data || null
  };
}
