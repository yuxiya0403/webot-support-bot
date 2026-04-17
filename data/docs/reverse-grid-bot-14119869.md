---
id: "14119869"
type: article
title: "Reverse Grid Bot"
state: "published"
url: "https://intercom.help/webot/en/articles/14119869-reverse-grid-bot"
author_id: 10009720
created_at: 2026-03-19T06:22:58.000Z
updated_at: 2026-03-19T06:22:59.000Z
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

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177991905/1520d2736f0c60b2190e35403f85/48672002252953?expires=1776232800&signature=13283a5f6a3d2bc96d00481bd0d2f4440193ecd20da448bf6128953112ee21ed&req=diEgEcB3nIhfXPMW3nq%2BgUuFJDr9Jib4G5hi6rJjF8dMhS8pgn8Kwu2ShkP1%0AXZYRAoDfoEFb7HYZYjV1TefSgi4%3D%0A)

- **Trigger price:** When the currency price reaches this price, the bot order is triggered to be created.

- **Stop loss:** When the currency price rises to this price (the number of base currencies is decreasing), the bot order will be automatically closed, and all the quoted currencies held by the bot will be converted into the base currency. (For example, when the reverse grid trades the ETH/USDT trading pair, the order triggers a stop loss, and the bot will convert all USDT into ETH)

- **Take profit:** When the currency price drops to this price (the number of base currencies is increasing), the bot order will be automatically closed, and all the quoted currencies held by the bot will be converted into the base currency. (For example, when the reverse grid trades the ETH/USDT trading pair, the order triggers take profit, and the bot will convert all USDT into ETH)

- **Slippage control:** Through parameter setting to control the deviation of the initial open final trading average price and the price at the time of placing the order within a certain percentage range. (Due to the large volatility of the crypto market, when traders are trading, the final trading price is often inconsistent with the price when the order is placed. At this time, you can control the slippage by opening the order limit price.

- **Grid mode-Arithmetic:** When creating a grid strategy, the price interval of each grid of the arithmetic grid is equal (for example, 1, 2, 3, 4)

- **Grid mode-Geometric:** When creating a grid strategy, the price range of each grid of the geometric grid is proportional (for example, 1, 2, 4, 8)

- **Investment-ETH Only:** Only ETH can be used to create the reverse grid bot (for example, the reverse grid trades the ETH/USDT trading pair, then you can only use ETH to create the bot in this case )

- **Investment-Both:** You can invest the dual coins in your account at the same time to create the reverse grid bot (for example, when you choose the ETH/USDT trading pair, you can invest in both ETH+USDT cryptocurrencies at the same time to create the reverse grid bot.

Example of using a Reverse Grid Bot

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177991937/9074b96c8057558dfe7561a11352/48672025543833?expires=1776232800&signature=6836d5b7242cc233cd6d4e940f79771eb9451cb063cb5f788a347fb9b6ab48a7&req=diEgEcB3nIhcXvMW3nq%2BgeVIF0GrMuzb8qHPQWDhRgTlwcYdoRsPUhQQKbGy%0AKwG7Pmyox4QkD6oB%2BL5brpS59Mk%3D%0A)

**Explanation of Bot Order Terms**

- **Investment:** The amount of currencies invested when the grid bot is created

- **Total profit:** Grid profit + Unrealized profit

- **Grid profit:** The Bot keeps buying low and selling high, andthe arbitrage profits

- **Unrealized profit:** (Current price-purchase cost) * number of currencies of the bot held

- **Grid annualized:** [(Grid profit/Investment)/(Lasting time/365)]*100%

- **Total annualized**: [(Total profit/Investment)/(Lasting time/365)]*100%

How to create a Reverse Grid

**In APP：**

**Step 1:** [Download/update](https://www.webot.com/us/en-US/download) and log in to the latest version of the Webot app to access Reverse Grid.

**Step 2:** Click on [Bot] in the bottom menu bar, then click on [Create] where you will find the [Reverse Grid Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177991986/2f83047947e5af7e537a687a9d32/48673743311129?expires=1776232800&signature=e6cc96caa2e74b3118168cfb113b7d80c8b5dfc5678b1649cb81b43d1e9ded62&req=diEgEcB3nIhXX%2FMW3nq%2BgaJ8SsC6y4n5yOZdLUkrM%2BKhEvVQZ8NltwMKpOFi%0ABHBwhyil8iZNxpCn64HHiiDXOJk%3D%0A)

**Step 3:** Choose your desired cryptocurrency pair, enter the appropriate parameters (_You can also use the AI strategy button if you prefer to use AI parameters_) and investment amount, then click [Create] - [OK] to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177992012/94aa6923b1fdaa9b51e8ab084aa5/48672025549593?expires=1776232800&signature=b2df4c88f2feaabff4da10fbf1a9a3f8fdcbebf5d3a13ff73dfa6e39c80070c1&req=diEgEcB3n4FeW%2FMW3nq%2BgS2T7Ol1Nv5p%2B2j9UuBi0%2FpEyNAjspBJrC6a4T7C%0AiQzeimmkODY7qM5DDbxIxNF20SY%3D%0A)

**On the Web：**

**Step 1:** Open the [Webot website](https://www.webot.com/en-US/), log in to your account, click on [Spot] in the top menu bar, then click on [Trading Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177992076/b6893b2eefaf7f71f2efd130a63b/48672002264345?expires=1776232800&signature=f3f9724179fa3f1186186844ab7cbc3af0a7ea721906e0ca8d8a0d2b25b9c1e1&req=diEgEcB3n4FYX%2FMW3nq%2BgZsJgejpYbPM70e7nyESESJwsdX7mEBP%2FiNRZD3Q%0AjMn5vx76uswiIwt6SHqSZ7U1u9Q%3D%0A)

**Step 2: **

Click [Bot] on the left corner, then click [All], and then click [Reverse Grid Bot].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177992128/7730251dc7b61bd6abe1091770ed/48672025557913?expires=1776232800&signature=27282b9147202e200a89d8764a079d18da378da8093f32ac6c8dfbd4e779f0e4&req=diEgEcB3n4BdUfMW3nq%2BgTL1ZmLqmMUDxPuJ68t8K2DPv1KcJkqT6%2FKO82f7%0AToVoUvEnnXp6gyZrTGg%2F9To3VpM%3D%0A)

**Step 3:** Choose your desired cryptocurrency pair, enter the appropriate parameters and investment amount, then click [Create Bot] - [Continue] to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177992193/47e25215156372aa32ed8f79adf1/48672025558553?expires=1776232800&signature=7d7388911f3a0f54fb16edc524db3d1fc8709d06ce8a1277539ec6f36af93b9f&req=diEgEcB3n4BWWvMW3nq%2BgSKkux2oavsDFD7dMvBkLMHeV6J%2FFRrwl9NSAcxU%0AgaQIyleugD8t8Zyre4O3Nf314Rw%3D%0A)

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

Please get in touch with [Webot Support](https://webot.zendesk.com/hc/en-us/requests/new) if you have any other questions.