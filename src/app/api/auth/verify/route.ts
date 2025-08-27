// src/app/api/auth/verify/route.ts
import 'dotenv/config';
import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

type AuthTokenData = {
  status: 'PENDING' | 'VERIFIED' | 'EXPIRED';
  phoneNumber: string;
  createdAt: number;
  expiresAt: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: 'Verification token is required.' }, { status: 400 });
    }

    const key = `auth:${token}`;
    const tokenData = await kv.get<AuthTokenData>(key);

    if (!tokenData) {
      return NextResponse.json({ error: 'This verification link is invalid or has already been used.' }, { status: 404 });
    }

    if (tokenData.status === 'VERIFIED') {
      return NextResponse.json({ error: 'This link has already been used.' }, { status: 410 });
    }
    
    if (Date.now() > tokenData.expiresAt) {
      return NextResponse.json({ error: 'This verification link has expired. Please request a new one.' }, { status: 410 });
    }

    // Update the status to 'VERIFIED' and re-save it.
    // We can also reduce the expiry time significantly now that it's verified.
    await kv.set(
      key,
      { ...tokenData, status: 'VERIFIED' },
      { ex: 60 * 60 * 24 } // Keep record for 24 hours for auditing, then delete
    );

    return NextResponse.json({ 
      message: 'Verification successful!',
      phoneNumber: tokenData.phoneNumber,
    });

  } catch (error) {
    console.error('Error in /api/auth/verify:', error);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}