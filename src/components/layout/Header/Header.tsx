'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-gradient-to-r from-[#03071a]/80 to-[#172453]/80 backdrop-blur-xl border-b border-[#3c959d]/20 shadow-2xl' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-8 py-5">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              <img 
                src="/logo.png" 
                alt="Tunisie Business Solutions Logo" 
                className="w-48 h-16 object-contain transform group-hover:scale-105 transition-all duration-300 filter drop-shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-10">
            {['Solutions', 'Enterprise', 'Global', 'Security'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-300 hover:text-[#3c959d] transition-all duration-300 relative group font-semibold text-lg">
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#3c959d] to-[#ef7335] group-hover:w-full transition-all duration-500"></span>
              </a>
            ))}
            <button className="border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-[#3c959d] hover:border-[#3c959d]/50 transition-all duration-300 font-semibold px-6 py-2 rounded-lg">
              Client Portal
            </button>
            <button className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-2 rounded-lg">
            Get Started Now
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-[#3c959d]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-700">
            <nav className="flex flex-col space-y-4 pt-4">
              {['Solutions', 'Enterprise', 'Global', 'Security'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-300 hover:text-[#3c959d] transition-all duration-300 font-semibold text-lg">
                  {item}
                </a>
              ))}
              <button className="border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-[#3c959d] hover:border-[#3c959d]/50 transition-all duration-300 font-semibold px-6 py-2 rounded-lg text-left">
                Client Portal
              </button>
              <button className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 px-8 py-2 rounded-lg text-left">
                Request Demo
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
