# How to Create a Telegram Bot (for Verification Links)

Follow these steps to create your Telegram bot and get the necessary credentials for your app.

---

### Step 1: Talk to the BotFather

1.  Open your Telegram app.
2.  In the search bar, type `BotFather` and choose the official one (it has a blue checkmark).
3.  Click **Start** to begin the conversation.

![Step 1: BotFather](https://storage.googleapis.com/studioprod-%20%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_botfather.png)

---

### Step 2: Create a New Bot

1.  Type the command `/newbot` and send it.
2.  BotFather will ask for a **name** for your bot. This is its display name (e.g., `My App Verifier`).
3.  Next, it will ask for a **username**. This must be unique and end in `bot` (e.g., `MyAppVerifierBot`).

---

### Step 3: Get Your Bot Token

Once you've chosen a unique username, BotFather will congratulate you and give you a **token**. This token is like a password for your bot.

*   **Copy this token carefully.** It will look something like `7123456789:AAG_AbcDef1234GhijKlmnOpqrstUvWxYz`.

You will use this for the `VERIFICATION_BOT_TOKEN` environment variable.

![Step 3: Get Token](https://storage.googleapis.com/studioprod-%20%E2%81%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_token.png)

---

### Step 4: Get Your Personal Chat ID

This is the most important step for the verification bot. You need to get your personal Telegram Chat ID so the bot knows where to send the login links.

1.  Find your new bot in Telegram search (using the username you created, e.g., `MyAppVerifierBot`) and click **Start**.
2.  Now, open your web browser and go to the following URL, but **replace `<YOUR_BOT_TOKEN>`** with the token you just copied:
    ```
    https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
    ```
    For example: `https://api.telegram.org/bot7123456789:AAG_AbcDef1234GhijKlmnOpqrstUvWxYz/getUpdates`
3.  You will see some text on the page. Look for `"chat":{"id":`. The number that comes after it is your Chat ID. It will look like `123456789`.
4.  **Copy this Chat ID.**

You will use this for the `VERIFICATION_CHAT_ID` environment variable.

![Step 4: Get Chat ID](https://storage.googleapis.com/studioprod-%20%E2%81%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_chat_id.png)

---

### You're Done!

You now have your `VERIFICATION_BOT_TOKEN` and `VERIFICATION_CHAT_ID`. You can add these to your project's environment variables.
