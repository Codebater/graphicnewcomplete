import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Simple hardcoded authentication - you can replace with real auth later
    const validCredentials = {
      email: 'admin@graphiq.art',
      password: 'admin123'
    };

    if (email === validCredentials.email && password === validCredentials.password) {
      // Create a session token (in production, use proper JWT or session management)
      const sessionToken = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      
      // Set session cookie
      const cookieStore = await cookies();
      cookieStore.set('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          email: email,
          name: 'Admin User'
        }
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
