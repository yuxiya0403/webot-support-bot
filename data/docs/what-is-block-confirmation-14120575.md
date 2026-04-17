---
id: "14120575"
type: article
title: "What is Block Confirmation?"
state: "published"
url: "https://intercom.help/webot/en/articles/14120575-what-is-block-confirmation"
author_id: 10009720
created_at: 2026-03-19T08:36:18.000Z
updated_at: 2026-04-03T02:27:56.000Z
---
# What is Block Confirmation?
When transferring cryptocurrency, the "Arrival Time" is often the most critical piece of information for users. Unlike traditional banking systems, blockchain transactions rely on a decentralized validation process called **Block Confirmations**.

Because each blockchain operates on a unique technical architecture, the time required to finalize a transaction varies significantly across different networks to ensure maximum security.

What is a Block Confirmation?

A Block Confirmation indicates how many blocks have been added to the blockchain _after_ the block containing your transaction.

- **Security Correlation:** The higher the confirmation count, the more "permanent" the transaction becomes. A higher count exponentially reduces the risk of transaction reversal or double-spending.

- **Example:** If your Bitcoin (BTC) transaction shows **2 confirmations**, it means your transaction is embedded in a block, and 2 subsequent blocks have been successfully mined and linked on top of it.

Network Confirmation Reference

Below is a breakdown of confirmation requirements and estimated times for major networks supported on our platform:

**Network Name**

**Block Confirmation Requirement**

**Block Creation Time**

**Estimated Completion Time**

BSV

200

10 mins

33.3 hours

ETC

8000

15s

33.3 hours

FIL

900

30s

7.5 hours

BCH

10

10 mins

100 mins

BTC

2

10 mins

20 mins

LTC

6

2.5 mins

15 mins

ETH

64

12s

13 mins

LUNC

128

6s

13 mins

LUNA

128

6s

13 mins

TON

150

5s

12.5 mins

DOGE

12

1 mins

12 mins

ADA

15

20s

5 mins

CKB

30

8s

4 mins

VET

20

10s

3.3 mins

OPTIMISM

100

2s

3.3 mins

XTZ

6

30s

3 mins

NEAR

120

1s

2 mins

HECO

30

3s

90s

TRC20

27

3s

81s

ATOM

12

6-7s

78s

DOT

12

6s

72s

ALGO

12

4.5s

54s

SUI

120

400ms

48s

MANTA

24

2s

48s

BEP20

15

3s

45s

AVAXC

18

2s

36s

ARBITRUM

100

250ms

25s

XRP

6

3-5s

24s

NUM

6

2s

12s

FTM

10

1s

10s

KAS

6

1s

6s

XLM

1

3-5s

5s

EOS

6

0.5s

3s

TAO

1

3s

3s

DOMI

1

3s

3s

OORT

1

2s

2s

APT

1

1s

1s

SOL

1

400ms

400ms

FAQ

**Q: Why does ETC take so much longer than other assets?**

**A:** The ETC network requires **8,000 confirmations** (approx. 33.3 hours). This high threshold is a deliberate security measure to protect against historical network vulnerabilities, ensuring that your large deposits are 100% secure before they are credited.

**Q: Why do confirmation requirements vary across different chains?**

A: Each blockchain has a different "Finality" profile. Bitcoin is highly decentralized and secure, so 2 confirmations are sufficient. Faster networks or those with different consensus mechanisms may require hundreds of confirmations to reach the same level of cryptographic certainty.

**Q: How can I track the real-time status of my transaction?**

A: To track your transfer, you need your Transaction Hash (TXID). You can paste this ID into a specialized Block Explorer to see exactly how many confirmations have been completed.

Once the "Confirmations" count on the explorer reaches our platform's required threshold, your funds will be credited automatically.

Please get in touch with Webot Support if you have any other questions.