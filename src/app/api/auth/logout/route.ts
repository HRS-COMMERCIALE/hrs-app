import { NextRequest, NextResponse } from 'next/server';
import { ApiResponseHandler } from '../../../../utils/help/apiResponses';

export async function POST(request: NextRequest) {
  try {
    // Build response
    const response = ApiResponseHandler.success(
      {
        success: true,
        message: 'Logout successful'
      },
      'Logout successful'
    );

    // Clear authentication cookies
    response.cookies.set('accessToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error: any) {
    return ApiResponseHandler.internalError(error?.message || 'Failed to logout');
  }
}
