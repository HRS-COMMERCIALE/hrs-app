'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguageStore } from '../../../store/languageStore';
import { useLanguageUtils } from '../../../utils/language/languageUtils';
import { useAuth } from '../../../store/authProvider';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback } from '../../../components/ui/avatar';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../../../components/ui/dropdown-menu';
import { Settings, Globe, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';

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
    { id: 'home', label: currentTranslations?.homePage?.navbar?.home || 'Home', href: '/' },
    { id: 'business-plans', label: 'Business Plans', href: '/businessPlans' },
    { id: 'about', label: currentTranslations?.homePage?.navbar?.about || 'About', href: '#about' },
    { id: 'contact', label: currentTranslations?.homePage?.navbar?.contactUs || 'Contact Us', href: '/contactUs' }
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

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear cookies and reload page
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Reload the page to reset the application state
        window.location.reload();
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Render different buttons based on auth state
  const renderAuthButtons = () => {
    if (authState === 'loading') {
      return (
        <div className="animate-pulse bg-muted h-10 w-24 rounded-lg"></div>
      );
    }

    if (authState === 'authenticated') {
      return (
        <Button 
          onClick={() => router.push('/dashboard')}
          className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          size="sm"
        >
          {currentTranslations?.homePage?.navbar?.dashboard || 'Dashboard'}
        </Button>
      );
    }

    // Not authenticated - show login and signup buttons
    return (
      <div className="flex items-center space-x-3">
        <Button 
          onClick={() => router.push('/login')}
          className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-[#3c959d] hover:to-[#4ba5ad] text-slate-100 hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-slate-500/30 hover:border-[#3c959d]/50"
          size="sm"
        >
          {currentTranslations?.homePage?.navbar?.login || 'Login'}
        </Button>
        <Button 
          onClick={() => router.push('/register')}
          className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          size="sm"
        >
          {currentTranslations?.homePage?.navbar?.signUp || 'Sign Up'}
        </Button>
      </div>
    );
  };

  // Render mobile auth buttons
  const renderMobileAuthButtons = () => {
    if (authState === 'loading') {
      return (
        <div className="animate-pulse bg-muted h-12 w-full rounded-lg"></div>
      );
    }

    if (authState === 'authenticated') {
      return (
        <Button 
          onClick={() => router.push('/dashboard')}
          className="w-full bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          {currentTranslations?.homePage?.navbar?.dashboard || 'Dashboard'}
        </Button>
      );
    }

    // Not authenticated - show login and signup buttons
    return (
      <div className="space-y-3">
        <Button 
          onClick={() => router.push('/login')}
          className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-[#3c959d] hover:to-[#4ba5ad] text-slate-100 hover:text-white font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-slate-500/30 hover:border-[#3c959d]/50"
          size="lg"
        >
          {currentTranslations?.homePage?.navbar?.login || 'Login'}
        </Button>
        <Button 
          onClick={() => router.push('/register')}
          className="w-full bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          size="lg"
        >
          {currentTranslations?.homePage?.navbar?.signUp || 'Sign Up'}
        </Button>
      </div>
    );
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-sm border-b border-[#3c959d]/50 shadow-2xl' : 'bg-gradient-to-r from-[#03071a]/5 to-[#172453]/5 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-20">
          {/* Logo Section - Left */}
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
          
          {/* Desktop Navigation - Absolutely Centered - Show for all users */}
          <nav className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.href} 
                  className="text-slate-200 hover:text-[#3c959d] transition-all duration-300 relative group font-medium text-sm px-4 py-2 rounded-lg hover:bg-slate-800/30 whitespace-nowrap"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-[#3c959d] to-[#ef7335] group-hover:w-3/4 transition-all duration-500"></span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Right Side Actions - User Profile Dropdown & Auth - Far Right */}
          <div className="hidden lg:flex items-center justify-end ml-auto">
            {/* User Profile Dropdown */}
            {authState === 'authenticated' && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="flex items-center space-x-3 text-slate-200 hover:text-[#3c959d] hover:bg-slate-800/30 p-2"
                  >
                    {/* User Avatar */}
                    <div className="relative">
                      <Avatar className="w-8 h-8 lg:w-10 lg:h-10">
                        <AvatarFallback className="bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-semibold text-sm lg:text-base">
                          {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status indicator */}
                      <Badge 
                        variant="secondary" 
                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-slate-800 p-0 rounded-full"
                      />
                    </div>
                    
                    {/* User Name */}
                    <div className="text-left">
                      <div className="text-slate-200 font-medium text-sm lg:text-base">
                        {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                      </div>
                      {user.title && (
                        <div className="text-slate-400 text-xs lg:text-sm">
                          {user.title}
                        </div>
                      )}
                    </div>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="bg-gradient-to-br from-[#1a2a4a]/95 to-[#2d7a82]/95 border-[#3c959d]/30 backdrop-blur-xl min-w-[200px]"
                >
                  {/* User Info Header */}
                  <DropdownMenuLabel className="text-slate-200 font-medium">
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  
                  {/* Dashboard Button */}
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard')}
                    className="text-slate-200 hover:text-[#3c959d] hover:bg-slate-800/30 cursor-pointer"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Dashboard
                  </DropdownMenuItem>
                  
                  {/* Current Plan Display */}
                  <DropdownMenuItem className="text-slate-400 hover:bg-transparent cursor-default">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-medium">Current Plan:</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-semibold px-2 py-1 ${
                          user.plan === 'free' ? 'bg-slate-600 text-slate-200' :
                          user.plan === 'Premium' ? 'bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] text-white' :
                          user.plan === 'Platinum' ? 'bg-gradient-to-r from-[#ef7335] to-[#ff6b35] text-white' :
                          'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        }`}
                      >
                        {user.plan}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                  
                  {/* Settings */}
                  <DropdownMenuItem
                    onClick={() => router.push('/dashboard/settings')}
                    className="text-slate-200 hover:text-[#3c959d] hover:bg-slate-800/30 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  
                  {/* Language Selector */}
                  <DropdownMenuLabel className="text-slate-400 text-xs font-medium">Language</DropdownMenuLabel>
                  {languages.map((language) => (
                    <DropdownMenuItem
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      className={`flex items-center space-x-3 cursor-pointer ${
                        currentLanguageCode === language.code ? 'text-[#3c959d] bg-[#3c959d]/10' : 'text-slate-200'
                      } ${language.code === 'ar' ? 'text-right' : ''}`}
                    >
                      <span className="text-base">{language.flag}</span>
                      <span className="font-medium text-sm">{language.name}</span>
                    </DropdownMenuItem>
                  ))}
                  
                  <DropdownMenuSeparator className="bg-slate-700/50" />
                  
                  {/* Logout */}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-900/20 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Auth Buttons for non-authenticated users */
              renderAuthButtons()
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost"
            size="sm"
            className="lg:hidden text-[#3c959d] hover:bg-slate-800/30 ml-auto"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 bg-gradient-to-b from-[#1a2a4a]/95 to-[#2d7a82]/95 backdrop-blur-xl">
            <nav className="px-4 py-6 space-y-4">
              {/* Mobile User Profile Section */}
              {authState === 'authenticated' && user && (
                <div className="flex items-center space-x-3 pb-4">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white font-semibold text-lg">
                        {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <Badge 
                      variant="secondary" 
                      className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-slate-800 p-0 rounded-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-200 font-medium text-base">
                      {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                    </div>
                    {user.title && (
                      <div className="text-slate-400 text-sm">
                        {user.title}
                      </div>
                    )}
                    {/* Current Plan Display */}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-slate-500 text-xs">Plan:</span>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs font-semibold px-2 py-0.5 ${
                          user.plan === 'free' ? 'bg-slate-600 text-slate-200' :
                          user.plan === 'Premium' ? 'bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] text-white' :
                          user.plan === 'Platinum' ? 'bg-gradient-to-r from-[#ef7335] to-[#ff6b35] text-white' :
                          'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        }`}
                      >
                        {user.plan}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              <Separator className="bg-slate-700/50" />

              {/* Mobile Dashboard Button */}
              {authState === 'authenticated' && (
                <Button 
                  onClick={() => {
                    router.push('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start text-slate-200 hover:text-[#3c959d] hover:bg-slate-800/30"
                  size="lg"
                >
                  <User className="w-5 h-5 mr-3" />
                  Dashboard
                </Button>
              )}

              {/* Mobile Settings Button */}
              <Button 
                onClick={() => {
                  router.push('/dashboard/settings');
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start text-slate-200 hover:text-[#3c959d] hover:bg-slate-800/30"
                size="lg"
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </Button>

              {/* Navigation items for all users */}
              {navigationItems.map((item) => (
                <Link 
                  key={item.id} 
                  href={item.href} 
                  className="block text-slate-200 hover:text-[#3c959d] transition-all duration-300 font-medium text-base px-3 py-2 rounded-lg hover:bg-slate-800/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Language Selector */}
              <div className="pt-4">
                <Separator className="bg-slate-700/50 mb-4" />
                <div className="text-slate-400 text-sm mb-3 px-3 font-medium">Language</div>
                <div className="space-y-2">
                  {languages.map((language) => (
                    <Button
                      key={language.code}
                      onClick={() => handleLanguageChange(language.code)}
                      variant={currentLanguageCode === language.code ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        currentLanguageCode === language.code 
                          ? 'text-[#3c959d] bg-[#3c959d]/10 border border-[#3c959d]/30' 
                          : 'text-slate-200 hover:bg-slate-800/30'
                      }`}
                      size="lg"
                    >
                      <span className="text-lg mr-3">{language.flag}</span>
                      <span className="font-medium">{language.name}</span>
                    </Button>
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
