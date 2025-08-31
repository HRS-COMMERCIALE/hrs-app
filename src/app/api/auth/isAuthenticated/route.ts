import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAccessToken, verifyRefreshToken, isTokenExpired } from '../../../../utils/jwt/jwtUtils';
import { refreshAccessTokenService } from '../refreshAccessToken/refreshTokenService';
import { generateAccessToken } from '../../../../utils/jwt/jwtUtils';
import { User, Business } from '../../../../models/associationt.ts/association';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    
    // Get both tokens from cookies
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    // Check if both tokens exist
    if (!accessToken || !refreshToken) {
      return NextResponse.json({
        authenticated: false,
        message: 'Missing authentication tokens',
        code: 'MISSING_TOKENS'
      }, { status: 401 });
    }
    
    // Check if access token is expired
    if (isTokenExpired(accessToken)) {
      // If access token is expired, check if refresh token is valid
      try {
        const refreshPayload = verifyRefreshToken(refreshToken);
        
        // Refresh token is valid, but access token is expired
        // Try to refresh the access token automatically
        const refreshResult = await refreshAccessTokenService(cookieStore);
        
        if (refreshResult.success) {
          // Successfully refreshed access token
          // Get user data to generate new access token and get user info
          const user = await User.findByPk(refreshPayload.userId);
          if (!user) {
            return NextResponse.json({
              authenticated: false,
              message: 'User not found during token refresh',
              code: 'USER_NOT_FOUND'
            }, { status: 401 });
          }
          
          // Get business data including logo
          const business = await Business.findOne({
            where: { userId: user.get("id") }
          });
          
          // Generate new access token
          const newAccessToken = generateAccessToken({
            userId: user.get("id") as number,
            email: user.get("email") as string,
            role: user.get("role") as string,
          });
          
          // Create response with new access token cookie
          const response = NextResponse.json({
            authenticated: true,
            message: 'User is authenticated (tokens refreshed)',
            code: 'AUTHENTICATED_REFRESHED',
            user: {
              id: user.get("id") as number,
              email: user.get("email") as string,
              role: user.get("role") as string,
              firstName: user.get("firstName") as string,
              lastName: user.get("lastName") as string,
              title: user.get("title") as string,
              status: user.get("status") as string,
              mobile: user.get("mobile") as string,
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
          
          // Set the new access token cookie
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
          // Failed to refresh access token
          return NextResponse.json({
            authenticated: false,
            message: 'Access token expired and failed to refresh',
            code: 'REFRESH_FAILED',
            error: refreshResult.error
          }, { status: 401 });
        }
        
      } catch (refreshError) {
        // Both tokens are invalid or expired
        return NextResponse.json({
          authenticated: false,
          message: 'Both tokens are invalid or expired',
          code: 'BOTH_TOKENS_INVALID'
        }, { status: 401 });
      }
    }
    
    // Verify access token
    try {
      const accessPayload = verifyAccessToken(accessToken);
      
      // Get full user data from database
      const user = await User.findByPk(accessPayload.userId);
      if (!user) {
        return NextResponse.json({
          authenticated: false,
          message: 'User not found',
          code: 'USER_NOT_FOUND'
        }, { status: 401 });
      }
      
      // Get business data including logo
      const business = await Business.findOne({
        where: { userId: user.get("id") }
      });
      
      // Both tokens are valid
      return NextResponse.json({
        authenticated: true,
        message: 'User is authenticated',
        code: 'AUTHENTICATED',
        user: {
          id: user.get("id") as number,
          email: user.get("email") as string,
          role: user.get("role") as string,
          firstName: user.get("firstName") as string,
          lastName: user.get("lastName") as string,
          title: user.get("title") as string,
          status: user.get("status") as string,
          mobile: user.get("mobile") as string,
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
      // Access token is invalid
      return NextResponse.json({
        authenticated: false,
        message: 'Invalid access token',
        code: 'INVALID_ACCESS_TOKEN'
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
