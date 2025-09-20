'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useLocale } from 'next-intl';
import { ReactNode } from 'react';

interface I18nProviderProps {
  children: ReactNode;
  messages: any;
}

export function I18nProvider({ children, messages }: I18nProviderProps) {
  const locale = useLocale();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
