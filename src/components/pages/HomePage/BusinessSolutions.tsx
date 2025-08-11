"use client"
import React, { useState, useEffect, useRef } from 'react';

const BusinessSolutions = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  const nextSlide = () => {
    setActiveTab((prev) => (prev + 1) % solutions.length);
  };

  const prevSlide = () => {
    setActiveTab((prev) => (prev - 1 + solutions.length) % solutions.length);
  };

  const goToSlide = (index: number) => {
    setActiveTab(index);
  };

  const solutions = [
    {
      title: "Sales & Invoicing",
      subtitle: "Get Paid Faster",
      description: "Create professional invoices in seconds. Track payments automatically. Never chase money again.",
      features: [
        "Invoice in 30 seconds",
        "Auto-payment reminders",
        "Real-time payment tracking",
        "Professional templates",
        "Multi-currency support"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Inventory Control",
      subtitle: "Stop Losing Money",
      description: "Know exactly what you have, where it is, and when to reorder. Eliminate stockouts and overstock.",
      features: [
        "Real-time stock levels",
        "Auto-reorder alerts",
        "Multi-warehouse tracking",
        "Barcode scanning",
        "Stock value reports"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      title: "Financial Dashboard",
      subtitle: "See Your Money",
      description: "Know your cash flow instantly. Make decisions based on real numbers, not guesses.",
      features: [
        "Live cash flow view",
        "Profit & loss tracking",
        "Expense categorization",
        "Tax-ready reports",
        "Bank reconciliation"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Customer Management",
      subtitle: "Grow Your Business",
      description: "Keep customers happy and coming back. Track every interaction and never miss an opportunity.",
      features: [
        "Customer database",
        "Sales history tracking",
        "Follow-up reminders",
        "Customer insights",
        "Mobile CRM access"
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Simple Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d]/15 to-[#ef7335]/15 backdrop-blur-sm border border-[#3c959d]/30 rounded-full px-6 py-3 text-sm mb-8">
            <div className="relative">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-slate-200 font-medium">Core Business Solutions</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
            Stop Losing Money,
            <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent">
              Start Growing !
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
            Most businesses waste 20% of their revenue on inefficiencies. Our platform eliminates waste, 
            automates tedious tasks, and gives you the insights to make more money. 
            <span className="text-[#4ba5ad] font-semibold"> Start seeing results in 30 days.</span>
          </p>
        </div>

        {/* Solution Preview Cards - Navigation */}
        <div className={`mb-12 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {solutions.map((solution, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                    index === activeTab
                      ? 'bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 border border-[#3c959d]/40 scale-105 shadow-lg shadow-[#3c959d]/20'
                      : 'bg-slate-800/30 border border-slate-700/30 hover:bg-slate-700/40 hover:border-[#3c959d]/30 hover:scale-105'
                  }`}
                >
                  <div className="text-3xl mb-3">{solution.icon}</div>
                  <h4 className={`text-sm font-semibold ${
                    index === activeTab ? 'text-[#3c959d]' : 'text-slate-300'
                  }`}>
                    {solution.title}
                  </h4>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Solutions Carousel */}
        <div className={`mb-20 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-6xl mx-auto relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-[#3c959d]/50 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-[#3c959d]/50 transition-all duration-300 hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Active Solution Display */}
            <div className="bg-gradient-to-r from-[#3c959d]/10 via-slate-800/50 to-[#ef7335]/10 backdrop-blur-lg border border-[#3c959d]/30 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div>
                  <div className="text-[#4ba5ad] mb-6">
                    {solutions[activeTab].icon}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {solutions[activeTab].title}
                  </h3>
                  
                  <p className="text-lg font-semibold mb-4 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent">
                    {solutions[activeTab].subtitle}
                  </p>
                  
                  <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                    {solutions[activeTab].description}
                  </p>

                  <button className="group bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] text-white font-bold px-10 py-5 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#3c959d]/25 hover:scale-105 flex items-center gap-3">
                    Learn More
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                  </button>
                </div>

                {/* Features List */}
                <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-slate-700/30">
                  <h4 className="text-xl font-bold text-white mb-6">Key Features</h4>
                  <ul className="space-y-4">
                    {solutions[activeTab].features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-slate-300">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] flex-shrink-0"></div>
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {solutions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTab
                      ? 'bg-[#3c959d] w-8'
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`text-center transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-slate-800/80 via-slate-900/80 to-slate-800/80 backdrop-blur-lg border border-[#3c959d]/20 rounded-3xl p-12 text-center shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Stop Losing Money?
            </h3>
            <p className="text-slate-300 text-lg mb-10 max-w-3xl mx-auto">
              Join 10,000+ businesses that have increased their profits by an average of 35% in the first year.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="group bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] text-white font-bold px-12 py-6 rounded-2xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#3c959d]/25 min-w-[220px]">
                <span className="flex items-center justify-center gap-3">
                  Start Free Trial
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </span>
              </button>
              <button className="border-2 border-[#3c959d]/50 text-[#3c959d] hover:bg-[#3c959d]/10 font-semibold px-12 py-6 rounded-2xl text-lg transition-all duration-300 hover:border-[#3c959d] hover:shadow-lg hover:shadow-[#3c959d]/20 min-w-[220px] backdrop-blur-sm">
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a2.5 2.5 0 010 5H9V10z" />
                  </svg>
                  Watch Demo
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSolutions;