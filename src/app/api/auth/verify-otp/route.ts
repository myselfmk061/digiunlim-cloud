
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function POST(request: Request) {
  try {
    const { token, otp } = await request.json();

    if (!token || !otp) {
      return NextResponse.json({ error: 'Token and OTP are required.' }, { status: 400 });
    }

    const key = `login-token:${token}`;
    const tokenDataString = await redis.get<string>(key);

    if (!tokenDataString) {
      return NextResponse.json({ error: 'Verification link expired or invalid. Please try again.' }, { status: 400 });
    }

    const tokenData = JSON.parse(tokenDataString);

    if (tokenData.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

    // OTP is correct, update status to VERIFIED
    const updatedTokenData = { ...tokenData, status: 'VERIFIED' };
    const ttl = await redis.ttl(key);
    await redis.set(
      key,
      JSON.stringify(updatedTokenData),
      { ex: ttl > 0 ? ttl : 600 } // use remaining ttl or default to 10 mins
    );

    return NextResponse.json({ status: 'VERIFIED', phoneNumber: tokenData.phoneNumber });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Could not verify OTP' },
      { status: 500 }
    );
  }
}
