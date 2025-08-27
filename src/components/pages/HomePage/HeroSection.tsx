"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '../../../store/languageStore';

const HeroSection = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  // Centralized content object for easy text management
  const { currentTranslations } = useLanguageStore();
  const language = currentTranslations.homePage.heroSection;
  const content = {
    statusBadge: {
      text: language.statusBadge.text
    },
    hero: {
      title: {
        line1: language.hero.title.line1,
        line2: language.hero.title.line2
      },
      description: {
        main: language.hero.description.main,
        highlight: language.hero.description.highlight,
        ending: language.hero.description.ending
      }
    },
    cta: {
      primaryButton: {
        text: language.cta.primaryButton.text
      },
      secondaryButton: {
        text: language.cta.secondaryButton.text
      }
    },
    trustIndicators: {
      setup: language.trustIndicators.setup,
      cancel: language.trustIndicators.cancel,
      security: language.trustIndicators.security
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#3c959d]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ef7335]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEwOF8xNzgpIj4KPHBhdGggZD0iTTQwIDEuNUgwVjBINDBWMS41WiIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTA4XzE3OCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K')] opacity-30"></div>
      </div>

      {/* Floating Particles - More Refined */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#4ba5ad]/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 pt-20 pb-16 relative z-10">
        {/* Status Badge */}
        <div className={`text-center mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d]/15 to-[#ef7335]/15 backdrop-blur-sm border border-[#3c959d]/30 rounded-full px-6 py-3 text-sm">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-slate-200 font-medium">{content.statusBadge.text}</span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="text-center max-w-6xl mx-auto mb-20">
          <h1 className={`text-6xl md:text-8xl font-black mb-8 leading-tight transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-4">
              {content.hero.title.line1}
            </span>
            <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent relative">
              {content.hero.title.line2}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 blur-xl -z-10 animate-pulse"></div>
            </span>
          </h1>
          
          <p className={`text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-16 leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {content.hero.description.main}
            <span className="text-[#4ba5ad] font-semibold">{content.hero.description.highlight}</span> 
            {content.hero.description.ending}
          </p>

          {/* Enhanced CTA Section */}
          <div className={`transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button 
                onClick={() => router.push('/login')}
                className="group relative bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] text-white font-bold px-12 py-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-[#3c959d]/30 min-w-[220px] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {content.cta.primaryButton.text}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#2d7a82] via-[#3c959d] to-[#e05a2b] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              <button className="group border-2 border-[#3c959d]/50 text-[#3c959d] hover:bg-[#3c959d]/10 font-semibold px-12 py-6 rounded-2xl text-lg transition-all duration-300 hover:border-[#3c959d] hover:shadow-lg hover:shadow-[#3c959d]/20 min-w-[220px] backdrop-blur-sm">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 010 5H9V10z" />
                  </svg>
                  {content.cta.secondaryButton.text}
                </span>
              </button>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                {content.trustIndicators.setup}
              </span>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                {content.trustIndicators.cancel}
              </span>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                </svg>
                {content.trustIndicators.security}
              </span>
            </div>
          </div>
        </div>

        {/* Elegant Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-10 border-2 border-slate-400 rounded-full relative">
              <div className="w-1 h-3 bg-slate-400 rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;