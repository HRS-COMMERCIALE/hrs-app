import { NextRequest, NextResponse } from 'next/server';
import { getAuthPayload } from '../../_lib/auth';
import { setKey } from '../../../../libs/Redis';
import { sendVerificationEmail } from '../../../../utils/email/emailConfirmationEmail';
import { User } from '../../../../models/associationt.ts/association';

/**
 * Generate a random 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * POST /api/auth/send-verification
 * Sends a verification code to the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the user using cookies or Authorization header
    const authResult = await getAuthPayload(request);
    
    if (!authResult.ok) {
      return authResult.response;
    }

    const { userId, email } = authResult.payload;

    // Get user details from database
    const user = await User.findByPk(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        message: 'User not found in database'
      }, { status: 404 });
    }

    // Check if user's email is already verified
    const isEmailVerified = user.get('emailVerified');
    if (isEmailVerified) {
      return NextResponse.json({
        success: false,
        error: 'Email already verified',
        message: 'Your email is already verified. No need to send verification code.',
        data: {
          userId,
          emailVerified: true
        }
      }, { status: 400 });
    }

    // Generate a 6-digit verification code
    const verificationCode = generateVerificationCode();

    // Store the code in Redis with 10 minutes expiration
    // Key format: verification:userId
    const redisKey = `verification:${userId}`;
    await setKey(redisKey, verificationCode, 600); // 600 seconds = 10 minutes

    // Send verification email
    const userName = `${user.get('firstName')} ${user.get('lastName')}`.trim();
    const emailSent = await sendVerificationEmail({
      email,
      verificationCode,
      userName: userName || undefined
    });

    if (!emailSent) {
      // If email fails, we should still return success but log the issue
      console.error(`Failed to send verification email to user ${userId} at ${email}`);
      
      return NextResponse.json({
        success: true,
        message: 'Verification code generated and stored, but email delivery failed',
        data: {
          userId,
          expiresIn: 600, // 10 minutes in seconds
          emailDeliveryFailed: true
        }
      }, { status: 200 });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully',
      data: {
        userId,
        expiresIn: 600, // 10 minutes in seconds
        emailSent: true
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error in send-verification API:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to send verification code',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
