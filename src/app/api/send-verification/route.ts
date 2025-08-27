
// src/app/api/send-verification/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber, countryCode } = await request.json();
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

    if (!botToken || !chatId) {
      console.error('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set.');
      return NextResponse.json(
        { error: 'Verification service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // The verification is simply getting the user to the app.
    // The "logged in" state is determined by localStorage on the client.
    // We send a direct link to the dashboard.
    const verificationLink = `${appUrl}/dashboard?verified=true`;
    const message = `Hello! Click this link to log in to DigiUnLim Cloud: ${verificationLink}`;
    
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
        }),
    });

    const result = await response.json();

    if (!result.ok) {
        console.error('Failed to send Telegram message:', result.description);
        return NextResponse.json(
            { error: 'Could not send verification link. Please check bot configuration.' },
            { status: 500 }
        );
    }

    return NextResponse.json({ message: 'Verification link sent successfully!' });

  } catch (error) {
    console.error('Error in send-verification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'An internal server error occurred.', details: errorMessage }, { status: 500 });
  }
}
