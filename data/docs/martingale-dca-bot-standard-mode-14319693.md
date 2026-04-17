---
id: "14319693"
type: article
title: "Martingale (DCA) Bot - Standard Mode"
state: "published"
url: "https://intercom.help/pionexus/en/articles/14319693-martingale-dca-bot-standard-mode"
author_id: 10009720
created_at: 2026-03-30T06:14:10.000Z
updated_at: 2026-03-30T06:14:11.000Z
---
# Martingale (DCA) Bot - Standard Mode
> Contents
> The classic Martingale strategy
> What is the Pionex.US Martingale Bot?
> Martingale Bot Parameters Setting
> Martingale Bot VS Grid T...
_

Contents

- [The classic Martingale strategy](#h_01JZ4WA0Y25XYBBBRGYKQ2QX05)

- [What is the Pionex.US Martingale Bot?](#h_01JZ4WA0Y58JQ7HGX7W8JJA7J0)

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

What is the Pionex.US Martingale Bot?

Pionex.US Martingale Bot is developed and designed with the traditional martingale strategy core idea, which is a strategy of ladder-buy, selling all at once. And it will use more funds to buy for each dip to significantly reduce the average holding cost.

Pionex.US Martingale Bot will buy unequal amounts of coins after every price drop with a fixed percentage. If you create a Pionex.US Martingale Bot, the bot will calculate with the parameters you set up and evenly divide the investment into several shares. Then the bot will buy coins with 1 share, 1 share, 2 shares, 4 shares, 8 shares, 16 shares….

Assuming that if the price drops by 1%, the bot will buy a number of coins. So the bot will buy the dips when the currency price drops to 99%, 98%, 97%, 96%, 95%… When it drops by 5%, the average price is 95.97% of the initial price. At this time, if the current price increases by 1.02%, it will recover the cost, which greatly reduces the risk. However, the Grid Trading Bot strategy needs to rise to about 99% of the initial price to recover its costs, and the Pionex.US Martingale Bot only needs to rise 4.2%.

Therefore, how to make profits with the Pionex.US Martingale Bot? The first is to choose good coins. As long as this coin has good liquidity, the price will not drop to zero in the long term, and the Martingale Bot can help to make profits. Secondly, the timing to get started is also much easier. Most Pionex.US Martingale Bots will make profits unless the price keeps going down without returns after getting started.

Based on the above two points, it’s recommended that users choose the top coins with a big market cap and get started at the Not-High price timing, which can make profits with liquidity, reduce risks, and minimize the drawdown of your funds.

Pionex.US Martingale Bot does not use leverage and can freely set the percentage of decline for buying the dips. So it is very safe. As long as the selected coins are good, even if there is a short-term drawdown, it can be profitable right away once the price rebounds

**We also did backtesting on the Martingale Bot on BTC/USDT ( backtesting period: 15 months, April 1, 2020 ~ July 1, 2021):**

According to the default AI parameters, the Martingale Bot has reached 205.68% APR in a complete cycle of one and a half years, with a total of 623 arbitrage times. In the middle of 519, the max drawdown is -52.84%, which is slightly lower than holding BTC with a -55.44% drawdown.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218014923/8dcf36fc6f199aee008f9083e7c9/48487779041305?expires=1776232800&signature=f2f6469f8f41a4501310b25a67908facbbefce0d3245d1d23011902e805bbdc5&req=diImHsl%2FmYhdWvMW3nq%2Bgam5ciXlwQE2AylV%2BhJW65begOad0hzrgYEJKp5y%0A1HM151ImEWZrJFcv9j%2B5X%2B2J1rQ%3D%0A)

If we make the strategy more conservative and increase the percentage of the price scale, Martingale Bot can obtain more stable profits and a smaller drawdown. As can be seen from the table below, if you increase your position for every 10% drop, the max drawdown of the Martingale Bot is only -16.37%, which is far less than the a -55.44% of holding, and the profit is as high as 122.12%, which keeps the good balance between the benefits and risks.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218014947/608048ab9a83e914a2ea544e341a/48487792262553?expires=1776232800&signature=8f83ecdc73d0cabf968f862e2d5643e2d2e1c635a202ea5b91b737f967b13daf&req=diImHsl%2FmYhbXvMW3nq%2Bgeti%2FHPugORO9L6w3z8Q2sUreBMqvewO2%2B2Reaj%2B%0AtqCiFHD1aRol3991C%2BU4xRZWqY4%3D%0A)

Martingale Bot Parameters Setting

The Pionex.US Martingale Bot maintains a clean product design with an easy-to-use and visually appealing interface. It operates in an automatic cycle mode — each time it buys the dip and takes profit, it automatically enters the next round. The Martingale Bot offers both AI strategy parameters and the flexibility to customize the settings as needed.

AI Strategy

Martingale AI strategy provides parameters based on the volatility of different coins. Based on risk preference, there are two types of AI parameters:

Balanced

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218014971/d0ce55d697da3e08e6496575934f/48487792271257?expires=1776232800&signature=70e1dc695298da87be64bfef2d6fa29f3203884664f211471074c53e91617094&req=diImHsl%2FmYhYWPMW3nq%2Bgd%2F9QlekQHw7Q%2BhKKWSFgRt%2B%2BlyWZlZ78DWOgH6l%0A6pSHmjESWcXBXuab0v1y8TU5UXA%3D%0A)

The balanced type offers moderate benefits and risks, providing relatively high volume scaling and fewer safety orders, allowing the strategy to maintain a high fund utilization rate.

Conservative

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218014994/4a4e5e067ac61f238f4765a2c4f3/48487779048985?expires=1776232800&signature=51d3b9b00e149c6eb5089c893add249687df02340455e10b0b9820fafdcd55d0&req=diImHsl%2FmYhWXfMW3nq%2BgVNqYwCuZHYFOGm485q%2BEPrmxP3l6s5ZOu8a1o6V%0ABfuS%2BH%2BoQPnFOiC6wR4l8j5AqiY%3D%0A)

The conservative type offers lower risks and returns, with relatively lower volume scaling and more safety orders, allowing the strategy to maintain a moderate fund utilization rate.

Customize Setting

The manual setting includes seven parameters, categorized into common and advanced parameters.

Common Parameters

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015047/188a7f7f3902fb3f839343e4615e/48487792281113?expires=1776232800&signature=0be05dcc1ee32911b4037d63aef7bc40f1863b2e225044d1a8e41893b6694054&req=diImHsl%2FmIFbXvMW3nq%2BgQVFjr6dHY1plHfRuEijnkziV%2B73VvQ5S5SBC29Z%0ADGYck7uOeT3qnGsZN%2BUPDqjWqGQ%3D%0A)

There are three parameters in common:

- **Price scale:** After the first order is executed in each round, the bot will buy the coins when the price drop reaches this ratio. This ratio can be filled in with a percentage or an absolute value.

- **Take profit ratio:** In each round, when buying the dips and the price rebounds to reach this ratio, the bot will sell all the coins to take profit.

- **Investment**: The total investment amount of this Pionex.US Martingale Bot.

Advanced Parameters

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015084/d2dabd6b13289679c6f95c35f0bf/48487792282649?expires=1776232800&signature=0a8ae210d8d6a830c7505ec1b8039ae9f52af4b6c6e3de37d67d6a76f9520e21&req=diImHsl%2FmIFXXfMW3nq%2BgT6UajhU9Gdg7yG%2FrS%2FQnGVWkaQOaovU%2BPViQ%2Bl8%0AKmb3v6LPDZRhXtdgzo%2FTCaxyDvg%3D%0A)

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

To get started, simply follow the tutorials on Pionex.US Martingale strategy and create your first Martingale Bot today.

**In APP：**

**Step 1: **Open the [Pionex.US app](https://www.pionex.us/en-US/download) and click on [Bot] - [Create] to access the bot section.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015162/1c0e91cb93ad8cc7d773a09c5e8f/48487792284825?expires=1776232800&signature=1f6f0f477fc0cb403e9d2d4cc6cc6fd447d56f7f123d2460bad3cab86a73a9f8&req=diImHsl%2FmIBZW%2FMW3nq%2BgUCnCXQvP4nGPliLb1mkdTnm6EW1LyXxtEUA2KWN%0A7Z7BBRGqbQ5EzOSvnkPy%2FgeMvVo%3D%0A)

**Step 2: **Click [All], then select [Martingale Bot] & choose [Standard mode].

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015192/9cbcab213d6e49897af9a4280733/48539854105497?expires=1776232800&signature=e8689f0772ff41b4c828c88a3c79a8ee42219b69587c0566a8919243189bb33f&req=diImHsl%2FmIBWW%2FMW3nq%2BgX%2BcKTy3HXXvxEhvOAYbH93NvOwKXwyC8rwcfnYa%0AWg%2BT0GWr3m%2BpdhdRYavONQUutAg%3D%0A)

**Step 3****:** Choose your desired cryptocurrency pair, then click [AI Strategy]. Select your preferred risk level from the [Risk Preference] drop-down menu. You may configure additional parameters (optional), enter the investment amount, and then click [Create] followed by [Confirm] to successfully set up your bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015219/07946ede9b261235d1d867a9de3c/48487792294809?expires=1776232800&signature=804214c2207e474de00b83226f1e90b8349606c1d9b9b5120a6fd752cf8c7314&req=diImHsl%2FmINeUPMW3nq%2BgbltIeFC9JRtSiJnODQhBccU3Cmh%2F72%2B5k2%2F5Ahu%0AxoQQxvnPpEMhvmn3Squ%2FDLJ1wac%3D%0A)

[https://drive.google.com/file/d/1ViBMSS-1NYKQ_GG9JvA06GJqdv68b6Th/view?usp=drive_link](https://drive.google.com/file/d/1ViBMSS-1NYKQ_GG9JvA06GJqdv68b6Th/view?usp=drive_link)

**On the Web：**

**Step 1: **Log in to your [Pionex.US account](https://accounts.pionex.us/en/sign), click on [Trade] in the upper menu bar, and then select [Trading Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015246/1617dad6e90d3ba467aba480af40/48487779086745?expires=1776232800&signature=84f248a13cedfc7c1f243fbea5ecf005f9dfb61f7234a11429e5db31b2b486d0&req=diImHsl%2FmINbX%2FMW3nq%2Bgbw5Qvgk6Qaz0HjKzhL4WKYoaQMpBX5zR0a%2FfX3R%0AmAqaLNcv6ib0qcVY%2FGipM%2BTG9Vg%3D%0A)

**Step 2: **Click on [Bot] - [All], then select [Martingale Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015259/a112f8a6bc3f57d65d1d16d9f8e1/48487779089177?expires=1776232800&signature=a3c8cb8b7ef987adb4dd5c93fcfef4bb200b0e69d4f05e6dbf951be764ee2c26&req=diImHsl%2FmINaUPMW3nq%2BgdmEaAqHGcBiHa1qgEqRb88nQw7Vcuc3EansUhtY%0AbSWgxVMFFqklbTnZXy%2Fa2yKN8bI%3D%0A)

**Step 3: **Choose your desired cryptocurrency pair, then click [Use AI Strategy]. Select your preferred risk level from the [Risk Preference] drop-down menu. You may configure additional parameters (optional), enter the investment amount, and then click [Create] followed by [OK] to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015310/ab4bbd4cb71e546ae0dbf20b8b3f/48487792331801?expires=1776232800&signature=0dca90ad8642f11032e0d8ab0e20de9c9ead8899a62349d0146e79ea88d51622&req=diImHsl%2FmIJeWfMW3nq%2Bge1G3UlbpipGtM2mCsxbRkM64FUJjZiks%2BvXXYMg%0ACPVWMih1BEk%2F%2BUNnwUNu4NHfn04%3D%0A)

Martingale Bot display

The Martingale running bot interface is designed to be simple and user-friendly. It provides a concise overview of your bot’s performance and key metrics. You can view a total of eight main parameters on the bot’s detail page, with additional data available within the interface.

This allows users to track both realized and unrealized profits, understand trading frequency, and evaluate the bot’s overall effectiveness based on market conditions and preset strategies.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218015345/4ec3752d3f3bfe7f3c149d1fd889/48487792333721?expires=1776232800&signature=2c62cb903ccd94b6a0a81210d5b35822bf90cedb50268f6b40d30f3a8ec7dfba&req=diImHsl%2FmIJbXPMW3nq%2BgeO2Niq0fwyttT%2BOT5UQY84L41hEgaz9J%2FsBhq0H%0AIYBRy7UTNuJmIJCJZL3GRmVSi8c%3D%0A)

- **Investment:** The total amount of funds allocated to the Martingale bot. This represents your capital input into the strategy.

- **Total Profit:** The net profit generated by the bot after deducting trading fees. Note: When the bot is stopped, the sum of Investment + Total Profit is what you should expect to receive. However, due to market fluctuations at the moment of stopping, the final amount may differ slightly.

- **Arbitrage Profit:** The total profit earned from each round of successful buying low and selling high—i.e., the realized profit.

- **Unrealized Profit:** This reflects the current profit or loss for coins held in an ongoing round. These coins haven't been sold yet, and their value is based on the current market price compared to their average cost.

- **Arbitrage/Total APR (Annual Percentage Rate):** An annualized performance metric. It shows how the arbitrage profit (or total profit) translates into a yearly return rate, giving a better sense of long-term profitability.

- **Current Price:** The live market price of the coin being traded by the bot.

- **Take-Profit Price:** The target price at which the bot will sell all the accumulated coins for profit in the current round, based on your configured parameters.

- **Completed Rounds:** The number of full trading cycles (buy dips → sell on rebound) the bot has completed. Each cycle is considered one round.

Martingale Bot FAQ

**Q：Does the Pionex.US Martingale (DCA) bot automatically reinvest profits?**

A：The Pionex.US Martingale (DCA) bot is designed to automatically reinvest profits back into the bot, resulting in an auto-compounding effect. After each round is completed, the bot generates profits, which are then reinvested. For example, if your DCA bot generates a profit of 10 USDT in the current round and your bot has a total of 10 shares, the profit will be evenly distributed among these shares before the start of the next round. This means each share will receive an additional 1 USDT, and the bot will initiate the next round with the increased funds. This process continues—compounding profits and starting new rounds—as long as the bot remains active.

Please get in touch with [Pionex.US Support](https://pionexus.zendesk.com/hc/en-us/requests/new) if you have any other questions.