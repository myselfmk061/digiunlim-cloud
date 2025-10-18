import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    // Hash password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Find user by email, username, or phone
    let userId = await redis.get(`user:email:${identifier}`) as string;
    if (!userId) userId = await redis.get(`user:username:${identifier}`) as string;
    if (!userId) userId = await redis.get(`user:phone:${identifier}`) as string;

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user data
    const userData = await redis.get(`user:${userId}`);
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = JSON.parse(userData as string);

    // Verify password
    if (user.password !== hashedPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate token
    const token = crypto.randomUUID();
    await redis.set(`session:${token}`, userId, { ex: 86400 }); // 24 hours

    return NextResponse.json({
      success: true,
      token,
      email: user.email,
      phone: user.phone,
      username: user.username,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}