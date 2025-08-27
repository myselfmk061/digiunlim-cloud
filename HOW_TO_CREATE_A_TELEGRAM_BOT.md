# How to Create Telegram Bots and Get Credentials

This guide will show you how to create **two** separate Telegram bots to get the credentials needed for your application to work.

-   **Verification Bot**: Sends login links to users.
-   **Storage Bot**: Stores all the uploaded files in a private channel.

---

### Part 1: Create the Verification Bot

This bot will handle sending secure login links to your users' Telegram accounts.

1.  **Talk to the BotFather:**
    *   Open your Telegram app.
    *   In the search bar, type `BotFather` and choose the official one (it has a blue checkmark).
    *   Click **Start** to begin the conversation.

    ![Step 1: BotFather](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_botfather.png)

2.  **Create a New Bot:**
    *   Type the command `/newbot` and send it.
    *   BotFather will ask for a **name**. Choose something clear, like `My App Verifier`.
    *   Next, it will ask for a **username**. This must be unique and end in `bot` (e.g., `MyAppVerifierBot`). **Save this username.**

3.  **Get Your Verification Bot Credentials:**
    *   Once you've chosen a unique username, BotFather will give you a **token**.
    *   **Copy this token.** It will look like `7123456789:AAG_AbcDef1234GhijKlmnOpqrstUvWxYz`.
    *   You now have your two verification credentials:
        *   `VERIFICATION_BOT_TOKEN`: The token you just copied.
        *   `NEXT_PUBLIC_VERIFICATION_BOT_USERNAME`: The username you chose (e.g., `MyAppVerifierBot`).

    ![Step 3: Get Token](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_token.png)

---

### Part 2: Create the Storage Bot and Private Channel

This bot will be responsible for uploading and managing files in a private channel that acts as your unlimited storage backend.

1.  **Create the Storage Bot:**
    *   In your conversation with BotFather, type `/newbot` again.
    *   Give it a distinct **name**, like `My App Storage`.
    *   Give it a unique **username**, like `MyAppStorageBot`.

2.  **Get Your Storage Bot Token:**
    *   BotFather will give you a second, different token.
    *   **Copy this new token.** This is your `STORAGE_BOT_TOKEN`. Save it.

3.  **Create a Private Channel:**
    *   In Telegram's main menu, create a **New Channel**.
    *   Give it a name (e.g., "App Storage") and make sure you set it to **Private Channel**.

4.  **Add the Storage Bot as an Admin:**
    *   Go to your new channel's settings.
    *   Go to **Administrators** > **Add Admin**.
    *   Search for your **Storage Bot's username** (e.g., `MyAppStorageBot`) and select it.
    *   Ensure it has permission to **Post Messages**. Other permissions are not required.

5.  **Get the Channel's Chat ID:**
    *   Send any test message to your new private channel (e.g., "hello").
    *   Forward this message to a special bot like `@ShowJsonBot` or `@JsonDumpBot`.
    *   The ID bot will reply with JSON text. Look for `forward_from_chat`. The `id` inside it is your channel's Chat ID. It will be a negative number, starting with `-100...` (e.g., `-1001234567890`).
    *   **Copy this entire ID, including the `-100` part.** This is your `TELEGRAM_CHAT_ID`.

    ![Step 5: Get Channel ID](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B7%CE%B8%CF%8C%CF%82.appspot.com/assets/telegram_channel_id.png)

---

### You're Done!

You now have all four required credentials. You can add these to your project's `.env` file or Vercel environment variables.

-   `VERIFICATION_BOT_TOKEN`
-   `NEXT_PUBLIC_VERIFICATION_BOT_USERNAME`
-   `STORAGE_BOT_TOKEN`
-   `TELEGRAM_CHAT_ID`
