---
id: "14119854"
type: article
title: "Trailing Buy and Sell"
state: "published"
url: "https://intercom.help/webot/en/articles/14119854-trailing-buy-and-sell"
author_id: 10009720
created_at: 2026-03-19T06:22:14.000Z
updated_at: 2026-04-08T00:43:15.000Z
---
# Trailing Buy and Sell
> Why do you need Trailing Buy and Trailing SellHave you ever had such an experience? After you bought the coin, the price of the coin conti...
Why do you need Trailing Buy and Trailing Sell

Have you ever had such an experience? After you bought the coin, the price of the coin continued to fall, so you were very depressed and didn’t buy it when the price was lower; after you sold the coin, the price of the coin continued to rise, making you regret it.

Then you should learn to use “Trailing Buy” and “Trailing Sell”.

“Trailing Buy” and “Trailing Sell” can help you buy as low as possible or sell as high as possible in a volatile market.

How to use Trailing Buy and Trailing Sell

Webot provides “Trailing Buy” and “Trailing Sell” bots. These two bots are suitable for buying bottoms and chasing prices in fluctuating market conditions. You can use the two bots together, so you don’t need to watch the market yourself; you don’t have to worry that the price you buy is not low enough and the price you sell is not high enough.

Trailing Buy

When you want bottoms but are unsure whether the downtrend has ended, you can use “**Trailing Buy**” to buy bottoms. You can control the bot through parameter settings. When the currency price drops to a certain low point and rebounds a certain percentage, buy it to achieve bottom hunting.

Creation Steps

1. First, open [Webot](https://www.webot.com/en-US/) and log in to your account. Choose the trading pair you want to trade.

2. Find the “**Trailing Buy**” on the left side of the page and click the “**CREATE**“.

3. Set the parameters: **Trigger price**, **Trailing percent (%)**, and **Investment**.

- **Trigger price: **When the market price reaches the set trigger price, the order will be triggered, and the order will be placed.

- **Trailing percent(%): **When the price reaches a certain bottom and rebounds to a certain extent, the order will be executed to buy.

- **Investment: **The planned amount of funds invested in this order.

4. Slide the bar to confirm the amount of money invested using the bot, and finally, click **“CREATE”** at the bottom of the page.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177951107/e38baf0f37d44f629cc4463c1e00/20270636610969?expires=1776232800&signature=5aa5b6bc33e95cbeb73fae83a69e86c831917f04358e5c36d05e4b6e5418cf62&req=diEgEcB7nIBfXvMW3nq%2BgXUlt0CQ%2F9wRCmPJDSbGR0zXQFlD2pnEOqX0fLTm%0AnG%2BPfYU282Hwxk0lD3R4uBucHLM%3D%0A)

Trailing Buy Example

Create a “**Trailing Buy**” bot and select the BTC/USDT trading pair. Assuming that the current price of BTC is 58985 USDT, the trigger price is 55000 USDT, the maximum rebound is 10%, and the purchase amount is 1000 USDT.
​
When the BTC price drops to 55000 USDT, the bot order is triggered. When the BTC price drops all the way to 40000 USDT and then rebounds to 44000 USDT (that is, the currency price rebounds by 10% from the bottom), the bot will immediately buy 1000 USDT at the market price of 44000 USDT.

Trailing Sell

When the market is hot, and you want to participate in the rise of the coin price to gain profits, but you are unable to keep an eye on the market at all times, and you are worried that the coin price will fall more and cause losses, you can use the “**Trailing Sell**” bot to chase the increase. You can control the bot through the bot’s parameter settings. When the price rises to a certain high and drops a certain percentage, the bot will sell all the tokens it holds for profit.

Steps To Create

1. First, open [Webot](https://www.webot.com/en-US/) and log in to your account. Choose the trading pair you want to trade.

2. Find the “**Trailing Sell**” on the right side of the page and click the “**Create**“.

3. Set parameters: **Trigger price**, **Trailing percent (%)**, and **Sell quantity**.

- **Trigger price: **When the market price reaches the set trigger price, the order will be triggered, and the order will be placed.

- **Trailing percent(%): **When the price reaches a certain bottom and rebounds to a certain extent, the order will be executed to buy.

- **Sell quantity:** Number of coins planned to be sold.

4. Slide the bar to confirm the number of coins planned to be sold in the bot, and finally click “**CREATE**” at the bottom of the page.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177951175/6c276008786dd043089cccf59cda/20270611775897?expires=1776232800&signature=10ea6e005f38cf0787a6bc7c9920b1d583d5983ece5386a7551e370f051e1b06&req=diEgEcB7nIBYXPMW3nq%2BgTCKOWcsTnY6DVGt6Nwv5hfBeY1QPP3HdsZRK7R0%0AO%2Fp9AjxbybOMfC%2Bt1Xc5kum0alw%3D%0A)

Trailing Sell Example

Create a “**Trailing Sell**” bot and select the BTC/USDT trading pair. Assuming that the price of BTC is 58985 USDT, the trigger price is set to 60000 USDT, the maximum drawdown ratio is set to 10%, and the quantity sold is 1 BTC.
​
The bot order is triggered when the BTC price rises to 60000 USDT. When the BTC price rises all the way to 66000 USDT and then retreats to 59400 USDT (that is, the coins price retreats by 10% from the high point), the bot will immediately sell the BTC at the market price of 59400 USDT.