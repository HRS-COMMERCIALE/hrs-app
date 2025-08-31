import { apiClient } from '../../client/client';

/**
 * Fetches the current IP address from the IP API
 * @returns Promise<{ip: string}> - Object containing the IP address
 */
export async function getCurrentIP(): Promise<{ ip: string }> {
  try {
    const response = await apiClient
      .get()
      .to('/api/ip')
      .noRetry() // No need for token refresh for IP endpoint
      .fetch<{ ip: string }>();

    if (response.success && response.data) {
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to fetch IP');
    }
  } catch (error) {
    console.error('Error getting IP address:', error);
    // Return fallback IP on error
    return { ip: 'Unknown' };
  }
}
