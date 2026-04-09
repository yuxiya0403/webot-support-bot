import "dotenv/config";
import axios from "axios";
import fs from "node:fs/promises";
import path from "node:path";

const env = {
  intercomAccessToken: process.env.INTERCOM_ACCESS_TOKEN || "",
  intercomApiBaseUrl: (process.env.INTERCOM_API_BASE_URL || "https://api.intercom.io").replace(/\/$/, ""),
  intercomApiVersion: process.env.INTERCOM_API_VERSION || "2.14",
  outputDir: path.resolve(process.cwd(), process.env.INTERCOM_EXPORT_DIR || "./exports/intercom"),
  includeDrafts: (process.env.INTERCOM_EXPORT_INCLUDE_DRAFTS || "false").toLowerCase() === "true"
};

if (!env.intercomAccessToken) {
  console.error("Missing INTERCOM_ACCESS_TOKEN.");
  process.exit(1);
}

const client = axios.create({
  baseURL: env.intercomApiBaseUrl,
  headers: {
    Authorization: `Bearer ${env.intercomAccessToken}`,
    Accept: "application/json",
    "Content-Type": "application/json",
    "Intercom-Version": env.intercomApiVersion
  },
  timeout: 30000
});

async function main() {
  const articles = await fetchAllArticles();
  const externalPages = await fetchAllExternalPages();

  await fs.mkdir(env.outputDir, { recursive: true });
  await fs.mkdir(path.join(env.outputDir, "articles"), { recursive: true });
  await fs.mkdir(path.join(env.outputDir, "external-pages"), { recursive: true });

  const filteredArticles = env.includeDrafts ? articles : articles.filter((item) => item.state !== "draft");

  for (const article of filteredArticles) {
    const filePath = path.join(env.outputDir, "articles", `${slugify(article.title || article.id)}-${article.id}.md`);
    await fs.writeFile(filePath, renderArticleMarkdown(article), "utf8");
  }

  for (const page of externalPages) {
    const title = page.title || page.url || page.id;
    const filePath = path.join(env.outputDir, "external-pages", `${slugify(title)}-${page.id}.md`);
    await fs.writeFile(filePath, renderExternalPageMarkdown(page), "utf8");
  }

  const summaryPath = path.join(env.outputDir, "index.md");
  await fs.writeFile(summaryPath, renderIndexMarkdown(filteredArticles, externalPages), "utf8");

  console.log(`Export complete.`);
  console.log(`Articles: ${filteredArticles.length}`);
  console.log(`External pages: ${externalPages.length}`);
  console.log(`Output: ${env.outputDir}`);
}

async function fetchAllArticles() {
  const items = [];
  let nextUrl = "/articles";

  while (nextUrl) {
    const response = await client.get(nextUrl);
    const payload = response.data || {};
    const pageItems = extractArticles(payload);
    items.push(...pageItems);
    nextUrl = normalizeNextUrl(payload.pages?.next);
  }

  return items;
}

async function fetchAllExternalPages() {
  const items = [];
  let nextUrl = "/ai/external_pages";

  while (nextUrl) {
    const response = await client.get(nextUrl);
    const payload = response.data || {};
    const pageItems = Array.isArray(payload.data) ? payload.data : [];
    items.push(...pageItems);
    nextUrl = normalizeNextUrl(payload.pages?.next);
  }

  return items;
}

function extractArticles(payload) {
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.articles)) return payload.articles;
  if (Array.isArray(payload.data?.articles)) return payload.data.articles;
  return [];
}

function normalizeNextUrl(next) {
  if (!next) return null;
  if (typeof next === "string") {
    if (next.startsWith(env.intercomApiBaseUrl)) {
      return next.slice(env.intercomApiBaseUrl.length);
    }
    return next;
  }
  if (typeof next?.starting_after === "string") {
    return null;
  }
  if (typeof next?.page === "number") {
    return null;
  }
  return null;
}

function renderArticleMarkdown(article) {
  const metaLines = [
    `id: ${safeMeta(article.id)}`,
    `type: article`,
    `title: ${safeMeta(article.title)}`,
    `state: ${safeMeta(article.state)}`,
    `url: ${safeMeta(article.url)}`,
    `author_id: ${safeMeta(article.author_id)}`,
    `created_at: ${formatTimestamp(article.created_at)}`,
    `updated_at: ${formatTimestamp(article.updated_at)}`
  ];

  const body = htmlToMarkdown(article.body || "");
  const description = article.description ? htmlToMarkdown(article.description) : "";

  return [
    "---",
    ...metaLines,
    "---",
    "",
    `# ${article.title || `Article ${article.id}`}`,
    "",
    description ? `> ${description.replace(/\n/g, "\n> ")}` : "",
    description ? "" : "",
    body || "_No body available._",
    ""
  ].filter(Boolean).join("\n");
}

function renderExternalPageMarkdown(page) {
  const title = page.title || page.url || `External Page ${page.id}`;
  const metaLines = [
    `id: ${safeMeta(page.id)}`,
    `type: external_page`,
    `title: ${safeMeta(page.title)}`,
    `url: ${safeMeta(page.url)}`,
    `source_id: ${safeMeta(page.content_import_source_id)}`,
    `created_at: ${formatTimestamp(page.created_at)}`,
    `updated_at: ${formatTimestamp(page.updated_at)}`
  ];

  const content = htmlToMarkdown(page.content || page.body || "");

  return [
    "---",
    ...metaLines,
    "---",
    "",
    `# ${title}`,
    "",
    page.url ? `Source: ${page.url}` : "",
    page.url ? "" : "",
    content || "_No content available._",
    ""
  ].filter(Boolean).join("\n");
}

function renderIndexMarkdown(articles, externalPages) {
  const lines = [
    "# Intercom Export",
    "",
    `Generated at: ${new Date().toISOString()}`,
    `Articles: ${articles.length}`,
    `External pages: ${externalPages.length}`,
    "",
    "## Articles",
    ""
  ];

  for (const article of articles) {
    const fileName = `articles/${slugify(article.title || article.id)}-${article.id}.md`;
    lines.push(`- [${article.title || article.id}](${fileName})`);
  }

  lines.push("", "## External Pages", "");

  for (const page of externalPages) {
    const title = page.title || page.url || page.id;
    const fileName = `external-pages/${slugify(title)}-${page.id}.md`;
    lines.push(`- [${title}](${fileName})`);
  }

  lines.push("");
  return lines.join("\n");
}

function htmlToMarkdown(input) {
  return decodeEntities(String(input || ""))
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<li>/gi, "- ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<ul[^>]*>/gi, "\n")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<ol[^>]*>/gi, "\n")
    .replace(/<\/ol>/gi, "\n")
    .replace(/<strong[^>]*>/gi, "**")
    .replace(/<\/strong>/gi, "**")
    .replace(/<b[^>]*>/gi, "**")
    .replace(/<\/b>/gi, "**")
    .replace(/<em[^>]*>/gi, "_")
    .replace(/<\/em>/gi, "_")
    .replace(/<i[^>]*>/gi, "_")
    .replace(/<\/i>/gi, "_")
    .replace(/<code[^>]*>/gi, "`")
    .replace(/<\/code>/gi, "`")
    .replace(/<a [^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_match, href, text) => {
      const label = stripTags(text).trim() || href;
      return `[${label}](${href})`;
    })
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function stripTags(text) {
  return decodeEntities(String(text || "")).replace(/<[^>]+>/g, "");
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function slugify(value) {
  return String(value || "untitled")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";
}

function safeMeta(value) {
  return JSON.stringify(value ?? "");
}

function formatTimestamp(value) {
  if (!value) return "";
  const timestamp = Number(value);
  if (!Number.isFinite(timestamp)) return String(value);
  return new Date(timestamp * 1000).toISOString();
}

main().catch((error) => {
  console.error("Intercom export failed.");
  console.error(error.response?.data || error.message);
  process.exit(1);
});
