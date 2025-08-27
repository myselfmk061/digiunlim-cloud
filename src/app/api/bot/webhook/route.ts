import { NextResponse, type NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check for message and text field
    if (!body.message || !body.message.text) {
      // Not a message we are interested in, so we can ignore it.
      return NextResponse.json({ ok: true });
    }

    const { message } = body;
    
    // The token is sent with the /start command, e.g., /start <token>
    const parts = message.text.split(' ');
    if (parts.length < 2 || parts[0] !== '/start') {
        // Command is not in the format we expect
        return NextResponse.json({ ok: true });
    }
    const token = parts[1];
    
    const key = `login-token:${token}`;
    const tokenDataString = await redis.get<string>(key);
    
    if (tokenDataString) {
      const tokenData = JSON.parse(tokenDataString);
      
      // Update status to VERIFIED
      const updatedTokenData = { ...tokenData, status: 'VERIFIED' };
      
      // Save it back to redis with the original expiration time
      const ttl = await redis.ttl(key);
      await redis.set(
        key,
        JSON.stringify(updatedTokenData),
        { ex: ttl > 0 ? ttl : 600 } // use remaining ttl or default to 10 mins
      );
    }
    // Always return OK to Telegram
    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error("Error in webhook:", error);
    // Even if there's an error, we should tell Telegram we received the request.
    // The error is logged for debugging.
    return NextResponse.json({ ok: true });
  }
}
