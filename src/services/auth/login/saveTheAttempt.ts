import { LoginAttempt } from '@/models/associationt.ts/association';

type SaveAttemptData = {
  userId: number;
  userEmail: string;
  success: boolean;
  reasonFailed?: string;
  ip: string;
  userAgent: string;
};

type SaveAttemptResult = {
  success: boolean;
  savedAttempt?: any; // The saved login attempt data
  errors?: string[];
};

type LocationData = {
  city: string | null;
  country: string | null;
  location: string | null; // Combined format for backward compatibility
};

// Helper function to get location from IP using ipinfo.io API
async function getLocationFromIP(ip: string): Promise<LocationData> {
  const API_TOKEN = 'e6f333bdf060e0';
  
  try {
    const response = await fetch(`https://api.ipinfo.io/lite/${ip}?token=${API_TOKEN}`);
    
    if (!response.ok) {
      console.warn(`Failed to get location from IP ${ip}: ${response.status} ${response.statusText}`);
      return { city: null, country: null, location: null };
    }
    
    const data = await response.json();
    
    const city = data.city || null;
    const country = data.country || null;
    
    // Create combined location string for backward compatibility
    let location: string | null = null;
    if (city && country) {
      location = `${city}, ${country}`;
    } else if (country) {
      location = country;
    } else if (city) {
      location = city;
    }
    
    return { city, country, location };
  } catch (error) {
    console.warn('Failed to get location from IP:', error);
    return { city: null, country: null, location: null };
  }
}

export async function saveTheAttempt(data: SaveAttemptData): Promise<SaveAttemptResult> {
  const result: SaveAttemptResult = {
    success: true,
    errors: []
  };

  try {
    // Get location data from IP (with error handling)
    const locationData = await getLocationFromIP(data.ip);
    
    // Save to database
    try {
      const savedAttempt = await LoginAttempt().create({
        userId: data.userId,
        ipAddress: data.ip,
        userAgent: data.userAgent,
        successful: data.success,
        failureReason: data.success ? null : data.reasonFailed,
        attemptAt: new Date(),
        location: locationData.city ? ` ${locationData.country},${locationData.city} . ` : ` ${locationData.country} . `
      });
      result.savedAttempt = savedAttempt;
    } catch (dbError) {
      console.error('Failed to save login attempt to database:', dbError);
      result.errors?.push('Database save failed');
      result.success = false;
    }

  } catch (error) {
    console.error('Unexpected error in saveTheAttempt:', error);
    result.success = false;
    result.errors?.push('Unexpected error occurred');
  }

  return result;
}

// Convenience function for backward compatibility
export async function saveTheAttemptLegacy(
  userId: number,
  userEmail: string,
  success: boolean,
  reasonFailed: string,
  ip: string, 
  userAgent: string
): Promise<void> {
  await saveTheAttempt({
    userId,
    userEmail,
    success,
    reasonFailed,
    ip,
    userAgent
  });
}