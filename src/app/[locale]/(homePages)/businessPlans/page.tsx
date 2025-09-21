'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/hooks';
import Header from '@/components/layout/Header/Header';
import BusinessPlan from '@/components/pages/HomePage/businessPlan';
import AboutUs from '@/components/pages/HomePage/AboutUs';
import Footer from '@/components/pages/HomePage/footer';
import { companyInfo } from '@/libs/config/companyInfo';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { CreditCard } from 'lucide-react';

export default function BusinessPlansPage() {
    const [mounted, setMounted] = useState(false);
    const { tNested } = useI18n();
    const t = tNested('businessPlans');

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <LoadingSpinner icon={CreditCard} message={t('loading')} />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Header />
            
            {/* Hero Section */}
            <section className="relative h-[70vh] overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16 rounded-b-3xl">
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

                <div className="container mx-auto px-6 pt-20 pb-16 relative z-10 h-full flex items-center">
                    <div className="text-center max-w-6xl mx-auto w-full">
                        {/* Status Badge */}
                        <div className="mb-8 transform transition-all duration-1000">
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d]/15 to-[#ef7335]/15 backdrop-blur-sm border border-[#3c959d]/30 rounded-full px-6 py-3 text-sm">
                                <div className="relative">
                                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                    <div className="absolute inset-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                                </div>
                                <span className="text-slate-200 font-medium">{t('hero.badge')}</span>
                            </div>
                        </div>

                        {/* Main Hero Content */}
                        <div className="mb-12">
                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight transform transition-all duration-1000">
                                <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-4">
                                    {t('hero.title.line1')}
                                </span>
                                <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent relative">
                                    {t('hero.title.line2')}
                                    <div className="absolute -inset-2 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 blur-xl -z-10 animate-pulse"></div>
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed transform transition-all duration-1000">
                                {t('hero.description')}
                                <span className="text-[#4ba5ad] font-semibold">{t('hero.descriptionHighlight')}</span>
                            </p>

                            {/* Trust Indicators */}
                            <div className="transform transition-all duration-1000">
                                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                        {companyInfo.trustIndicators.setup}
                                    </span>
                                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                        {companyInfo.trustIndicators.cancel}
                                    </span>
                                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                                        </svg>
                                        {companyInfo.trustIndicators.security}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Plans Section */}
            <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#3c959d]/5 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-full h-32 bg-gradient-to-t from-[#ef7335]/5 to-transparent"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#3c959d]/10 to-[#ef7335]/10 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="w-12 h-1 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full"></div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 via-[#3c959d] to-slate-800 bg-clip-text text-transparent mb-6 leading-tight">
                            {t('section.title')}
                        </h2>
                        <div className="max-w-5xl mx-auto leading-relaxed">
                            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#3c959d] to-[#ef7335] bg-clip-text text-transparent mb-4">
                                {t('section.subtitle')}
                            </h3>
                            <h4 className="text-lg md:text-xl font-semibold text-slate-700 mb-6">
                                {t('section.description')}
                            </h4>
                            <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                                {t('section.content')}
                            </p>
                        </div>
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


            {/* Footer */}
            <Footer />
        </div>
    );
}
