/**
 * Semantic search using dense embeddings (OpenAI text-embedding-3-small) with TF-IDF fallback.
 * Embeddings are cached to disk and only recomputed when content changes.
 */

import OpenAI from "openai";
import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.resolve(__dirname, "../data/embeddings-cache.json");
const EMBED_MODEL = process.env.OPENAI_EMBED_MODEL || "text-embedding-3-small";

let openaiClient = null;
function getOpenAiClient() {
  if (!openaiClient) {
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 30000 });
  }
  return openaiClient;
}

// ---------------------------------------------------------------------------
// Disk cache — { [hash]: float[] }
// ---------------------------------------------------------------------------

let cache = null;
let cacheDirty = false;

async function loadCache() {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(CACHE_FILE, "utf8");
    cache = JSON.parse(raw);
  } catch {
    cache = {};
  }
  return cache;
}

async function saveCache() {
  if (!cacheDirty) return;
  await fs.mkdir(path.dirname(CACHE_FILE), { recursive: true });
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache));
  cacheDirty = false;
}

function hashText(text) {
  return createHash("sha1").update(text.slice(0, 2000)).digest("hex");
}

// ---------------------------------------------------------------------------
// Embedding
// ---------------------------------------------------------------------------

async function embed(text) {
  const c = await loadCache();
  const key = hashText(text);
  if (c[key]) return c[key];

  const client = getOpenAiClient();
  const res = await client.embeddings.create({
    model: EMBED_MODEL,
    input: text.slice(0, 8000)
  });
  const vector = res.data[0].embedding;

  c[key] = vector;
  cacheDirty = true;
  return vector;
}

// ---------------------------------------------------------------------------
// Cosine similarity
// ---------------------------------------------------------------------------

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

// ---------------------------------------------------------------------------
// Public API — FAQs
// ---------------------------------------------------------------------------

export async function scoreFaqsBySimilarity(userText, faqs, topK = 10) {
  if (!faqs.length) return [];

  try {
    const queryVec = await embed(userText);
    const scored = await Promise.all(
      faqs.map(async (faq) => {
        const text = `${faq.question} ${(faq.keywords || []).join(" ")} ${faq.answer.slice(0, 300)}`;
        const vec = await embed(text);
        return { faq, score: cosine(queryVec, vec) };
      })
    );
    await saveCache();
    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  } catch (err) {
    console.error("[embeddings] dense FAQ search failed, falling back to TF-IDF:", err.message);
    return findTopFaqsTfIdfScored(userText, faqs, topK);
  }
}

export async function findTopFaqs(userText, faqs, topK = 10) {
  const scored = await scoreFaqsBySimilarity(userText, faqs, topK);
  return scored.map((s) => s.faq);
}

// ---------------------------------------------------------------------------
// Public API — Documents
// ---------------------------------------------------------------------------

export async function scoreDocsWithScores(userText, docs, topK = 12) {
  if (!docs.length) return [];

  try {
    const queryVec = await embed(userText);
    const scored = await Promise.all(
      docs.map(async (doc) => {
        const vec = await embed(doc.text.slice(0, 4000));
        return { doc, score: cosine(queryVec, vec) };
      })
    );
    await saveCache();
    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  } catch (err) {
    console.error("[embeddings] dense doc search failed, falling back to TF-IDF:", err.message);
    return scoreDocsTfIdfScored(userText, docs, topK);
  }
}

export async function scoreDocsBySimilarity(userText, docs, topK = 5) {
  const scored = await scoreDocsWithScores(userText, docs, topK * 2);
  return scored
    .filter((s) => s.score > 0.15)
    .slice(0, topK)
    .map((s) => s.doc);
}

// ---------------------------------------------------------------------------
// TF-IDF fallback
// ---------------------------------------------------------------------------

const STOP_WORDS = new Set([
  "a","an","the","is","it","in","on","at","to","for","of","and","or","but",
  "my","me","i","we","you","your","our","can","do","did","will","was","are",
  "be","has","have","had","not","no","so","if","by","up","out","how","what",
  "why","when","who","which","this","that","there","here","with","from","get",
  "got","just","about","still","dont","cant","wont","im","its","thats","dont"
]);

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function termFrequency(tokens) {
  const tf = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  const max = Math.max(...Object.values(tf), 1);
  for (const t in tf) tf[t] /= max;
  return tf;
}

function buildIdf(corpus) {
  const df = {};
  for (const doc of corpus) {
    for (const term of new Set(doc)) df[term] = (df[term] || 0) + 1;
  }
  const N = corpus.length;
  const idf = {};
  for (const term in df) idf[term] = Math.log((N + 1) / (df[term] + 1)) + 1;
  return idf;
}

function tfidfVector(tokens, idf) {
  const tf = termFrequency(tokens);
  const vec = {};
  for (const term in tf) vec[term] = tf[term] * (idf[term] || 1);
  return vec;
}

function cosineTfidf(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, na = 0, nb = 0;
  for (const k of keys) {
    const va = a[k] || 0, vb = b[k] || 0;
    dot += va * vb; na += va * va; nb += vb * vb;
  }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

function findTopFaqsTfIdfScored(userText, faqs, topK) {
  const corpus = faqs.map((faq) =>
    tokenize(`${faq.question} ${(faq.keywords || []).join(" ")} ${faq.answer.slice(0, 300)}`)
  );
  const queryTokens = tokenize(userText);
  const idf = buildIdf([...corpus, queryTokens]);
  const queryVec = tfidfVector(queryTokens, idf);
  return faqs
    .map((faq, i) => ({ faq, score: cosineTfidf(queryVec, tfidfVector(corpus[i], idf)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function scoreDocsTfIdfScored(userText, docs, topK) {
  const corpus = docs.map((d) => tokenize(d.text.slice(0, 5000)));
  const queryTokens = tokenize(userText);
  const idf = buildIdf([...corpus, queryTokens]);
  const queryVec = tfidfVector(queryTokens, idf);
  return docs
    .map((doc, i) => ({ doc, score: cosineTfidf(queryVec, tfidfVector(corpus[i], idf)) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
