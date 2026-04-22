#!/bin/bash
pkill -f "node src/index.js" 2>/dev/null
sleep 1
cd "$(dirname "$0")"
nohup node src/index.js > logs/bot.log 2>&1 &
echo "Bot started (PID $!). Logs: logs/bot.log"
