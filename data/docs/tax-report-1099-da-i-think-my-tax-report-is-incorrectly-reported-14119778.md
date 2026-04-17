---
id: "14119778"
type: article
title: "Tax Report 1099-DA: I think my tax report is incorrectly reported"
state: "published"
url: "https://intercom.help/webot/en/articles/14119778-tax-report-1099-da-i-think-my-tax-report-is-incorrectly-reported"
author_id: 10009720
created_at: 2026-03-19T06:18:39.000Z
updated_at: 2026-03-25T07:53:15.000Z
---
# Tax Report 1099-DA: I think my tax report is incorrectly reported
**What Is Form 1099-DA?**

Form 1099-DA, _Digital Asset Proceeds From Broker Transactions_, is a new IRS tax form introduced for the 2025 tax year. It is used by U.S. custodial brokers — including Webot — to report the gross proceeds from your digital asset sales and disposals directly to both you and the IRS.

Think of it like the Form 1099-B used for stock transactions, but specifically designed for crypto and other digital assets. The form was mandated by changes to Internal Revenue Code §6045 through the Infrastructure Investment and Jobs Act, with reporting required beginning January 1, 2025.

**_IRS Source:_**_ [About Form 1099-DA](https://www.irs.gov/forms-pubs/about-form-1099-da) | [Understanding Your Form 1099-DA](https://www.irs.gov/businesses/understanding-your-form-1099-da)_

**What Does "Proceeds" Mean?**

**Proceeds** (shown in Box 1f of your 1099-DA) represent the **total value you received** from selling, exchanging, or disposing of digital assets during the year. This includes:

- Cash received from selling crypto for USD

- The fair market value of another digital asset you received in a swap/exchange

- The value of goods or services received in exchange for crypto

**Proceeds are not your profit.** They are the gross amount before subtracting what you paid for the asset. For example, if you bought $1,000 of XRP and later sold it for $1,200, your proceeds are $1,200 — not $200.

⚠️ **Important:** If you use trading bots that continuously buy and sell, your gross proceeds figure can appear very large — far larger than your account balance or deposits — because it accumulates every sale throughout the year, even if you reinvest the same dollars repeatedly.

**Example:** Starting with $5,000, your bot completes 10 round-trip buy/sell cycles, generating $50,000 in gross proceeds, even though you never held more than $5,000 at once. The $50,000 is what gets reported as proceeds, but your actual taxable gain would only be the profit earned across those trades.

**What Is Cost Basis?**

**Cost basis** is what you originally paid to acquire a digital asset, including any transaction fees. It is the number subtracted from your proceeds to determine your actual gain or loss.

- **Cost Basis = Purchase Price + Fees Paid to Acquire**

- **Gain/Loss = Proceeds − Cost Basis**

For 2025, brokers are **not required** to report cost basis to the IRS on the 1099-DA — only gross proceeds are mandatory. This means Box 1g (Cost or Other Basis) on your form may be blank. **You are responsible for calculating and reporting your own cost basis** when you file your tax return.

**_IRS Source:_**_ [Instructions for Form 1099-DA (2025)](https://www.irs.gov/pub/irs-pdf/i1099da.pdf) — "Brokers are not required to report basis information with respect to sales effected in 2025."_

This is why we provide transaction history files alongside the 1099-DA — so you can calculate your cost basis accurately. We recommend using a trusted crypto tax platform or a qualified tax professional to assist with this.

**How the 1099-DA Is Calculated: Realized vs. Unrealized**

Your 1099-DA only reflects **realized** transactions — trades that were fully completed (bought and then sold) during the 2025 tax year. It does **not** include:

- Assets you still hold in your account (unrealized positions)

- Paper gains or losses on open positions

- Deposits or withdrawals (these are not taxable events by themselves)

**Why Your Reported Gain May Look Higher Than Expected**

A common source of confusion is when the realized gain shown on the 1099-DA appears higher than the difference between your deposits and your current account balance. This is usually explained by **unrealized losses** on assets you still hold.

**Example:**

Activity

Amount

Realized gains from completed bot trades

+$8,000

Unrealized loss on tokens still held (e.g., THETA, AXS down since purchase)

−$3,000

Net economic result (what your account actually reflects)

~$5,000

Both figures are accurate — they simply measure different things. The $8,000 is what you owe taxes on now. The $3,000 loss becomes deductible when you sell those assets in the future.

**Calculation Methods: FIFO and Others**

When you have multiple purchases of the same asset at different prices, the IRS requires you to use a specific accounting method to determine which "lot" was sold. The most common method is:

- **FIFO (First In, First Out):** The oldest units purchased are considered sold first. This is the IRS default method and what Webot applies in its reporting.

- **Specific Identification:** You may be able to designate which specific lot was sold, which can minimize taxes in some situations. This requires detailed recordkeeping and must be established at the time of sale.

- **HIFO (Highest In, First Out):** Sells the highest-cost lots first, minimizing gains. This requires specific identification to be properly established.

For 2025 bot trading activity, FIFO is applied across your trade history. If you wish to use a different method, consult a tax professional before filing.

**_IRS Source:_**_ [Revenue Procedure 2024-28](https://www.irs.gov/pub/irs-drop/rp-24-28.pdf) — covers cost basis allocation methods for digital assets._

**Form 1099-DA vs. Form 8949 vs. Schedule D**

These three forms work together in a chain:

Form

Purpose

**1099-DA**

Issued by your broker. Reports gross proceeds (and sometimes basis) from your digital asset sales to you and the IRS.

**Form 8949**

You complete this. Lists each individual sale transaction, your cost basis, and your calculated gain or loss. This is where corrections and adjustments to 1099-DA figures are made.

**Schedule D**

Summarizes totals from Form 8949 and feeds into your Form 1040. This is where your net capital gains or losses are ultimately reported.

**When Do You Need Form 8949?**

You must use Form 8949 when:

- Your 1099-DA does not show cost basis (Box 1g is blank, or basis was not reported to the IRS)

- You need to make corrections or adjustments to the figures on the 1099-DA

- You have transactions from wallets or exchanges outside of Webot

**_IRS Source:_**_ [Instructions for Form 8949 (2025)](https://www.irs.gov/instructions/i8949) — "Form 8949 allows you and the IRS to reconcile amounts that were reported to you and the IRS on Form 1099-DA with the amounts you report on your return."_

If your 1099-DA shows basis was reported to the IRS and no adjustment is needed, you may in some cases, report directly on Schedule D without filing a separate Form 8949.

**What If My Personal Information Is Wrong?**

If your 1099-DA contains incorrect personal information—such as your **name**, **Social Security Number (SSN)**, or **Taxpayer Identification Number (TIN)**—please review the guidelines below.

**Incorrect Address:**

Please note that we currently do not support updates to the address displayed on your 1099-DA. However, an incorrect address will not affect your ability to file taxes, nor will it interfere with the IRS’s process, provided your Name and SSN/TIN are accurate.

**Incorrect SSN/TIN or Name:**

- **For SSN/TIN Errors:** Please visit the Identity Verification page in your account settings to re-verify with your correct SSN/TIN. Once your verification is successfully updated, contact us at [service@webot.com](mailto:service@webot.com) to request an updated tax report.

- **For Name Errors:** If your legal name is misspelled or incorrect, please contact us directly at [service@webot.com](mailto:service@webot.com) with supporting documentation so we can update our records.

**Filing Guidance**

- **Do Not File with Incorrect Tax IDs:** Ensure your SSN/TIN is corrected in our system before you finalize your tax filing.

- **File by the Deadline:** If you are waiting for an updated form, you should still aim to file by the tax deadline using your correct legal information on your tax return.

- **Keep Records:** Maintain a copy of all original forms and your correspondence with us for your tax professional’s review.

⚠️ An incorrect SSN or TIN is particularly important to resolve quickly, as the IRS uses this number to match your return to our filing. A mismatch can result in backup withholding or IRS notices, even if your tax figures are correct.

**_IRS Source:_**_ [Understanding Your Form 1099-DA — If your Form 1099-DA has incorrect information](https://www.irs.gov/businesses/understanding-your-form-1099-da)_

**What If I Received a 1099-DA But Shouldn't Have?**

If you believe you received a Form 1099-DA in error — for example, because you did not sell any digital assets — contact us immediately. Per IRS guidance:

- Contact the issuer (Webot) right away

- Keep a copy of the original form and all correspondence

- Do not wait to file your taxes — file by the deadline, regardless

**_IRS Source:_**_ [Understanding Your Form 1099-DA — If you get a Form 1099-DA when you shouldn't have](https://www.irs.gov/businesses/understanding-your-form-1099-da)_

**What If the Transaction Figures on My 1099-DA Are Incorrect?**

If the proceeds or other figures appear wrong, here is what the IRS advises and what you should do:

- **Request a corrected form from us** — contact [service@webot.com](mailto:service@webot.com) with specifics about the error

- **Keep a copy** of the corrected form and all correspondence

- **Do not contact the IRS** to correct it — only the issuing broker can file a corrected 1099-DA with the IRS

- **Do not wait to file** — file your return by the deadline based on your actual correct figures

- **Report the correct figures on Form 8949** — you can enter the correct proceeds and basis on Form 8949 and note the adjustment in column (g) with the appropriate code

**_IRS Source:_**_ [Understanding Your Form 1099-DA — If your Form 1099-DA has incorrect information](https://www.irs.gov/businesses/understanding-your-form-1099-da)_

**Do I Still Have to Report Crypto Taxes If I Did Not Receive a 1099-DA?**

**Yes.** Whether or not you receive a Form 1099-DA, the IRS requires you to report all income, gains, and losses from digital asset transactions on your federal tax return. This includes transactions on foreign exchanges that may not be required to file 1099-DAs.

**_IRS Source:_**_ [Understanding Your Form 1099-DA](https://www.irs.gov/businesses/understanding-your-form-1099-da) — "Whether or not you receive a Form 1099-DA, you must report all income, gains, and losses from digital asset transactions on your federal income tax return."_

**Frequently Asked Questions (FAQ)**

**Q: My proceeds figure is much higher than my total deposits. Is this a mistake?**

**A:** Not necessarily. Proceeds represent the cumulative total of all your sales transactions throughout the year — not your profit or starting balance. If you used trading bots, the same capital can cycle through dozens or hundreds of trades, each generating proceeds. Your taxable gain is proceeds minus your cost basis, which is typically a much smaller number.

**Q: Why does my 1099-DA not show a cost basis figure?**

**A:** For the 2025 tax year, brokers are only required to report gross proceeds. Cost basis reporting becomes mandatory for covered securities starting with 2026 transactions. You will need to calculate your cost basis yourself using your transaction history files, which we provide in your tax report package.

**Q: My bot trades show $500,000 in proceeds, but I only deposited $10,000. Is the IRS going to think I made $500,000?**

**A:** No, as long as you file correctly. The IRS does not tax proceeds; it taxes gains (proceeds minus cost basis). On your Form 8949, you will list both the proceeds and the cost basis for each transaction. If your cost basis equals your proceeds (or exceeds them), your taxable gain is zero, or you have a deductible loss. File accurately with complete records, and you will only be taxed on your actual gains.

**Q: What is the difference between a short-term and long-term gain?**

**A:** Assets held for **one year or less** before selling are short-term gains, taxed at your ordinary income tax rate. Assets held for **more than one year** are long-term gains, taxed at the lower capital gains rates (0%, 15%, or 20% depending on your income). Your 1099-DA indicates whether each transaction is short-term or long-term based on the acquisition and sale dates.

**Q: Are crypto withdrawals to my external wallet a taxable event?**

**A:** No. Transferring crypto from your Webot account to your own external wallet is not a taxable event — it is simply moving your own property. It should not appear as a "sale" on your 1099-DA. However, if you then sell the crypto from that external wallet, that sale would be a taxable event you must report (though a foreign or DeFi broker may not issue a 1099-DA for it).

**Q: I received a 1099-DA that shows transactions I don't recognize. What should I do?**

**A:** Contact us immediately at [service@webot.com](mailto:service@webot.com). Provide your account UID and a description of the transactions you do not recognize. Do not file your taxes using figures you believe are incorrect — use your own verified transaction records and report on Form 8949, making adjustments as necessary. Keep all correspondence with us as documentation.

**Q: My name or SSN is wrong on the form. Can I just file my taxes anyway?**

**A:** You should contact us to request a corrected form as soon as possible, since the IRS uses your SSN/TIN to match your return to our filing. However, you should not delay filing your taxes. File by the deadline using your correct information, and note that a corrected form is pending. Keep all correspondence with us for your records.

**Q: What is the tax filing deadline for 2025 returns?**

**A:** The standard IRS deadline for individual tax returns (Form 1040) is **April 15, 2026**. You can request a six-month extension (to October 15, 2026), but note that an extension to file is not an extension to pay — any taxes owed are still due by April 15.

**We Recommend Consulting a Tax Professional**

Given the complexity of crypto tax reporting — especially for users with active bot trading, multiple assets, or withdrawals to external wallets — we strongly recommend working with a qualified CPA or tax professional who has experience with digital asset taxation. They can ensure your Form 8949 is correctly completed, your cost basis is properly calculated, and your return is fully compliant.

**IRS References**

- [Understanding Your Form 1099-DA](https://www.irs.gov/businesses/understanding-your-form-1099-da)

- [About Form 1099-DA](https://www.irs.gov/forms-pubs/about-form-1099-da)

- [Instructions for Form 1099-DA (2025)](https://www.irs.gov/pub/irs-pdf/i1099da.pdf)

- [Instructions for Form 8949 (2025)](https://www.irs.gov/instructions/i8949)

- [Instructions for Schedule D (Form 1040) (2025)](https://www.irs.gov/instructions/i1040sd)

- [IRS FAQ: Broker Reporting for Digital Assets](https://www.irs.gov/filing/frequently-asked-questions-about-broker-reporting)

- [Digital Assets — IRS Overview](https://www.irs.gov/businesses/small-businesses-self-employed/digital-assets)