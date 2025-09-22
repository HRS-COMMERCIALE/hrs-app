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
    sm: { height: 'h-2', width: 'w-40', text: 'text-xs' },
    md: { height: 'h-2.5', width: 'w-72', text: 'text-sm' },
    lg: { height: 'h-3.5', width: 'w-96', text: 'text-base' },
  };

  const cfg = sizeConfig[size];

  const bar = (
    <div className={`relative overflow-hidden rounded-full ${cfg.height} ${variant === 'inline' ? 'w-28' : cfg.width}`}
      style={{
        // Subtle background with gradient to match the spinner theme
        background: 'linear-gradient(90deg, rgba(226,232,240,0.9) 0%, rgba(241,245,249,0.9) 100%)'
      }}
    >
      {/* Track gloss */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60" style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.05) 100%)'
        }} />
      </div>

      {/* Progress fill */}
      {clamped === null ? (
        <>
          {/* Indeterminate shimmer */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite]" style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)'
          }} />
          {/* Subtle animated stripes */}
          <div className="absolute inset-0 opacity-20 bg-[length:16px_16px]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(99,102,241,0.25) 0, rgba(99,102,241,0.25) 8px, rgba(168,85,247,0.25) 8px, rgba(168,85,247,0.25) 16px)'
          }} />
        </>
      ) : (
        <div className="relative h-full overflow-hidden rounded-full transition-[width] duration-400 ease-out"
          style={{ width: `${clamped}%` }}
        >
          {/* Core gradient fill matches LoadingSpinner theme */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600" />
          {/* Inner glow sweep */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute -inset-x-10 inset-y-0 translate-x-[-60%] animate-[shine_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          {/* Subtle noise/texture */}
          <div className="absolute inset-0 rounded-full opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.5), rgba(255,255,255,0) 60%)'
          }} />
        </div>
      )}

      {/* Outer ring and glow */}
      <div className="absolute inset-0 rounded-full ring-1 ring-black/5" />
      <div className="absolute -inset-1 rounded-full blur-sm opacity-30 bg-gradient-to-r from-blue-400/50 to-purple-500/50" />
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

// Tailwind keyframes used via arbitrary animations:
// shimmer: sweeping light for indeterminate state
// shine: inner glow sweep over the filled bar
// Ensure Tailwind JIT is enabled (Next.js default).

