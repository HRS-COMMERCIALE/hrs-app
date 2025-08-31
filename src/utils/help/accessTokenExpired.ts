/**
 * Handles token refresh when access token is expired
 * Gets refresh token from cookies and calls refresh API
 * The refresh API automatically sets the new access token in cookies
 */
export async function handleTokenRefresh(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // Note: In client-side code, cookies are automatically included with credentials: 'include'
    // The refresh token will be sent automatically by the browser
    
    // Call the refresh token API
    const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/refreshAccessToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
    });

    if (!refreshResponse.ok) {
      const errorData = await refreshResponse.json();
      return { 
        success: false, 
        error: errorData.error || 'Failed to refresh token' 
      };
    }

    // The refresh API automatically sets the new access token in cookies
    // So we just need to return success
    return { 
      success: true, 
      message: 'Token refreshed successfully' 
    };

  } catch (error: any) {
    return { 
      success: false, 
      error: error?.message || 'Failed to refresh token' 
    };
  }
}

/**
 * Checks if the response indicates an expired token and handles refresh
 * Use this in your API calls when you get an expired token response
 */
export async function handleExpiredTokenResponse(response: Response): Promise<{ shouldRetry: boolean; error?: string }> {
  try {
    const data = await response.json();
    
    // Check if the response indicates an expired token
    if (data.code === 'TOKEN_EXPIRED' || data.error === 'Token expired') {
      // Attempt to refresh the token
      const refreshResult = await handleTokenRefresh();
      
      if (refreshResult.success) {
        return { shouldRetry: true };
      } else {
        return { 
          shouldRetry: false, 
          error: refreshResult.error || 'Failed to refresh token' 
        };
      }
    }
    
    return { shouldRetry: false };
  } catch (error) {
    return { shouldRetry: false, error: 'Failed to parse response' };
  }
}
