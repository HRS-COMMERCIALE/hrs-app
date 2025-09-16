import { NextRequest, NextResponse } from 'next/server';
import { signUpValidationSchema } from '@/validations/auth/signUpValidation';
import { User } from '@/models/associationt.ts/association';
import { hashPassword } from '@/utils/bycript/password';
import { sequelize } from '@/libs/Db';
import { generateAccessToken, generateRefreshToken } from '@/utils/jwt/jwtUtils';
import { ApiResponseHandler } from '@/utils/help/apiResponses';

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate the request data
    const validationResult = signUpValidationSchema.safeParse(body);
    
    if (!validationResult.success) {
      const errorMessages = validationResult.error.issues.map((err: any) => {
        const field = err.path.join('.');
        let userFriendlyMessage = err.message;
        
        // Convert technical validation messages to user-friendly ones
        switch (field) {
          case 'firstName':
            if (err.message.includes('required')) userFriendlyMessage = 'First name is required';
            else if (err.message.includes('too_small')) userFriendlyMessage = 'First name must be at least 2 characters';
            break;
          case 'lastName':
            if (err.message.includes('required')) userFriendlyMessage = 'Last name is required';
            else if (err.message.includes('too_small')) userFriendlyMessage = 'Last name must be at least 2 characters';
            break;
          case 'email':
            if (err.message.includes('required')) userFriendlyMessage = 'Email address is required';
            else if (err.message.includes('invalid_string')) userFriendlyMessage = 'Please enter a valid email address';
            break;
          case 'mobile':
            if (err.message.includes('required')) userFriendlyMessage = 'Mobile number is required';
            else if (err.message.includes('invalid_string')) userFriendlyMessage = 'Please enter a valid mobile number';
            else if (err.message.includes('Mobile number must contain only digits')) userFriendlyMessage = 'Mobile number must contain only digits';
            break;
          case 'landline':
            if (err.message.includes('Landline must be a number')) userFriendlyMessage = 'Landline must contain only digits';
            break;
          case 'password':
            if (err.message.includes('required')) userFriendlyMessage = 'Password is required';
            else if (err.message.includes('too_small')) userFriendlyMessage = 'Password must be at least 8 characters long';
            break;
          case 'title':
            if (err.message.includes('required')) userFriendlyMessage = 'Please select a title';
            break;
        }
        
        return {
          field,
          message: userFriendlyMessage,
        };
      });
      
      return NextResponse.json(
        {
          success: false,
          message: 'Please fix the following errors:',
          errors: errorMessages,
        },
        { status: 400 }
      );
    }

    const { email, password, ...userData } = validationResult.data;

    // Normalize email (lowercase and trim)
    const normalizedEmail = email.toLowerCase().trim();

    // Use database transaction for secure operations
    const transaction = await sequelize.transaction();

    try {
      // Check if user already exists with normalized email
      const existingUser = await User.findOne({ 
        where: { email: normalizedEmail },
        transaction 
      });
      
      if (existingUser) {
        await transaction.rollback();
        return NextResponse.json(
          {
            success: false,
            message: 'An account with this email address already exists',
            errors: [{
              field: 'email',
              message: 'This email is already registered'
            }]
          },
          { status: 409 }
        );
      }

      // Hash the password using the utility function
      const hashedPassword = await hashPassword(password);

      // Create new user within transaction
      const newUser = await User.create({
        ...userData,
        email: normalizedEmail,
        password: hashedPassword,
        emailVerified: false,
        isBanned: false,
      }, { transaction });

      // Commit the transaction
      await transaction.commit();

      // Generate tokens
      const accessToken = generateAccessToken({
        userId: newUser.get('id') as number,
        email: newUser.get('email') as string,
        plan: newUser.get('plan') as string,
      });

      const refreshToken = generateRefreshToken({
        userId: newUser.get('id') as number
      });

      // Build response and set cookies
      const response = ApiResponseHandler.created(
        {},
        "User created successfully"
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

    } catch (transactionError) {
      // Rollback transaction on any error
      await transaction.rollback();
      throw transactionError;
    }

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("Email already exists")) {
        return ApiResponseHandler.conflict(
          "Email already exists",
          "email_exists"
        );
      }

      if (error.message.includes("is required") || error.message.includes("required")) {
        return ApiResponseHandler.badRequest(
          "Validation failed",
          "validation_error"
        );
      }
    }

    // Handle other errors
    return ApiResponseHandler.internalError("Failed to create user");
  }
}
