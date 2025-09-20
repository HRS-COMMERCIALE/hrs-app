import { Locale } from '@/i18n/config';

const LANGUAGE_PREFERENCE_KEY = 'hrs-app-language-preference';
const LANGUAGE_COOKIE_NAME = 'NEXT_LOCALE';

/**
 * Get stored language preference from localStorage
 */
export function getStoredLanguagePreference(): Locale | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(LANGUAGE_PREFERENCE_KEY);
    return stored as Locale || null;
  } catch (error) {
    console.warn('Failed to read language preference from localStorage:', error);
    return null;
  }
}

/**
 * Store language preference in localStorage
 */
export function storeLanguagePreference(locale: Locale): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LANGUAGE_PREFERENCE_KEY, locale);
  } catch (error) {
    console.warn('Failed to store language preference in localStorage:', error);
  }
}

/**
 * Get language preference from cookies (server-side)
 */
export function getLanguagePreferenceFromCookies(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null;
  
  try {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const locale = cookies[LANGUAGE_COOKIE_NAME];
    return locale as Locale || null;
  } catch (error) {
    console.warn('Failed to read language preference from cookies:', error);
    return null;
  }
}

/**
 * Set language preference cookie
 */
export function setLanguagePreferenceCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;
  
  try {
    // Set cookie with 1 year expiration
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${locale}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.warn('Failed to set language preference cookie:', error);
  }
}

/**
 * Clear stored language preference
 */
export function clearLanguagePreference(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LANGUAGE_PREFERENCE_KEY);
    document.cookie = `${LANGUAGE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  } catch (error) {
    console.warn('Failed to clear language preference:', error);
  }
}
