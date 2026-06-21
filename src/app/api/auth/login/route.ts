import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    // The bcrypt hash is stored base64-encoded so its `$` chars survive every
    // env loader (dotenv/Vercel) without expansion or quoting issues.
    const b64 = process.env.ADMIN_PASSWORD_HASH_B64;
    const adminHash = b64 ? Buffer.from(b64.trim(), 'base64').toString('utf8') : '';

    if (!adminEmail || !adminHash || !process.env.AUTH_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Admin authentication is not configured.' },
        { status: 500 }
      );
    }

    const emailOk =
      typeof email === 'string' && email.trim().toLowerCase() === adminEmail.toLowerCase();
    const passwordOk =
      emailOk && typeof password === 'string' && (await bcrypt.compare(password, adminHash));

    if (!emailOk || !passwordOk) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await createSessionToken(adminEmail);
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: { email: adminEmail, name: 'Admin' },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
