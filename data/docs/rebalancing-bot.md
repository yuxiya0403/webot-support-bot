# Rebalancing Bot (屯币宝)

## What is the Rebalancing Bot (屯币宝)?
The Rebalancing Bot (屯币宝) maintains a target allocation ratio across multiple coins by automatically buying and selling when prices shift. It takes advantage of price fluctuations between coins to accumulate more tokens over time.

**Example**: You invest 100 USDT split equally between BTC and ETH (50/50). When BTC grows to 60 USDT and ETH stays at 50 USDT, the bot sells 5 USDT of BTC and buys 5 USDT of ETH to restore the 1:1 balance. After rebalancing, both are worth ~55 USDT each.

## Best For
- Users optimistic about multiple coins long-term
- Building coin holdings through automated rebalancing arbitrage

## Modes
- **Dual-coin mode**: Balance 2 coins at a 1:1 ratio.
- **Multi-coin mode**: Balance up to 10 coins with custom ratios.

## Rebalancing Methods
- **Close**: Bot holds coins without rebalancing (paused mode).
- **Periodic**: Rebalances at fixed time intervals (e.g. every 4 hours or 24 hours).
- **Threshold**: Rebalances when any coin deviates beyond a set % from the target ratio (e.g. 5%).

## Key Parameters
- **Investment**: Only USDT can be used to create the bot.
- **Trigger price**: Bot activates when any selected coin reaches this price.
- **Minimum investment**: 10 USDT per coin (e.g. 2 coins = 20 USDT minimum).

## Fees
- Free to use. Only spot trading fees apply: 0.1% per rebalance transaction.

## How to Create (App)
1. Open Webot app → Bot → Create → Rebalancing Bot
2. Choose rebalancing mode (Dual-coin or Multi-coin)
3. Select cryptocurrencies
4. Enter investment amount
5. Create → Confirm

## How to Create (Web)
1. Log in → Trade → Trading Bot
2. Bot → All → Rebalancing Bot
3. Select cryptocurrencies
4. Set rebalancing mode and parameters
5. Enter investment → Create → OK

## FAQ
**Q: When is a good time to create the Rebalancing Bot?**
A: When coin prices are relatively low. If you're unsure, open multiple bots in batches to average your entry price.

**Q: Why does my bot only show sell records with no buy records?**
A: This happens with small investments. After a sell, the minimum trade size may prevent a buy from executing. This is normal.

**Q: Can I modify the rebalance condition while the bot is running?**
A: Yes. Click Detail → Parameter → Rebalance mode to modify.

**Q: Can I withdraw or add investment?**
A: Yes. Click Edit/Stop → Withdraw investment or Add investment. When reducing, principal and profit are released proportionally.

**Q: Why are my coin holdings decreasing?**
A: When one coin is sold to rebalance, another is bought. Over time, all coin holdings increase as the bot captures price fluctuation profits.
