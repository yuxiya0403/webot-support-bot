---
id: "14119842"
type: article
title: "Smart Trade Bot"
state: "published"
url: "https://intercom.help/webot/en/articles/14119842-smart-trade-bot"
author_id: 10009720
created_at: 2026-03-19T06:21:28.000Z
updated_at: 2026-03-19T06:21:29.000Z
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

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934753/7a65f1cf9337876c693b53da5446/48491411836569?expires=1776232800&signature=57aa36845721afc7d2c4f8a94a918f85efa765605301566799ad64d04113381f&req=diEgEcB9mYZaWvMW3nq%2BgcU6%2BZZItvx0rBW898GjZ49HXGHQzs6mN9SXm%2BgC%0ABm3t97nXzyvXlDxbSNbXGVaFylg%3D%0A)

As shown, when the currency price rises to the trigger price (134.81), the Trailing Take Profit strategy is activated with a trailing percentage of 5%. As the price continues to fluctuate and rise, the order will remain active as long as the price stays within the range between the maximum price and the maximum price minus the trailing percentage (5%). This allows the strategy to capture profits during an uptrend.

Only when the price drops and reaches the level of “maximum price minus trailing percent (5%)” will the order be automatically closed at that price (154.03).

As we can see, Smart Trade is a great option for fluctuating and uptrending markets (such as cryptocurrencies with high volatility). It helps you capture profits during an uptrend without worrying about sudden drops.

Modes and Parameters

There are two modes of Smart Trade: **“Limit(Standard mode)**” and “**Market(Speed mode)**“.

Limit (Standard mode)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934806/9725623ce1f9160f3b5b3c3da6cf/48491449819673?expires=1776232800&signature=fac28e97f4570337c5dc30742b7777a3066ec03431d77a21ee978e9fae25238e&req=diEgEcB9mYlfX%2FMW3nq%2BgfZLDMaN%2FwXlfsOLlk2P%2Fskn%2B4UPjukk0MhasjDY%0As73CV92KGy2s26kHaKLyyZE27i4%3D%0A)

**Buy-in parameters**
The following parameters need to be filled in:

- **Buy price:** Enter the limit order price at which you wish to purchase the tokens.

- **Buy quantity:** After entering the purchase quantity, Smart Trade will automatically calculate the corresponding investment amount and its proportion. You can also drag the slider to directly set the amount of funds to invest.

**Take Profit parameters**There are 2 modes of Take Profit: **Fixed-Price Take Profit** and **Trailing Take Profit**. When the price reaches the trigger price, both modes will be executed at the market price.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934822/1aff1e9687d816b4dbbaecb87f38/48491449822233?expires=1776232800&signature=06b56e173f7b92a5f835d999bbc1e2852bf71f731f66621b8f1f93a67d2bf662&req=diEgEcB9mYldW%2FMW3nq%2BgcsmodZzPgG%2BDmAdlX6VF2i6J2wpKVp%2F2aXiJZL5%0A1bXheuRwRFEZx87CM59fGiX65qU%3D%0A)

- **Fixed-Price Take Profit:** Turn off “Trailing Take Profit” and enter the desired take profit price. You can use the shortcut buttons on the right to set a take profit at 10% / 15% / 20% above the buy-in price, or manually enter a different price of your choice. The only requirement is that the take profit price must be higher than the buy-in price.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934853/f52b7bb6de7e7399bad42d176c21/48491449822873?expires=1776232800&signature=eb49bf429c154c3ca0c738f6d94ab4bc80d8122e4f76953e8752b03fd032910f&req=diEgEcB9mYlaWvMW3nq%2BgVE42Qf7xCw5vicrPlwQ6gs4zoDLF9SXy1RZjGla%0A9ircHq8yLGaln2wgz8oJ%2FZizYUU%3D%0A)

- **Trailing Take Profit: **Turn on “Trailing Take Profit” to make the trailing parameters visible. This strategy is triggered when the market price reaches the sell trigger price. After that, if the price reaches the maximum price minus the trailing percentage, the system will execute a market sell order. You’ll need to set the following parameters:

- **Sell Trigger Price** – You can use the shortcut buttons or manually enter the price.

- **Trailing Percent** – This defines how much the price can fall from the peak before triggering the sell.

The maximum limit of the trailing percent is calculated using the formula: **(Sell Trigger Price – Buy Price) / Sell Trigger Price × 100%. **This ensures that as long as the take profit condition is met, the order will always close with a profit ≥ 0.

**Stop Loss parameters**

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934892/c93d3bd18ee1e50694147ee8570b/48491411848089?expires=1776232800&signature=126b25d347046cb53f073b5362aba6549b0ed4ca843d45be2fc4a6d17e962eb3&req=diEgEcB9mYlWW%2FMW3nq%2BgQ5SCiibHnYOem2Xwi8E5Pp4p3zOayW4buqCYrHP%0AL363a3icaJnbuK00VZDrL1E1fD0%3D%0A)

You just need to enter the price at which you want to close the bot and set the stop-loss level. If you don’t want to sell your asset at a low price or intend to hold it long-term, you can set the stop-loss price to 0.

Market (Speed mode)

When your preferred token is on the rise and you don’t want to miss the opportunity, you can use this mode to chase the upward trend. In this case, you only need to set the total investment amount for the bot and the trailing percentage (%).

**Buy-in parameters**

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934935/448b30ec7f886e804d3be17d11fb/48491411848985?expires=1776232800&signature=a4a4aad8bcacc4d6810156380906f976ecb491dc232ff302fbec8b854669976d&req=diEgEcB9mYhcXPMW3nq%2BgSjFNG4J8UkxkCczhW%2Fx0DThaIuOdO006hQRlbJL%0AYl3YO5kkHFIXrobhxtS9fbL1YEg%3D%0A)

**Total investment:** The amount of total investment you plan to invest in the bot.

**Take Profit & Stop Loss parameters**

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934974/e7b76937de058da0936bf0f16e0c/48491411850521?expires=1776232800&signature=3f521fc25af9a8213a0ff07dc5416e6680183eb16294890f516b074e323d54f3&req=diEgEcB9mYhYXfMW3nq%2BgXsW32Md3v35RO9yz0NqiSBg3PE9yxpfj%2FpGZCm%2B%0A5JlQD2oxB6Pc9kwoc%2FWYxozm860%3D%0A)

**Trailing percent(%):** This parameter functions as both a stop-loss and take-profit trigger (as before, you can use the shortcut key or manually enter the value). When the token price rises to a certain peak and then falls back by the specified percentage, the bot will sell the tokens to secure profits or limit losses.

How to Set Up a Smart Trade Bot?

To get started, simply follow the tutorials below and create your first Smart Trade Bot today.

**In APP：**

**Step 1: **Open the [Webot app](https://www.webot.com/us/en-US/download) and click on [Bot] - [Create] and then select [Smart Trade] Bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177934998/be78d5271be4c9edbf508ffdbae4/48491449827737?expires=1776232800&signature=c5f538544ac949a574e441dfc10deafb417c50957df14f0e7511a6952d5fa5cb&req=diEgEcB9mYhWUfMW3nq%2Bge7SQtiMbwPmCG8nMON2LApPFEjHeeJDZ33EiUIp%0ALidglij%2BXTVr1sJ9BSAeujTb%2BrY%3D%0A)

**Step 2: **

- Choose your desired cryptocurrency pair.

- Select the desired mode – we will choose Limit (Standard Mode).

- Input the desired [Buy Price] and [Buy Quantity].

- Enter your desired Take Profit price. If you wish to use the Trailing Take Profit feature, please refer to [this section](https://docs.google.com/document/d/1v6yFfvQdv80i3ga_tYJoDJXfJpdYCKwNtVRoqiysIQ0/edit?tab=t.0#heading=h.69131yloxbyw).

- Input the desired Stop Loss value. To disable it, enter 0.

- Finally, click the [Create] button to launch the bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177935015/a154b0befba4e40c8de5f8a5efc9/48491411857689?expires=1776232800&signature=da6efeea0e192cb80af6d1cbe5c7ef6c4dd238978d277edd184d0751fe6c253e&req=diEgEcB9mIFeXPMW3nq%2BgQnvDze7rXsbj48wszjp9omIzNY2JYP57qq%2F%2FjFz%0AGQRdqWEbKT1gn3oUrjdoHgKNIiE%3D%0A)

**Step 3****:** The successfully created bot will be displayed on the [Bot] page.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177935064/49667861e5d8466fdb04db0dc066/48491411861785?expires=1776232800&signature=77fbdf579a60336f98689717574659767b0ee8815e8f6efafecff8361ebfc765&req=diEgEcB9mIFZXfMW3nq%2BgctcrzSkfOkj%2BIgMcTAqVBqja%2F2Ji080VEOyVh6g%0AtTFN8ry05PQhABar%2BJZwscBnvz4%3D%0A)

[https://drive.google.com/file/d/1thNyx6SBn0VxvI5bEjAydFnm_ihsxTC2/view?usp=drive_link](https://drive.google.com/file/d/1thNyx6SBn0VxvI5bEjAydFnm_ihsxTC2/view?usp=drive_link)

**On the Web：**

**Step 1: **Log in to your [Webot account](https://accounts.webot.com/en/sign), click on [Trade] in the upper menu bar, and then select [Trading Bot].

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177935101/4c6c9bd72eaf291820a8987a89c8/48491449833497?expires=1776232800&signature=071537af1ac956dd12d81bf1586e85ba0ead9fd72de5ac205245e34875189174&req=diEgEcB9mIBfWPMW3nq%2BgdeVwdzWxWFu6Hvw0j4rBhT%2F9IQiX44UN4tGSjp3%0A83XM8FVKrH38dgrOVphKD5o%2Bhj4%3D%0A)

**Step 2: **Click on [Bot] - [All], then select the [Smart Trade] bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177935136/fa06a92cc0a41ec5bf5c20c75043/48491411864729?expires=1776232800&signature=bba178068961683cf0d1737d3012cb2a0583caf72812dca53ecd1e6043ff8c08&req=diEgEcB9mIBcX%2FMW3nq%2BgeMA40rRHR8AfsQrq5UX9V4%2FUEEVrK1BTZdSMvW3%0ArravzUbpE5mIjUn7iqcKFB5F3KU%3D%0A)

**Step 3:**

- Choose your desired cryptocurrency pair.

- Select the desired mode – we will choose Limit (Standard Mode).

- Input the desired [Buy Price] and [Buy Quantity].

- Enter your desired Take Profit price. If you wish to use the Trailing Take Profit feature, please refer to [this section](https://docs.google.com/document/d/1v6yFfvQdv80i3ga_tYJoDJXfJpdYCKwNtVRoqiysIQ0/edit?tab=t.0#heading=h.69131yloxbyw).

- Input the desired Stop Loss value. To disable it, enter 0.

- Finally, click the [Create] button to launch the bot.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177935181/d23b612fa6345c58ffb72bcef2ac/48491449836441?expires=1776232800&signature=2f18f07185551cb4d54dd7abcafeb7fa32ae51d70a73df551275bcc0e7832022&req=diEgEcB9mIBXWPMW3nq%2BgXxXQiKH9llVRjopoEKhXP7FNvEfAiPBRZ9dPz7P%0Avjr2HNaKyEhl1uJzxQ9uQZOk66s%3D%0A)

**Step 4****:** The successfully created bot will be displayed on the “[Running orders](https://www.webot.com/en-US/orders/bot/running/all)” page.

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177935223/9cd2f6d2f95fe03feb617302e073/48491449841561?expires=1776232800&signature=05ad63c87fac680924146ed11d3e7bcb7801b70c8faa46288d52a509e48b8cf7&req=diEgEcB9mINdWvMW3nq%2BgSBkj18XK7KE0bBuz4PzA%2BZKMLRL6CqZHhyiD%2Bho%0AF6x3oa%2FH1xRmONKbmHuXHAstdMQ%3D%0A)

Risk Warning

The market price will trigger both Fixed-Price Take Profit and Trailing Take Profit orders. Therefore, during periods of volatile market fluctuations, a large volume of buy and sell transactions may directly impact the market price.

Webot recommends that you check the depth and liquidity of the cryptocurrency you plan to invest in before using Smart Trade to minimize risk. Webot does not advise investing large amounts in cryptocurrencies with poor market depth and liquidity.

Please get in touch with[Webot Support](https://webot.zendesk.com/hc/en-us/requests/new) if you have any other questions.