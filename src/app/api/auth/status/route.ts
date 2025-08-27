import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

// Upstash Redis client को Initialize करें
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const tokenData = await redis.get(`login-token:${token}`);
    
    if (!tokenData) {
      return NextResponse.json({ status: 'EXPIRED' });
    }

    // Data को parse करें
    const parsedData = JSON.parse(tokenData as string);
    return NextResponse.json({ status: parsedData.status });

  } catch (error) {
    console.error('Error checking token status:', error);
    return NextResponse.json(
      { error: 'Could not check token status' },
      { status: 500 }
    );
  }
}