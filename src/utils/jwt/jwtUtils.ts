import jwt from 'jsonwebtoken';

// JWT configuration
const JWT_CONFIG = {
  ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key',
  REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  ACCESS_TOKEN_EXPIRES_IN: '1d' as const, // 1 day
  REFRESH_TOKEN_EXPIRES_IN: '7d' as const, // 7 days
};

// Token payload interface
export interface TokenPayload {
  userId: number;
  email: string;
  tokenType?: 'access';
}

// Refresh token payload interface (only userId)
export interface RefreshTokenPayload {
  userId: number;
  tokenType?: 'refresh';
}

// Token response interface
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

// Generate access token
export function generateAccessToken(payload: TokenPayload): string {
  const payloadWithType: TokenPayload = {
    ...payload,
    tokenType: 'access',
  };
  return jwt.sign(payloadWithType, JWT_CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN,
  });
}

// Generate refresh token
export function generateRefreshToken(payload: RefreshTokenPayload): string {
  const payloadWithType: RefreshTokenPayload = {
    ...payload,
    tokenType: 'refresh',
  };
  return jwt.sign(payloadWithType, JWT_CONFIG.REFRESH_TOKEN_SECRET, {
    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN,
  });
}

// Generate both tokens
export function generateTokens(payload: TokenPayload): TokenResponse {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: payload.userId });
  
  // Calculate expiration time in seconds
  const expiresIn = 24 * 60 * 60; // 24 hours in seconds
  
  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

// Verify access token
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.ACCESS_TOKEN_SECRET) as TokenPayload;
    if ((decoded as any)?.tokenType && (decoded as any).tokenType !== 'access') {
      throw new Error('Provided a refrsh token');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.REFRESH_TOKEN_SECRET) as RefreshTokenPayload & { tokenType?: string };
    if (decoded?.tokenType && decoded.tokenType !== 'refresh') {
      throw new Error('Provided token is not a refresh token');
    }
    return decoded as RefreshTokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7); // Remove 'Bearer ' prefix
}

// Decode token without verification (for debugging/logging only)
export function decodeToken(token: string): any {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
}
