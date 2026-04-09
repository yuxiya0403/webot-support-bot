---
id: "14119846"
type: article
title: "Martingale (DCA) Bot - Standard Mode"
state: "published"
url: "https://intercom.help/webot/en/articles/14119846-martingale-dca-bot-standard-mode"
author_id: 10009720
created_at: 2026-03-19T06:21:46.000Z
updated_at: 2026-03-19T06:21:47.000Z
---
# Martingale (DCA) Bot - Standard Mode
> Contents
> The classic Martingale strategy
> What is the Webot Martingale Bot?
> Martingale Bot Parameters Setting
> Martingale Bot VS Grid Tradi...
_

Contents

- [The classic Martingale strategy](#h_01JZ4WA0Y25XYBBBRGYKQ2QX05)

- [What is the Webot Martingale Bot?](#h_01JZ4WA0Y58JQ7HGX7W8JJA7J0)

- [Martingale Bot Parameters Setting](#h_01JZ4WA0YC3RQ691SDQPTBCN24)

- [Martingale Bot VS Grid Trading Bot](#h_01JZ4WA0YRMD2H7XAMMNZ0JV3Y)

- [How to Set Up a Martingale Bot?](#h_01JZ4WA0YYP5T5P8GBF6P0RHAP)

- [Martingale Bot display](#h_01JZ4WA0Z6KXHBH00F7A6N2NKT)

- [Martingale Bot FAQ](#h_01JZ4WA0ZC4VJ7264BK9R7GCAG)

The classic Martingale strategy

We believe many people have heard of the “Martingale” strategy. Traditionally, this strategy is used in speculative games, such as the “High card takes it all”. For example, if you fail in one round of the game, you can put double in the next round until you win.

According to probability theory, if the winning rate of each round is an independent event, the final profit probability is 1–0.5^n. That is to say, the more consecutive participation you take, the higher the probability of profit you will gain. For example, the winning rate of the first round is 50%, the second is 75%, the third is 87.5%, the fourth is 93.75%, and the fifth is 96.875%.

In the final win, the chips you put in are twice as much as the previous one, so the winning one can cover the previous loss, which will make you a profit. For example, you invest $10 for the first time, $20 for the second time, $40 for the third, $80 for the fourth, and $160 for the fifth time. If you win the fifth time, the final profit will be 160–80–40–20–10=$10.

Some people call Martingale a “Win with enough funds” strategy. If you have enough funds, you will definitely be profitable in the end. But the reality is that no one will have unlimited funds. Even with a 99.99% winning rate, one person may be unlucky to lose all the principal.

So, how do you use this martingale strategy in trading and optimize it for a higher winning rate and capital utilization? Let’s continue to explore:

What is the Webot Martingale Bot?

Webot Martingale Bot is developed and designed with the traditional martingale strategy core idea, which is a strategy of ladder-buy, selling all at once. And it will use more funds to buy for each dip to significantly reduce the average holding cost.

Webot Martingale Bot will buy unequal amounts of coins after every price drop with a fixed percentage. If you create a Webot Martingale Bot, the bot will calculate with the parameters you set up and evenly divide the investment into several shares. Then the bot will buy coins with 1 share, 1 share, 2 shares, 4 shares, 8 shares, 16 shares….

Assuming that if the price drops by 1%, the bot will buy a number of coins. So the bot will buy the dips when the currency price drops to 99%, 98%, 97%, 96%, 95%… When it drops by 5%, the average price is 95.97% of the initial price. At this time, if the current price increases by 1.02%, it will recover the cost, which greatly reduces the risk. However, the Grid Trading Bot strategy needs to rise to about 99% of the initial price to recover its costs, and the Webot Martingale Bot only needs to rise 4.2%.

Therefore, how to make profits with the Webot Martingale Bot? The first is to choose good coins. As long as this coin has good liquidity, the price will not drop to zero in the long term, and the Martingale Bot can help to make profits. Secondly, the timing to get started is also much easier. Most Webot Martingale Bots will make profits unless the price keeps going down without returns after getting started.

Based on the above two points, it’s recommended that users choose the top coins with a big market cap and get started at the Not-High price timing, which can make profits with liquidity, reduce risks, and minimize the drawdown of your funds.

Webot Martingale Bot does not use leverage and can freely set the percentage of decline for buying the dips. So it is very safe. As long as the selected coins are good, even if there is a short-term drawdown, it can be profitable right away once the price rebounds

**We also did backtesting on the Martingale Bot on BTC/USDT ( backtesting period: 15 months, April 1, 2020 ~ July 1, 2021):**

According to the default AI parameters, the Martingale Bot has reached 205.68% APR in a complete cycle of one and a half years, with a total of 623 arbitrage times. In the middle of 519, the max drawdown is -52.84%, which is slightly lower than holding BTC with a -55.44% drawdown.

_

If we make the strategy more conservative and increase the percentage of the price scale, Martingale Bot can obtain more stable profits and a smaller drawdown. As can be seen from the table below, if you increase your position for every 10% drop, the max drawdown of the Martingale Bot is only -16.37%, which is far less than the a -55.44% of holding, and the profit is as high as 122.12%, which keeps the good balance between the benefits and risks.

_

Martingale Bot Parameters Setting

The Webot Martingale Bot maintains a clean product design with an easy-to-use and visually appealing interface. It operates in an automatic cycle mode — each time it buys the dip and takes profit, it automatically enters the next round. The Martingale Bot offers both AI strategy parameters and the flexibility to customize the settings as needed.

AI Strategy

Martingale AI strategy provides parameters based on the volatility of different coins. Based on risk preference, there are two types of AI parameters:

Balanced

_

The balanced type offers moderate benefits and risks, providing relatively high volume scaling and fewer safety orders, allowing the strategy to maintain a high fund utilization rate.

Conservative

_

The conservative type offers lower risks and returns, with relatively lower volume scaling and more safety orders, allowing the strategy to maintain a moderate fund utilization rate.

Customize Setting

The manual setting includes seven parameters, categorized into common and advanced parameters.

Common Parameters

_

There are three parameters in common:

- **Price scale:** After the first order is executed in each round, the bot will buy the coins when the price drop reaches this ratio. This ratio can be filled in with a percentage or an absolute value.

- **Take profit ratio:** In each round, when buying the dips and the price rebounds to reach this ratio, the bot will sell all the coins to take profit.

- **Investment**: The total investment amount of this Webot Martingale Bot.

Advanced Parameters

_

There are five parameters in advanced:

- **Volume scale:** How many times is the amount of this time compared to the previous time when the position is replenished. For example, if you choose 1.5 times, the investment amount for each safety order is 1, 1.5, 2.25…

- **Stop loss percentage:**

- Total profit: All of the coins will be sold when the total profit hits the percentage, and the bot will be closed.

- Unrealized profit: Your coins will be sold out, and the bot will be closed when the unrealized profit rate reaches the percentage. If you want to input a positive number, the number should be less than the current unrealized profit.

- **Price range**: The bot will not start a new round if the current price is outside the price range.

- **Trigger price:** The bot will be activated when the price reaches the trigger price, which can be set either above or below the current market price.

- **Safety orders:** In each round, the bot evenly divides the investment into multiple parts to buy the dips. The Martingale Bot uses an increasing order size strategy—buying the dips with 1 part of the funds, then 1 share, 2 shares, 4 shares, 8 shares, 16 shares, 32 shares, and so on—to execute the subsequent orders.

For example, if Safety Orders are set to 3, the funds will be divided into 8 shares. At the beginning of each round bot will start by buying 1 share (1/8 of the investment amount). If the price drops by a certain percentage, the bot will then buy another 1 share (1/8), followed by 2 shares (1/4), and finally 4 shares (1/2) as the price continues to drop. If the price drops further beyond this point, the bot will not buy any more coins. Instead, it will wait for the price to rebound and reach the take-profit ratio, at which point it will sell all 8 shares to take profit.

Martingale Bot VS Grid Trading Bot

The biggest difference between the Martingale Bot and the Grid Trading bot is that the Martingale Bot will laddering buy and sell all at one time, while the Grid Trading Bot will laddering buy and laddering sell. Because Martingale Bot will buy more and more coins during the downward process, it will keep a small position with the coins when getting started for the first time. While Grid Trading Bot will hold more coins when getting started, according to the parameters set by the user. Normally, the coin will take about half of the initial investment. Therefore, when the market rises, Grid Trading Bot will gain more trend gains than Martingale, but if the market falls, Grid Trading Bot will also have a greater drawdown.

However, Martingale Bot only divides funds into 32 shares by default. And to pursue more frequent arbitrage profit, Grid Trading Bot usually divides funds into more than 100 shares, so the capital utilization rate of Martingale Bot will be Higher than Grid Trading Bot. When the fluctuations are big in the uptrend market, Martingale Bot will take a higher arbitrage profit than the Grid Trading bot.

So, in summary, the pros and cons of Martingale Bot and Grid trading are as follows:

Trending Profit

Martingale Bot Arbitrage Profit

Martingale Bot > Grid Bot

Risk

Martingale Bot 

How to Set Up a Martingale Bot?

To get started, simply follow the tutorials on Webot Martingale strategy and create your first Martingale Bot today.

**In APP：**

**Step 1: **Open the [Webot app](https://www.webot.com/us/en-US/download) and click on [Bot] - [Create] to access the bot section.
​

_

**Step 2: **Click [All], then select [Martingale Bot] & choose [Standard mode].

_

**Step 3****:** Choose your desired cryptocurrency pair, then click [AI Strategy]. Select your preferred risk level from the [Risk Preference] drop-down menu. You may configure additional parameters (optional), enter the investment amount, and then click [Create] followed by [Confirm] to successfully set up your bot.

_

[https://drive.google.com/file/d/1ViBMSS-1NYKQ_GG9JvA06GJqdv68b6Th/view?usp=drive_link](https://drive.google.com/file/d/1ViBMSS-1NYKQ_GG9JvA06GJqdv68b6Th/view?usp=drive_link)

**On the Web：**

**Step 1: **Log in to your [Webot account](https://accounts.webot.com/en/sign), click on [Trade] in the upper menu bar, and then select [Trading Bot].
​

_

**Step 2: **Click on [Bot] - [All], then select [Martingale Bot].
​

_

**Step 3: **Choose your desired cryptocurrency pair, then click [Use AI Strategy]. Select your preferred risk level from the [Risk Preference] drop-down menu. You may configure additional parameters (optional), enter the investment amount, and then click [Create] followed by [OK] to successfully set up your bot.
​

_

Martingale Bot display

The Martingale running bot interface is designed to be simple and user-friendly. It provides a concise overview of your bot’s performance and key metrics. You can view a total of eight main parameters on the bot’s detail page, with additional data available within the interface.

This allows users to track both realized and unrealized profits, understand trading frequency, and evaluate the bot’s overall effectiveness based on market conditions and preset strategies.

_

- **Investment:** The total amount of funds allocated to the Martingale bot. This represents your capital input into the strategy.

- **Total Profit:** The net profit generated by the bot after deducting trading fees. Note: When the bot is stopped, the sum of Investment + Total Profit is what you should expect to receive. However, due to market fluctuations at the moment of stopping, the final amount may differ slightly.

- **Arbitrage Profit:** The total profit earned from each round of successful buying low and selling high—i.e., the realized profit.

- **Unrealized Profit:** This reflects the current profit or loss for coins held in an ongoing round. These coins haven't been sold yet, and their value is based on the current market price compared to their average cost.

- **Arbitrage/Total APR (Annual Percentage Rate):** An annualized performance metric. It shows how the arbitrage profit (or total profit) translates into a yearly return rate, giving a better sense of long-term profitability.

- **Current Price:** The live market price of the coin being traded by the bot.

- **Take-Profit Price:** The target price at which the bot will sell all the accumulated coins for profit in the current round, based on your configured parameters.

- **Completed Rounds:** The number of full trading cycles (buy dips → sell on rebound) the bot has completed. Each cycle is considered one round.

Martingale Bot FAQ

**Q：Does the Webot Martingale (DCA) bot automatically reinvest profits?**

A：The Webot Martingale (DCA) bot is designed to automatically reinvest profits back into the bot, resulting in an auto-compounding effect. After each round is completed, the bot generates profits, which are then reinvested. For example, if your DCA bot generates a profit of 10 USDT in the current round and your bot has a total of 10 shares, the profit will be evenly distributed among these shares before the start of the next round. This means each share will receive an additional 1 USDT, and the bot will initiate the next round with the increased funds. This process continues—compounding profits and starting new rounds—as long as the bot remains active.

Please get in touch with [Webot Support](https://webot.zendesk.com/hc/en-us/requests/new) if you have any other questions.