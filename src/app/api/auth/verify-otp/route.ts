import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { token, otp } = await request.json();
    
    if (!token || !otp) {
      return NextResponse.json({ error: 'Token and OTP are required' }, { status: 400 });
    }

    // Get token data from Redis
    const tokenKey = `login-token:${token}`;
    const tokenData = await redis.get(tokenKey);
    
    if (!tokenData) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const data = JSON.parse(tokenData as string);
    
    // Verify OTP
    if (data.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Mark as verified and clean up
    await redis.del(tokenKey);
    
    return NextResponse.json({ 
      success: true,
      phoneNumber: data.phoneNumber,
      message: 'OTP verified successfully'
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}