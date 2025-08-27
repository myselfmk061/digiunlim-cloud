// src/app/api/auth/start/route.ts
import 'dotenv/config';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, countryCode } = body;

    if (!phoneNumber || !countryCode) {
      return NextResponse.json(
        { error: 'Phone number and country code are required.' },
        { status: 400 }
      );
    }

    const botToken = process.env.VERIFICATION_BOT_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

    if (!botToken) {
      console.error('VERIFICATION_BOT_TOKEN is not set.');
      return NextResponse.json(
        { error: 'Verification service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // 1. Create a secure, unique token
    const token = randomUUID();
    const fullPhoneNumber = countryCode + phoneNumber;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // 2. Store the token in Vercel KV
    await kv.set(
      `auth:${token}`,
      {
        status: 'PENDING',
        phoneNumber: fullPhoneNumber,
        createdAt: Date.now(),
        expiresAt: expiresAt,
      },
      { ex: 600 } // Expire key in KV after 10 minutes
    );

    // 3. Send the verification link via Telegram
    const verificationLink = `${appUrl}/verify?token=${token}`;
    const message = `🔐 DigiUnLim Cloud Login\n\nClick this link to access your account:\n${verificationLink}\n\n⚠️ This link is secure and expires in 10 minutes.`;
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: fullPhoneNumber,
        text: message,
      }),
    });

    const result = await telegramResponse.json();

    if (!result.ok) {
      console.error('Failed to send Telegram message:', result.description);
      if (result.description && (result.description.includes('chat not found') || result.description.includes('bot was blocked by the user'))) {
        return NextResponse.json(
          { error: 'Could not send link. Make sure this phone number is on Telegram and you have started a chat with our bot.' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Could not send verification link. Please check the phone number and try again.' },
        { status: 500 }
      );
    }

    // 4. Send the token back to the frontend (as per the requested flow)
    return NextResponse.json({ token });

  } catch (error) {
    console.error('Error in /api/auth/start:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'An internal server error occurred.', details: errorMessage }, { status: 500 });
  }
}