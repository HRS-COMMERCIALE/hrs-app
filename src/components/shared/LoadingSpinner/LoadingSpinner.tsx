"use client";

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LoadingSpinnerProps {
  icon?: LucideIcon;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'minimal' | 'fullscreen';
  className?: string;
}

export function LoadingSpinner({ 
  icon: Icon, 
  message, 
  size = 'lg',
  variant = 'default',
  className = ''
}: LoadingSpinnerProps) {
  // Use provided message or fallback to default
  const displayMessage = message || 'Loading...';

  // Size configurations
  const sizeConfig = {
    sm: {
      spinner: 'h-16 w-16',
      icon: 'w-4 h-4',
      text: 'text-sm',
      spacing: 'mb-4'
    },
    md: {
      spinner: 'h-24 w-24',
      icon: 'w-6 h-6',
      text: 'text-base',
      spacing: 'mb-6'
    },
    lg: {
      spinner: 'h-32 w-32',
      icon: 'w-8 h-8',
      text: 'text-lg',
      spacing: 'mb-8'
    },
    xl: {
      spinner: 'h-40 w-40',
      icon: 'w-10 h-10',
      text: 'text-xl',
      spacing: 'mb-10'
    }
  };

  const config = sizeConfig[size];

  // Default icon if none provided
  const DefaultIcon = () => (
    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" />
  );

  // Minimal variant - just spinner
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <div className={`animate-spin rounded-full ${config.spinner} border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-600`}></div>
          <div className={`absolute inset-0 animate-spin rounded-full ${config.spinner} border-4 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent`} style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          <div className={`absolute inset-4 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg`}>
            {Icon ? <Icon className={`${config.icon} text-blue-600 animate-pulse`} /> : <DefaultIcon />}
          </div>
        </div>
      </div>
    );
  }

  // Default variant - spinner with text
  if (variant === 'default') {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className={`relative ${config.spacing}`}>
          <div className={`animate-spin rounded-full ${config.spinner} border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-600`}></div>
          <div className={`absolute inset-0 animate-spin rounded-full ${config.spinner} border-4 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent`} style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          <div className={`absolute inset-4 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg`}>
            {Icon ? <Icon className={`${config.icon} text-blue-600 animate-pulse`} /> : <DefaultIcon />}
          </div>
        </div>
        
        {displayMessage && (
          <div className="text-center">
            <div className={`text-slate-700 ${config.text} font-medium mb-2`}>{displayMessage}</div>
            <div className="flex space-x-1 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fullscreen variant - complete loading screen
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${className}`}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-tilt"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Loading Spinner */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className={`relative ${config.spacing}`}>
          <div className={`animate-spin rounded-full ${config.spinner} border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-600`}></div>
          <div className={`absolute inset-0 animate-spin rounded-full ${config.spinner} border-4 border-transparent bg-gradient-to-r from-transparent via-white/20 to-transparent`} style={{ animationDuration: '3s', animationDirection: 'reverse' }}></div>
          <div className={`absolute inset-4 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg`}>
            {Icon ? <Icon className={`${config.icon} text-blue-600 animate-pulse`} /> : <DefaultIcon />}
          </div>
        </div>
        
        {displayMessage && (
          <div className="text-center">
            <div className={`text-slate-700 ${config.text} font-medium mb-2`}>{displayMessage}</div>
            <div className="flex space-x-1 justify-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


