import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "../../../_lib/auth";
import { BuinessUsers } from "../../../../../models/associationt.ts/association";
import { ApiResponseHandler } from "../../../../../utils/help/apiResponses";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authPayload = await requireAuth(request);
    if (authPayload instanceof NextResponse) return authPayload;

    // Get businessId from query parameters
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get("businessId");

    if (!businessId) {
      return ApiResponseHandler.badRequest("Business ID is required", "missing_business_id");
    }

    const businessIdNum = parseInt(businessId);
    if (isNaN(businessIdNum)) {
      return ApiResponseHandler.badRequest("Invalid business ID format", "invalid_business_id");
    }

    // Check if user has access to this specific business
    const businessAssociation = await BuinessUsers().findOne({
      where: { 
        userId: authPayload.userId,
        businessId: businessIdNum,
        isBanned: false // Only allow non-banned associations
      },
      attributes: ["id", "role", "isOnline", "isBanned", "joinedAt", "lastActiveAt"]
    });

    if (!businessAssociation) {
      return ApiResponseHandler.error(
        "Access denied: You do not have permission to access this business",
        "business_access_denied",
        undefined,
        403
      );
    }

    // User has access to this business
    const associationData = {
      associationId: businessAssociation.get("id"),
      role: businessAssociation.get("role"),
      isOnline: businessAssociation.get("isOnline"),
      isBanned: businessAssociation.get("isBanned"),
      joinedAt: businessAssociation.get("joinedAt"),
      lastActiveAt: businessAssociation.get("lastActiveAt"),
      hasAccess: true
    };

    return ApiResponseHandler.success(
      associationData,
      "Business access validated successfully"
    );

  } catch (error) {
    console.error("/api/auth/BuinessUsers/validateAccess error:", error);
    
    if (error instanceof Error) {
      return ApiResponseHandler.error(
        error.message,
        "business_access_validation_error",
        undefined,
        500
      );
    }
    
    return ApiResponseHandler.internalError("Failed to validate business access");
  }
}
