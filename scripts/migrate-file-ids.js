/**
 * Migrates Telegram file_ids from an old bot token to a new one.
 * Downloads files via old bot, re-uploads via new bot, updates knowledge-base.json.
 */

import "dotenv/config";
import axios from "axios";
import FormData from "form-data";
import fs from "node:fs/promises";
import path from "node:path";

const OLD_BOT_TOKEN = process.argv[2];
const NEW_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const UPLOAD_CHAT_ID = process.env.AGENT_CHAT_IDS?.split(",")[0]?.trim();
const KB_FILE = path.resolve("./data/knowledge-base.json");

if (!OLD_BOT_TOKEN) {
  console.error("Usage: node scripts/migrate-file-ids.js <OLD_BOT_TOKEN>");
  process.exit(1);
}
if (!NEW_BOT_TOKEN || !UPLOAD_CHAT_ID) {
  console.error("Missing TELEGRAM_BOT_TOKEN or AGENT_CHAT_IDS in .env");
  process.exit(1);
}

const oldBot = axios.create({ baseURL: `https://api.telegram.org/bot${OLD_BOT_TOKEN}`, timeout: 30000 });
const newBot = axios.create({ baseURL: `https://api.telegram.org/bot${NEW_BOT_TOKEN}`, timeout: 30000 });

async function downloadFromOldBot(fileId) {
  const fileInfo = await oldBot.get(`/getFile?file_id=${fileId}`);
  const filePath = fileInfo.data.result.file_path;
  const url = `https://api.telegram.org/file/bot${OLD_BOT_TOKEN}/${filePath}`;
  const res = await axios.get(url, { responseType: "arraybuffer", timeout: 30000 });
  return Buffer.from(res.data);
}

async function uploadToNewBot(buffer) {
  const form = new FormData();
  form.append("chat_id", UPLOAD_CHAT_ID);
  form.append("photo", buffer, { filename: "photo.jpg", contentType: "image/jpeg" });
  form.append("disable_notification", "true");
  const res = await newBot.post("/sendPhoto", form, { headers: form.getHeaders(), timeout: 30000 });
  const photos = res.data.result.photo;
  return photos[photos.length - 1].file_id;
}

async function main() {
  const kb = JSON.parse(await fs.readFile(KB_FILE, "utf8"));
  let migrated = 0;
  let failed = 0;

  for (const faq of kb.faqs) {
    if (!faq.images?.length) continue;
    for (let i = 0; i < faq.images.length; i++) {
      const img = faq.images[i];
      if (!img.file_id) continue;
      try {
        console.log(`[${faq.id}] image ${i + 1}: downloading...`);
        const buffer = await downloadFromOldBot(img.file_id);
        console.log(`[${faq.id}] image ${i + 1}: uploading to new bot...`);
        const newFileId = await uploadToNewBot(buffer);
        img.file_id = newFileId;
        migrated++;
        console.log(`[${faq.id}] image ${i + 1}: ✅ migrated`);
        await new Promise(r => setTimeout(r, 1100)); // rate limit
      } catch (err) {
        console.error(`[${faq.id}] image ${i + 1}: ❌ ${err.message}`);
        failed++;
      }
    }
  }

  await fs.writeFile(KB_FILE, JSON.stringify(kb, null, 2));
  console.log(`\nDone. Migrated: ${migrated}, Failed: ${failed}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
