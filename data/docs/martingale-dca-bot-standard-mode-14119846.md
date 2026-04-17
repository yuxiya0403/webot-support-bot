---
id: "14119846"
type: article
title: "Martingale (DCA) Bot - Standard Mode"
state: "published"
url: "https://intercom.help/webot/en/articles/14119846-martingale-dca-bot-standard-mode"
author_id: 10009720
created_at: 2026-03-19T06:21:46.000Z
updated_at: 2026-04-08T00:32:39.000Z
---
# Martingale (DCA) Bot - Standard Mode
> Contents
> The classic Martingale strategy
> What is the Webot Martingale Bot?
> Martingale Bot Parameters Setting
> Martingale Bot VS Grid Tradi...
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

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936794/47c98bc517f643c2f03b33f16513/48487779041305?expires=1776232800&signature=91720cd8a7d28ea1f0eb7c278791b39a1d99afc1c56903586231e76ad0541ad1&req=diEgEcB9m4ZWXfMW3nq%2BgU3yT%2Brn25FC0y4ItMrtZtqo3yUb7QabOFMnIkXU%0AHPeSEpQYyjuo7YFrmSOgy1yI6iY%3D%0A)

If we make the strategy more conservative and increase the percentage of the price scale, Martingale Bot can obtain more stable profits and a smaller drawdown. As can be seen from the table below, if you increase your position for every 10% drop, the max drawdown of the Martingale Bot is only -16.37%, which is far less than the a -55.44% of holding, and the profit is as high as 122.12%, which keeps the good balance between the benefits and risks.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936832/40bd6e5d169a727e2b966feddad2/48487792262553?expires=1776232800&signature=1af9e63e0147113404eb2475103b8cf4729ebf4c38bc5a7ebc901166028b1b5a&req=diEgEcB9m4lcW%2FMW3nq%2Bgd7Zyuk5ZR4GDMBJ60t%2BJMhnJo4gYNjXTSgxL%2Bg%2B%0AOWeDMaLJGrKpzhIoMltTsP1YS%2BM%3D%0A)

Martingale Bot Parameters Setting

The Webot Martingale Bot maintains a clean product design with an easy-to-use and visually appealing interface. It operates in an automatic cycle mode — each time it buys the dip and takes profit, it automatically enters the next round. The Martingale Bot offers both AI strategy parameters and the flexibility to customize the settings as needed.

AI Strategy

Martingale AI strategy provides parameters based on the volatility of different coins. Based on risk preference, there are two types of AI parameters:

Balanced

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936843/197bbf077c65d5f49828023a642b/48487792271257?expires=1776232800&signature=6cff68cb271964de9100d8da5553d52c6968537d8da10df0a1555348bd8ea812&req=diEgEcB9m4lbWvMW3nq%2BgWyIwOAiGqU2wB6KEOMzO%2Fj9gF2bfmfl1Rss%2Fgzk%0AHn8ByHZEfmFsliVDUsNBtGR8Ac0%3D%0A)

The balanced type offers moderate benefits and risks, providing relatively high volume scaling and fewer safety orders, allowing the strategy to maintain a high fund utilization rate.

Conservative

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936868/c756c7a82c54894561dab8cc7792/48487779048985?expires=1776232800&signature=8c04f2bf6a203a7d4a094da4cf4284401decb2eb4e359632ae4d487879607c5a&req=diEgEcB9m4lZUfMW3nq%2BgUgNSwQ5gyTHHKYlQgO1ERslYo%2Bexp4SV3%2BhfPEX%0AfUff%2FQ039%2Fag4V996f%2BQN0NnoKU%3D%0A)

The conservative type offers lower risks and returns, with relatively lower volume scaling and more safety orders, allowing the strategy to maintain a moderate fund utilization rate.

Customize Setting

The manual setting includes seven parameters, categorized into common and advanced parameters.

Common Parameters

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936893/17bb1b1dff4de5be283348cd476a/48487792281113?expires=1776232800&signature=f0bb588c1f68517599e59a395710c607639bb99ac37cd87e772564a659f48ced&req=diEgEcB9m4lWWvMW3nq%2BgQpYEx29fD8t0owIk3phQljofIEwyPmAJmH%2F2qUr%0ACQIOZbkQg3OUH1safxgK3A9qt3I%3D%0A)

There are three parameters in common:

- **Price scale:** After the first order is executed in each round, the bot will buy the coins when the price drop reaches this ratio. This ratio can be filled in with a percentage or an absolute value.

- **Take profit ratio:** In each round, when buying the dips and the price rebounds to reach this ratio, the bot will sell all the coins to take profit.

- **Investment**: The total investment amount of this Webot Martingale Bot.

Advanced Parameters

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936914/f676c4ba269ada224e396ce80d4f/48487792282649?expires=1776232800&signature=29a335145bd8bb68c61060d49cf419ea1e8e585a1f5b551a7419a737cea54aa6&req=diEgEcB9m4heXfMW3nq%2BgTYfRikWxsJMDr0tuPBCOF8zyMc4aFRvvJ9xqIwn%0AqR36ovq3CE16Zabd68ihuwfJFJU%3D%0A)

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

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936952/b0ad0d8c8982c6624e6e5a248456/48487792284825?expires=1776232800&signature=9ae9b1da280cafd12885b28b4047181376af198decefb583ace18b220fad16a1&req=diEgEcB9m4haW%2FMW3nq%2BgdJfPzR93TuYKmDf6rmemeZ8ESvSXIqkztob%2FHdC%0AWJBROxWkzEKCDhs1qN5d62aDz7k%3D%0A)

**Step 2: **Click [All], then select [Martingale Bot] & choose [Standard mode].

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177936996/3f3759a50b784c5b094c74132e3d/48539854105497?expires=1776232800&signature=8b1ebc030ba867a70b4d1d569b6f141be3e40c8bcc7297c1f60bf9175ae781d3&req=diEgEcB9m4hWX%2FMW3nq%2BgclieI48EQAiQHs0i%2BTApQwd7LFEWoNTxGs4eMw5%0AdQ9FftobMkZ%2Bz9LFe0kDlynEtwM%3D%0A)

**Step 3:** Choose your desired cryptocurrency pair, then click [AI Strategy]. Select your preferred risk level from the [Risk Preference] drop-down menu. You may configure additional parameters (optional), enter the investment amount, and then click [Create] followed by [Confirm] to successfully set up your bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177937018/89102819b2e4bfcf7665f4887a13/48487792294809?expires=1776232800&signature=69857f9c899fdb190484447d08936bf83908fe05ffb70f4fbeef2029d787cbe2&req=diEgEcB9moFeUfMW3nq%2Bgd%2B8O04FkM1PcjvXKQNhYO9XW08VS7IUOvSL7AXk%0AKI2z1BuJdwyMcct1g9ZSrvcSon8%3D%0A)

​[https://drive.google.com/file/d/1ViBMSS-1NYKQ_GG9JvA06GJqdv68b6Th/view?usp=drive_link](https://drive.google.com/file/d/1ViBMSS-1NYKQ_GG9JvA06GJqdv68b6Th/view?usp=drive_link)

**On the Web：**

**Step 1: **Log in to your [Webot account](https://accounts.webot.com/en/sign), click on [Trade] in the upper menu bar, and then select [Trading Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177937047/4911823420befc7aa160d65b3439/48487779086745?expires=1776232800&signature=febe72e3e179909fb3410610521c70b691a48fa3c480526a30435581a3c7c7b4&req=diEgEcB9moFbXvMW3nq%2BgTu4QFQCLihrUXE8Gofp%2F1iZVyygKPPHduttapKF%0Ag%2BeBWnxiC3dRVThGHFY%2BmCjMmYM%3D%0A)

**Step 2: **Click on [Bot] - [All], then select [Martingale Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177937059/7c045d0646810adb9401454bc32f/48487779089177?expires=1776232800&signature=26b3c03361431f49cc6c097dc9168df040bbd19edee73814b79097e3e01a2d09&req=diEgEcB9moFaUPMW3nq%2BgfPQi2VE7027a0wWFW7XOz5u7aH8M2ltj%2B%2BbMiFx%0AJfJGUZcBW1VckDkWSjwu7svuLeI%3D%0A)

**Step 3: **Choose your desired cryptocurrency pair, then click [Use AI Strategy]. Select your preferred risk level from the [Risk Preference] drop-down menu. You may configure additional parameters (optional), enter the investment amount, and then click [Create] followed by [OK] to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177937093/a3c50f20748668f396a8b6a40903/48487792331801?expires=1776232800&signature=87d04f8ada3f64509f4842bdc1f427298382765a6e734c285938e85ae486c5d8&req=diEgEcB9moFWWvMW3nq%2BgVqzYmK7eTfrW5mUwQFGFiZJ7hTsT6go4jjElkt0%0AsHv9CqXA1%2B9X8TIa2v5sxq%2BZJlA%3D%0A)

Martingale Bot display

The Martingale running bot interface is designed to be simple and user-friendly. It provides a concise overview of your bot’s performance and key metrics. You can view a total of eight main parameters on the bot’s detail page, with additional data available within the interface.

This allows users to track both realized and unrealized profits, understand trading frequency, and evaluate the bot’s overall effectiveness based on market conditions and preset strategies.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177937114/be5cba90dfc9eba62923ceb9ae96/48487792333721?expires=1776232800&signature=2464e8944b07f06982dd0edc698389b1ad543b955a1f2e6e370df90974e4ec6a&req=diEgEcB9moBeXfMW3nq%2BgfhB9J8f%2BVHzw%2FdGrSC%2FV15a5V3b1cuwvN632TiG%0AfHWpuMH9S58OzB0GpPClBHwoN64%3D%0A)

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