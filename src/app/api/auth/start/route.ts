// src/app/api/auth/start/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
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

    // 1. Create a secure, unique token
    const token = randomUUID();
    const fullPhoneNumber = countryCode + phoneNumber;
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // 2. Store the token in Upstash Redis
    const key = `auth:${token}`;
    const value = {
        status: 'PENDING',
        phoneNumber: fullPhoneNumber,
        createdAt: Date.now(),
        expiresAt: expiresAt,
    };
    
    await redis.set(key, JSON.stringify(value), {
      ex: 600 // Expire key in Redis after 10 minutes
    });


    // 3. Send the token back to the frontend
    return NextResponse.json({ token });

  } catch (error) {
    console.error('Error in /api/auth/start:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'An internal server error occurred.', details: errorMessage }, { status: 500 });
  }
}
