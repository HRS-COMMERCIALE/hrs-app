'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { locales, Locale } from '@/i18n/config';
import { storeLanguagePreference, setLanguagePreferenceCookie } from '@/lib/languagePreference';

const languageNames = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية'
};

const languageFlags = {
  en: '🇺🇸',
  fr: '🇫🇷',
  ar: '🇸🇦'
};

export default function I18nLanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Store the language preference
    storeLanguagePreference(newLocale as Locale);
    setLanguagePreferenceCookie(newLocale as Locale);
    
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '';
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <div className="relative">
      <select
        value={locale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {locales.map((loc) => (
          <option key={loc} value={loc}>
            {languageFlags[loc]} {languageNames[loc]}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
