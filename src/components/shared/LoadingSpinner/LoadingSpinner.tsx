"use client";

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface LoadingSpinnerProps {
  appName?: string;
  message?: string;
}

export function LoadingSpinner({ appName = 'Loading', message }: LoadingSpinnerProps) {
  const t = useTranslations('common');
  const defaultMessage = t('loading');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-[#3c959d] via-[#ef7335] to-[#3c959d] bg-clip-border"></div>
        <div className="absolute inset-0 animate-spin rounded-full h-32 w-32 border-4 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent" style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
        <div className="absolute inset-4 bg-gradient-to-br from-slate-950 to-slate-900 rounded-full flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#3c959d] animate-pulse" />
        </div>
      </div>

      <div className="absolute bottom-20 text-center">
        <div className="text-white text-lg font-medium mb-2">{message || defaultMessage}</div>
        <div className="flex space-x-1 justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}


