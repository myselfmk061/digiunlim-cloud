import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json({ error: 'Credentials required' }, { status: 400 });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const user = await sql`
      SELECT id, username, email, phone, created_at 
      FROM users 
      WHERE (email = ${identifier} OR username = ${identifier} OR phone = ${identifier}) 
      AND password = ${hashedPassword}
    `;

    if (user.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      token: crypto.randomUUID(),
      user: user[0]
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}