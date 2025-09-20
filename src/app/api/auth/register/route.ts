import { NextRequest } from "next/server";
import { registerSchema } from "@/validations/auth/register";
import { RegisterUser } from "@/services/auth/register/RegisterUser";
import { ApiResponseHandler } from "@/utils/help/apiResponses";
import { requireAuth } from "@/app/api/_lib/auth";
import { User } from "@/models/associationt.ts/association";

export async function POST(request: NextRequest) {
  try {
    // Require authentication via cookies
    const authPayload = await requireAuth(request);
    if (authPayload instanceof Response) return authPayload;

    // Reject overly large requests early (basic guard, complement with server limits)
    const contentLength = request.headers.get('content-length');
    const maxBytes = 10 * 1024 * 1024; // 10MB
    if (contentLength && Number(contentLength) > maxBytes) {
      return ApiResponseHandler.badRequest('Request body too large', 'payload_too_large');
    }

    // Handle FormData instead of JSON
    const formData = await request.formData();
    
    // Convert FormData to structured object
    const body: any = {};
    
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
    

    // Validate payload using Zod schema
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );
      return ApiResponseHandler.validationError(errors);
    }

    const payload = validationResult.data;

    // Fetch current plan from DB to avoid trusting stale token claims
    const dbUser = await User().findByPk(authPayload.userId, { attributes: ['id', 'plan'] });
    if (!dbUser) {
      return ApiResponseHandler.badRequest('User not found', 'user_not_found');
    }

    // Create business and address for the authenticated user with plan enforcement
    await RegisterUser(payload, authPayload.userId, dbUser.get('plan') as string);

    // Return success without generating tokens or setting cookies
    return ApiResponseHandler.created(
      {},
      "Business registered successfully"
    );

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/register error:", error);

    if (error instanceof Error) {
      // Handle specific error types

      if (error.message.includes("PLAN_FORBIDDEN")) {
        return ApiResponseHandler.error(
          error.message.split(':').slice(1).join(':').trim() || "Your plan does not allow creating a business",
          "plan_forbidden",
          undefined,
          403
        );
      }

      if (error.message.includes("PLAN_NOT_SUPPORTED")) {
        return ApiResponseHandler.badRequest(
          "Cannot create business for custom plan for now",
          "plan_not_supported"
        );
      }

      if (error.message.includes("BUSINESS_LIMIT_REACHED")) {
        return ApiResponseHandler.error(
          "You have reached the business limit for your plan",
          "business_limit_reached",
          undefined,
          403
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


