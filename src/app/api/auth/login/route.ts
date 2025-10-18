
import { NextResponse } from 'next/server';

// This is a simplified, insecure login for demonstration purposes.
// In a real application, use a proper authentication library like NextAuth.js
// and store hashed passwords in a database.
const DEMO_PASSWORD = process.env.LOGIN_PASSWORD || 'digiunlim';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (password === DEMO_PASSWORD) {
      // In a real app, you would generate a JWT or session token here.
      // For this simplified version, we'll just return success.
      return NextResponse.json({ success: true, message: 'Login successful' });
    } else {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
