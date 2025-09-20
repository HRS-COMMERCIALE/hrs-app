'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/i18n/hooks';

const AboutUs: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { tNested } = useI18n();
  const language = tNested('homePage.aboutUs');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const content = {
    badge: language('badge'),
    title: {
      line1: language('title.line1'),
      line2: language('title.line2')
    },
    subtitle: language('subtitle'),
    comingSoon: language('comingSoon'),
    description: language('description'),
    underConstruction: language('underConstruction'),
    constructionNote: language('constructionNote'),
    developmentProgress: language('developmentProgress'),
    inDevelopment: language('inDevelopment'),
    exploreNote: language('exploreNote')
  };

  return (
    <section ref={sectionRef} className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#3c959d]/10 to-[#4ba5ad]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-gradient-to-r from-[#ef7335]/10 to-[#3c959d]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-r from-[#4ba5ad]/10 to-[#ef7335]/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 backdrop-blur-sm border border-[#3c959d]/40 rounded-full px-6 py-3 text-sm mb-8 shadow-lg">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-gray-700 font-semibold">{content.badge}</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {content.title.line1}
            <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent">
              {content.title.line2}
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {content.subtitle}
          </p>
        </div>

        {/* Main Content */}
        <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/50 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3c959d]/20 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#ef7335]/20 to-transparent rounded-full blur-2xl"></div>
              
              <div className="text-center relative z-10">
                {/* Central Icon */}
                <div className="w-20 h-20 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                {/* Placeholder Message */}
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {content.comingSoon}
                </h3>
                
                <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                  {content.description}
                </p>

                <div className="bg-gradient-to-r from-[#3c959d]/10 to-[#ef7335]/10 border border-[#3c959d]/20 rounded-xl p-6 mb-8">
                  <p className="text-sm text-gray-700 font-medium">
                    🚧 <span className="text-[#3c959d] font-semibold">{content.underConstruction}</span> - {content.constructionNote}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-[#3c959d] to-[#ef7335] h-2 rounded-full w-1/3 animate-pulse"></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{content.developmentProgress}</p>
                </div>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-md border border-gray-200">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  {content.inDevelopment}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className={`text-center mt-12 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-gray-600 text-sm">
            {content.exploreNote}
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;