import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const update = await request.json();
    console.log('📨 Telegram webhook received:', update);

    if (update.message && update.message.text) {
      const text = update.message.text;
      const chatId = update.message.chat.id;

      // Handle /start command with token
      if (text.startsWith('/start ')) {
        const token = text.split(' ')[1];
        console.log('🔑 Token from Telegram:', token);
        
        // Get token data from Redis
        const tokenKey = `login-token:${token}`;
        const tokenData = await redis.get(tokenKey);
        
        if (tokenData) {
          const data = JSON.parse(tokenData as string);
          
          // Update status and add chat ID
          data.status = 'OTP_SENT';
          data.chatId = chatId;
          
          await redis.set(tokenKey, JSON.stringify(data), { ex: 600 });
          
          // Send OTP to user
          const botToken = process.env.VERIFICATION_BOT_TOKEN;
          const otpMessage = `🔐 Your Login OTP: ${data.otp}\n\nEnter this 6-digit code in the DigiUnLim Cloud app to complete your login.`;
          
          await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: otpMessage
            })
          });
          
          console.log('✅ OTP sent to Telegram');
        } else {
          // Invalid or expired token
          await fetch(`https://api.telegram.org/bot${process.env.VERIFICATION_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              text: '❌ Invalid or expired login link. Please try logging in again.'
            })
          });
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('❌ Telegram webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}