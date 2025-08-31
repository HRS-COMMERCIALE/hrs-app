'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '../../../store/languageStore';
import { useLanguageUtils } from '../../../utils/language/languageUtils';
import { useAuth } from '../../../store/authProvider';

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  // Use the language utility hook
  const { changeLanguage, currentLanguageCode, currentTranslations } = useLanguageUtils();
  
  // Use auth hook to check authentication status
  const { authState, user } = useAuth();

  // Navigation items - easy to modify here
  const navigationItems = [
    { id: 'home', label: currentTranslations?.homePage?.navbar?.home || 'Home', href: '#home' },
    { id: 'features', label: currentTranslations?.homePage?.navbar?.features || 'Features', href: '#features' },
    { id: 'about', label: currentTranslations?.homePage?.navbar?.about || 'About', href: '#about' },
    { id: 'contact', label: currentTranslations?.homePage?.navbar?.contactUs || 'Contact Us', href: '#contact' }
  ];

  useEffect(() => {
  }, [currentTranslations]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsScrolled(scrollPercentage > 60);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode as any);
    setLanguageOpen(false);
  };

  // Render different buttons based on auth state
  const renderAuthButtons = () => {
    if (authState === 'loading') {
      return (
        <div className="animate-pulse bg-slate-700 h-10 w-24 rounded-lg"></div>
      );
    }

    if (authState === 'authenticated') {
      return (
        <button 
          onClick={() => router.push('/dashboard')}
          className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-lg text-sm whitespace-nowrap"
        >
          {currentTranslations?.homePage?.navbar?.dashboard || 'Dashboard'}
        </button>
      );
    }

    // Not authenticated - show login and signup buttons
    return (
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => router.push('/login')}
          className="text-slate-200 hover:text-[#3c959d] transition-all duration-300 font-medium px-4 py-2.5 rounded-lg border border-slate-600/50 hover:border-[#3c959d]/50 hover:bg-slate-800/30 text-sm whitespace-nowrap"
        >
          {currentTranslations?.homePage?.navbar?.login || 'Login'}
        </button>
        <button 
          onClick={() => router.push('/register')}
          className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-2.5 rounded-lg text-sm whitespace-nowrap"
        >
          {currentTranslations?.homePage?.navbar?.signUp || 'Sign Up'}
        </button>
      </div>
    );
  };

  // Render mobile auth buttons
  const renderMobileAuthButtons = () => {
    if (authState === 'loading') {
      return (
        <div className="animate-pulse bg-slate-700 h-12 w-full rounded-lg"></div>
      );
    }

    if (authState === 'authenticated') {
      return (
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-lg text-base"
        >
          {currentTranslations?.homePage?.navbar?.dashboard || 'Dashboard'}
        </button>
      );
    }

    // Not authenticated - show login and signup buttons
    return (
      <div className="space-y-3">
        <button 
          onClick={() => router.push('/login')}
          className="w-full text-slate-200 hover:text-[#3c959d] transition-all duration-300 font-medium px-6 py-3 rounded-lg border border-slate-600/50 hover:border-[#3c959d]/50 hover:bg-slate-800/30 text-base"
        >
          {currentTranslations?.homePage?.navbar?.login || 'Login'}
        </button>
        <button 
          onClick={() => router.push('/register')}
          className="w-full bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-3 rounded-lg text-base"
        >
          {currentTranslations?.homePage?.navbar?.signUp || 'Sign Up'}
        </button>
      </div>
    );
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm border-b border-[#3c959d]/50 shadow-2xl' : 'bg-gradient-to-r from-[#03071a]/5 to-[#172453]/5 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 group cursor-pointer">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Tunisie Business Solutions Logo" 
                className="h-8 lg:h-12 w-auto object-contain transform group-hover:scale-105 transition-all duration-300 filter drop-shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d]/20 via-transparent to-[#ef7335]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>
          
          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <a 
                  key={item.id} 
                  href={item.href} 
                  className="text-slate-200 hover:text-[#3c959d] transition-all duration-300 relative group font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-800/30 whitespace-nowrap"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3c959d] to-[#ef7335] group-hover:w-3/4 transition-all duration-500"></span>
                </a>
              ))}
            </div>
          </nav>

          {/* Right Side Actions - Fixed Width Container */}
          <div className="hidden lg:flex items-center justify-end space-x-3 min-w-[280px]">
            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center space-x-2 text-slate-200 hover:text-[#3c959d] transition-all duration-300 font-medium px-3 py-2.5 rounded-lg border border-slate-600/50 hover:border-[#3c959d]/50 hover:bg-slate-800/30 text-sm whitespace-nowrap"
              >
                <span className="text-base">{languages.find(lang => lang.code === currentLanguageCode)?.flag}</span>
                <span className="hidden sm:inline">{currentLanguageCode}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${languageOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {languageOpen && (
                <div className="absolute top-full right-0 mt-1 bg-gradient-to-br from-[#1a2a4a]/95 to-[#2d7a82]/95 border border-[#3c959d]/30 rounded-lg shadow-2xl backdrop-blur-xl z-50 min-w-[140px]">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left hover:bg-[#3c959d]/20 transition-all duration-200 ${
                        currentLanguageCode === language.code ? 'text-[#3c959d] bg-[#3c959d]/10' : 'text-slate-200'
                      } ${language.code === 'ar' ? 'text-right' : ''}`}
                    >
                      <span className="text-base">{language.flag}</span>
                      <span className="font-medium text-sm">{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {renderAuthButtons()}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-[#3c959d] p-2 rounded-lg hover:bg-slate-800/30 transition-all duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 bg-gradient-to-b from-[#1a2a4a]/95 to-[#2d7a82]/95 backdrop-blur-xl">
            <nav className="px-4 py-6 space-y-4">
              {navigationItems.map((item) => (
                <a 
                  key={item.id} 
                  href={item.href} 
                  className="block text-slate-200 hover:text-[#3c959d] transition-all duration-300 font-medium text-base px-3 py-2 rounded-lg hover:bg-slate-800/30"
                >
                  {item.label}
                </a>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-slate-700/50">
                <div className="text-slate-400 text-sm mb-3 px-3 font-medium">Language</div>
                <div className="space-y-2">
                  {languages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                        currentLanguageCode === language.code 
                          ? 'text-[#3c959d] bg-[#3c959d]/10 border border-[#3c959d]/30' 
                          : 'text-slate-200 hover:bg-slate-800/30'
                      }`}
                    >
                      <span className="text-lg">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="pt-4">
                {renderMobileAuthButtons()}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
