
// src/app/api/send-verification/route.ts
import 'dotenv/config';
import { NextResponse } from 'next/server';

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
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
       process.env.NODE_ENV === 'production' ? 'https://your-app.vercel.app' : 'http://localhost:9002');

    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set.');
      return NextResponse.json(
        { error: 'Verification service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const fullPhoneNumber = countryCode + phoneNumber;
    const verificationLink = `${appUrl}/verify?token=${token}&phone=${encodeURIComponent(fullPhoneNumber)}`;
    const message = `🔐 DigiUnLim Cloud Login\n\nClick this link to access your account:\n${verificationLink}\n\n⚠️ This link is secure and expires in 10 minutes.`;
    
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // The chat_id for sending the message will be the user's phone number (including country code).
    // The user must have started a chat with the bot for this to work.
    const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: fullPhoneNumber,
            text: message,
        }),
    });

    const result = await response.json();

    if (!result.ok) {
        console.error('Failed to send Telegram message:', result.description);
        // Provide a more helpful error message to the user
        if (result.description && result.description.includes('chat not found')) {
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

    return NextResponse.json({ message: 'Verification link sent successfully!' });

  } catch (error) {
    console.error('Error in send-verification:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'An internal server error occurred.', details: errorMessage }, { status: 500 });
  }
}
