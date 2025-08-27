import { NextRequest } from "next/server";
import { registerSchema } from "@/validations/auth/register";
import { RegisterUser } from "@/services/auth/register/RegisterUser";
import { ApiResponseHandler } from "@/utils/help/apiResponses";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt/jwtUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate payload using Zod schema
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return ApiResponseHandler.validationError(errors);
    }

    const payload = validationResult.data;

    // Create user
    const result = await RegisterUser(payload);

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: result.newUser.get('id') as number,
      email: result.newUser.get('email') as string,
      roleId: result.role.id,
      roleName: result.role.name
    });

    const refreshToken = generateRefreshToken({
      userId: result.newUser.get('id') as number
    });

    // Build response and set cookies
    const response = ApiResponseHandler.created(
      {},
      "User registered successfully with manager role, business, and address"
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

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/register error:", error);

    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes("Password is too weak")) {
        return ApiResponseHandler.badRequest(
          "Password validation failed",
          "password_strength"
        );
      }

      if (error.message.includes("Email already exists")) {
        return ApiResponseHandler.conflict(
          "Email already exists",
          "email_exists"
        );
      }

      if (error.message.includes("Mobile number already exists")) {
        return ApiResponseHandler.conflict(
          "Mobile number already exists",
          "mobile_exists"
        );
      }

      if (error.message.includes("Business name already exists")) {
        return ApiResponseHandler.conflict(
          "Business name already exists",
          "business_name_exists"
        );
      }

      if (error.message.includes("Tax ID already exists")) {
        return ApiResponseHandler.conflict(
          "Tax ID already exists",
          "tax_id_exists"
        );
      }

      if (error.message.includes("CNSS code already exists")) {
        return ApiResponseHandler.conflict(
          "CNSS code already exists",
          "cnss_code_exists"
        );
      }

      if (error.message.includes("Failed to assign role")) {
        return ApiResponseHandler.internalError(
          "Failed to assign user role"
        );
      }

      if (error.message.includes("Failed to create business")) {
        return ApiResponseHandler.internalError(
          "Failed to create business"
        );
      }

      if (error.message.includes("Failed to create address")) {
        return ApiResponseHandler.internalError(
          "Failed to create address"
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
    return ApiResponseHandler.internalError("Failed to register user");
  }
}


