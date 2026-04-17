---
id: "14119860"
type: article
title: "Martingale (DCA) Bot - Trailing Mode"
state: "published"
url: "https://intercom.help/webot/en/articles/14119860-martingale-dca-bot-trailing-mode"
author_id: 10009720
created_at: 2026-03-19T06:22:31.000Z
updated_at: 2026-03-19T06:22:33.000Z
---
# Martingale (DCA) Bot - Trailing Mode
> Contents
> Martingale + Smart trade?
> Why do you need the Martingale bot (trailing Mode)?
> Martingale Bot (Trailing Mode) Parameters Setting
> H...
**Contents**

- [Martingale + Smart trade?](#h_01JZVYY5VMTB0J1CK6DASPP6SH)

- [Why do you need the Martingale bot (trailing Mode)?](#h_01JZVYY5VX3F8N678X9K7RCSPW)

- [Martingale Bot (Trailing Mode) Parameters Setting](#h_01JZVZ0XJP0RSDYKF5HRFD2N03)

- [How to Set Up a Martingale Bot (Trailing Mode)?](#h_01JZVZ3D3EMV8JY6ZM0MJR3HAR)

Martingale + Smart trade?

When you first see the Martingale Bot (Trailing Mode), it might feel unfamiliar or confusing. The Martingale Bot (Trailing Mode) is a combination of the Martingale Bot and the Smart Trade Bot. First of all, you can take a look at our tutorials for the Martingale Bot (Standard Mode) and the Smart Trade Bot below:

- [Martingale Bot (Standard Mode)](https://webot.zendesk.com/hc/en-us/articles/14868823218831)

- [Smart Trade Bot](https://webot.zendesk.com/hc/en-us/articles/14868803084559)

After reading these two tutorials, I believe you’ll have a deeper understanding of both the Martingale Bot (Standard Mode) and the Smart Trade Bot. At that point, you might start to wonder: Why combine the Smart Trade function with the Martingale Bot (Standard Mode)?

Why do you need the Martingale bot (Trailing Mode)?

The volatility in the crypto space is much greater than in traditional finance, making it easy for prices to exceed your original expectations. When setting up a Martingale bot, you need to first anticipate the price volatility in order to determine the appropriate ratio for covering positions with each drop.

However, if the price drops too much, it may fall below the last Martingale safety order, leading to an unrealized loss. On the other hand, if the price suddenly rises, the bot may sell at a relatively low price, missing out on potential profits from a strong upward trend. The Martingale Bot's trailing mode can effectively solve this pain point. Martingale Bot trailing mode can solve such a pain point very well.

For example:

We want to trade the DOGE/USDT pair using the Martingale bot (Standard Mode), setting both the price scale and take profit ratio at 1%. According to the K-line chart below, the bot performs well in the first half, capturing profits in a volatile market. However, in the latter half—highlighted in red—DOGE experienced a sharp decline following a sudden spike triggered by an announcement from Elon Musk. In such a market, the standard Martingale bot became temporarily trapped. It eventually closed positions with only a 1% profit, missing the opportunity to capitalize on the larger trend.

​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177990583/4a97a898d65510c5f82c58036464/48772677499929?expires=1776232800&signature=caf17511b1a0500c7f3fb967fdd31e36fa80e31089f140aee615d1844d98a823&req=diEgEcB3nYRXWvMW3nq%2BgTXhW5XIKlf3OtxBKbKx7H8tHKFhAa251dppTNUN%0ARCtvsIRf84CHdjkEc9I%2BJCK0yWo%3D%0A)

By using the Martingale trailing mode, we can achieve better timing for both buying and selling. For example, if we set the price scale and take profit ratio to 1%, and enable trailing mode with a 0.5% trailing ratio, the bot's behavior changes significantly. When the price drops enough to trigger the trailing buy, the bot will continue monitoring the price movement, wait for it to reach a local low, and then place a buy order once the price rebounds by 0.5%.

Similarly, when the price rises enough to trigger the trailing sell, the bot will track the upward trend, wait until the price reaches a local high, and then sell the position after a 0.5% pullback. This allows the bot to better capture profits from price swings. The performance is illustrated in the following two images:

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177990620/a563ac6b924ebf40f2036ef8a6f9/48772677500825?expires=1776232800&signature=a1d9561175a86ca4fd6d9e9fdc071671522ce3c10d0bdb471dbe110ec08341d4&req=diEgEcB3nYddWfMW3nq%2BgbNjEW21wPAAT%2FwXdIPQIIh1lPgzpNdtWIH8c05Y%0As9XQ1jvcQK0XtsAmQVgsv9loEMQ%3D%0A)

Therefore, the actual performance is as shown in the pictures below:

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177990637/22e6e83fa52b3b0010e4b305a067/48772674971673?expires=1776232800&signature=da26d3ba9f408640a2302980a84abdd03aea649f67a51dba8f5ca8f0006b48f9&req=diEgEcB3nYdcXvMW3nq%2BgQ2bVAhrwD2qm%2B0I%2FGtFZayPB3gRZzpKwYQAcDDL%0APvo%2BdKDeu9hCz9hfcN66O8J6QGQ%3D%0A)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177990668/8f02f2b87d1279924456a6013b8d/48772674972313?expires=1776232800&signature=35c5b99ab5ce3b557aa3ae39634fba2079a8d8b54dd6fd15f1a70c17a8742088&req=diEgEcB3nYdZUfMW3nq%2BgWsqSQJ8%2F82wszJxzTYp%2B35aSnfj3PSH59eb9O1E%0APyD0VTfmLtVdmwaMlwX33z0GybM%3D%0A)

As shown, the returns from a Martingale Bot (Standard Mode) are significantly lower than those from the Martingale Bot (Trailing Mode), and its ability to manage risk is also weaker in comparison.

While the Martingale Bot (Trailing Mode) is better suited for highly volatile cryptocurrencies, it can be more challenging to configure and manage. Choosing an effective trailing ratio requires extensive experience and, in many cases, professional backtesting. To help you gain a deeper understanding, let us introduce the meaning of each specific parameter below.

Martingale Bot (Trailing Mode) Parameters Setting

The trailing mode is designed for experienced traders, and as such, no AI-generated parameters are available within this mode. Traders are expected to have their insights into the assets they trade and carefully configure each parameter based on their strategy.

Below is a detailed explanation of each parameter:

- **Price Scale Settings: **The bot uses the price scale to average down the entry cost within each deal. By adjusting the price scale, the bot has a better chance of entering positions at more favorable prices for each safety order. There are two key parameters under price scale settings:

- **Price Scale Rate:** This defines the percentage drop required before the bot places the next safety order using a trailing buy order type.

- **Max Rebound Rate:** Once the price has dropped by the Price Scale Rate, the bot activates a trailing buy and monitors the price movement. It will wait for the price to hit a local low and then rebound by the Max. Rebound Rate before executing the safety order.

This approach allows the bot to avoid premature entries and potentially catch better buying opportunities during volatile market conditions.

- **Investment:** This refers to the total amount allocated to the bot. In trailing mode, the bot uses market orders to execute trades, which can lead to higher slippage, especially with larger investments. To minimize this risk, we’ve set certain limitations when using this mode. Each bot is limited to a maximum investment range of $2,000 to $10,000 USDT, depending on the asset pair. It only supports trading pairs with USD or USDT as the quote currency, with the exception of ETH/BTC, which is also supported.

- **Volume scale:** How many times is the amount of this time compared to the previous time when the position is replenished. For example, if you choose 1.5 times, the investment amount for each safety order is 1, 1.5, 2.25…

- **Safety orders:** In each round, the bot evenly divides the investment into multiple parts to buy the dips. The Martingale Bot uses an increasing order size strategy—buying the dips with 1 part of the funds, then 1 share, 2 shares, 4 shares, 8 shares, 16 shares, 32 shares, and so on—to execute the subsequent orders.

- **Trigger price (optional):** The bot will be activated when the price reaches the trigger price, which can be set either above or below the current market price.

- **Price range: **The bot will not start a new round if the current price is outside the defined price range. Once this range is exceeded, no further purchases will be made—regardless of whether the price rises or falls. This parameter is primarily designed to prevent the bot from buying at high levels after a sudden price surge followed by a correction, which could lead to the position being trapped.

How to Set Up a Martingale Bot (Trailing Mode)?

To get started, simply follow the tutorials on Webot Martingale (Trailing Mode) strategy and create your first Martingale Bot today.

**In APP：**

**Step 1: **Open the [Webot app](https://www.webot.com/us/en-US/download) and click on [Bot] - [Create] to access the bot section.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177990681/b7b136ce071154f6cec00340e97d/48772674973209?expires=1776232800&signature=4dfac25f28227b42b847e1279888c8b357917040a2dcee9ee8921b936a2dcf36&req=diEgEcB3nYdXWPMW3nq%2BgaT%2FR7TF3sbi66%2FpNrZrGTrOj98gCoOVPTWw2zD3%0A3AE9FsK7IAbeWLkrFe5LR8zEGiQ%3D%0A)

**Step 2: **Click [All], then select [Martingale Bot] & choose [Standard mode].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177990703/f50c93d424dee7eb0775c9b36418/48772677515929?expires=1776232800&signature=abaf88575878b404eea42a453dfe92d80f610fdc933e343f1ef403e56a3aabd9&req=diEgEcB3nYZfWvMW3nq%2BgUhdYQRBddTl6gG%2FEZGh%2FDL1y6mraPA1fRx95kX8%0Am1QDdaFUctFg8VwPjdnYvBVdenA%3D%0A)

**Step 3****:** Choose your desired cryptocurrency pair, then click [Customize]. Input your desired price scale parameters and take profit parameters, then enter the investment amount. Finally, click [Create], followed by [Confirm], to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177990740/17a68d15a085646d6f9120d54da2/48772677516825?expires=1776232800&signature=8941483d9ed61fb6bfa298328f6a2784ddfdb71355b22a7481b969dc1a73ed2f&req=diEgEcB3nYZbWfMW3nq%2BgZ9U2mJCDn18m2He5%2Bxvla5A0ofoJVBuB7VoHl7I%0Ax8uIyF22VcBPTKvq5aFic%2F9AsYs%3D%0A)

**On the Web：**

_Currently, this bot is not available on the Webot website. Once it becomes available, we will provide the creation steps._

Please get in touch with Webot Support if you have any other questions.