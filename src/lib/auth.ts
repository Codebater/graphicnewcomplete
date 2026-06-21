import { SignJWT, jwtVerify } from 'jose';

export const SESSION_COOKIE = 'session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error('Missing AUTH_SECRET');
  return new TextEncoder().encode(s);
}

export async function createSessionToken(email: string): Promise<string> {
  return await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret());
}

// Verify a session token. Returns the admin identity or null. Works in both
// the Node.js (route handlers) and Edge (middleware) runtimes.
export async function verifySessionToken(
  token: string | undefined | null
): Promise<{ email: string } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role === 'admin' && typeof payload.email === 'string') {
      return { email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}
