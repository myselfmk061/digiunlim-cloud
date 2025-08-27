// src/app/api/auth/status/route.ts
import 'dotenv/config';
import { NextResponse, type NextRequest } from 'next/server';
import { kv } from '@vercel/kv';

type AuthTokenData = {
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  phoneNumber: string;
  createdAt: number;
  expiresAt: number;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
    }

    const key = `auth:${token}`;
    const tokenData = await kv.get<AuthTokenData>(key);

    if (!tokenData) {
      return NextResponse.json({ status: 'EXPIRED', error: 'Invalid or expired token.' }, { status: 404 });
    }
    
    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ status: 'EXPIRED', error: 'Token has expired.' }, { status: 410 });
    }

    // If verified, return the phone number as well
    if (tokenData.status === 'VERIFIED') {
        return NextResponse.json({ status: 'VERIFIED', phoneNumber: tokenData.phoneNumber });
    }

    // Otherwise, just return the pending status
    return NextResponse.json({ status: tokenData.status });

  } catch (error) {
    console.error('Error in /api/auth/status:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}
