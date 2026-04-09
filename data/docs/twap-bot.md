# TWAP Bot (定投机器人)

## What is TWAP?
TWAP (Time-Weighted Average Price) is an algorithmic trading strategy that splits a large order into smaller equal-sized orders executed at regular time intervals. This minimizes market impact and achieves a better average transaction price.

## Why Use TWAP?
When placing a large buy or sell order all at once, it can move the market price unfavorably. TWAP spreads the order over time to reduce this impact and lower transaction costs.

## Parameters
- **Order period**: Time interval between each order — options: 10 sec, 30 sec, 1 min, 5 min.
- **Buy/Sell amount per order**: The amount to buy or sell in each interval.
- **Total transactions**: Number of times the order repeats.

## Examples
**Buying example**: ETH/USDT pair, frequency = 10 seconds, buy 1,000 USDT each time, total 100 transactions → Bot buys 1,000 USDT of ETH every 10 seconds, 100 times = 100,000 USDT total.

**Selling example**: ETH/USDT pair, frequency = 10 seconds, sell 1 ETH each time, total 100 transactions → Bot sells 1 ETH every 10 seconds, 100 times = 100 ETH total.

## How to Use (Web only)
1. Log in to Webot website
2. Trade → Trading Bot → TWAP
3. Select trading pair
4. Set order period, amount per order, and number of transactions
5. Start
