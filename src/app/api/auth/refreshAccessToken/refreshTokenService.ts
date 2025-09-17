import { ApiResponseHandler } from "@/utils/help/apiResponses";
import { generateAccessToken, verifyRefreshToken, verifyAccessToken } from "@/utils/jwt/jwtUtils";
import { User } from "@/models/associationt.ts/association";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export interface RefreshTokenResult {
  success: boolean;
  response?: Response;
  error?: string;
  errorCode?: string;
}

export async function refreshAccessTokenService(cookieStore: ReadonlyRequestCookies): Promise<RefreshTokenResult> {
  try {
    // Accept refresh token from cookie only
    const refreshToken = cookieStore.get("refreshToken")?.value || null;
    if (!refreshToken) {
      return {
        success: false,
        error: "Missing refresh token",
        errorCode: "missing_refresh_token"
      };
    }

    // Verify refresh token (expected to contain at least userId)
    const decoded = verifyRefreshToken(refreshToken) as { userId: number; tokenType?: string };
    if (!decoded || decoded.tokenType !== "refresh") {
      return {
        success: false,
        error: "Provided token must be a refresh token",
        errorCode: "invalid_token_type"
      };
    }
    
    const userId = decoded.userId;
    if (!userId) {
      return {
        success: false,
        error: "Invalid refresh token payload",
        errorCode: "invalid_refresh_payload"
      };
    }

    const user = await User().findByPk(userId);
    if (!user) {
      return {
        success: false,
        error: "User not found",
        errorCode: "user_not_found"
      };
    }

    const accessToken = generateAccessToken({
      userId: user.get("id") as number,
      email: user.get("email") as string,
      plan: user.get("plan") as string,
    });

    const response = ApiResponseHandler.success({}, "Access token refreshed");

    const isProd = process.env.NODE_ENV === "production";
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "strict",
      path: "/",
      maxAge: 24 * 60 * 60,
    });

    return {
      success: true,
      response
    };
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("refreshAccessTokenService error:", error);
    const message: string = error?.message || "Failed to refresh access token";

    if (message.includes("Invalid or expired refresh token")) {
      return {
        success: false,
        error: "Invalid or expired refresh token",
        errorCode: "invalid_refresh_token"
      };
    }

    // Additional clarity: if a client mistakenly sends an access token here,
    // detect it and respond with a specific error.
    try {
      const maybeAccessToken = cookieStore.get("refreshToken")?.value || null;
      if (maybeAccessToken) {
        // If this verifies as an access token, inform the client explicitly
        verifyAccessToken(maybeAccessToken);
        return {
          success: false,
          error: "Provided token is an access token, not a refresh token",
          errorCode: "access_token_not_allowed"
        };
      }
    } catch (_) {
      // no-op: if it doesn't verify as access token, fall through to generic error
    }

    return {
      success: false,
      error: "Failed to refresh access token",
      errorCode: "internal_error"
    };
  }
}
