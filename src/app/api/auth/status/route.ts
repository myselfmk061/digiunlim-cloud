import { NextResponse, type NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ status: 'EXPIRED', error: 'No token provided.' }, { status: 400 });
  }

  const tokenDataString = await redis.get<string>(`login-token:${token}`);
  
  if (!tokenDataString) {
    return NextResponse.json({ status: 'EXPIRED', error: 'Token not found or expired.' });
  }

  try {
    const tokenData = JSON.parse(tokenDataString);
    return NextResponse.json(tokenData);
  } catch (error) {
     console.error("Failed to parse token data from Redis:", error);
     return NextResponse.json({ status: 'EXPIRED', error: 'Invalid token data.' }, { status: 500 });
  }
}
