"use client";
import { useState, useEffect, useMemo } from "react";
import { useLanguageStore } from "../../store/languageStore";
import { availableLanguages, type SupportedLanguageCode } from "../../locales";

const LOCAL_STORAGE_LANGUAGE_KEY = "selectedLanguage";

const LANGUAGE_NAMES: Record<SupportedLanguageCode, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

const LANGUAGE_FLAGS: Record<SupportedLanguageCode, string> = {
  en: "us",
  fr: "fr",
  ar: "sa",
};

export default function LanguageSelector() {
  const changeLanguage = useLanguageStore((s) => s.changeLanguage);
  const [show, setShow] = useState(false);
  const [selectedHover, setSelectedHover] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
    if (!stored) setShow(true);
  }, []);

  const handleSelect = (code: SupportedLanguageCode) => {
    changeLanguage(code);
    setShow(false);
  };

  const languageCodes = useMemo(() => Object.keys(availableLanguages), []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
      {/* Simplified Background Lines - Only visible on larger screens */}
      <div className="absolute inset-0 overflow-hidden opacity-60 hidden sm:block">
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
          style={{ willChange: 'transform' }}
        >
          <defs>
            <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3c959d" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ef7335" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="line2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef7335" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#3c959d" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          
          <path
            d="M0,50 Q25,20 50,40 T100,30"
            stroke="url(#line1)"
            strokeWidth="0.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          
          <path
            d="M0,80 Q50,10 100,60"
            stroke="url(#line2)"
            strokeWidth="0.3"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '4s', animationDelay: '1.5s' }}
          />
        </svg>
      </div>

      {/* Modal Container - Responsive */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-gradient-to-br from-[#03071a] via-[#0f1a2e] to-[#1a2a4a] border border-[#3c959d]/20 rounded-2xl shadow-2xl p-6 sm:p-8 mx-4">
        
        <div className="relative z-10">
          {/* Header - Responsive */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent mb-2">
              Select Your Language
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">Choose your preferred language to continue</p>
          </div>

          {/* Language Options - Optimized */}
          <div className="space-y-2 sm:space-y-3">
            {languageCodes.map((code, index) => {
              const isHovered = selectedHover === code;
              
              return (
              <button
                  key={code}
                onClick={() => handleSelect(code as SupportedLanguageCode)}
                  onMouseEnter={() => setSelectedHover(code)}
                  onMouseLeave={() => setSelectedHover(null)}
                  className={`w-full group relative overflow-hidden rounded-xl border transition-all duration-200 transform-gpu ${
                    isHovered
                      ? "border-[#3c959d]/60 shadow-md shadow-[#3c959d]/10 scale-[1.02]"
                      : "border-[#3c959d]/20 hover:border-[#3c959d]/40 hover:scale-[1.01]"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    willChange: 'transform'
                  }}
                >
                  {/* Optimized Button Background */}
                  <div 
                    className={`absolute inset-0 transition-opacity duration-200 ${
                      isHovered
                        ? "bg-gradient-to-r from-[#3c959d]/15 via-[#4ba5ad]/10 to-[#ef7335]/15 opacity-100"
                        : "bg-[#3c959d]/5 opacity-50"
                    }`}
                    style={{ willChange: 'opacity' }}
                  />
                  
                  {/* Button Content - Responsive */}
                  <div className="relative z-10 flex items-center justify-between p-3 sm:p-4">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <span className="text-lg sm:text-2xl bg-gradient-to-r from-[#3c959d] to-[#ef7335] bg-clip-text text-transparent">{LANGUAGE_FLAGS[code as SupportedLanguageCode]}</span>
                      <span className={`font-semibold text-base sm:text-lg transition-colors duration-200 ${
                        isHovered ? "bg-gradient-to-r from-[#3c959d] to-[#ef7335] bg-clip-text text-transparent" : "text-[#3c959d]"
                      }`}>
                        {LANGUAGE_NAMES[code as SupportedLanguageCode] || code}
                      </span>
                    </div>
                    
                    {/* Arrow Icon - Optimized */}
                    <svg 
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200 ${
                        isHovered 
                          ? "text-[#ef7335] translate-x-0.5" 
                          : "text-slate-400 group-hover:text-slate-300"
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      style={{ willChange: 'transform, color' }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Hover Effect Line - Simplified */}
                  <div 
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[#3c959d] to-[#ef7335] transition-all duration-200 ${
                      isHovered ? "w-full" : "w-0"
                    }`}
                    style={{ willChange: 'width' }}
                  />
              </button>
              );
            })}
          </div>

          {/* Footer - Responsive */}
          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs text-slate-400">
              You can change this later in settings
            </p>
          </div>
      </div>
      </div>

      {/* Optimized CSS Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}