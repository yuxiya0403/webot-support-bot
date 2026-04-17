---
id: "14319688"
type: article
title: "Martingale (DCA) Bot - Trailing Mode"
state: "published"
url: "https://intercom.help/pionexus/en/articles/14319688-martingale-dca-bot-trailing-mode"
author_id: 10009720
created_at: 2026-03-30T06:14:03.000Z
updated_at: 2026-03-30T06:14:04.000Z
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

- [Martingale Bot (Standard Mode)](https://pionexus.zendesk.com/hc/en-us/articles/19259170441369)

- [Smart Trade Bot](https://pionexus.zendesk.com/hc/en-us/articles/48491449850905)

After reading these two tutorials, I believe you’ll have a deeper understanding of both the Martingale Bot (Standard Mode) and the Smart Trade Bot. At that point, you might start to wonder: Why combine the Smart Trade function with the Martingale Bot (Standard Mode)?

Why do you need the Martingale bot (Trailing Mode)?

The volatility in the crypto space is much greater than in traditional finance, making it easy for prices to exceed your original expectations. When setting up a Martingale bot, you need to first anticipate the price volatility in order to determine the appropriate ratio for covering positions with each drop.

However, if the price drops too much, it may fall below the last Martingale safety order, leading to an unrealized loss. On the other hand, if the price suddenly rises, the bot may sell at a relatively low price, missing out on potential profits from a strong upward trend. The Martingale Bot's trailing mode can effectively solve this pain point. Martingale Bot trailing mode can solve such a pain point very well.

For example:

We want to trade the DOGE/USDT pair using the Martingale bot (Standard Mode), setting both the price scale and take profit ratio at 1%. According to the K-line chart below, the bot performs well in the first half, capturing profits in a volatile market. However, in the latter half—highlighted in red—DOGE experienced a sharp decline following a sudden spike triggered by an announcement from Elon Musk. In such a market, the standard Martingale bot became temporarily trapped. It eventually closed positions with only a 1% profit, missing the opportunity to capitalize on the larger trend.

​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009709/d40ffd017b3a9a383c4899e6eed1/48772677499929?expires=1776232800&signature=0cca670a30f817e90b2bd713d58d4cad943a553fb2921c93ef21f296ac28a110&req=diImHsl%2BlIZfUPMW3nq%2BgUCT78vEInH8GtkslIRHTHemb3s5kJyYfKByavhZ%0AUW%2B%2B9UwvUbYUXtcCvKy%2FuJOTRHk%3D%0A)

By using the Martingale trailing mode, we can achieve better timing for both buying and selling. For example, if we set the price scale and take profit ratio to 1%, and enable trailing mode with a 0.5% trailing ratio, the bot's behavior changes significantly. When the price drops enough to trigger the trailing buy, the bot will continue monitoring the price movement, wait for it to reach a local low, and then place a buy order once the price rebounds by 0.5%.

Similarly, when the price rises enough to trigger the trailing sell, the bot will track the upward trend, wait until the price reaches a local high, and then sell the position after a 0.5% pullback. This allows the bot to better capture profits from price swings. The performance is illustrated in the following two images:

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009727/b6ada5ffd830e2f0176060066afa/48772677500825?expires=1776232800&signature=c04a2aa50e37b886d57ce8151aafbf004bf8d95f06e5464e8b5bd59af55d85e5&req=diImHsl%2BlIZdXvMW3nq%2Bgf7rbOwkNI%2BnIh9tlIMpm40gf37Img4KwdwOxcwi%0AriGPL6llcfoQnaRfS3em4nubaKY%3D%0A)

Therefore, the actual performance is as shown in the pictures below:

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009749/5a61a593104a7375292fed1db0d4/48772674971673?expires=1776232800&signature=bea1f8760d8ee6463c4fcc5a885605e0650ae8df44bf89874ead004a3827977c&req=diImHsl%2BlIZbUPMW3nq%2BgTxbA1mofliFXw1x3FPsjj5%2BiGDzz%2FuEYS9L7zsr%0ACOYCkn6jYlMd2Ht%2BTzb2GYAeq0o%3D%0A)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009769/15ea9d73a3d4f40d307c81110632/48772674972313?expires=1776232800&signature=bf5f39c011dda9120e638db4faaed3819ff642ee7498a2a5c50a92e79b2da224&req=diImHsl%2BlIZZUPMW3nq%2BgW6n9WuqcEVkCDZ0JhVRvJGAW61b407DtFOzInaE%0AsCj%2BLs4fkBmrc%2B%2F1hDjaAH3%2Fy6o%3D%0A)

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

To get started, simply follow the tutorials on Pionex.US Martingale (Trailing Mode) strategy and create your first Martingale Bot today.

**In APP：**

**Step 1: **Open the [Pionex.US app](https://www.pionex.us/en-US/download) and click on [Bot] - [Create] to access the bot section.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009801/1bd099770439cc8dcf66c81b7109/48772674973209?expires=1776232800&signature=d0d56c812a6f815f5bc613cf049d308a920c3ca6d78924db46beca4fef866b60&req=diImHsl%2BlIlfWPMW3nq%2BgXSAqy8tWzAM69GI3qald4geZxtsF%2Fej858BFHPS%0AzK5xywBKxvbwKu4sxV1KA643p4I%3D%0A)

**Step 2: **Click [All], then select [Martingale Bot] & choose [Standard mode].
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009809/6c7f9fe2b24584932f82252dad1a/48772677515929?expires=1776232800&signature=87f44f6809e1ee6d67e05b37f9f7988dcee34cbd40fce3f4b6812d09d3151822&req=diImHsl%2BlIlfUPMW3nq%2BgTxDdnY6jE1VZHitL1Abd2BO4yLYBPqVSLv0CvNs%0APObjUsO09%2B9kscTU7Ay8tsoKomg%3D%0A)

**Step 3****:** Choose your desired cryptocurrency pair, then click [Customize]. Input your desired price scale parameters and take profit parameters, then enter the investment amount. Finally, click [Create], followed by [Confirm], to successfully set up your bot.
​

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218009837/0512ed99cf1b9909a0cdf6209723/48772677516825?expires=1776232800&signature=21d9b58edab864a4280703175a34b8f85e2ea6bce02df18d82024527a91dc50d&req=diImHsl%2BlIlcXvMW3nq%2BgWDr%2Bs4auG2idV%2FeF3P1jHjR9iBk1y8O4khlA%2BjN%0ApUauFC2bfG3Mc6NLtmz28%2FPYvto%3D%0A)

**On the Web：**

_Currently, this bot is not available on the Pionex.US website. Once it becomes available, we will provide the creation steps._

Please get in touch with Pionex.US Support if you have any other questions.