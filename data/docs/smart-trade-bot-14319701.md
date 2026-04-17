---
id: "14319701"
type: article
title: "Smart Trade Bot"
state: "published"
url: "https://intercom.help/pionexus/en/articles/14319701-smart-trade-bot"
author_id: 10009720
created_at: 2026-03-30T06:14:23.000Z
updated_at: 2026-03-30T06:14:23.000Z
---
# Smart Trade Bot
> What’s Smart Trade?
> Why do you need Smart Trade?
> Modes and Parameters
> How to Set Up a Smart Trade Bot?
> Risk Warning
> What’s Smart Trade?Bri...
- [What’s Smart Trade?](#h_01JZ4XQR65YW2B2163YTH8RQB8)

- [Why do you need Smart Trade?](#h_01JZ4XQR69V4CRKWQ3E1690C22)

- [Modes and Parameters](#h_01JZ4XQR6D5HQTDMRTNNV1Z698)

- [How to Set Up a Smart Trade Bot?](#h_01JZ4XQR70RJ3XKW35P18DX6FH)

- [Risk Warning](#h_01JZ4XQR7M4BQK2XN927ERBXDB)

What’s Smart Trade?

Briefly speaking, Smart Trade is an intelligent, 24/7 trading bot that allows you to schedule both buying and selling with take-profit and stop-loss settings. It helps you capture profits during uptrends while minimizing the risk of significant losses.

Smart Trade consists of three parts: Buy-in settings, Take-Profit settings, and Stop-Loss settings. Once these parameters are confirmed, your Smart Trade strategy begins! With Smart Trade, you can aim for substantial profit while keeping losses under control — all without the need to constantly monitor the market.

Why do you need Smart Trade?

If you’ve used our Grid Trading Bot before, you probably know that it’s best suited for volatile markets — the greater the volatility, the higher the potential grid profits the bot can generate.

However, when a bull market arrives or certain cryptocurrencies experience a short-term pump, the profit from Grid Trading may be lower than the profit from simply holding the asset, due to how the Grid Trading Bot works.

Imagine seeing a cryptocurrency rising rapidly — you’ll probably feel the urge to chase the rally, right? But at the same time, there’s always that voice in your head warning you it might crash just as fast. That’s where Smart Trade comes in — it helps you manage both the opportunity and the risk.

The following GIF demonstrates how Smart Trade works.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010033/16184e9de0f8f045104c1f60452f/48491411836569?expires=1776232800&signature=015b4ba7fe62cf5700ef84aba4b3e705f663ac33affe194926ccab89b2ab9af2&req=diImHsl%2FnYFcWvMW3nq%2BgaR60pFuEm20lZ2awzAHWpbx3QqKGr2XusqlMYj3%0AF5zSDeaOgKcw%2F59aw4r6B1F%2B7T8%3D%0A)

As shown, when the currency price rises to the trigger price (134.81), the Trailing Take Profit strategy is activated with a trailing percentage of 5%. As the price continues to fluctuate and rise, the order will remain active as long as the price stays within the range between the maximum price and the maximum price minus the trailing percentage (5%). This allows the strategy to capture profits during an uptrend.

Only when the price drops and reaches the level of “maximum price minus trailing percent (5%)” will the order be automatically closed at that price (154.03).

As we can see, Smart Trade is a great option for fluctuating and uptrending markets (such as cryptocurrencies with high volatility). It helps you capture profits during an uptrend without worrying about sudden drops.

Modes and Parameters

There are two modes of Smart Trade: **“Limit(Standard mode)**” and “**Market(Speed mode)**“.

Limit (Standard mode)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010057/da18b9d2c6b66ab47c2768fecbfa/48491449819673?expires=1776232800&signature=c280ee969c2280b3d493fbd2a4b3629101b6e0f750a8960850f567845e287679&req=diImHsl%2FnYFaXvMW3nq%2BgU1bDkt0%2FEm8GB6Qk4u18RgfazAI0fMsEbgkhZVu%0AzwMKUDX9dCRvu2YScoOGaZKbjvE%3D%0A)

**Buy-in parameters**
The following parameters need to be filled in:

- **Buy price:** Enter the limit order price at which you wish to purchase the tokens.

- **Buy quantity:** After entering the purchase quantity, Smart Trade will automatically calculate the corresponding investment amount and its proportion. You can also drag the slider to directly set the amount of funds to invest.

**Take Profit parameters**There are 2 modes of Take Profit: **Fixed-Price Take Profit** and **Trailing Take Profit**. When the price reaches the trigger price, both modes will be executed at the market price.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010080/ffb6f57d65e2d918ccc526d7c566/48491449822233?expires=1776232800&signature=ed2226256f5c49e2192c72a51328264025319eb01ae983539a5705c2403628f6&req=diImHsl%2FnYFXWfMW3nq%2Bgf6bROP70v9V5ftoPerdlRf35HUYUSZLShAVlOhv%0AigJcd3zWf93FD591HY8oVUT844U%3D%0A)

- **Fixed-Price Take Profit:** Turn off “Trailing Take Profit” and enter the desired take profit price. You can use the shortcut buttons on the right to set a take profit at 10% / 15% / 20% above the buy-in price, or manually enter a different price of your choice. The only requirement is that the take profit price must be higher than the buy-in price.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010109/5ddc176437fe416be3ee9339240d/48491449822873?expires=1776232800&signature=2ef29cd15ea1977968c3bcc3a87dd65691aab7fa18599ceee63a240e298bbaf0&req=diImHsl%2FnYBfUPMW3nq%2BgX6jWQOUsnGVLo%2FxzGpQbyrOz1yIb%2FbCKVSGXr3J%0AgS2c1QFkHuY8oPKPfqk%2FkydiQio%3D%0A)

- **Trailing Take Profit: **Turn on “Trailing Take Profit” to make the trailing parameters visible. This strategy is triggered when the market price reaches the sell trigger price. After that, if the price reaches the maximum price minus the trailing percentage, the system will execute a market sell order. You’ll need to set the following parameters:

- **Sell Trigger Price** – You can use the shortcut buttons or manually enter the price.

- **Trailing Percent** – This defines how much the price can fall from the peak before triggering the sell.

The maximum limit of the trailing percent is calculated using the formula: **(Sell Trigger Price – Buy Price) / Sell Trigger Price × 100%. **This ensures that as long as the take profit condition is met, the order will always close with a profit ≥ 0.

**Stop Loss parameters**

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010122/dbd20c777902989384e81e1a9c79/48491411848089?expires=1776232800&signature=ba28f0bbb633524a6daf051d2efcb3b53c0f9514bdb5bd4dc5eb3380e7382934&req=diImHsl%2FnYBdW%2FMW3nq%2BgVQcy%2Fqd9261eb4CYR%2BF7CQn4tTy8LjJH5ejtpsM%0AhLA%2FZ6RjcLDSl5gtsOFXbRa%2FEq0%3D%0A)

You just need to enter the price at which you want to close the bot and set the stop-loss level. If you don’t want to sell your asset at a low price or intend to hold it long-term, you can set the stop-loss price to 0.

Market (Speed mode)

When your preferred token is on the rise and you don’t want to miss the opportunity, you can use this mode to chase the upward trend. In this case, you only need to set the total investment amount for the bot and the trailing percentage (%).

**Buy-in parameters**

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010137/7b250e27e283a8f41c7a69aa7b30/48491411848985?expires=1776232800&signature=522c1532714455dd7dcf6f26f8222c41ad1e0a9da83edcc580f0fc78ce958f53&req=diImHsl%2FnYBcXvMW3nq%2BgcPUvP3wZ4HClaktRAKeqFEFXaNZQ0paLPphNsla%0AVOaR%2B0AdTMpXfT53gD8s3RY%2B9yQ%3D%0A)

**Total investment:** The amount of total investment you plan to invest in the bot.

**Take Profit & Stop Loss parameters**

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010161/d52c935f2daf59a50527b8eda61b/48491411850521?expires=1776232800&signature=8268ed07ac8af4f74ffd060ad1d379ca109acda0f44611c37da153dc51b9cd0c&req=diImHsl%2FnYBZWPMW3nq%2BgXN3FGV4LJBNUBDuf5%2FAF35aRoIC3GXMGHJabdGs%0Alngzabej0pBFJXLQ279iOpIirKQ%3D%0A)

**Trailing percent(%):** This parameter functions as both a stop-loss and take-profit trigger (as before, you can use the shortcut key or manually enter the value). When the token price rises to a certain peak and then falls back by the specified percentage, the bot will sell the tokens to secure profits or limit losses.

How to Set Up a Smart Trade Bot?

To get started, simply follow the tutorials below and create your first Smart Trade Bot today.

**In APP：**

**Step 1: **Open the [Pionex.US app](https://www.pionex.us/en-US/download) and click on [Bot] - [Create] and then select [Smart Trade] Bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010174/f0ffcec5267f0acd56c6c7627ecf/48491449827737?expires=1776232800&signature=be782dfd642609013ad6d06519add98d243f61035b0fd6080228d87250b2bc6a&req=diImHsl%2FnYBYXfMW3nq%2Bgee8nOPp8Y92QukPIn6LAQDC2ljXpY1hFSy0dKTq%0AyeMHpfoXm6mGdytXKcvGNmKCyfY%3D%0A)

**Step 2: **

- Choose your desired cryptocurrency pair.

- Select the desired mode – we will choose Limit (Standard Mode).

- Input the desired [Buy Price] and [Buy Quantity].

- Enter your desired Take Profit price. If you wish to use the Trailing Take Profit feature, please refer to [this section](https://docs.google.com/document/d/1v6yFfvQdv80i3ga_tYJoDJXfJpdYCKwNtVRoqiysIQ0/edit?tab=t.0#heading=h.69131yloxbyw).

- Input the desired Stop Loss value. To disable it, enter 0.

- Finally, click the [Create] button to launch the bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010183/23d717e6b59d9904e583a21580de/48491411857689?expires=1776232800&signature=c5af2e6527142b0636bad75ddb6feafd64b245c757cfcd045475110582f28df5&req=diImHsl%2FnYBXWvMW3nq%2BgRHwooVRuUDfJWOOqIVOHvsZGY1Fc0x3jSqJ8I4J%0AJU9itycESa34TDOhd%2BCaaJQD2TU%3D%0A)

**Step 3****:** The successfully created bot will be displayed on the [Bot] page.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010201/d53341e671ba80684f23224aa525/48491411861785?expires=1776232800&signature=7bd3b9bef29c502ebaaca52034b14616181ceb42822ea86175d0114cb912e92f&req=diImHsl%2FnYNfWPMW3nq%2BgTnr%2F0%2FJ2I4rXpm%2BfYk4isUqe835BV1qTmBzgb7s%0Af1AbUB1VHg4M6apf6ViK3xeL5cQ%3D%0A)

[https://drive.google.com/file/d/1thNyx6SBn0VxvI5bEjAydFnm_ihsxTC2/view?usp=drive_link](https://drive.google.com/file/d/1thNyx6SBn0VxvI5bEjAydFnm_ihsxTC2/view?usp=drive_link)

**On the Web：**

**Step 1: **Log in to your [Pionex.US account](https://accounts.pionex.us/en/sign), click on [Trade] in the upper menu bar, and then select [Trading Bot].

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010214/e58f2f63b5ce49ded212a1df1cfe/48491449833497?expires=1776232800&signature=d5561cec84ec29936d821b62f2e8773b40c906f0a524de9c0bb9da46c71ae0df&req=diImHsl%2FnYNeXfMW3nq%2BgU%2FBWwWDo2eF3s8woDap2%2B9qZU7fEDZdyP81L1Yp%0AU9KjQwff9ZHphPYl7m4caA%2FHPgE%3D%0A)

**Step 2: **Click on [Bot] - [All], then select the [Smart Trade] bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010231/761708e2dd931b793a384c7c01ff/48491411864729?expires=1776232800&signature=cde1e48ef73c713b4ffdc7768e74bbeb388918c7c2ba0c73611eea3a87092857&req=diImHsl%2FnYNcWPMW3nq%2BgVnRS0HaX0CJ2Mfl9WqddoiolucV7zMhJL9AqRQM%0AHu%2BRSrWUZkyjzlkXu6Qc4ExqEDY%3D%0A)

**Step 3:**

- Choose your desired cryptocurrency pair.

- Select the desired mode – we will choose Limit (Standard Mode).

- Input the desired [Buy Price] and [Buy Quantity].

- Enter your desired Take Profit price. If you wish to use the Trailing Take Profit feature, please refer to [this section](https://docs.google.com/document/d/1v6yFfvQdv80i3ga_tYJoDJXfJpdYCKwNtVRoqiysIQ0/edit?tab=t.0#heading=h.69131yloxbyw).

- Input the desired Stop Loss value. To disable it, enter 0.

- Finally, click the [Create] button to launch the bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010256/fadbf92b472d18a69578924826da/48491449836441?expires=1776232800&signature=bce847167afbbdb25cf5770c896129b72204d12ffa9f57c796d5daf5226d4c9c&req=diImHsl%2FnYNaX%2FMW3nq%2BgRphClRKiIYwGKuho1qt9bkZsW%2FcFufvfNbwFISv%0AVRvkprH5gVsye7CjhzD6LsfDD%2B0%3D%0A)

**Step 4****:** The successfully created bot will be displayed on the “[Running orders](https://www.pionex.us/en-US/orders/bot/running/all)” page.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010280/4dde60b1083171890e4405474324/48491449841561?expires=1776232800&signature=87e28fad337c73dcc105b92dc0ae4329c38ccb0be6692cf7c02835e3a1e1ea44&req=diImHsl%2FnYNXWfMW3nq%2BgYdIfIjyAOwU8Zu%2BSqEHXWtxJkRs4gsn7JQzg9GG%0Aa2MswHuTQie%2FGRi2yW3e4uOR9ew%3D%0A)

Risk Warning

The market price will trigger both Fixed-Price Take Profit and Trailing Take Profit orders. Therefore, during periods of volatile market fluctuations, a large volume of buy and sell transactions may directly impact the market price.

Pionex.US recommends that you check the depth and liquidity of the cryptocurrency you plan to invest in before using Smart Trade to minimize risk. Pionex.US does not advise investing large amounts in cryptocurrencies with poor market depth and liquidity.

Please get in touch with[Pionex.US Support](https://pionexus.zendesk.com/hc/en-us/requests/new) if you have any other questions.