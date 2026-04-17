# Webot Bot Maintenance Checklist

## Every few hours (when bot stops responding)
- [ ] Get fresh AWS credentials from your SSO portal
- [ ] Update `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` in `.env`
- [ ] Run `bash start.sh` — restarts the bot with new credentials
- [ ] Verify: `tail -5 logs/bot.log`

## When you update articles in Intercom
- [ ] Run `bash scripts/weekly-refresh.sh`
- [ ] Check `logs/refresh.log` to confirm it completed
- [ ] Test a question in Telegram to verify new content is live

## Daily (takes 2 min)
- [ ] Send `SUGGESTIONS` to the agent bot in Telegram
- [ ] Review AI-generated FAQ suggestions
- [ ] `APPROVE #1 #2` → `CONFIRM ALL` to publish good ones
- [ ] `REJECT #1` to discard irrelevant ones

## Weekly
- [ ] Check `logs/conversation-log.jsonl` for common unanswered questions
- [ ] Add missing FAQs to `data/knowledge-base.json` if needed
- [ ] Add images to FAQs that don't have them yet (51 remaining)

## When AWS session token changes (ask tech team)
- [ ] Update `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` in `.env`
- [ ] Run `bash start.sh`

---

## Pending FAQs — Need Internal Policy / Confirmation

- [ ] FAQ #22 — Why was my account suspended during deposit? (need to verify answer with internal policy before adding)
- [ ] FAQ #23 — Account frozen after multiple login failures (need internal policy details before adding)
- [ ] FAQ #25 — Why did my bot get stopped by the system? (need internal policy — chat showed bots stopped despite meeting minimum investment)
- [ ] FAQ #26 — What is the minimum investment for the Moon Bot? (need to confirm current minimum amount)
- [ ] FAQ #30 — Why does wire withdrawal take 7+ business days? (need internal SLA details for wire withdrawals)

## Pending FAQs — Can Add Now (no internal info needed)

- [ ] FAQ #20 — Withdrawal cancelled by support — what now?
- [ ] FAQ #21 — Driver's license not accepted for KYC, only passport?
- [ ] FAQ #24 — How to verify without TIN/SSN?
- [x] FAQ #27 — Grid bot fees vs profit calculation ✅ Added
- [x] FAQ #28 — Bot created with old parameters — can I update them? ✅ Added
- [x] FAQ #29 — ACH deposit history empty / no confirmation email ✅ Added
- [x] FAQ #31 — Signed up for wrong exchange (Pionex instead of Webot) — can I get a refund? ✅ Added
- [x] FAQ #32 — 3 MFA methods explained (email / SMS / Google Authenticator) ✅ Added

---

## Quick Reference

| Task | Command |
|---|---|
| Start / restart bot | `bash start.sh` |
| Check bot logs | `tail -20 logs/bot.log` |
| Refresh articles + images | `bash scripts/weekly-refresh.sh` |
| Check refresh logs | `tail -20 logs/refresh.log` |
| Check image cache progress | `tail -5 logs/image-cache.log` |
| Refresh AWS credentials | Update `.env` then `bash start.sh` |
