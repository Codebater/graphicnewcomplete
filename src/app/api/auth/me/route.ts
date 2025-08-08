import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');

    if (session?.value) {
      // In a real app, you'd validate the session token against a database
      // For now, just check if it exists and looks valid
      if (session.value.startsWith('session_')) {
        return NextResponse.json({
          success: true,
          authenticated: true,
          user: {
            email: 'admin@graphiq.art',
            name: 'Admin User'
          }
        });
      }
    }

    return NextResponse.json({
      success: true,
      authenticated: false,
      user: null
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { success: false, error: 'Auth check failed' },
      { status: 500 }
    );
  }
}
