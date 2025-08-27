// src/app/api/bot/webhook/route.ts
import 'dotenv/config';
import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

type AuthTokenData = {
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  phoneNumber: string;
  createdAt: number;
  expiresAt: number;
};

// This function handles incoming webhooks from Telegram
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 1. Check if the update contains a message and text
    if (!body.message || !body.message.text) {
      return NextResponse.json({ status: 'ok' }); // Not an event we care about
    }

    const text: string = body.message.text;
    
    // 2. Check if the message is a /start command with a token
    if (!text.startsWith('/start ')) {
      return NextResponse.json({ status: 'ok' }); // Not a login attempt
    }

    const token = text.split(' ')[1];
    if (!token) {
      console.warn('Webhook received /start command without a token.');
      return NextResponse.json({ status: 'ok' });
    }

    const key = `auth:${token}`;
    const tokenData = await kv.get<AuthTokenData>(key);

    // 3. Validate the token
    if (!tokenData) {
      console.warn(`Webhook received an invalid token: ${token}`);
      // We don't need to send a message back, just acknowledge the webhook.
      return NextResponse.json({ status: 'ok' });
    }

    if (Date.now() > tokenData.expiresAt) {
       console.warn(`Webhook received an expired token: ${token}`);
       return NextResponse.json({ status: 'ok' });
    }

    if (tokenData.status === 'PENDING') {
      // 4. Update the status to 'VERIFIED'
      await kv.set(
        key,
        { ...tokenData, status: 'VERIFIED' },
        { ex: 60 * 60 * 24 } // Keep record for 24 hours
      );
    }
    
    // 5. Acknowledge the webhook request from Telegram
    return NextResponse.json({ status: 'ok' });

  } catch (error) {
    console.error('Error in /api/bot/webhook:', error);
    // Return a 200 OK response even on errors to prevent Telegram from resending the webhook
    return NextResponse.json({ status: 'error', message: 'Internal server error' });
  }
}

// NOTE: You must set this webhook with Telegram for it to work.
// You can do this by sending a request to the Telegram API:
// https://api.telegram.org/bot<YOUR_VERIFICATION_BOT_TOKEN>/setWebhook?url=<YOUR_DEPLOYED_APP_URL>/api/bot/webhook
// Example:
// curl "https://api.telegram.org/bot12345:ABCDE/setWebhook?url=https://your-app.vercel.app/api/bot/webhook"
//
// Do this ONCE after your application is deployed.
