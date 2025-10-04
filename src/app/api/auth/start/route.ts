
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Redis } from '@upstash/redis';

// Upstash Redis client को Initialize करें
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://helped-caiman-18817.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'AkmBAAIgcDIDbCxlSD38VKunHEfs6p4i9QW_6JHufFRarIh5b0VvgQ',
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
    
    // Check if it's a Redis connection error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    if (errorMessage.includes('Redis') || errorMessage.includes('ECONNREFUSED')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Login process failed',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
