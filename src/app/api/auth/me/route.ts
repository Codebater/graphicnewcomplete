import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);

    if (session) {
      return NextResponse.json({
        success: true,
        authenticated: true,
        user: { email: session.email, name: 'Admin' },
      });
    }

    return NextResponse.json({ success: true, authenticated: false, user: null });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ success: false, error: 'Auth check failed' }, { status: 500 });
  }
}
