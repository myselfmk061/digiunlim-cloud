
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';

// Upstash Redis client को Initialize करें
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});



function generateOtp() {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const { countryCode, phoneNumber: rawPhoneNumber } = await request.json();
    
    if (!rawPhoneNumber || !countryCode) {
      return NextResponse.json({ error: 'Phone number and country code required' }, { status: 400 });
    }

    const phoneNumber = `${countryCode}${rawPhoneNumber.replace(/\D/g, '')}`;
    const loginToken = crypto.randomUUID();
    const otp = generateOtp();
    
    // Store in Redis
    const tokenData = {
      status: 'PENDING',
      phoneNumber: phoneNumber,
      otp: otp,
      createdAt: new Date().toISOString()
    };
    
    await redis.set(
      `login-token:${loginToken}`,
      JSON.stringify(tokenData),
      { ex: 600 }
    );
    
    return NextResponse.json({ 
      token: loginToken, 
      phoneNumber: phoneNumber
    });

  } catch (error) {
    console.error('❌ Error in login process:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Simple error for testing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
