import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const { countryCode, phoneNumber: rawPhoneNumber } = await request.json();
    
    if (!rawPhoneNumber) {
        return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }
    
    // Clean phone number (remove non-digits) and combine with country code
    const phoneNumber = `${countryCode}${rawPhoneNumber.replace(/\D/g, '')}`;

    const loginToken = crypto.randomUUID();
    const verificationToken = crypto.randomUUID(); // For the link
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Store login token info for polling
    await redis.set(
      `login-token:${loginToken}`,
      JSON.stringify({ status: 'PENDING', phoneNumber: phoneNumber }), // Include phone number for later
      { ex: 600 } // 10 minute expiry
    );
    
    return NextResponse.json({ token: loginToken });

  } catch (error) {
    console.error('Error creating login token:', error);
    return NextResponse.json(
      { error: 'Could not start login process' },
      { status: 500 }
    );
  }
}
