# How to Create a Telegram Bot and Get Credentials

This guide will show you how to create a single Telegram bot and get the `VERIFICATION_BOT_TOKEN` and `TELEGRAM_CHAT_ID` needed for your application to work.

---

### Part 1: Create the Bot and Get Your Token

This part is the same for everyone.

1.  **Talk to the BotFather:**
    *   Open your Telegram app.
    *   In the search bar, type `BotFather` and choose the official one (it has a blue checkmark).
    *   Click **Start** to begin the conversation.

    ![Step 1: BotFather](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_botfather.png)

2.  **Create a New Bot:**
    *   Type the command `/newbot` and send it.
    *   BotFather will ask for a **name**. This is its display name (e.g., `My App Bot`).
    *   Next, it will ask for a **username**. This must be unique and end in `bot` (e.g., `MyAppBot`).

3.  **Get Your Bot Token:**
    *   Once you've chosen a unique username, BotFather will give you a **token**.
    *   **Copy this token.** It will look like `7123456789:AAG_AbcDef1234GhijKlmnOpqrstUvWxYz`.
    *   This is your `VERIFICATION_BOT_TOKEN`.

    ![Step 3: Get Token](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_token.png)

---

### Part 2: Get Your Chat ID

Now you need to get the `TELEGRAM_CHAT_ID`. You have two options. Choose the one that fits your needs.

#### Option A: Use Your Personal Chat (for Verification Links)

If you want the bot to send login links directly to your personal Telegram account, follow these steps.

1.  **Start a Chat with Your Bot:**
    *   Find your new bot in Telegram search (using the username you created, e.g., `MyAppBot`) and click **Start**.

2.  **Get Your Personal Chat ID:**
    *   Open your web browser and go to the following URL, but **replace `<YOUR_BOT_TOKEN>`** with the token you just copied:
        ```
        https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
        ```
    *   You will see some text. Look for `"chat":{"id":`. The number that comes after it is your Chat ID (e.g., `123456789`).
    *   **Copy this Chat ID.** This is your `TELEGRAM_CHAT_ID`.

    ![Step 4: Get Personal Chat ID](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_chat_id.png)


#### Option B: Use a Private Channel (for File Storage)

If you want to use the bot to upload and store files in a separate, private place, follow these steps. **Note:** If you use this method, the verification links will also be sent to this channel, not to you personally.

1.  **Create a Private Channel:**
    *   In Telegram, create a **New Channel**.
    *   Give it a name (e.g., "App Storage") and make it **Private**.

2.  **Add Your Bot as an Admin:**
    *   Add your new bot to the channel as an **Administrator**.
    *   You must give it permission to "Post Messages".

3.  **Get the Channel's Chat ID:**
    *   Send any test message to your new private channel (e.g., "hello").
    *   Forward this message to a special bot like `@ShowJsonBot` or `@JsonDumpBot`.
    *   The ID bot will reply with JSON text. Look for `forward_from_chat`. The `id` inside it is your channel's Chat ID. It will be a negative number, starting with `-100...` (e.g., `-1001234567890`).
    *   **Copy this entire ID, including the `-100` part.** This is your `TELEGRAM_CHAT_ID`.

    ![Step 5: Get Channel ID](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_channel_id.png)

---

### You're Done!

You now have your `VERIFICATION_BOT_TOKEN` and `TELEGRAM_CHAT_ID`. You can add these to your project's `.env` file or Vercel environment variables.
