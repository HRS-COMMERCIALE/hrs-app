"use client";

import { useI18n } from '@/i18n/hooks';
import { useLocale } from '@/i18n/hooks';
import NotFoundView from '@/components/pages/notFound/NotFoundView';
import Header404 from '@/components/layout/Header/Header404';
import Footer from '@/components/pages/HomePage/footer';

export default function LocalizedNotFound() {
  const { t } = useI18n();
  const locale = useLocale();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
      <Header404 />
      <main className="flex-1">
        <NotFoundView
          title={t('errors.notFoundTitle', { default: 'Page not found' })}
          message={t('errors.notFoundMessage', { default: "The page you are looking for doesn’t exist." })}
          href={`/${locale}`}
          linkText={t('actions.goHome', { default: 'Go back home' })}
        />
      </main>
      <Footer />
    </div>
  );
}


