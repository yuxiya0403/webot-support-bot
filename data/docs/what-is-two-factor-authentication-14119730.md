---
id: "14119730"
type: article
title: "What is Two Factor Authentication?"
state: "published"
url: "https://intercom.help/webot/en/articles/14119730-what-is-two-factor-authentication"
author_id: 10009720
created_at: 2026-03-19T06:15:41.000Z
updated_at: 2026-04-01T05:46:08.000Z
---
# What is Two Factor Authentication?
> Webot offers 2-step verification, known also as 2-factor (2FA) or multifactor authentication, as an added security layer in addition to yo...
Webot offers 2-step verification, known also as 2-factor (2FA) or multifactor authentication, as an added security layer in addition to your password.

With 2-factor Authentication enabled on your account, you'll need to provide a unique verification code sent to your phone in addition to your username and password.

**Some events that can trigger 2-step verification**

- Sign-in attempt from an unrecognized device

- Sign-in attempt from an unrecognized IP address

- Sending crypto out of your Webot account

Learn how to [troubleshoot 2-step verification](https://intercom.help/webot/en/articles/14119758-2-factor-authentication-troubleshooting) issues.

Google Authenticator (TOTP) - Secure

These are apps that generate a one-time code based on both of these factors:

1) the current date and time on your phone and

2) a secret key known only to you.

Webot shows you a secret key, which you'll then need to paste into an Authenticator app on your phone. To read more about how to bind Google Authenticator, please click [here](https://intercom.help/webot/en/articles/14119767-how-to-bind-google-authenticator).

You can download [Google Authenticator](https://www.webot.com/us/en-US/downloadGoogleAuth) from the app store.

Email - Least secure

2FA using email adds an extra layer of security to online accounts. After entering their username and password, users receive a unique, time-sensitive code via email, which they must enter to complete the login process. This method reduces the risk of unauthorized access by verifying the user's identity through their registered email address.

SMS/Text - Least secure

SMS/Text is a phone app authentication or text-based authentication. Since SMS is linked to a phone number, it can leave you susceptible to phone number porting attacks. These types of attacks involve an attacker transferring or "porting" a victim's phone number to a device the attacker controls, effectively taking over the number and associated 2-step verification codes.