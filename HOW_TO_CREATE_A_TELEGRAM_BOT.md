# How to Create a Telegram Bot and Get Credentials

This guide will show you how to create a Telegram bot and a private channel to get the credentials needed for your application. This setup will act as your free, unlimited file storage backend.

---

### Step 1: Create the Telegram Bot

1.  **Talk to the BotFather:**
    *   Open your Telegram app.
    *   In the search bar, type `BotFather` and choose the official one (it has a blue checkmark).
    *   Click **Start** to begin the conversation.

    ![Step 1: BotFather](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_botfather.png)

2.  **Create a New Bot:**
    *   Type the command `/newbot` and send it.
    *   BotFather will ask for a **name**. This can be anything (e.g., `My App Storage`).
    *   Next, it will ask for a **username**. This must be unique and end in `bot` (e.g., `MyAppStorageBot`).

3.  **Get Your Bot Token:**
    *   Once you've chosen a unique username, BotFather will give you a **token**.
    *   **Copy this token.** It will look like `7123456789:AAG_AbcDef1234GhijKlmnOpqrstUvWxYz`.
    *   This is your `TELEGRAM_BOT_TOKEN`.

    ![Step 3: Get Token](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_token.png)

---

### Step 2: Create a Private Channel and Get its ID

This channel is where your bot will upload all the files.

1.  **Create a Private Channel:**
    *   In Telegram's main menu, create a **New Channel**.
    *   Give it a name (e.g., "App File Storage") and make sure you set it to **Private Channel**.

2.  **Add Your Bot as an Admin:**
    *   Go to your new channel's settings.
    *   Go to **Administrators** > **Add Admin**.
    *   Search for your **bot's username** (e.g., `MyAppStorageBot`) and select it.
    *   Ensure it has permission to **Post Messages**. Other permissions are not required.

3.  **Get the Channel's Chat ID:**
    *   Send any test message to your new private channel (e.g., "hello").
    *   Forward this message to a special bot like `@ShowJsonBot` or `@JsonDumpBot`.
    *   The ID bot will reply with JSON text. Look for `forward_from_chat`. The `id` inside it is your channel's Chat ID. It will be a negative number, starting with `-100...` (e.g., `-1001234567890`).
    *   **Copy this entire ID, including the `-100` part.** This is your `TELEGRAM_CHAT_ID`.

    ![Step 5: Get Channel ID](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_channel_id.png)

---

### You're Done!

You now have the two required credentials. You can add these to your project's `.env` file.

-   `TELEGRAM_BOT_TOKEN`
-   `TELEGRAM_CHAT_ID`
