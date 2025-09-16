import { NextRequest } from "next/server";
import { registerSchema } from "@/validations/auth/register";
import { RegisterUser } from "@/services/auth/register/RegisterUser";
import { ApiResponseHandler } from "@/utils/help/apiResponses";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt/jwtUtils";

export async function POST(request: NextRequest) {
  try {
    // Handle FormData instead of JSON
    const formData = await request.formData();
    
    // Convert FormData to structured object
    const body: any = {};
    
    // Process user data
    const userData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('user[') && key.endsWith(']')) {
        const fieldName = key.slice(5, -1); // Remove 'user[' and ']' (5 chars)
        userData[fieldName] = value;
      }
    }
    body.user = userData;
    
    // Process business data
    const businessData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('business[') && key.endsWith(']')) {
        const fieldName = key.slice(9, -1); // Remove 'business[' and ']' (9 chars)
        businessData[fieldName] = value;
      }
    }
    body.business = businessData;
    
    // Process address data
    const addressData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('address[') && key.endsWith(']')) {
        const fieldName = key.slice(8, -1); // Remove 'address[' and ']' (8 chars)
        addressData[fieldName] = value;
      }
    }
    body.address = addressData;
    
    // Process subscription data
    const subscriptionData: any = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('subscription[') && key.endsWith(']')) {
        const fieldName = key.slice(13, -1); // Remove 'subscription[' and ']' (13 chars)
        subscriptionData[fieldName] = value;
      }
    }
    body.subscription = subscriptionData;

    // Log the parsed data for debugging

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
      plan: result.newUser.get('plan') as string,
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


