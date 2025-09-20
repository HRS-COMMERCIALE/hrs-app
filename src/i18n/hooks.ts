'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect } from 'react';
import { getStoredLanguagePreference, setLanguagePreferenceCookie } from '@/lib/languagePreference';

// Custom hook for easy access to translations
export function useI18n() {
  const t = useTranslations();
  const locale = useLocale();

  // Initialize language preference on mount
  useEffect(() => {
    const storedPreference = getStoredLanguagePreference();
    if (storedPreference && storedPreference !== locale) {
      // Sync localStorage with cookie
      setLanguagePreferenceCookie(storedPreference);
    }
  }, [locale]);

  return {
    t,
    locale,
    // Helper function for nested translations
    tNested: (namespace: string) => useTranslations(namespace),
    // Helper to get current locale info
    getLocaleInfo: () => ({
      current: locale,
      isEnglish: locale === 'en',
      isFrench: locale === 'fr', 
      isArabic: locale === 'ar'
    })
  };
}

// Export individual hooks for convenience
export { useTranslations, useLocale };
