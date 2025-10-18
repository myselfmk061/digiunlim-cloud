import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { username, email, phone, password } = await request.json();
    
    console.log('📝 Registration attempt:', { username, email, phone });

    // Validate input
    if (!username || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await redis.get(`user:email:${email}`);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Hash password (simple hash for demo)
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Create user
    const userId = crypto.randomUUID();
    const userData = {
      id: userId,
      username,
      email,
      phone,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    // Store user data
    await redis.set(`user:${userId}`, JSON.stringify(userData));
    await redis.set(`user:email:${email}`, userId);
    await redis.set(`user:username:${username}`, userId);
    await redis.set(`user:phone:${phone}`, userId);
    
    console.log('✅ User registered successfully:', userId);

    return NextResponse.json({ 
      success: true,
      message: 'Registration successful',
      userId: userId
    });
  } catch (error) {
    console.error('❌ Registration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    return NextResponse.json({ 
      error: 'Registration failed',
      details: errorMessage 
    }, { status: 500 });
  }
}