'use client';

import { useTranslations } from 'next-intl';

export default function I18nExample() {
  const t = useTranslations();
  const tNavbar = useTranslations('homePage.navbar');
  const tAuthLogin = useTranslations('auth.login');
  const tCommon = useTranslations('common');

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">i18n Example</h2>
      
      {/* Using nested translations */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Home Page Navbar:</h3>
          <p>Home: {tNavbar('home')}</p>
          <p>Features: {tNavbar('features')}</p>
          <p>About: {tNavbar('about')}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Auth Login:</h3>
          <p>Title: {tAuthLogin('title')}</p>
          <p>Email: {tAuthLogin('email')}</p>
          <p>Password: {tAuthLogin('password')}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Common Actions:</h3>
          <p>Save: {tCommon('save')}</p>
          <p>Cancel: {tCommon('cancel')}</p>
          <p>Loading: {tCommon('loading')}</p>
        </div>
      </div>
    </div>
  );
}
