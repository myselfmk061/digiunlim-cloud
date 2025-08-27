# How to Deploy Your Project to Vercel (Step-by-Step)

Follow these steps carefully to get your website live on the internet.

## Before You Start

- Make sure your code is on GitHub.
- You will need to create **two** Telegram bots:
  - One bot for sending login links.
  - A second bot for storing files.
  - [**Follow this guide to create your Telegram Bots**](./HOW_TO_CREATE_A_TELEGRAM_BOT.md)
- You will need an [Upstash Redis](https://upstash.com/) account for the free database.

---

### Step 1: Go to Vercel and Import Project

1.  Open your web browser and go to [https://vercel.com/new](https://vercel.com/new).
2.  If you are not logged in, sign up using your GitHub account.
3.  You will see a list of your GitHub projects. Find your project and click the **Import** button.

![Step 1: Import Project on Vercel](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B8%CF%8C%CF%82.appspot.com/assets/vercel_import.png)

---

### Step 2: Configure Your Project

Vercel will automatically know it's a Next.js project. You just need to add your secrets for your Telegram bots and Upstash database.

1.  Scroll down until you see the section called **Environment Variables**.
2.  You will add six secrets here, one by one.

    *   **Name:** `VERIFICATION_BOT_TOKEN`
    *   **Value:** `[Your Verification Bot Token]`
    *   Click **Add**.

    *   **Name:** `NEXT_PUBLIC_VERIFICATION_BOT_USERNAME`
    *   **Value:** `[Your Verification Bot's Username, e.g., MyAppVerifierBot]`
    *   Click **Add**.

    *   **Name:** `STORAGE_BOT_TOKEN`
    *   **Value:** `[Your Storage Bot Token]`
    *   Click **Add**.
    
    *   **Name:** `TELEGRAM_CHAT_ID`
    *   **Value:** `[Your Private Storage Channel ID]`
    *   Click **Add**.
    
    *   **Name:** `UPSTASH_REDIS_REST_URL`
    *   **Value:** `[Your Upstash Redis URL]`
    *   Click **Add**.

    *   **Name:** `UPSTASH_REDIS_REST_TOKEN`
    *   **Value:** `[Your Upstash Redis Token]`
    *   Click **Add**.

It should look similar to this (with your own values):

![Step 2: Add Environment Variables](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B8%CF%8C%CF%82.appspot.com/assets/vercel_env.png)

---

### Step 3: Deploy

1.  Now, just click the big blue **Deploy** button.
2.  Wait for a minute or two while Vercel builds and deploys your site.

![Step 3: Deploy](https://storage.googleapis.com/studioprod-%E2%80%94%CE%B2%CE%BF%CE%B8%CF%8C%CF%82.appspot.com/assets/vercel_deploy.png)

---

### Step 4: Final Update (Very Important!)

After deploying, Vercel will show you a congratulations screen with a picture of your new website.

1.  At the top, you will see your public URL (e.g., `your-project.vercel.app`). **Copy this URL.**
2.  Go back to your Vercel project dashboard.
3.  Go to the **Settings** tab.
4.  Click on **Environment Variables** in the left menu.
5.  Add one more variable:
    *   **Name:** `NEXT_PUBLIC_APP_URL`
    *   **Value:** Paste the URL you copied (e.g., `https://your-project.vercel.app`). **Make sure it starts with `https://`**.
6.  **Save** the new variable.
7.  Go to the **Deployments** tab, find the latest deployment, click the "..." menu, and select **Redeploy**. This is necessary for the new `NEXT_PUBLIC_APP_URL` variable to be used by the application.

You are all done! Your website is now live and fully configured.

