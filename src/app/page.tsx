import { redirect } from 'next/navigation';
import { defaultLocale } from '@/i18n/config';

// This page should never be reached due to middleware redirects
// But if it is, redirect to the default locale
export default function RootPage() {
  console.log('defaultLocale', defaultLocale);
  redirect(`/${defaultLocale}`);
}