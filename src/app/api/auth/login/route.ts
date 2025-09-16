import { NextRequest } from 'next/server';
import { ApiResponseHandler } from '@/utils/help/apiResponses';
import { loginAttempt } from '@/services/auth/login/login';
import { sucessfullLogin } from '@/services/auth/login/sucessfullLogin';
import { validateLogin } from '@/validations/auth/login';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt/jwtUtils';

type LoginBody = {
  email?: string;
  password?: string;
  ip?: string;
  userAgent?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as LoginBody;

    const { email, password, ip, userAgent } = body;
    if (!email || !password || !userAgent || !ip) {
      return ApiResponseHandler.validationError([
        !email ? 'email is required' : '',
        !password ? 'password is required' : '',
        !userAgent ? 'userAgent is required' : '',
        !ip ? 'ip is required' : '',
      ].filter(Boolean) as string[]);
    }

    const rawForValidation = {
      email,
      password,
      ip,
      userAgent: userAgent || req.headers.get('user-agent') || undefined,
    };
    const { errors, value } = validateLogin(rawForValidation);
    if (errors.length || !value) {
      return ApiResponseHandler.validationError(errors);
    }

    const loginResult = await loginAttempt(value.email, value.password);
    
    if (!loginResult.success) {
      return ApiResponseHandler.badRequest(loginResult.error);
    }

    // Handle successful login attempt
    const successfulLoginResult = await sucessfullLogin(
      loginResult.user.id,
      value.email,
      null, // reasonFailed is null for successful login
      value.ip,
      value.userAgent
    );

    // Check if there were any issues with saving the attempt or sending email
    if (!successfulLoginResult.success) {
      console.error('Login attempt tracking failed:', successfulLoginResult.errors);
      // Continue with login even if tracking fails, but log the issue
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: loginResult.user.id,
      email: loginResult.user.email,
      plan: loginResult.user.plan,
    });

    const refreshToken = generateRefreshToken({
      userId: loginResult.user.id
    });

    // Build response and set cookies
    const response = ApiResponseHandler.success(
      {
        success: true,
        message: 'Login successful'
      },
      'Login successful'
    );

    const isProd = process.env.NODE_ENV === 'production';

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 1 day in seconds
    });

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error: any) {
    return ApiResponseHandler.internalError(error?.message || 'Failed to handle login');
  }
}


