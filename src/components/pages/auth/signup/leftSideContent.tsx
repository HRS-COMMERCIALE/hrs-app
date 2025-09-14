"use client"
import { useState, useEffect } from 'react';
import { useLanguageStore } from '../../../../store/languageStore';

export default function LeftSideContent() {
    const { currentTranslations } = useLanguageStore();

    const [mounted, setMounted] = useState(false);
    

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0">
                {/* Primary gradient overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3c959d]/15 via-slate-900/50 to-slate-900"></div>
                
                {/* Animated diagonal streaks */}
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(60,149,157,0.03)_26%,rgba(60,149,157,0.08)_27%,transparent_28%,transparent_100%)] animate-pulse"></div>
                <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_70%,rgba(239,115,53,0.04)_71%,rgba(239,115,53,0.06)_72%,transparent_73%,transparent_100%)]" style={{ animationDelay: '1s' }}></div>
                
                {/* Floating particles effect (render after mount to avoid hydration mismatch) */}
                {mounted && (
                    <div className="absolute inset-0 opacity-20">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-[#3c959d] rounded-full animate-ping"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Enhanced Floating Geometric Elements */}
            <div className="absolute bottom-32 right-20">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ef7335]/20 to-[#3c959d]/20 blur-lg group-hover:blur-xl transition-all duration-500"></div>
                    <div className="relative w-28 h-28 border-2 border-[#ef7335]/40 rotate-45 animate-pulse backdrop-blur-sm">
                        <div className="absolute inset-2 border border-[#ef7335]/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                    </div>
                </div>
            </div>
            
            <div className="absolute top-1/3 right-10 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-lg blur-md group-hover:blur-lg transition-all duration-300"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#4ba5ad]/15 to-[#ef7335]/15 border border-[#4ba5ad]/30 rounded-lg rotate-12 animate-bounce backdrop-blur-sm" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                        <div className="absolute inset-2 bg-gradient-to-br from-[#4ba5ad]/10 to-[#ef7335]/10 rounded-sm"></div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-20 left-32">
                <div className="w-6 h-24 bg-gradient-to-t from-[#3c959d]/30 via-[#4ba5ad]/20 to-transparent rounded-full animate-pulse backdrop-blur-sm" style={{ animationDelay: '0.5s' }}>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#3c959d] rounded-full animate-ping"></div>
                </div>
            </div>

            {/* Enhanced Grid Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="h-full w-full bg-[linear-gradient(rgba(60,149,157,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(60,149,157,0.2)_1px,transparent_1px)] bg-[size:40px_40px] animate-pulse" style={{ animationDuration: '4s' }}></div>
            </div>

            {/* Main Content Container */}
            <div className={`relative z-10 flex flex-col items-center justify-center h-full text-white px-12 py-16 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                
                {/* Enhanced Hero Section */}
                <div className="text-center mb-12 max-w-xl">
                    <h1 className="text-6xl font-bold mb-8 leading-tight">
                        <span className="block text-white drop-shadow-lg mb-2">Join Our</span>
                        <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent">
                            HRS Platform
                        </span>
                    </h1>
                    
                    <p className="text-xl text-slate-300 leading-relaxed max-w-lg mx-auto font-light">
                        Create your account and start managing your business with our comprehensive solutions.
                    </p>
                </div>

                {/* Enhanced Feature Highlights */}
                <div className="grid grid-cols-3 gap-8 w-full max-w-3xl mb-12">
                    {[
                        {
                            icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
                            title: "Secure Registration",
                            subtitle: "Bank-level security for your data",
                            color: "#3c959d",
                            gradient: "from-[#3c959d]/20 to-[#4ba5ad]/20"
                        },
                        {
                            icon: "M13 10V3L4 14h7v7l9-11h-7z",
                            title: "Quick Setup",
                            subtitle: "Get started in minutes",
                            color: "#4ba5ad",
                            gradient: "from-[#4ba5ad]/20 to-[#ef7335]/20"
                        },
                        {
                            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
                            title: "Reliable Platform",
                            subtitle: "99.9% uptime guarantee",
                            color: "#ef7335",
                            gradient: "from-[#ef7335]/20 to-[#3c959d]/20"
                        }
                    ].map((feature, index) => (
                        <div key={index} className="text-center group cursor-pointer" style={{ animationDelay: `${index * 200}ms` }}>
                            <div className="relative mb-6">
                                <div className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-xl group-hover:blur-sm opacity-50 group-hover:opacity-80 transition-all duration-500`}></div>
                                <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800/80 to-slate-700/80 border border-slate-600/50 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-sm group-hover:scale-110 group-hover:border-opacity-80 transition-all duration-500 shadow-xl" style={{ borderColor: `${feature.color}40` }}>
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl"></div>
                                    <svg className="relative w-10 h-10 transition-all duration-300 group-hover:scale-110" fill="none" stroke={feature.color} viewBox="0 0 24 24" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon} />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="font-bold text-white text-base mb-2 group-hover:text-opacity-90 transition-all duration-300">{feature.title}</h3>
                            <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-all duration-300 font-medium">{feature.subtitle}</p>
                        </div>
                    ))}
                </div>

                {/* Enhanced Security Badges */}
                <div className="flex items-center justify-center gap-8 text-slate-400">
                    <div className="flex items-center gap-3 text-base group hover:text-slate-300 transition-all duration-300">
                        <div className="relative">
                            <svg className="w-6 h-6 text-emerald-400 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                        </div>
                        <span className="font-semibold">SOC2 Compliant</span>
                    </div>
                    
                    <div className="w-px h-6 bg-slate-600"></div>
                    
                    <div className="flex items-center gap-3 text-base group hover:text-slate-300 transition-all duration-300">
                        <div className="relative">
                            <svg className="w-6 h-6 text-[#3c959d] group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div className="absolute -inset-1 bg-[#3c959d]/20 rounded-full blur group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                        </div>
                        <span className="font-semibold">GDPR Ready</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
