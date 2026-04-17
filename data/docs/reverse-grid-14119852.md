---
id: "14119852"
type: article
title: "Reverse Grid"
state: "published"
url: "https://intercom.help/webot/en/articles/14119852-reverse-grid"
author_id: 10009720
created_at: 2026-03-19T06:22:06.000Z
updated_at: 2026-03-19T06:22:08.000Z
---
# Reverse Grid
> What is Reverse GridBefore explaining the specific principles, let’s first understand the goal of the reverse grid: increase the number of...
_

What is Reverse Grid

Before explaining the specific principles, let’s first understand the goal of the reverse grid: **increase the number of tokens held by the bot** and **reduce the cost of holding the bot**.

The principle of the reverse grid is similar to the principle of the grid. They all use the bot to buy low and sell high to perform arbitrage within a certain price range. The essential difference between them is that the unit of calculating the income is different, so how to understand it?

First of all, let’s learn a little knowledge: Take the most common trading pair “ETH/USDT” as an example. Here we generally refer to the token “USDT” on the right side of the trading pair as **“Quote Currency”**. The token “ETH” on the left side of the trading pair is called **“Base Currency”**.

Next, we still take the “ETH/USDT” trading pair as an example:

When you create a grid, the bot will use “**Quote Currency**” (USDT) to measure the profit of the bot, focusing on whether the amount of USDT held increases.

When you create a reverse grid, the bot will use the “**Base Currency**” (ETH) to measure the bot’s revenue, and the focus is on whether the number of ETH held increases.

Believe that seeing this, you should have understood the principle of the reverse grid.

When is it appropriate to use Reverse Grid

When you judge that the market is about to fall, you might as well take the currency in your hand to open a reverse grid, sell the currency at a high price, and buy it back at a low price. This will continue to shake arbitrage and reduce your holding costs; When the market is in a bear market, you can also open a reverse grid with the coins in your hand to earn more coins and wait for the arrival of the bull market.

How to create Reverse Grid

First, open the Webot website and log in to your account, then find the “**Reverse Grid**” on the right side of the website page, and then click “**CREATE**” to enter the parameter setting page.

![](https://webot-d125655f84fc.intercom-attachments-1.com/i/o/c6h9pild/2177939270/a1b78b1fd6825601a05d0b90275e/1655200215218-1024x283.jpg?expires=1776232800&signature=8311f42745bb57224adf80afe350bade345ccb092135bd4c95587a6124b3609b&req=diEgEcB9lINYWfMW3nq%2BgQLdwOI4uXak42f32Pz5O%2F2nt%2Fy%2F0Sacf6AiJToP%0AuX03hDrYWKsbqxNuuch%2FHRssHXI%3D%0A)

**Parameter meaning**

- **Upper price:** When the price is higher than the Upper price of the interval, the bot will no longer execute orders outside the grid interval.

- **Lower price: **When the price is lower than the Lower price of the interval, the bot will no longer execute orders outside the grid interval.

- **Grids:** Divide the Upper price of the interval and the Lower price of the interval into corresponding shares.

- **Total investment: **The number of tokens planned to be invested in the bot.

![](https://webot-d125655f84fc.intercom-attachments-1.com/i/o/c6h9pild/2177939286/68d9ea495392428cbba63bf02e75/1655200706242.jpg?expires=1776232800&signature=203d852c9b780eb4e2ab0f359dff69990d4c4374220982a52032be8f24f06b8a&req=diEgEcB9lINXX%2FMW3nq%2BgRsBdTiQaSreZ5pyrohBUW%2BFd72zjJlO7WUNDwaW%0AQ%2BIbQN98OqcJ9f9n3Nl37RAFY1Q%3D%0A)

**Advanced settings**

- **Trigger price: **When the currency price reaches this price, the bot order is triggered to be created.

- **Stop loss: **When the currency price rises to this price (the number of base currencies is decreasing), the bot order will be automatically closed, and all the quoted currencies held by the bot will be converted into the base currency. (For example, when the reverse grid trades the ETH/USDT trading pair, the order triggers a stop loss, and the bot will convert all USDT into ETH)

- **Close bot at:** When the currency price drops to this price (the number of base currencies is increasing), the bot order will be automatically closed, and all the quoted currencies held by the bot will be converted into the base currency. (For example, when the reverse grid trades the ETH/USDT trading pair, the order triggers take profit, and the bot will convert all USDT into ETH)

- **Slippage control: **Through parameter setting to control the deviation of the initial open final trading average price and the price at the time of placing the order within a certain percentage range. (Due to the large volatility of the crypto market, when traders are trading, the final trading price is often inconsistent with the price when the order is placed. At this time, you can control the slippage by opening the order limit price)

- **Grid mode-Arithmetic:** When creating a grid strategy, the price interval of each grid of the arithmetic grid is equal (for example, 1, 2, 3, 4)

- **Grid mode-Geometric: **When creating a grid strategy, the price range of each grid of the geometric grid is proportional (for example, 1, 2, 4, 8)

- **Investment-ETH Only: **Only ETH can be used to create the reverse grid bot (for example, the reverse grid trades the ETH/USDT trading pair, then you can only use ETH to create the bot in this case )

- **Investment-Both: **You can invest the dual coins in your account at the same time to create the reverse grid bot (for example, when you choose the ETH/USDT trading pair, you can invest in both ETH+USDT cryptocurrencies at the same time to create the reverse grid bot.

Example of using a Reverse Grid Bot

![](https://webot-d125655f84fc.intercom-attachments-1.com/i/o/c6h9pild/2177939318/32c63b57db2f91ff5e8b17ce2ad4/S__35037190.jpg?expires=1776232800&signature=91b2132bba5ed08c7fa93b6a6d371565f4d6f9794bf288b4ae25e1426ef79980&req=diEgEcB9lIJeUfMW3nq%2BgXgAEdLtljdY7NUGYQwkKLk2mGvMaoKksx%2Fyd7SN%0A9EkhCntciOMR6NTPWKFvQ9Yehn8%3D%0A)

**Explanation of bot Order Terms**

- **Investment: **The amount of currencies invested when the grid bot is created

- **Total profit:** Grid profit + Unrealized profit

- **Grid profit:** Bot keep buying low and selling high, and gain arbitrage profits

- **Unrealized profit:** (Current price-purchase cost) * number of currencies of bot held

- **Grid annualized: **[(Grid profit/Investment)/(Lasting time/365)]*100%

- **Total annualized:** [(Total profit/Investment)/(Lasting time/365)]*100%

FAQ

**Q：The grid bot is used for rising market, but can the reverse grid be used for shorting when the market is falling?**
A：The reverse grid cannot be regarded as a short grid because its principle is the same as the grid bot.
If you want to go short, you can use a Margin Grid or an S-shaped leveraged token.

**Q：Is it possible to create a grid bot and a reverse grid bot at the same time to realize long-short hedging and earn grid profits?**
A：This kind of operation cannot realize hedging because the principle of the reverse grid is the same as the grid, which is to obtain profit by buying low and selling high. So this operation is the same as creating two grid bots at the same time.

**Q：I create the ETH/USDT reverse grid bot; why the grid profit will decrease?**
A：Because the profit earned by arbitrage during the operation of the reverse grid bot is still USDT, the bot will convert this part of USDT into the corresponding amount of ETH and display it. If the price of ETH increases, then the amount of equivalent ETH corresponding to this part of USDT will decrease, which will show that your grid profit is decreasing.

**Q：I create the reverse grid of ETH/USDT; shouldn’t i release ETH to release profits? Why is the released profit USDT?**
A：Because the principle of the reverse grid is the same as that of the grid, it is profitable by buying low and selling high. So the arbitrage of the reverse grid will naturally earn USDT, and the profit you withdraw will also be USDT.

**Q：Can I modify the parameters or add or withdraw the investment after the bot is created?**
A：After the bot is successfully created, the parameters such as the price range and the number of grids are fixed and cannot be changed. You can no longer add or withdraw the investment. Only the stop loss price and take profit price can be adjusted.

**Q：When I created the reverse grid of ETH/USDT, I set the take profit/automatic stop loss. When the currency price reaches the setting, will it automatically exchange back ETH for me? Will it become USDT?**
A：When the currency price reaches the take-profit/stop-loss price you set, the reverse grid bot will automatically close the position. At this time, the bot will immediately use all the USDT held by the bot to buy all ETH at the market price.