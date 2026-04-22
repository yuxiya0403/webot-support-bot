/**
 * Downloads article images from Intercom CDN and uploads to Telegram
 * to get permanent file_ids. Saves progress to data/image-cache.json.
 * Safe to re-run — skips already-cached URLs.
 */

import "dotenv/config";
import axios from "axios";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import FormData from "form-data";

const DOCS_DIR = path.resolve("./data/docs");
const CACHE_FILE = path.resolve("./data/image-cache.json");
const BOT_TOKEN = process.env.AGENT_BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
const UPLOAD_CHAT_ID = process.env.AGENT_CHAT_IDS?.split(",")[1]?.trim()
  || process.env.AGENT_CHAT_IDS?.split(",")[0]?.trim();

if (!BOT_TOKEN) { console.error("Missing AGENT_BOT_TOKEN"); process.exit(1); }
if (!UPLOAD_CHAT_ID) { console.error("Missing AGENT_CHAT_IDS"); process.exit(1); }

const telegramClient = axios.create({
  baseURL: `https://api.telegram.org/bot${BOT_TOKEN}`,
  timeout: 30000
});

// ---------------------------------------------------------------------------
// Load / save cache
// ---------------------------------------------------------------------------

async function loadCache() {
  try {
    return JSON.parse(await fs.readFile(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// ---------------------------------------------------------------------------
// Collect all unique image URLs from articles
// ---------------------------------------------------------------------------

async function collectImageUrls() {
  const urls = new Set();
  const entries = await fs.readdir(DOCS_DIR);
  for (const file of entries) {
    if (!file.endsWith(".md") || file === "index.md") continue;
    const content = await fs.readFile(path.join(DOCS_DIR, file), "utf8");
    for (const m of content.matchAll(/!\[[^\]]*\]\((https?:\/\/[^)]+)\)/g)) {
      urls.add(m[1]);
    }
  }
  return [...urls];
}

// ---------------------------------------------------------------------------
// Download image bytes
// ---------------------------------------------------------------------------

async function downloadImage(url) {
  const res = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0" }
  });
  const contentType = res.headers["content-type"] || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("gif") ? "gif" : "jpg";
  return { buffer: Buffer.from(res.data), ext, contentType };
}

// ---------------------------------------------------------------------------
// Upload to Telegram, return file_id
// ---------------------------------------------------------------------------

async function uploadToTelegram(buffer, ext, contentType) {
  const form = new FormData();
  form.append("chat_id", UPLOAD_CHAT_ID);
  form.append("photo", buffer, { filename: `img.${ext}`, contentType });
  form.append("disable_notification", "true");

  const res = await telegramClient.post("/sendPhoto", form, {
    headers: form.getHeaders(),
    timeout: 30000
  });
  const photos = res.data.result.photo;
  return photos[photos.length - 1].file_id; // largest size
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Upload target chat: ${UPLOAD_CHAT_ID}`);
  const cache = await loadCache();
  const allUrls = await collectImageUrls();
  const pending = allUrls.filter(u => !cache[u]);

  console.log(`Total images: ${allUrls.length}`);
  console.log(`Already cached: ${allUrls.length - pending.length}`);
  console.log(`To upload: ${pending.length}`);

  if (!pending.length) {
    console.log("All images already cached.");
    return;
  }

  let done = 0;
  let failed = 0;

  for (const url of pending) {
    try {
      const { buffer, ext, contentType } = await downloadImage(url);
      const fileId = await uploadToTelegram(buffer, ext, contentType);
      cache[url] = fileId;
      done++;

      if (done % 10 === 0) {
        await saveCache(cache);
        console.log(`[${done}/${pending.length}] cached...`);
      }

      // Rate limit: ~1 upload/sec to stay within Telegram limits
      await sleep(1100);
    } catch (err) {
      console.warn(`[skip] ${url.slice(0, 80)}... — ${err.message}`);
      cache[url] = null; // mark as failed so we skip on retry
      failed++;
      await sleep(500);
    }
  }

  await saveCache(cache);
  console.log(`\nDone. Cached: ${done}, Failed: ${failed}`);
  console.log(`Cache saved to ${CACHE_FILE}`);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

main().catch(e => { console.error(e.message); process.exit(1); });
