# Reverse Grid Bot (反向网格机器人)

## What is the Reverse Grid Bot?
The Reverse Grid Bot accumulates base currency (e.g. ETH) by selling high and buying back lower. Unlike the regular Grid Bot which profits in quote currency (USDT), the Reverse Grid measures profit in base currency (ETH).

**Goal**: Increase the number of tokens held and reduce the cost of holding.

## Key Concept
- **Grid Bot**: Profits measured in quote currency (USDT). Focuses on growing USDT.
- **Reverse Grid Bot**: Profits measured in base currency (ETH). Focuses on growing ETH holdings.

## Best For
- Bear markets — sell coins high, buy back lower, accumulate more coins
- When you want to reduce your average holding cost over time

## Key Parameters
- **Upper limit**: Bot stops executing orders above this price.
- **Lower limit**: Bot stops executing orders below this price.
- **Grids**: Number of price levels within the range.
- **Investment**: Amount of base currency (tokens) to invest.

## Advanced Settings
- **Trigger price**: Bot activates when price reaches this level.
- **Stop loss**: When price rises to this level (base currency decreasing), bot closes and converts all USDT back to base currency.
- **Take profit**: When price drops to this level (base currency increasing), bot closes and converts all USDT back to base currency.
- **Slippage control**: Controls deviation between order price and execution price.
- **Grid mode – Arithmetic**: Equal price intervals (e.g. 1, 2, 3, 4).
- **Grid mode – Geometric**: Proportional price intervals (e.g. 1, 2, 4, 8).
- **Investment – Base currency only**: Use only the base currency (e.g. ETH only).
- **Investment – Both**: Use both coins simultaneously (e.g. ETH + USDT).

## How to Create (App)
1. Open Webot app → Bot → Create
2. Select Reverse Grid Bot
3. Choose cryptocurrency pair
4. Enter parameters (or use AI Strategy) and investment amount
5. Create → OK

## How to Create (Web)
1. Log in → Trade → Trading Bot
2. Bot → All → Reverse Grid Bot
3. Choose cryptocurrency pair
4. Enter parameters and investment amount
5. Create Bot → Continue

## FAQ
**Q: Can the Reverse Grid be used for shorting?**
A: No. The reverse grid cannot be used as a short strategy. It still buys low and sells high, just like the regular grid.

**Q: Can I run a Grid Bot and Reverse Grid Bot at the same time for hedging?**
A: No. Both bots buy low and sell high — running both simultaneously is the same as running two grid bots. It does not create a hedge.

**Q: Why is my grid profit decreasing?**
A: The bot earns USDT from arbitrage and converts it to base currency (e.g. ETH). If ETH price rises, the same USDT buys less ETH, so the displayed grid profit in ETH decreases.

**Q: Why is my released profit in USDT, not ETH?**
A: The reverse grid earns profit by buying low and selling high, so arbitrage profits are naturally in USDT.

**Q: Can I modify parameters after the bot is created?**
A: No. Price range and grid count are fixed after creation. You cannot add or withdraw investment. Only stop loss and take profit prices can be adjusted.

**Q: When take profit or stop loss triggers, what happens?**
A: The bot automatically closes and converts all USDT held by the bot into base currency (e.g. ETH) at market price.
