import { NextRequest } from "next/server";
import { ApiResponseHandler } from "@/utils/help/apiResponses";
import { cookies } from "next/headers";
import { refreshAccessTokenService } from "./refreshTokenService";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const result = await refreshAccessTokenService(cookieStore);
    
    if (result.success && result.response) {
      return result.response;
    }
    
    // Handle error cases
    switch (result.errorCode) {
      case "missing_refresh_token":
        return ApiResponseHandler.badRequest(result.error!, result.errorCode!);
      case "invalid_token_type":
        return ApiResponseHandler.badRequest(result.error!, result.errorCode!);
      case "invalid_refresh_payload":
        return ApiResponseHandler.badRequest(result.error!, result.errorCode!);
      case "user_not_found":
        return ApiResponseHandler.badRequest(result.error!, result.errorCode!);
      case "invalid_refresh_token":
        return ApiResponseHandler.badRequest(result.error!, result.errorCode!);
      case "access_token_not_allowed":
        return ApiResponseHandler.badRequest(result.error!, result.errorCode!);
      default:
        return ApiResponseHandler.internalError("Failed to refresh access token");
    }
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("/api/auth/refreshAccessToken error:", error);
    return ApiResponseHandler.internalError("Failed to refresh access token");
  }
}


