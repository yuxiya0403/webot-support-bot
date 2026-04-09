# Webot AI Telegram Support Bot — Build Checklist

## Phase 1: Infrastructure Setup

- [ ] 1.1 Create customer-facing bot via BotFather → copy token to `TELEGRAM_BOT_TOKEN`
- [ ] 1.2 Create agent bot via BotFather → copy token to `AGENT_BOT_TOKEN`
- [ ] 1.3 Get your Telegram chat ID (send `/chatid` to the customer bot) → set `AGENT_CHAT_IDS`
- [ ] 1.4 Set AWS Bedrock credentials: `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- [ ] 1.5 Run `npm install` and `npm start` — confirm bot responds to `/start`

## Phase 2: Knowledge Base

- [ ] 2.1 Update `data/knowledge-base.json`:
  - [ ] `businessName` — e.g. "Webot (formerly Pionex.US)"
  - [ ] `summary` — 2–3 sentences describing the platform
  - [ ] `handoffContact` — e.g. "@siaauu" or support email
- [ ] 2.2 Add top 20–30 FAQ entries (real user questions + answers) to the `faqs` array
- [ ] 2.3 Add product documents to `data/docs/`:
  - [ ] Trading bot guides
  - [ ] Fee schedule
  - [ ] KYC / verification process
  - [ ] Withdrawal / deposit rules
  - [ ] Common error explanations
- [ ] 2.4 Update `HANDOFF_KEYWORDS` in `.env` for Webot-specific triggers
  - Current defaults: `人工,转人工,投诉,退款,合作,紧急,human,agent`
  - Add any others: e.g. `提现,KYC,出金,冻结`

## Phase 3: AI Prompt Tuning

- [ ] 3.1 Write `AI_SYSTEM_PROMPT` in `.env`:
  - Specify language preference (Chinese default, switch if user writes English)
  - Define response tone (professional, concise)
  - Set boundaries (don't promise timelines, don't invent policies)
- [ ] 3.2 Test that AI stays within knowledge base and doesn't hallucinate

## Phase 4: Testing

- [ ] 4.1 Test FAQ coverage — ask the top 10 common questions, verify answers are correct
- [ ] 4.2 Test out-of-scope question — bot should offer handoff, not invent an answer
- [ ] 4.3 Test handoff trigger — send "人工", confirm agent bot receives the ticket
- [ ] 4.4 Test agent REPLY command — send `REPLY <message>` from agent bot, confirm user receives it
- [ ] 4.5 Test agent RESOLVE command — send `RESOLVE`, confirm session closes cleanly
- [ ] 4.6 Test SESSIONS command — send `SESSIONS`, confirm active sessions are listed
- [ ] 4.7 Test multi-turn conversation — ask 3–4 follow-up questions, verify context is maintained

## Phase 5: Deployment

- [ ] 5.1 Deploy to a server (VPS or cloud instance)
- [ ] 5.2 Set `TELEGRAM_MODE=polling` (no public URL needed) or configure webhook with `BASE_URL`
- [ ] 5.3 Run as a managed process (e.g. `pm2 start src/index.js`) so it restarts on crash
- [ ] 5.4 Confirm only ONE instance is running at a time (two instances cause 409 conflicts)

## Phase 6: Ongoing Maintenance

- [ ] 6.1 Review `data/gap-log.jsonl` weekly — find questions the bot couldn't answer
- [ ] 6.2 Add those questions to `data/knowledge-base.json` FAQs
- [ ] 6.3 Monitor handoff rate — if too high, knowledge base needs more content
- [ ] 6.4 Update FAQ and docs whenever product/policy changes
