import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { extractTokenFromHeader, verifyAccessToken, TokenPayload, isTokenExpired } from '../../../utils/jwt/jwtUtils';

export type AuthResult = {
  ok: true;
  payload: TokenPayload;
} | {
  ok: false;
  response: NextResponse;
  errorType?: 'expired' | 'invalid' | 'missing';
};

export async function getAuthPayload(req: Request): Promise<AuthResult> {
  try {
    // 1) Try HTTP-only cookie first (more secure)
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('accessToken')?.value || cookieStore.get('token')?.value || null;

    // 2) Fallback to Authorization: Bearer <token>
    const authHeader = req.headers.get('authorization');
    const headerToken = extractTokenFromHeader(authHeader);

    const token = cookieToken || headerToken;
    if (!token) {
      return { 
        ok: false, 
        response: NextResponse.json({ error: 'Missing or invalid Authorization header' }, { status: 401 }),
        errorType: 'missing'
      };
    }

    // Check if token is expired before verification
    if (isTokenExpired(token)) {
      return { 
        ok: false, 
        response: NextResponse.json({ 
          error: 'Token expired', 
          message: 'Your session has expired. Please log in again.',
          code: 'TOKEN_EXPIRED'
        }, { status: 401 }),
        errorType: 'expired'
      };
    }

    const payload = verifyAccessToken(token);
    return { ok: true, payload };
  } catch (error: any) {
    return { 
      ok: false, 
      response: NextResponse.json({ 
        error: 'Unauthorized', 
        details: error?.message || 'Invalid token',
        code: 'INVALID_TOKEN'
      }, { status: 401 }),
      errorType: 'invalid'
    };
  }
}

export async function requireAuth(req: Request): Promise<TokenPayload | NextResponse> {
  const result = await getAuthPayload(req);
  if (!result.ok) return result.response;
  return result.payload;
}


