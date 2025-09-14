'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '../../../store/languageStore';
import HeroSection from '../../../components/pages/HomePage/HeroSection';
import BusinessSolutions from '../../../components/pages/HomePage/BusinessSolutions';
import BusinessPlan from '../../../components/pages/HomePage/businessPlan';
import AboutUs from '../../../components/pages/HomePage/AboutUs';
import Footer from '../../../components/pages/HomePage/footer';

export default function BusinessPlansPage() {
    const { currentTranslations } = useLanguageStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335] overflow-hidden">
                <div className="absolute inset-0">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3c959d]/30 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#ef7335]/15 via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4ba5ad]/10 via-transparent to-transparent"></div>
                    
                    {/* Grid Pattern */}
                    <div className="absolute inset-0 opacity-8">
                        <div className="h-full w-full bg-[linear-gradient(rgba(60,149,157,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(60,149,157,0.15)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-16 right-24 w-40 h-40 border-2 border-[#3c959d]/20 rounded-full animate-spin opacity-50" style={{ animationDuration: '25s' }}></div>
                    <div className="absolute bottom-32 left-16 w-32 h-32 border-2 border-[#ef7335]/18 rotate-45 animate-pulse opacity-40"></div>
                    <div className="absolute top-1/3 right-12 w-16 h-16 bg-gradient-to-br from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-2xl rotate-12 animate-bounce opacity-60" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="space-y-8">
                        {/* Logo */}
                        <div className="inline-flex items-center justify-center">
                            <div className="relative group">
                                <div className="absolute -inset-3 border-2 border-gradient-to-r from-[#3c959d]/30 to-[#ef7335]/30 rounded-full animate-spin opacity-40" style={{ animationDuration: '8s' }}></div>
                                <div className="absolute -inset-1 border border-[#4ba5ad]/20 rounded-full animate-ping opacity-30" style={{ animationDuration: '2s' }}></div>
                                <img 
                                    src="/logo.png" 
                                    alt="Tunisie Business Solutions Logo" 
                                    className="h-20 w-auto object-contain transform group-hover:scale-105 transition-all duration-300 filter drop-shadow-lg relative z-10"
                                />
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-[#f8fafc] to-white bg-clip-text text-transparent leading-tight">
                                Business Plans
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
                                Choose the perfect plan for your business growth and success
                            </p>
                            
                            {/* Decorative Line */}
                            <div className="w-24 h-1 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full mx-auto opacity-80"></div>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white font-semibold text-lg hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                <span className="relative z-10">View All Plans</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            </button>
                            <button className="group relative px-8 py-4 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-xl text-white font-semibold text-lg hover:scale-105 transition-all duration-300">
                                <span className="relative z-10">Get Started Today</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#2a7a82] to-[#d45f2a] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Plans Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-[#3c959d] to-slate-800 bg-clip-text text-transparent mb-6">
                            Our Business Plans
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Tailored solutions designed to meet your business needs and help you achieve your goals
                        </p>
                        <div className="w-20 h-1 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full mx-auto mt-6"></div>
                    </div>

                    {/* Business Plan Component */}
                    <BusinessPlan />
                </div>
            </section>

            {/* About Us Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AboutUs />
                </div>
            </section>

            {/* Business Solutions Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BusinessSolutions />
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
