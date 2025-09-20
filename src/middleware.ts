import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { getLanguagePreferenceFromCookies } from './lib/languagePreference';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Enable automatic locale detection
  localeDetection: true,

  
  // Always show locale prefix in URL
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if path already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  // If no locale in path, check for stored preference
  if (!pathnameHasLocale) {
    const cookieHeader = request.headers.get('cookie');
    const storedPreference = getLanguagePreferenceFromCookies(cookieHeader);
    
    if (storedPreference && locales.includes(storedPreference)) {
      // Redirect to stored preference
      const url = request.nextUrl.clone();
      url.pathname = `/${storedPreference}${pathname}`;
      return Response.redirect(url);
    }
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _static (inside /public)
    // - all root files inside /public (e.g. favicon.ico)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
};
