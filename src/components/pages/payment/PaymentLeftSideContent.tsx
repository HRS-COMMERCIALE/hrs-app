"use client"
import { useState, useEffect } from 'react';
import { useLanguageStore } from '../../../store/languageStore';

interface PaymentLeftSideContentProps {
    planName: string;
    planPrice: string;
    planCurrency: string;
}

export default function PaymentLeftSideContent({ planName, planPrice, planCurrency }: PaymentLeftSideContentProps) {
    const { currentTranslations } = useLanguageStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="hidden lg:flex lg:w-1/2 h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
            {/* Enhanced Animated Background */}
            <div className="absolute inset-0">
                {/* Multi-layered gradient overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(60,149,157,0.15),transparent)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_-20%_80%,rgba(239,115,53,0.10),transparent)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_80%_20%,rgba(76,165,173,0.08),transparent)]"></div>
                
                {/* Animated mesh gradient */}
                <div className="absolute inset-0 opacity-30">
                    <div 
                        className="absolute inset-0 bg-gradient-to-r from-[#3c959d]/20 via-transparent to-[#ef7335]/20"
                        style={{
                            background: `
                                radial-gradient(circle at 20% 50%, rgba(60,149,157,0.15) 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, rgba(239,115,53,0.12) 0%, transparent 50%),
                                radial-gradient(circle at 40% 80%, rgba(76,165,173,0.10) 0%, transparent 50%)
                            `,
                            animation: 'pulse 4s ease-in-out infinite alternate'
                        }}
                    />
                </div>
                
                {/* Dynamic diagonal patterns */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(60,149,157,0.05)_49%,rgba(60,149,157,0.10)_50%,rgba(60,149,157,0.05)_51%,transparent_52%)] opacity-60 animate-pulse"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(-45deg,transparent_48%,rgba(239,115,53,0.05)_49%,rgba(239,115,53,0.08)_50%,rgba(239,115,53,0.05)_51%,transparent_52%)]" style={{ animationDelay: '2s', animation: 'pulse 3s ease-in-out infinite alternate' }}></div>
                </div>
                
                {/* Animated noise texture */}
                <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                        background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        mixBlendMode: 'overlay'
                    }}
                />
                
                {/* Enhanced floating particles */}
                {mounted && (
                    <div className="absolute inset-0">
                        {/* Large floating orbs */}
                        {[...Array(6)].map((_, i) => (
                            <div
                                key={`orb-${i}`}
                                className="absolute rounded-full blur-sm animate-float"
                                style={{
                                    left: `${20 + Math.random() * 60}%`,
                                    top: `${20 + Math.random() * 60}%`,
                                    width: `${8 + Math.random() * 16}px`,
                                    height: `${8 + Math.random() * 16}px`,
                                    background: i % 2 === 0 
                                        ? 'radial-gradient(circle, rgba(60,149,157,0.6) 0%, rgba(60,149,157,0.1) 70%, transparent 100%)'
                                        : 'radial-gradient(circle, rgba(239,115,53,0.6) 0%, rgba(239,115,53,0.1) 70%, transparent 100%)',
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${4 + Math.random() * 4}s`
                                }}
                            />
                        ))}
                        
                        {/* Small sparkle particles */}
                        {[...Array(12)].map((_, i) => (
                            <div
                                key={`sparkle-${i}`}
                                className="absolute w-1 h-1 rounded-full animate-twinkle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    background: i % 3 === 0 
                                        ? '#3c959d' 
                                        : i % 3 === 1 
                                        ? '#ef7335' 
                                        : '#4ba5ad',
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>
                )}
                
                {/* Flowing wave effect */}
                <div className="absolute inset-0 opacity-10">
                    <div 
                        className="absolute inset-0"
                        style={{
                            background: `
                                linear-gradient(90deg, 
                                    transparent 0%, 
                                    rgba(60,149,157,0.4) 25%, 
                                    rgba(239,115,53,0.3) 50%, 
                                    rgba(76,165,173,0.4) 75%, 
                                    transparent 100%
                                )
                            `,
                            transform: 'translateX(-100%)',
                            animation: 'wave 8s ease-in-out infinite'
                        }}
                    />
                </div>
            </div>

            {/* Enhanced Floating Geometric Elements */}
            <div className="absolute bottom-32 right-20">
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#ef7335]/30 to-[#3c959d]/30 blur-xl group-hover:blur-2xl transition-all duration-700 animate-pulse"></div>
                    <div className="relative w-28 h-28 border-2 border-[#ef7335]/50 rotate-45 backdrop-blur-sm rounded-lg overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#ef7335]/10 to-[#3c959d]/10"></div>
                        <div className="absolute inset-2 border border-[#ef7335]/30 animate-spin rounded-sm" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                            <div className="absolute inset-1 bg-gradient-to-br from-[#3c959d]/20 to-transparent rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute top-1/3 right-10 group">
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#4ba5ad]/30 to-[#ef7335]/30 rounded-xl blur-lg group-hover:blur-xl transition-all duration-500 animate-pulse"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-[#4ba5ad]/20 to-[#ef7335]/20 border border-[#4ba5ad]/40 rounded-xl rotate-12 backdrop-blur-sm overflow-hidden" style={{ animation: 'bounce 3s ease-in-out infinite', animationDelay: '1s' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#4ba5ad]/15 to-[#ef7335]/15"></div>
                        <div className="absolute inset-2 bg-gradient-to-br from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-lg border border-[#4ba5ad]/20">
                            <div className="absolute inset-1 bg-gradient-to-br from-transparent to-[#ef7335]/10 rounded-sm"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="absolute bottom-20 left-32">
                <div className="relative">
                    <div className="absolute inset-0 bg-[#3c959d]/30 blur-md rounded-full animate-pulse"></div>
                    <div className="w-6 h-24 bg-gradient-to-t from-[#3c959d]/40 via-[#4ba5ad]/30 to-transparent rounded-full backdrop-blur-sm relative overflow-hidden" style={{ animationDelay: '0.5s' }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#3c959d]/20 to-transparent rounded-full"></div>
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[#3c959d] rounded-full animate-ping shadow-lg shadow-[#3c959d]/50"></div>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#4ba5ad] rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Enhanced Grid Pattern with depth */}
            <div className="absolute inset-0 opacity-8">
                <div className="h-full w-full relative">
                    <div 
                        className="absolute inset-0 bg-[linear-gradient(rgba(60,149,157,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(60,149,157,0.15)_1px,transparent_1px)] bg-[size:60px_60px]"
                        style={{ animation: 'pulse 6s ease-in-out infinite' }}
                    ></div>
                    <div 
                        className="absolute inset-0 bg-[linear-gradient(rgba(239,115,53,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(239,115,53,0.08)_1px,transparent_1px)] bg-[size:40px_40px]"
                        style={{ animation: 'pulse 4s ease-in-out infinite', animationDelay: '1s' }}
                    ></div>
                </div>
            </div>

            {/* Additional CSS for custom animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-10px) rotate(120deg); }
                    66% { transform: translateY(5px) rotate(240deg); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                
                @keyframes wave {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .animate-twinkle {
                    animation: twinkle 3s ease-in-out infinite;
                }
            `}</style>

            {/* Main Content Container */}
            <div className={`relative z-10 flex flex-col justify-between h-full text-white pl-32 pr-1 lg:pl-40 lg:pr-2 py-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                
                {/* Top Section - Plan Name and Price */}
                <div className="text-center">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                        Subscribe to {planName}
                    </h1>
                    
                    <div className="flex items-baseline justify-center mb-2">
                        <span className="text-5xl lg:text-6xl font-bold text-white">
                            {planPrice}
                        </span>
                        <span className="text-lg lg:text-xl text-slate-300 ml-2 font-medium">
                            {planCurrency}
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm">per month</p>
                </div>

                {/* Middle Section - Design Elements */}
                <div className="flex-1 flex flex-col justify-center items-center">
                    {/* Product Card */}
                    <div className="relative w-full max-w-sm mx-auto mb-8">
                        {/* Card Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl"></div>
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3c959d]/30 to-[#ef7335]/30 rounded-2xl blur opacity-50"></div>
                        
                        <div className="relative p-6">
                            {/* Product Logo and Name */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#3c959d] to-[#ef7335] rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <span className="text-white font-semibold text-lg">{planName}</span>
                                </div>
                                <span className="text-white font-bold text-lg">{planPrice} {planCurrency}</span>
                            </div>

                            {/* Description */}
                            <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                                {planName} includes unlimited business management, advanced CRM features, priority support, secure cloud storage, and mobile app access for your growing business needs.
                            </p>

                            {/* Billing Cycle */}
                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 text-xs">Billed every month</span>
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="w-full max-w-sm mx-auto">
                        <div className="space-y-3">
                            {/* Subtotal */}
                            <div className="flex justify-between items-center">
                                <span className="text-slate-300 text-sm">Subtotal</span>
                                <span className="text-white font-medium">{planPrice} {planCurrency}</span>
                            </div>

                            {/* Tax */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-300 text-sm">Tax</span>
                                    <div className="w-3 h-3 bg-slate-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs text-white">i</span>
                                    </div>
                                </div>
                                <span className="text-white font-medium">0.00 {planCurrency}</span>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-slate-600 my-3"></div>

                            {/* Total */}
                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold">Total due today</span>
                                <span className="text-white font-bold text-lg">{planPrice} {planCurrency}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section - Security Badges */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-slate-400">
                    <div className="flex items-center gap-2 text-sm group hover:text-slate-300 transition-all duration-300">
                        <div className="relative">
                            <svg className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div className="absolute -inset-1 bg-emerald-400/20 rounded-full blur group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                        </div>
                        <span className="font-medium">SSL Secured</span>
                    </div>
                    
                    <div className="hidden sm:block w-px h-4 bg-slate-600"></div>
                    
                    <div className="flex items-center gap-2 text-sm group hover:text-slate-300 transition-all duration-300">
                        <div className="relative">
                            <svg className="w-4 h-4 text-[#3c959d] group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <div className="absolute -inset-1 bg-[#3c959d]/20 rounded-full blur group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                        </div>
                        <span className="font-medium">PCI Compliant</span>
                    </div>
                </div>
            </div>
        </div>
    );
}