import { NextRequest, NextResponse } from 'next/server';
import { getDownloadInfo, generateSecureDownloadUrl, verifyFileExists } from '../../../utils/download/backblaze';
import { User } from '../../../models/associationt.ts/association';
import { verifyAccessToken } from '../../../utils/jwt/jwtUtils';

// Force this route to be server-side only
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_FILE = 'WX240PACKHFSQLCS.exe';

export async function GET(request: NextRequest) {
  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      }, { status: 401 });
    }

    // Verify access token
    let userId: number;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.userId;
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }, { status: 401 });
    }

    // Verify user exists and has paid plan
    const user = await User().findByPk(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    // Check if user has paid plan
    if (user.get('plan') === 'free') {
      return NextResponse.json({
        success: false,
        error: 'Paid plan required for download',
        code: 'PAID_PLAN_REQUIRED'
      }, { status: 403 });
    }

    // Verify file exists
    const fileExists = await verifyFileExists(ALLOWED_FILE);
    if (!fileExists) {
      return NextResponse.json({
        success: false,
        error: 'File not found',
        code: 'FILE_NOT_FOUND'
      }, { status: 404 });
    }

    // Get file information
    const fileInfo = await getDownloadInfo(ALLOWED_FILE);
    if (!fileInfo) {
      return NextResponse.json({
        success: false,
        error: 'Unable to retrieve file information',
        code: 'FILE_INFO_ERROR'
      }, { status: 500 });
    }

    // Generate secure download URL
    const downloadUrl = await generateSecureDownloadUrl(ALLOWED_FILE);

    // Log download attempt
    console.log(`[DOWNLOAD] User ${userId} (${user.get('email')}) requested download of ${ALLOWED_FILE}`);

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileInfo: {
        fileName: fileInfo.fileName,
        fileSize: fileInfo.fileSize,
        expiresAt: fileInfo.expiresAt,
      },
      message: 'Download URL generated successfully'
    });

  } catch (error: any) {
    console.error('[DOWNLOAD] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: error?.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileName } = body;

    // Validate file name
    if (!fileName || fileName !== ALLOWED_FILE) {
      return NextResponse.json({
        success: false,
        error: 'Invalid file name',
        code: 'INVALID_FILE_NAME'
      }, { status: 400 });
    }

    // Get access token from cookies
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED'
      }, { status: 401 });
    }

    // Verify access token
    let userId: number;
    try {
      const payload = verifyAccessToken(accessToken);
      userId = payload.userId;
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }, { status: 401 });
    }

    // Verify user exists and has paid plan
    const user = await User().findByPk(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      }, { status: 404 });
    }

    // Check if user has paid plan
    if (user.get('plan') === 'free') {
      return NextResponse.json({
        success: false,
        error: 'Paid plan required for download',
        code: 'PAID_PLAN_REQUIRED'
      }, { status: 403 });
    }

    // Verify file exists
    const fileExists = await verifyFileExists(fileName);
    if (!fileExists) {
      return NextResponse.json({
        success: false,
        error: 'File not found',
        code: 'FILE_NOT_FOUND'
      }, { status: 404 });
    }

    // Get file information
    const fileInfo = await getDownloadInfo(fileName);
    if (!fileInfo) {
      return NextResponse.json({
        success: false,
        error: 'Unable to retrieve file information',
        code: 'FILE_INFO_ERROR'
      }, { status: 500 });
    }

    // Generate secure download URL
    const downloadUrl = await generateSecureDownloadUrl(fileName);

    // Log download attempt
    console.log(`[DOWNLOAD] User ${userId} (${user.get('email')}) requested download of ${fileName}`);

    return NextResponse.json({
      success: true,
      downloadUrl,
      fileInfo: {
        fileName: fileInfo.fileName,
        fileSize: fileInfo.fileSize,
        expiresAt: fileInfo.expiresAt,
      },
      message: 'Download URL generated successfully'
    });

  } catch (error: any) {
    console.error('[DOWNLOAD] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      message: error?.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}




