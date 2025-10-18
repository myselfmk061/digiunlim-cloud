import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { username, email, phone, password } = await request.json();

    if (!username || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const userId = crypto.randomUUID();

    return NextResponse.json({ 
      success: true,
      message: 'Registration successful',
      user: {
        id: userId,
        username,
        email,
        phone,
        password: hashedPassword
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}