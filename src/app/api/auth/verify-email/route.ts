import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../_lib/auth';
import { getKey, deleteKey } from '../../../../libs/Redis';
import { User } from '../../../../models/associationt.ts/association';

/**
 * POST /api/auth/verify-email
 * Verifies the user's email using a 6-digit code from Redis
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user using cookies or Authorization header
    const authResult = await getAuthPayload(request);
    
    if (!authResult.ok) {
      return authResult.response;
    }

    const { userId } = authResult.payload;

    // Parse the request body to get the verification code
    const body = await request.json();
    const { verificationCode } = body;

    // Validate the verification code
    if (!verificationCode || typeof verificationCode !== 'string' || verificationCode.length !== 6) {
      return NextResponse.json({
        success: false,
        error: 'Invalid verification code',
        message: 'Please provide a valid 6-digit verification code'
      }, { status: 400 });
    }

    // Get user details from database
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        message: 'User not found in database'
      }, { status: 404 });
    }

    // Check if user is already verified
    const isAlreadyVerified = user.get('emailVerified') as boolean;
    if (isAlreadyVerified) {
      return NextResponse.json({
        success: false,
        error: 'Already verified',
        message: 'Your email is already verified'
      }, { status: 400 });
    }

    // Get the stored verification code from Redis
    const redisKey = `verification:${userId}`;
    const storedCode = await getKey<string>(redisKey);

    if (!storedCode) {
      return NextResponse.json({
        success: false,
        error: 'Code expired or not found',
        message: 'Verification code has expired or was not found. Please request a new code.'
      }, { status: 400 });
    }

    // Compare the provided code with the stored code
    // Convert both to strings to ensure proper comparison
    const providedCode = String(verificationCode);
    const redisCode = String(storedCode);
    
    
    if (providedCode !== redisCode) {
      return NextResponse.json({
        success: false,
        error: 'Invalid code',
        message: 'The verification code you provided is incorrect. Please try again.'
      }, { status: 400 });
    }

    // Update user's email verification status
    await user.update({
      emailVerified: true
    });

    // Delete the verification code from Redis (clean up)
    await deleteKey(redisKey);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully',
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in verify-email API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to verify email',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
