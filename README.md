# Telegram Customer Support Demo

This project now supports two Telegram connection modes:

- `TELEGRAM_MODE=polling`: local-only, no public URL needed
- `TELEGRAM_MODE=webhook`: public HTTPS webhook

It also supports two bot behavior modes:

- `MODE=ai`: Telegram bot -> AI customer support demo
- `MODE=intercom`: Telegram bot -> Intercom bridge

For your stage-1 demo, use `MODE=ai`.

## What the AI demo does

- Receives Telegram bot webhooks
- Replies to `/start` with a welcome message
- Answers FAQ-style questions from a local knowledge base
- Can read additional local `.txt`, `.md`, `.json`, or `.csv` files as document sources
- Optionally calls an OpenAI-compatible chat completion API
- Falls back to a safe response or human handoff when confidence is low

## What the Intercom bridge does

- Creates or reuses an Intercom contact for that Telegram user
- Creates a new Intercom conversation for the first Telegram message
- Replies to the same Intercom conversation for later Telegram messages
- Receives Intercom webhook events for teammate replies
- Sends the latest Intercom reply back to Telegram

## Limits

- Text messages only
- Uses JSON files instead of a database
- AI mode is a minimal demo, not a production support system
- Intercom mode assumes one open conversation per Telegram chat

## Setup

1. Create a Telegram bot with BotFather
2. Copy `.env.example` to `.env`
3. Fill in at least:
   - `MODE=ai`
   - `TELEGRAM_MODE=polling`
   - `TELEGRAM_BOT_TOKEN`
   - `AI_API_KEY` if you want live AI responses
4. Optionally configure:
   - `BASE_URL` only for webhook mode
   - `AI_BASE_URL`
   - `AI_MODEL`
   - `DOCUMENT_PATHS` for additional local document sources
5. Update `data/knowledge-base.json`
6. Install dependencies with `npm install`
7. Start the server with `npm start`
8. For local-only setup, chat with the bot directly in Telegram

## Local-only mode

Use this when you do not want a public URL:

```env
TELEGRAM_MODE=polling
BASE_URL=
```

Then run:

```bash
npm start
```

The bot will delete any existing webhook and start polling Telegram directly from your machine.

## Using local files as AI knowledge

If you have trading guideline files, put them on disk and list them in `.env`:

```env
DOCUMENT_PATHS=./docs/guidelines/intro.md,./docs/guidelines/risk_rules.txt,./docs/guidelines/faq.json
```

Supported file types:

- `.txt`
- `.md`
- `.json`
- `.csv`

The bot will read these files, select the most relevant ones for a user question, and send those excerpts to the AI model as context.

If your source files are PDF or Word documents, convert them to `.txt` or `.md` first for this demo.

## Telegram webhook mode

Set `TELEGRAM_MODE=webhook` and configure:

```text
https://your-host.example.com/webhooks/telegram
```

Example:

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-host.example.com/webhooks/telegram",
    "secret_token": "replace-with-random-secret"
  }'
```

## AI demo flow

- User opens the Telegram bot
- Bot sends a welcome message and example questions
- User asks a common question
- The bot tries FAQ match first
- If `AI_API_KEY` is configured, the bot can use your AI model endpoint
- If the answer is uncertain or the user requests human support, the bot replies with a handoff message

## Intercom mode setup

If you want the older Telegram <-> Intercom bridge, set `MODE=intercom` and configure:

- `INTERCOM_ACCESS_TOKEN`
- `INTERCOM_WEBHOOK_SECRET`

Then configure this Intercom webhook URL:

```text
https://your-host.example.com/webhooks/intercom?secret=replace-with-random-secret
```

Subscribe to:

- `conversation.admin.replied`
- `conversation.operator.replied`

## Export Intercom content to Markdown

You can export Help Center articles and Fin external pages into local `.md` files:

```bash
npm run export:intercom
```

Required env:

- `INTERCOM_ACCESS_TOKEN`

Optional env:

- `INTERCOM_API_BASE_URL` for EU/AU workspaces
- `INTERCOM_API_VERSION` defaults to `2.14`
- `INTERCOM_EXPORT_DIR` defaults to `./exports/intercom`
- `INTERCOM_EXPORT_INCLUDE_DRAFTS=true` to include draft articles

Output:

- `exports/intercom/articles/*.md`
- `exports/intercom/external-pages/*.md`
- `exports/intercom/index.md`

## Run locally

```bash
npm install
npm start
```

Use a public HTTPS tunnel for local testing.

## Demo docs

- `docs/phase1-demo-plan.md`: one-page plan for your boss
- `docs/ai-customer-service-script.md`: demo conversation script
- `data/knowledge-base.json`: FAQ and handoff content
