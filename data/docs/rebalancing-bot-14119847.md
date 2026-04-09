---
id: "14119847"
type: article
title: "Rebalancing Bot"
state: "published"
url: "https://intercom.help/webot/en/articles/14119847-rebalancing-bot"
author_id: 10009720
created_at: 2026-03-19T06:21:52.000Z
updated_at: 2026-03-19T06:21:53.000Z
---
# Rebalancing Bot
> Contents
> Why do you need the Rebalancing Bot
> What is the trading strategy of the Rebalancing Bot?
> Rebalancing Bot Modes
> Parameter meaning...
_

**Contents**

- [Why do you need the Rebalancing Bot](#h_01K0X596PC3WT14705YVR3TBQ8)

- [What is the trading strategy of the Rebalancing Bot?](#h_01K0X596PDNFHKXQ6KSGRPQ8S7)

- [Rebalancing Bot Modes](#h_01K0X596PDDY8RDQ2V5ECC9ZVM)

- [Parameter meaning](#h_01K0X596PDDQMZVSRY41SSGX81)

- [Example of using a Rebalancing Bot](#h_01K0X596PDRXNV1ZC4AS1RPTC2)

- [How to create a Rebalancing Bot](#h_01K0X596PD7SY2ANP9VT0J6C26)

- [Rebalancing Bot FAQ](#h_01K0X596PDNXRRDPFZDYC77VNP)

Why do you need the Rebalancing Bot

If you're optimistic about several coins at the same time and are willing to hold them long-term for potential value growth, the Rebalancing Bot could be a good choice for you.

What is the trading strategy of the Rebalancing Bot?

Suppose you have 100 USDT and choose BTC and ETH to create a Rebalancing Bot. The bot will allocate your funds evenly, investing 50 USDT in BTC and 50 USDT in ETH based on their real-time prices. By default, the bot checks the market every 5 minutes and automatically adjusts your holdings to maintain the 1:1 ratio, rebalancing based on price fluctuations between BTC and ETH.

When the value of your BTC increases to 60 USDT while ETH remains around 50 USDT, the rebalancing bot will sell 5 USDT worth of BTC and use it to buy 5 USDT worth of ETH. This keeps the position ratio balanced at 1:1. After rebalancing, your BTC and ETH holdings will both be worth approximately 55 USDT.

Compared to simply holding coins, the rebalancing bot offers the advantage of customizable rebalancing conditions. It takes advantage of price fluctuations between selected tokens to perform rebalancing arbitrage, helping you accumulate more coins over time.

Rebalancing Bot Modes

There are two modes available: Dual-coin mode and Multi-coin mode.

Dual-coin mode

In Dual-coin mode, you can allocate two coins simultaneously. It is recommended to choose mainstream spot-trading coins such as BTC and ETH. Once the two coins are selected, you can decide the amount of funds to invest in starting the rebalancing bot.

By default, the position allocation ratio for the two coins is set to 1:1. When the exchange rate between the two coins fluctuates, the bot will automatically rebalance your holdings to maintain this 1:1 ratio in real time.

Multi-coin mode

In Multi-coin mode, you can allocate up to 10 coins. You have the flexibility to set the position ratio for each coin according to your preference and choose your preferred rebalancing method.

Parameter meaning

- **Investment:** The amount of funds you wish to invest. Only USDT can be used to create a Rebalancing Bot.

- **Trigger Price:** You can set a trigger price for one or more coins. When any selected coin reaches its trigger price, the Rebalancing Bot will be activated and start running.

- **Rebalance Setting:** Rebalancing helps restore your portfolio to the original target allocation when price movements cause imbalances. You can choose to:

- **Close**: The bot will stop operating and simply hold the current coins without making changes.

- **Periodic:** The bot rebalances your portfolio at regular time intervals (e.g., every 4 hours or every 24 hours), regardless of price fluctuations.

- **Threshold Rebalance: **The bot rebalances only when the allocation ratio of any coin deviates beyond a preset threshold (e.g., 5%) from your original settings.

Example of using a Rebalancing Bot

_

**Explanation of Bot Order Terms**

- **Investment:** The amount of currencies invested when the grid bot is created.

- **Total profit:** (Current coin holdings × Current price) − Investment amount − Accumulated trading fees.

- **Next Rebalancing:** Once the rebalancing condition is set and triggered, the next rebalance will begin.

How to create a Rebalancing Bot

To get started, simply follow the tutorials on Webot Rebalancing strategy and create your first Rebalancing Bot today.

**In APP：**

**Step 1: **Open the [Webot app](https://www.webot.com/us/en-US/download) and click on [Bot] - [Create], then select [Martingale Bot].
​

_

**Step 2: **Choose your desired rebalancing mode, select your preferred cryptocurrencies, enter the investment amount, and then click [Create], followed by [Confirm], to successfully set up your bot.
​

_

**On the Web：**

**Step 1: **Log in to your [Webot account](https://accounts.webot.com/en/sign), click on [Trade] in the upper menu bar, and then select [Trading Bot].
​

_

**Step 2: **Click on [Bot] - [All], then select Rebalancing Bot].
​

_

**Step 3: **Select your desired cryptocurrencies, enter the investment amount, choose the appropriate rebalancing mode, and then click [Create], followed by [OK], to successfully set up your bot.
​

_

Rebalancing Bot FAQ

**Q： When is a suitable time to create a rebalancing bot?**

A： You can turn on the rebalancing bot while the coin price is relatively low. If you can’t judge whether the current price is at a low level, you can choose to open positions in batches by several rebalancing bots, and then wait patiently for the market to rise.

**Q： Why does the rebalancing bot have only a record of selling but no record of buying?**

A： This situation often occurs in orders with a small investment. The bot will conduct buying and selling transactions during the rebalancing. When the coin's price fluctuates rapidly, it may appear that after the bot has just sold out, it may no longer be able to buy the spot due to the minimum transaction accuracy of the coin. This situation is completely normal, so you don’t need to worry about it.

**Q： Can the rebalance condition be modified during the operation of the rebalancing bot?**

A： You can click the [Detail] - [Parameter] - [Rebalance mode] button on the rebalancing bot to modify.

**Q： Can I withdraw investment from the rebalancing bot?**

A： Rebalancing bots hold spot assets, and all profits are in the form of unrealized profits. You can perform operations by clicking the [Edit/Stop] - [Withdraw investment] button on the rebalancing bots. When you reduce your position, the principal and profit will be released in equal proportions.

**Q： Can I add an investment to the rebalancing bot?**

A： You can increase your investment by clicking the [Edit/Stop] - [Add investment] button on the rebalancing bots.

**Q： What is the minimum investment for the rebalancing bot?**

A： To make the rebalancing bot operate normally, the minimum investment requirement for a single currency here is 10 USDT. For example, when you select 2 coins, the minimum investment to start the bot is 20 USDT.

**Q： Why do my coins become less after using the rebalancing bot?**

A： When you are using the rebalancing bot, the bot will balance the exchange rate fluctuations of different tokens. In this process, some tokens will be sold and some tokens will be bought at the same time. So, when you find that the number of a certain token in the bot’s position is decreasing, then the number of other tokens in the bot’s position must be increasing. If you run the rebalancing bot for a long time, you will observe that the number of all currencies held by the bot will increase.

**Q： What is the trading fee of the rebalancing bot?**

A： The Rebalancing Bot is free to use, and only transaction fees apply. The spot trading fee rate is 0.1%.

Please get in touch with [Webot Support](https://webot.zendesk.com/hc/en-us/requests/new) if you have any other questions.