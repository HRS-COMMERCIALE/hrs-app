import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['en', 'fr', 'ar'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Resolve to a safe locale when undefined/invalid to avoid 404 on '/'
  const resolvedLocale: Locale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  // Use explicit import map so bundler can resolve at build time
  const loaders: Record<Locale, () => Promise<any>> = {
    en: () => import('../locales/messages/en.json'),
    fr: () => import('../locales/messages/fr.json'),
    ar: () => import('../locales/messages/ar.json')
  };

  const loaded = await loaders[resolvedLocale]();
  return {
    locale: resolvedLocale,
    messages: loaded.default
  };
});
