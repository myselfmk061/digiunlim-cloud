import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sql, initDB } from '@/lib/db';

export async function POST(request: Request) {
  try {
    await initDB();
    const { username, email, phone, password } = await request.json();

    if (!username || !email || !phone || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const existing = await sql`SELECT * FROM users WHERE email = ${email} OR username = ${username} OR phone = ${phone}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const result = await sql`
      INSERT INTO users (username, email, phone, password)
      VALUES (${username}, ${email}, ${phone}, ${hashedPassword})
      RETURNING id, username, email, phone, created_at
    `;

    return NextResponse.json({ success: true, user: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}