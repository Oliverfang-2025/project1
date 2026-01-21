import { NextRequest } from 'next/server';
import { verifyLogin } from '@/lib/db';

interface AuthBody {
  username?: string;
}

/**
 * Verify admin authentication from multiple sources:
 * 1. Authorization header (Bearer token format)
 * 2. Cookie (admin_auth with username and expiresAt)
 * 3. Request body (for POST requests with username)
 *
 * For request body validation, the username must exist in database.
 */
export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  // Check Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '');
    if (token.length > 0) {
      // For token-based auth, verify it's a valid username
      const isValid = await verifyLogin(token, ''); // This won't match password but checks username exists
      return isValid;
    }
  }

  // Check cookie
  const adminAuth = request.cookies.get('admin_auth');
  if (adminAuth) {
    try {
      const auth = JSON.parse(adminAuth.value);
      if (auth.isLoggedIn && auth.expiresAt) {
        return new Date(auth.expiresAt) > new Date();
      }
    } catch {
      return false;
    }
  }

  // For POST requests, check if body contains valid username
  // Clone the request to read body without consuming it
  try {
    const clonedRequest = request.clone();
    const body: AuthBody = await clonedRequest.json().catch(() => ({}));
    if (body.username) {
      // Verify username exists in database
      // Since we don't have password here, we just check if user exists
      const { neon } = await import('@neondatabase/serverless');
      const sql = neon(process.env.DATABASE_URL!);
      const result = await sql`SELECT username FROM admins WHERE username = ${body.username} LIMIT 1`;
      return result.length > 0;
    }
  } catch {
    // If we can't parse body or verify, fall through to false
  }

  return false;
}

export function unauthorizedResponse() {
  return { error: '未授权访问', code: 'UNAUTHORIZED' };
}
