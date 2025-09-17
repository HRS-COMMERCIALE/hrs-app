import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken, verifyRefreshToken } from '../../../../utils/jwt/jwtUtils';
import { refreshAccessTokenService } from '../refreshAccessToken/refreshTokenService';
import { generateAccessToken } from '../../../../utils/jwt/jwtUtils';
import { User, Business } from '../../../../models/associationt.ts/association';

// Force this route to be server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Get both tokens from cookies
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    // Require refresh token to recover if access token is missing/invalid
    if (!refreshToken) {
      return NextResponse.json({
        authenticated: false,
        message: 'Missing authentication tokens',
        code: 'MISSING_TOKENS'
      }, { status: 401 });
    }
    // If access token exists and is valid, return authenticated
    if (accessToken) {
      try {
        const accessPayload = verifyAccessToken(accessToken);
        const user = await User.findByPk(accessPayload.userId);
        if (!user) {
          return NextResponse.json({
            authenticated: false,
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }, { status: 401 });
        }
        const business = await Business.findOne({
          where: { userId: user.get("id") }
        });
        return NextResponse.json({
          authenticated: true,
          message: 'User is authenticated',
          code: 'AUTHENTICATED',
          user: {
            id: user.get("id") as number,
            email: user.get("email") as string,
            plan: user.get("plan") as string,
            planValidUntil: user.get("planValidUntil") as string | null,
            firstName: user.get("firstName") as string,
            lastName: user.get("lastName") as string,
            title: user.get("title") as string,
            status: user.get("status") as string,
            mobile: user.get("mobile") as string,
            emailVerified: user.get("emailVerified") as boolean,
          },
          business: business ? {
            id: business.get("id") as number,
            businessName: business.get("businessName") as string,
            logoFile: business.get("logoFile") as string | null,
            currency: business.get("currency") as string,
            industry: business.get("industry") as string,
            size: business.get("size") as string,
          } : null
        }, { status: 200 });
      } catch (accessError) {
        // Fall through to refresh flow if access token invalid/expired
      }
    }

    // Refresh flow when access token is missing or invalid
    try {
      const refreshPayload = verifyRefreshToken(refreshToken);
      const refreshResult = await refreshAccessTokenService(cookieStore);

      if (refreshResult.success) {
        const user = await User.findByPk(refreshPayload.userId);
        if (!user) {
          return NextResponse.json({
            authenticated: false,
            message: 'User not found during token refresh',
            code: 'USER_NOT_FOUND'
          }, { status: 401 });
        }

        const business = await Business.findOne({
          where: { userId: user.get("id") }
        });

        const newAccessToken = generateAccessToken({
          userId: user.get("id") as number,
          email: user.get("email") as string,
          plan: user.get("plan") as string,
        });

        const response = NextResponse.json({
          authenticated: true,
          message: 'User is authenticated (tokens refreshed)',
          code: 'AUTHENTICATED_REFRESHED',
          user: {
            id: user.get("id") as number,
            email: user.get("email") as string,
            plan: user.get("plan") as string,
            firstName: user.get("firstName") as string,
            lastName: user.get("lastName") as string,
            title: user.get("title") as string,
            status: user.get("status") as string,
            mobile: user.get("mobile") as string,
            emailVerified: user.get("emailVerified") as boolean,
          },
          business: business ? {
            id: business.get("id") as number,
            businessName: business.get("businessName") as string,
            logoFile: business.get("logoFile") as string | null,
            currency: business.get("currency") as string,
            industry: business.get("industry") as string,
            size: business.get("size") as string,
          } : null
        }, { status: 200 });

        const isProd = process.env.NODE_ENV === "production";
        response.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: "strict",
          path: "/",
          maxAge: 24 * 60 * 60, // 1 day
        });

        return response;
      } else {
        return NextResponse.json({
          authenticated: false,
          message: 'Access token invalid and failed to refresh',
          code: 'REFRESH_FAILED',
          error: refreshResult.error
        }, { status: 401 });
      }
    } catch (refreshError) {
      return NextResponse.json({
        authenticated: false,
        message: 'Both tokens are invalid or expired',
        code: 'BOTH_TOKENS_INVALID'
      }, { status: 401 });
    }
    
  } catch (error: any) {
    return NextResponse.json({
      authenticated: false,
      message: 'Authentication check failed',
      code: 'AUTH_CHECK_ERROR',
      error: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}
