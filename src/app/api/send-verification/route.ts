
// src/app/api/send-verification/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { phoneNumber, countryCode } = await request.json();
    
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:9002');

    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set.');
      return NextResponse.json(
        { error: 'Verification service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Generate a secure token for verification
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const verificationLink = `${appUrl}/verify?token=${token}&phone=${encodeURIComponent(countryCode + phoneNumber)}`;
    const message = `🔐 DigiUnLim Cloud Login\n\nClick this link to access your account:\n${verificationLink}\n\n⚠️ This link is secure and expires in 10 minutes.`;
    
    const fullPhoneNumber = countryCode + phoneNumber;
    const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const response = await fetch(telegramApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: fullPhoneNumber,
            text: message,
            parse_mode: 'Markdown'
        }),
    });

    const result = await response.json();

    if (!result.ok) {
        console.error('Failed to send Telegram message:', result.description);
        // Provide a more user-friendly error message
        if (result.description.includes('chat not found')) {
             return NextResponse.json(
                { error: 'Could not send link. Make sure this phone number is on Telegram and you have started a chat with the bot.' },
                { status: 404 }
            );
        }
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
