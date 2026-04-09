# Smart Trade Bot (智能交易)

## What is Smart Trade?
Smart Trade is a 24/7 trading bot that lets you schedule a buy with automatic take-profit and stop-loss settings. It helps you capture profits during uptrends while limiting downside risk — without needing to monitor the market constantly.

## Best For
Volatile and trending markets where you want to capture a move with defined risk parameters.

## Modes

### Limit (Standard Mode)
Set a specific buy price. Bot places a limit buy order and waits for execution.

**Buy-in parameters:**
- **Buy price**: The limit price at which you want to buy.
- **Buy quantity**: Amount of tokens to purchase.

**Take-profit options:**
- **Fixed-Price Take Profit**: Sells when price reaches your set target. Must be above buy price.
- **Trailing Take Profit**: Activates when price reaches the sell trigger price. Then sells when price drops from its peak by the trailing %. Formula for max trailing %: (Sell Trigger Price – Buy Price) / Sell Trigger Price × 100%.

**Stop-loss:**
- Set the price at which the bot closes the position. Set to 0 to disable.

### Market (Speed Mode)
For chasing a rising trend immediately. No specific buy price needed.

**Parameters:**
- **Total investment**: Amount to invest.
- **Trailing percent (%)**: When price rises to a peak then drops by this %, the bot sells — capturing profit or limiting loss.

## How to Create (App)
1. Open Webot app → Bot → Create → Smart Trade
2. Choose cryptocurrency pair
3. Select mode (Limit or Market)
4. Set buy price and quantity
5. Set take-profit (Fixed or Trailing) and stop-loss
6. Create

## How to Create (Web)
1. Log in → Trade → Trading Bot
2. Bot → All → Smart Trade
3. Choose cryptocurrency pair
4. Select mode and set parameters
5. Create

## Risk Warning
Fixed-Price and Trailing Take-Profit orders are triggered by market price. During high volatility, large buy/sell volumes can impact market price. Check the depth and liquidity of your chosen cryptocurrency before using Smart Trade. Webot does not recommend investing large amounts in low-liquidity assets.
