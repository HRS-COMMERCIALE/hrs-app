"use client";

import React from 'react';

type ProgressBarSize = 'sm' | 'md' | 'lg';
type ProgressBarVariant = 'default' | 'inline';

interface ProgressBarProps {
  message?: string;
  progress?: number | null; // null/undefined => indeterminate
  size?: ProgressBarSize;
  variant?: ProgressBarVariant;
  className?: string;
}

export function ProgressBar({
  message,
  progress,
  size = 'md',
  variant = 'default',
  className = ''
}: ProgressBarProps) {
  const clamped = typeof progress === 'number' ? Math.max(0, Math.min(100, progress)) : null;

  const sizeConfig: Record<ProgressBarSize, { height: string; width: string; text: string }> = {
    sm: { height: 'h-1.5', width: 'w-32', text: 'text-xs' },
    md: { height: 'h-2', width: 'w-64', text: 'text-sm' },
    lg: { height: 'h-3', width: 'w-80', text: 'text-base' },
  };

  const cfg = sizeConfig[size];

  const bar = (
    <div className={`relative overflow-hidden rounded-full bg-slate-200 ${cfg.height} ${variant === 'inline' ? 'w-24' : cfg.width}`}>
      {clamped === null ? (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      ) : (
        <div
          className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-[width] duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      )}
      <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        {bar}
        {message ? <span className={`text-slate-600 ${cfg.text}`}>{message}</span> : null}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {bar}
      {message ? <div className={`mt-2 text-slate-700 ${cfg.text} font-medium`}>{message}</div> : null}
    </div>
  );
}

// Tailwind keyframes (utility-friendly). Add via arbitrary values above.
// shimmer: translate X from -100% to 100%
// Using arbitrary animation in class: animate-[shimmer_1.4s_infinite]
// Consumers must have Tailwind JIT enabled (Next.js default).

