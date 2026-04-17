---
id: "14319697"
type: article
title: "How to understand the \"Release profit\""
state: "published"
url: "https://intercom.help/pionexus/en/articles/14319697-how-to-understand-the-release-profit"
author_id: 10009720
created_at: 2026-03-30T06:14:16.000Z
updated_at: 2026-03-30T06:14:17.000Z
---
# How to understand the "Release profit"
> Many of you have questions about the "Release profit" feature, and we will answer them in this article.
> What is the "Release profit" featu...
Many of you have questions about the "Release profit" feature, and we will answer them in this article.

​

**What is the "Release profit" feature?**

You can use this feature to release profit not used by the bot. (e.g., profit not used by the bot for pending orders on the grid or profit not used by the bot due to trading accuracy)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010464/6d51de537fc5dfa27e2bf1911948/10495146307993?expires=1776232800&signature=864b0f31c795e5539ac8a05c9116923e2d7162da47c4ce31bc92c7467bb49158&req=diImHsl%2FnYVZXfMW3nq%2BgTw5ErWitsYCYKW69ebRkir1CU9%2FoBpfI%2Fkt8GxI%0A%2BoTdBNhU%2BZH8WtXA2eb0MYH8DlA%3D%0A)

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

**Download the Pionex.US app to trade on the go: [iOS](https://apps.apple.com/us/app/pionex-us-buy-btc-and-eth/id1567213944) | [Android](https://play.google.com/store/apps/details?id=com.pionex.us.client&referrer=utm_source%3Dofficialweb)**

Follow us to stay up to date with [Pionex.US](https://www.pionex.us/en-US/) news and announcements:

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010476/91ef04dc7c75f6de34bb10f5b342/23404632403865?expires=1776232800&signature=1724979bc22454a9b5c74b5e52795b66d0a198e3352e6fc5b8c39dec3f0a3e08&req=diImHsl%2FnYVYX%2FMW3nq%2Bgdvc%2FS%2BxecFwjc%2FoeGurVgfB0%2F3JK74jqjerYMhs%0ADKwFFiX1Q32RcQWhAiioQWpL6cU%3D%0A)

[Pionex.US on Discord](https://discord.gg/dZbvbeXK46)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010489/0cdc1988da4a53109ebf213edfa6/46623078595353?expires=1776232800&signature=097b0994eb7e208421cf565fa5cb7d696594660265705926981053a60f50d2ea&req=diImHsl%2FnYVXUPMW3nq%2BgUE4O9t%2BjL2xoqk8wjCd9r7rvE3%2BeRHLMNLt4bo7%0AFGGDHUV0MDmbZuWXAdSNjSnLUAI%3D%0A)

[Pionex.US on Telegram](https://t.me/pionexus)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010506/d480f3c39e19fb4cac35ce1c59d9/23404632468377?expires=1776232800&signature=f8487bf24a3178f57808d2b616d64c129b96a63ad357bcea4d09139913b4130a&req=diImHsl%2FnYRfX%2FMW3nq%2Bgbf5%2BGLXi6c03icD9nN0ZnNv7QcUMMdT1rDbt54E%0A0OwJXtr3CQmRL7YntboxyCUHvjk%3D%0A)

[Pionex.US on YouTube](https://www.youtube.com/@pionexus518)

![](https://webot-d125655f84fc.intercom-attachments-7.com/i/o/c6h9pild/2218010521/b54158522342c9fa5363e98823e0/23404646786201?expires=1776232800&signature=699bdc4419ba4b955a3ba8cc98e21619f6aab68e5ed351c3ae81c41407e841bb&req=diImHsl%2FnYRdWPMW3nq%2BgQRAxPp2R%2BCR5fywgPQragduPPK%2Bc%2BiAKp3GMebG%0AMWA%2BF1IZzGNA4Wr1wnD%2FreBhkX8%3D%0A)

[Pionex.US on Twitter](https://twitter.com/PionexUS)

_Trading in the crypto market carries a substantial risk and the possibility of making both significant profits and losses. Please trade cautiously, __[Pionex.US](http://pionex.us/)__ could not assure any profit. __[Risk Disclaimer](https://www.pionex.us/blog/important-information-about-use-of-the-pionex-us-platform-and-risk-disclaimer/)_