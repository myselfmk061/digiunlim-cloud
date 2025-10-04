
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';

// Upstash Redis client को Initialize करें
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Test Redis connection
const testRedisConnection = async () => {
  try {
    await redis.ping();
    console.log('✅ Redis connected successfully');
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
  }
};

function generateOtp() {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    // Test Redis connection first
    await testRedisConnection();
    
    const { countryCode, phoneNumber: rawPhoneNumber } = await request.json();
    
    if (!rawPhoneNumber) {
        return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }
    
    // Clean phone number (remove non-digits) and combine with country code
    const phoneNumber = `${countryCode}${rawPhoneNumber.replace(/\D/g, '')}`;

    const loginToken = crypto.randomUUID();
    const otp = generateOtp();
    
    // Store login token info for polling, including the phone number and OTP
    await redis.set(
      `login-token:${loginToken}`,
      JSON.stringify({ 
        status: 'PENDING', 
        phoneNumber: phoneNumber,
        otp: otp, // Store the OTP
      }),
      { ex: 600 } // 10 minute expiry
    );
    
    return NextResponse.json({ token: loginToken, phoneNumber: phoneNumber });

  } catch (error) {
    console.error('Error creating login token:', error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Redis')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again.' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Could not start login process. Please check your input and try again.' },
      { status: 500 }
    );
  }
}
