#!/bin/bash
# Weekly refresh: re-fetches articles from Intercom and caches any new images.
# Safe to run anytime — skips already-cached images, only processes new ones.

set -e
cd "$(dirname "$0")/.."

LOG="logs/refresh.log"
mkdir -p logs
echo "=== Weekly refresh started: $(date) ===" >> "$LOG"

# 1. Re-fetch articles from Intercom
echo "[1/3] Fetching articles from Intercom..." | tee -a "$LOG"
node scripts/export-intercom-content.js >> "$LOG" 2>&1
echo "Articles fetched." | tee -a "$LOG"

# 2. Cache any new images (skips already-cached ones)
echo "[2/3] Caching new images to Telegram..." | tee -a "$LOG"
node scripts/cache-article-images.js >> "$LOG" 2>&1
echo "Images cached." | tee -a "$LOG"

# 3. Restart bot if it's running
echo "[3/3] Restarting bot..." | tee -a "$LOG"
bash start.sh >> "$LOG" 2>&1
echo "Bot restarted." | tee -a "$LOG"

echo "=== Refresh complete: $(date) ===" >> "$LOG"
echo "Done. See logs/refresh.log for details."
