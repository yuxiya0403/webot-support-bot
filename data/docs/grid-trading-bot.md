# Grid Trading Bot (网格机器人)

## What is Grid Trading?
The Grid Trading Bot automatically executes "buy low, sell high" trades within a set price range 24/7. It places a series of buy and sell limit orders across a grid of price levels, generating grid profits from market fluctuations.

If the price goes above the upper limit or below the lower limit, the bot pauses. It resumes once the price returns to the range.

## Best For
Sideways or volatile markets.

## Key Parameters
- **Upper limit**: The highest price in the bot's operating range.
- **Lower limit**: The lowest price in the bot's operating range.
- **Number of grids**: More grids = more frequent trades, smaller profit per trade. Fewer grids = less frequent trades, larger profit per trade.
- **Investment**: Minimum investment is calculated based on your range and grid count.

## Advanced Settings
- **Trigger price**: Bot activates when price reaches this level.
- **Take profit price**: Bot closes and sells all positions when price rises to this level.
- **Stop loss price**: Bot closes and sells all positions when price drops to this level.
- **Slippage control**: Limits deviation between order price and execution price.
- **Grid mode – Arithmetic**: Equal price intervals between grids (e.g. 1, 2, 3, 4).
- **Grid mode – Geometric**: Proportional price intervals between grids (e.g. 1, 2, 4, 8).
- **Investment – USDT only**: Use only USDT to fund the bot.
- **Investment – Both**: Use both coins in a trading pair (e.g. BTC + USDT).
- **Trailing up**: Bot adjusts upper limit upward as price rises.

## AI Strategy
Webot's AI Strategy uses historical backtest data (7 days, 30 days, 180 days) to recommend optimal parameters. Recommended for new users.

AI 2.0 upgrades include: improved backtesting accuracy, higher grid profitability, smarter grid range, and a Maximum Drawdown Indicator.

## How to Create (App)
1. Open Webot app → Bot → Create
2. Click All → Select Grid Trading Bot
3. Choose your cryptocurrency pair
4. Click Copy Strategy to use AI or influencer strategies, or set parameters manually
5. Enter investment amount → Create → OK

## How to Create (Web)
1. Log in → Trade → Trading Bot
2. Bot → All → Grid Trading Bot
3. Choose cryptocurrency pair
4. Click Copy Strategy or set parameters manually
5. Enter investment → Create Bot → Continue

## What Happens When Price Leaves the Range
- **Exceeds upper limit**: All investment has been sold. Bot resumes buying when price returns.
- **Drops below lower limit**: Full position acquired. Bot resumes selling when price returns.

## Benefits
- Runs 24/7, never misses an arbitrage opportunity
- Reduces emotional trading decisions
- Well-suited for sideways markets (which occur ~70% of the time in crypto)

## Drawbacks
- Pauses if price goes outside the set range
- Reduces capital efficiency (some funds held in reserve)
- May underperform simple holding during strong uptrends

## Risks
- If a coin is suspended or delisted, the bot stops automatically
- Grid Trading is a tool, not financial advice
- Past performance does not guarantee future results
