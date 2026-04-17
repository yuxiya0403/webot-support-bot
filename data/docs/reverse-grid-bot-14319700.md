---
id: "14319700"
type: article
title: "Reverse Grid Bot"
state: "published"
url: "https://intercom.help/pionexus/en/articles/14319700-reverse-grid-bot"
author_id: 10009720
created_at: 2026-03-30T06:14:21.000Z
updated_at: 2026-03-30T06:14:22.000Z
---
# Reverse Grid Bot
> Before explaining the specific principles, let’s first understand the goal of the reverse grid: increase the number of tokens held by the ...
Before explaining the specific principles, let’s first understand the goal of the reverse grid: **increase the number of tokens held by the bot** and **reduce the cost of holding the bot**.

**Contents**

- [What is Reverse Grid](#h_01JZMC7JK66RV59BKJ7EMQ7GNV)

- [When is it appropriate to use Reverse Grid](#h_01JZMC7JKB7R3NQJKR2ESY6WEE)

- [Parameter meaning](#h_01JZMC7JKDEMDWKJVG1ND2GK92)

- [How to create a Reverse Grid](#h_01JZMC7JMGBDBZHPZW33E5EW9T)

- [Example of using a Reverse Grid Bot](#h_01JZMC7JMBCMW4XN6J86ZK4C72)

- [Reverse Grid FAQ](#h_01JZMC7JMZNGKAQQR4P0QWYZKD)

What is Reverse Grid

The principle of the reverse grid is similar to the principle of the grid. They all use the bot to buy low and sell high to perform arbitrage within a certain price range. The essential difference between them is that the unit of calculating the income is different, so how can we understand it?

First of all, let’s learn a little knowledge: Take the most common trading pair “ETH/USDT”, as an example. Here, we generally refer to the token “USDT” on the right side of the trading pair as “**Quote Currency**”. The token “ETH” on the left side of the trading pair is called “**Base Currency**”.

Next, we still take the “ETH/USDT” trading pair as an example: When you create a grid, the bot will use “Quote Currency” (USDT) to measure the profit of the bot, focusing on whether the amount of USDT held increases.

When you create a reverse grid, the bot will use the “Base Currency” (ETH) to measure the bot’s revenue, and the focus is on whether the number of ETH held increases. Believe that seeing this, you should have understood the principle of reverse grid.
​

When is it appropriate to use Reverse Grid

When you judge that the market is about to fall, you might as well take the currency in your hand to open a reverse grid, sell the currency at a high price, and buy it back at a low price. This will continue to shake arbitrage and reduce your holding costs; When the market is in a bear market, you can also open a reverse grid with the coins in your hand to earn more coins and wait for the arrival of the bull market.

Parameter meaning

- **Upper limit:** When the price is higher than the Upper price of the interval, the bot will no longer execute orders outside the grid interval.

- **Lower limit:** When the price is lower than the Lower price of the interval, the bot will no longer execute orders outside the grid interval.

- **Grids:** Divide the Upper price of the interval and the Lower price of the interval into corresponding shares.

- **Total investment:** The number of tokens planned to be invested in the bot.

Advanced settings

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009850/be369fa0f7a9d7192600eb440b80/48672002252953?expires=1776232800&signature=cfbec7b2b1a0a5b784a8e8a66de4cdecd0e5f838bd32414f679220784f0bf682&req=diImHsl%2BlIlaWfMW3nq%2BgZkahDb%2BKj66TIxn%2BEFr7XAj1p4rUq5N2qeKsNEx%0Aw6rOZJlZaKemjYj2B%2BrsG9jbnQY%3D%0A)

- **Trigger price:** When the currency price reaches this price, the bot order is triggered to be created.

- **Stop loss:** When the currency price rises to this price (the number of base currencies is decreasing), the bot order will be automatically closed, and all the quoted currencies held by the bot will be converted into the base currency. (For example, when the reverse grid trades the ETH/USDT trading pair, the order triggers a stop loss, and the bot will convert all USDT into ETH)

- **Take profit:** When the currency price drops to this price (the number of base currencies is increasing), the bot order will be automatically closed, and all the quoted currencies held by the bot will be converted into the base currency. (For example, when the reverse grid trades the ETH/USDT trading pair, the order triggers take profit, and the bot will convert all USDT into ETH)

- **Slippage control:** Through parameter setting to control the deviation of the initial open final trading average price and the price at the time of placing the order within a certain percentage range. (Due to the large volatility of the crypto market, when traders are trading, the final trading price is often inconsistent with the price when the order is placed. At this time, you can control the slippage by opening the order limit price.

- **Grid mode-Arithmetic:** When creating a grid strategy, the price interval of each grid of the arithmetic grid is equal (for example, 1, 2, 3, 4)

- **Grid mode-Geometric:** When creating a grid strategy, the price range of each grid of the geometric grid is proportional (for example, 1, 2, 4, 8)

- **Investment-ETH Only:** Only ETH can be used to create the reverse grid bot (for example, the reverse grid trades the ETH/USDT trading pair, then you can only use ETH to create the bot in this case )

- **Investment-Both:** You can invest the dual coins in your account at the same time to create the reverse grid bot (for example, when you choose the ETH/USDT trading pair, you can invest in both ETH+USDT cryptocurrencies at the same time to create the reverse grid bot.

Example of using a Reverse Grid Bot

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009863/6d975c47214f1fff1ceb42cae72a/48672025543833?expires=1776232800&signature=f9f1874353183b334a8e9e6ce98d94ee0522ffabfb4962a3738da69fcf0cf1c2&req=diImHsl%2BlIlZWvMW3nq%2BgR2T9p5F%2B5CCRxNGiayx3c%2FB%2Fj%2FD%2FdlM%2Fk%2B2NbZ9%0AeOcLlGr9SNhsGOYeXM7s3I%2BtWz0%3D%0A)

**Explanation of Bot Order Terms**

- **Investment:** The amount of currencies invested when the grid bot is created

- **Total profit:** Grid profit + Unrealized profit

- **Grid profit:** The Bot keeps buying low and selling high, andthe arbitrage profits

- **Unrealized profit:** (Current price-purchase cost) * number of currencies of the bot held

- **Grid annualized:** [(Grid profit/Investment)/(Lasting time/365)]*100%

- **Total annualized**: [(Total profit/Investment)/(Lasting time/365)]*100%

How to create a Reverse Grid

**In APP：**

**Step 1:** [Download/update](https://www.pionex.us/en-US/download) and log in to the latest version of the Pionex.US app to access Reverse Grid.

**Step 2:** Click on [Bot] in the bottom menu bar, then click on [Create] where you will find the [Reverse Grid Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009882/022b31c1565e829ac975f4d0ba57/48673743311129?expires=1776232800&signature=1e488f5298aa5fda068b6643f4e773c202819ea0d68d6c8f949c508d02435083&req=diImHsl%2BlIlXW%2FMW3nq%2BgdUXIeiHKNdWlwElEYhsGHib2LDgyCiD4s9JztlQ%0AWKKMtv2LgSW8fAJ0kYl%2F7YAkmiU%3D%0A)

**Step 3:** Choose your desired cryptocurrency pair, enter the appropriate parameters (_You can also use the AI strategy button if you prefer to use AI parameters_) and investment amount, then click [Create] - [OK] to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009909/041ef912783b2cc22c4fc340a6f3/48672025549593?expires=1776232800&signature=49300551e57b2a0a99796b49bfdaa5aa8da986b38ced6de7ee8f1c2a4c2167eb&req=diImHsl%2BlIhfUPMW3nq%2BgXlD33%2BSf50%2FlrSMMi%2F9z8aXLHuHx4es4VYxt%2F%2B5%0AFM7t7y04lnfsuPtlDEW%2FCCUm3Qk%3D%0A)

**On the Web：**

**Step 1:** Open the [Pionex.US website](https://www.pionex.us/en-US/), log in to your account, click on [Spot] in the top menu bar, then click on [Trading Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009921/ef395b3afc779f1a928739b0803e/48672002264345?expires=1776232800&signature=e2a795488535701d09e396b587dfd9d996834bc5005674192bac2c3d845447d5&req=diImHsl%2BlIhdWPMW3nq%2BgUvAJ3zuzu4%2BVtulk4KwfrIe2p1qvGTYPVA%2FMpW8%0AbXHkz3VbWneNFYJnVsw2KVFmc3g%3D%0A)

**Step 2: **

Click [Bot] on the left corner, then click [All], and then click [Reverse Grid Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009957/b2b53f19c2c1289b860001c2d54b/48672025557913?expires=1776232800&signature=4c99ab0be2108851f54e006f760b80fbbc73e15d71190b5b81a5e0d8c29eae37&req=diImHsl%2BlIhaXvMW3nq%2BgT2PfV%2FJKautfhYkCE6oPngg1QZw34%2FTG9mTc7Ki%0AtNPW1zcUmY2Ly2HaR45%2FO8VtFc8%3D%0A)

**Step 3:** Choose your desired cryptocurrency pair, enter the appropriate parameters and investment amount, then click [Create Bot] - [Continue] to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010003/5615be6f78d0e0939c3d319a3e9c/48672025558553?expires=1776232800&signature=6b7edd2bfbec56643c2f40b6ce288dd0212fe9327ee27b3f6c8962792d791e3d&req=diImHsl%2FnYFfWvMW3nq%2BgZe7et1Xxabw7aJa1BMcs%2Bst3SX6nDT68Emd3Q%2F8%0AV7HBL0lcLvCCBjRezXZL4mEwFss%3D%0A)

Reverse Grid FAQ

**Q： The grid bot is used for rising markets, but can the reverse grid be used for shorting when the market is falling?**

A： The reverse grid cannot be regarded as a short grid, because its principle is the same as the grid bot.

**Q： Is it possible to create a grid bot and a reverse grid bot at the same time to realize long-short hedging and earn grid profits?**

A： This kind of operation cannot realize hedging, because the principle of the reverse grid is the same as the grid, which is to obtain profit by buying low and selling high. So this operation is the same as creating two grid bots at the same time. To create hedging strategies by going long and short on the market, you can utilize the above-mentioned futures bots.

**Q： I created the ETH/USDT reverse grid bot, why the grid profit will decrease?**

A： Because the profit earned by arbitrage during the operation of the reverse grid bot is still USDT, the bot will convert this part of USDT into the corresponding amount of ETH and display it. If the price of ETH increases, then the amount of equivalent ETH corresponding to this part of USDT will decrease, which will show that your grid profit is decreasing.

**Q： I create the reverse grid of ETH/USDT, shouldn’t i release ETH to release profits? Why is the released profit USDT?**

A： Because the principle of the reverse grid is the same as that of the grid, it is profitable by buying low and selling high. So the arbitrage of the reverse grid will naturally earn USDT, and the profit you withdraw will also be USDT.

**Q： Can I modify the parameters or add or withdraw the investment after the bot is created?**

A： After the bot is successfully created, the parameters such as the price range and the number of grids are fixed and cannot be changed. You can no longer add or withdraw the investment. Only the stop loss price and take profit price can be adjusted.

**Q： When I created the reverse grid of ETH/USDT, I set the take profit/automatic stop loss. When the currency price reaches the setting, will it automatically exchange back ETH for me? Will it become USDT?**

A： When the currency price reaches the take profit/stop loss price you set, the reverse grid bot will automatically close the position. At this time, the bot will immediately use all the USDT held by the bot to buy all ETH at the market price.

Please get in touch with [Pionex.US Support](https://pionexus.zendesk.com/hc/en-us/requests/new) if you have any other questions.