---
id: "14119867"
type: article
title: "How to understand the \"Release profit\""
state: "published"
url: "https://intercom.help/webot/en/articles/14119867-how-to-understand-the-release-profit"
author_id: 10009720
created_at: 2026-03-19T06:22:47.000Z
updated_at: 2026-03-19T06:22:48.000Z
---
# How to understand the "Release profit"
> Many of you have questions about the "Release profit" feature, and we will answer them in this article.
> What is the "Release profit" featu...
Many of you have questions about the "Release profit" feature, and we will answer them in this article.

​

**What is the "Release profit" feature?**

You can use this feature to release profit not used by the bot. (e.g., profit not used by the bot for pending orders on the grid or profit not used by the bot due to trading accuracy)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2177991587/e90251dd08aeeb5190514c9228b5/10495146307993?expires=1776232800&signature=8b51609969c91abb0dc126bad24024e99fe77ce274d79f1eff6e79e616e9ae55&req=diEgEcB3nIRXXvMW3nq%2BgSGS%2FJLs0HslCcH5ynJ5ptT0pl%2FDgUNguIsBHriS%0A2bEeC%2BQMy7PrCPfESFx16upIMYc%3D%0A)

**How to calculate the "Release profit"?**

Take the BTC/USDT grid bot as an example:

**The releasable profit = Total USDT - Total buy orders (USDT) - Pre placed orders (USDT) - Reserved fee (USDT) - Reserved fee (BTC) * Upper limit price * 1.2 - Released profit**

**Total USDT:** The total amount of USDT currently held by the bot

**Total buy orders (USDT):** The total amount of USDT that the bot has used to place buy orders in the price range

**Pre placed orders (USDT):** The amount of USDT the bot is currently prepared to use to place buy orders in the price range. (We use the dynamic pending order technique to increase the bot's speed. In general, the bot will only hang orders near the current market price but not at locations far away from the current market price. These orders that are not listed at the moment but are ready to be put up are called “Pre placed orders”.)

**Reserved fee (USDT):** The bot will use a portion of USDT as a reserved fee to keep the bot running correctly. (When the bot sells BTC, the fee charged is USDT)

**Reserved fee (BTC) * Upper limit price * 1.2: **The bot will use a portion of the BTC as a reserved fee to keep the bot running correctly. (When the bot buys BTC, the fee charged is BTC)

**Released profit:** All profits released by the bot's history

**FAQ**

**1. Where do the profits from the release go?**

The released profits will become tradable assets in your account. When you create a bot with funds, the funds remain in your account, but since the bot is using them, their status is "unavailable". When you release the "profits", the status of these funds will become "tradable".

​

**2. The system indicates that there are profits to be released. Should I release them? How often can I release profits?**

If the bot shows that you have profit to release, it means that the bot does not use the profit, and we recommend that you release this profit for other investments, thus increasing your capital utilization.

The frequency of the release of profit is not definite. It is related to the token price, bot parameters, and other factors. In general, when the bot continues to arbitrage times, there is a probability that the profit to be released will be generated.

​

**3. Why does the Release Profits page show 0 when my bot is already generating profits?**

This is because the bot continues to use the profits generated for trading and reserved fees, so there are orders that show profits but no profits to release.

​

**4. If I close the bot, will I be refunded for the reserved fees?**

The reserved fee is a special fund to ensure that the bot can trade correctly and will be "unavailable" in your account. When you close the bot, the status of funds will become "tradable" in your account.

​

**5. Why is the profit released more than the total profit of the bot?**

When you create a bot, the system uses the invested funds and bot parameters to buy the tokens needed for pending orders in batches, but there is a minimum number of transactions per token.

When your investment amount, bot parameters, and the minimum number of trades do not match exactly, a portion of your funds cannot be successfully invested in the bot and will be "unavailable", and the bot will allow you to release this portion of your funds through the "Release profit" feature.

​

**6. Why does the bot show a releasable profit, but I don't release it, and the profit disappears?**

Reason 1: The bot needs to set aside a portion of the tokens as a reserved fee to keep the bot running correctly. When the token price fluctuates, the reserved fee also changes, which affects the amount of profit you can release.

Reason 2: If you use the feature to adjust the bot's range, the bot uses all the releasable profit for pending trades, which eventually causes your releasable profit to disappear.

​

**7. How can I check my account's released profits or records?**

You can click on "Account" - "My portfolio" to see the change in the number of tokens in "Tradable" status, or click on "Edit/Stop" - "Release profit" - "Just this bot" - "Check the release profit history" on the bot order to see your release history. 

​

If you still have questions, please leave a message in the comments section. We will reply to your questions and discuss.