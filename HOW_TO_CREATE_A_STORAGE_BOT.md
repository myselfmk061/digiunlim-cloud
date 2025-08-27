# How to Create a Telegram Bot (for File Storage)

This bot will act as the backend for your unlimited storage.

---

### Step 1: Talk to the BotFather

1.  Open your Telegram app.
2.  In the search bar, type `BotFather` and choose the official one (it has a blue checkmark).
3.  Click **Start** to begin the conversation.

![Step 1: BotFather](https://storage.googleapis.com/studioprod-%20%E2%81%94%CE%B2%CE_BF%CE_B7%CE_B8%CF_8C%CF_82.appspot.com/assets/telegram_botfather.png)

---

### Step 2: Create a New Bot

1.  Type the command `/newbot` and send it.
2.  BotFather will ask for a **name**. This is its display name (e.g., `My App Storage`).
3.  Next, it will ask for a **username**. This must be unique and end in `bot` (e.g., `MyAppStorageBot`).

---

### Step 3: Get Your Bot Token

Once you've chosen a unique username, BotFather will give you a **token**.

*   **Copy this token.** It will look like `7123456789:AAG_AbcDef1234GhijKlmnOpqrstUvWxYz`.

You will use this for the `STORAGE_BOT_TOKEN` environment variable.

![Step 3: Get Token](https://storage.googleapis.com/studioprod-%20%E2%81%94%CE%B2%CE_BF%CE_B7%CE_B8%CF_8C%CF_82.appspot.com/assets/telegram_token.png)

---

### Step 4: Create a Private Channel for Storage

It's best to use a private channel for storage so only you and your bot have access.

1.  In Telegram, create a **New Channel**.
2.  Give it a name (e.g., "App Storage") and make it **Private**.
3.  **Important:** Add your new storage bot to the channel as an **Administrator**. You must give it permission to "Post Messages".

---

### Step 5: Get the Channel's Chat ID

1.  Send any test message to your new private channel (e.g., "hello").
2.  Now, you need a way to find the channel's ID. The easiest way is to temporarily forward a message from that channel to a public "ID Bot".
    *   Search for a bot like `@ShowJsonBot` or `@JsonDumpBot` in Telegram and start it.
    *   Go to your private channel, **forward** your test message, and send it to the ID bot you just started.
3.  The ID bot will reply with a lot of text (in JSON format). Look for `forward_from_chat`. The `id` inside it is your channel's Chat ID. It will be a negative number, starting with `-100...` (e.g., `-1001234567890`).
4.  **Copy this entire ID, including the `-100` part.**

You will use this for the `STORAGE_CHAT_ID` environment variable.

![Step 5: Get Channel ID](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_channel_id.png)

---

### You're Done!

You now have your `STORAGE_BOT_TOKEN` and `STORAGE_CHAT_I`D. You can add these to your project's environment variables.
