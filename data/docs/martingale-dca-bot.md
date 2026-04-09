# Martingale (DCA) Bot (马丁格尔/定投机器人)

## What is the Martingale Bot?
The Martingale Bot ladder-buys on price dips using increasing order sizes, then sells everything at once when the price rebounds to your take-profit level. It continuously reduces your average holding cost.

Buy order sizes follow a pattern: 1x, 1x, 2x, 4x, 8x, 16x... ensuring larger purchases at lower prices.

## Best For
- Coins with strong long-term fundamentals and good liquidity
- Starting at a non-high price point
- Volatile markets where price dips and recovers

## Key Parameters (Common)
- **Price scale**: The % price drop that triggers each additional buy.
- **Take profit ratio**: The % rebound at which the bot sells all accumulated coins.
- **Investment**: Total amount to invest in the bot.

## Key Parameters (Advanced)
- **Volume scale**: Multiplier for each successive buy order (e.g. 1.5x means 1, 1.5, 2.25...).
- **Safety orders**: Number of dip-buying levels. More safety orders = more dip buys before bot waits.
- **Stop loss**: Bot closes when total loss reaches this %.
- **Price range**: Bot won't start a new round if price is outside this range.
- **Trigger price**: Bot activates when price reaches this level.

## AI Strategy
- **Balanced**: Moderate risk and return. Higher volume scaling, fewer safety orders.
- **Conservative**: Lower risk and return. Lower volume scaling, more safety orders.

## Auto-Compounding
After each completed round, profits are automatically reinvested into the next round, creating a compounding effect.

## Martingale vs Grid Trading Bot
| | Martingale Bot | Grid Trading Bot |
|---|---|---|
| Trend profit | Lower | Higher |
| Arbitrage profit | Higher | Lower |
| Risk | Lower | Higher |
| Capital utilization | Higher | Lower |

## How to Create (App)
1. Open Webot app → Bot → Create
2. All → Martingale Bot → Standard Mode
3. Choose cryptocurrency pair
4. Click AI Strategy and select risk preference, or set parameters manually
5. Enter investment → Create → Confirm

## How to Create (Web)
1. Log in → Trade → Trading Bot
2. Bot → All → Martingale Bot
3. Choose cryptocurrency pair
4. Click Use AI Strategy and select risk preference, or set manually
5. Enter investment → Create → OK

## Bot Display Metrics
- **Investment**: Total funds allocated to the bot.
- **Total Profit**: Net profit after fees.
- **Arbitrage Profit**: Realized profit from completed buy-low/sell-high rounds.
- **Unrealized Profit**: Current profit/loss on coins not yet sold.
- **Completed Rounds**: Number of full buy-dip → sell-rebound cycles completed.
- **Take-Profit Price**: Target price at which bot will sell all coins in the current round.

## FAQ
**Q: Does the Martingale Bot auto-reinvest profits?**
A: Yes. After each round, profits are distributed evenly across all shares and reinvested in the next round automatically.
