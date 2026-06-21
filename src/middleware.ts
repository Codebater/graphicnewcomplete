import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, SESSION_COOKIE } from '@/lib/auth';

// Admin-only API areas. Public GETs (project lists/details) stay open; only
// mutating requests require a valid admin session. Visitor-facing endpoints
// (consultation checkout, stripe webhook) are intentionally not listed.
const PROTECTED_API_PREFIXES = ['/api/projects', '/api/upload'];
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;

  // Protect the admin dashboard pages.
  if (pathname.startsWith('/dashboard')) {
    const session = await verifySessionToken(token);
    if (!session) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect mutating admin API requests.
  if (
    MUTATING_METHODS.has(req.method) &&
    PROTECTED_API_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'))
  ) {
    const session = await verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/projects',
    '/api/projects/:path*',
    '/api/upload',
    '/api/upload/:path*',
  ],
};
