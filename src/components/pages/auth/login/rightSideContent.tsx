'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '../../../../store/languageStore';
import { apiClient } from '../../../../utils/client/client';
import { getCurrentIP } from '../../../../utils/help/ipProvider/ipProvider';

export default function RightSideContent() {
    const { currentTranslations } = useLanguageStore();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [currentIP, setCurrentIP] = useState<string>('Detecting...');
    const [isFetchingIP, setIsFetchingIP] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // Fetch IP address on component mount
        const fetchIP = async () => {
            setIsFetchingIP(true);
            try {
                const result = await getCurrentIP();
                setCurrentIP(result.ip);
            } catch (error) {
                console.warn('Failed to fetch IP:', error);
                setCurrentIP('Unknown');
            } finally {
                setIsFetchingIP(false);
            }
        };
        
        fetchIP();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const refreshIP = async () => {
        setIsFetchingIP(true);
        try {
            const result = await getCurrentIP();
            setCurrentIP(result.ip);
        } catch (error) {
            console.warn('Failed to refresh IP:', error);
            setCurrentIP('Unknown');
        } finally {
            setIsFetchingIP(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Prevent multiple submissions
        if (isLoading || isSubmitted) {
            return;
        }
        
        setIsLoading(true);
        setIsSubmitted(true);
        
        try {
            
            // Use the current IP address (already fetched on mount)
            const realIP = currentIP === 'Unknown' ? '127.0.0.1' : currentIP;
            
            const response = await apiClient
                .post()
                .to('/api/auth/login')
                .withBody({
                    email: formData.email,
                    password: formData.password,
                    ip: realIP,
                    userAgent: navigator.userAgent
                })
                .execute();
                
            
            if (response.success) {
                // Redirect to dashboard or handle success
                window.location.href = '/dashboard';
            } else {
                console.error('Login failed:', response.error);
                // Handle error (you can add error state and display it)
                alert(response.error || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335] relative overflow-hidden">
            {/* Enhanced Background Elements - Full Screen Coverage */}
            <div className="absolute inset-0 w-full h-full">
                {/* Primary gradient overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3c959d]/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#ef7335]/15 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4ba5ad]/10 via-transparent to-transparent"></div>
             
                {/* Enhanced grid pattern with animation */}
                <div className="absolute inset-0 opacity-8">
                    <div className="h-full w-full bg-[linear-gradient(rgba(60,149,157,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(60,149,157,0.15)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                </div>
                
                {/* Animated Exponential Curves */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1200 800" preserveAspectRatio="none">
                    {/* Exponential curve 1 */}
                    <path
                        d="M0,400 Q300,200 600,300 T1200,100"
                        fill="none"
                        stroke="url(#gradient1)"
                        strokeWidth="2"
                        className="animate-pulse"
                        style={{ animationDuration: '3s' }}
                    />
                    {/* Exponential curve 2 */}
                    <path
                        d="M0,600 Q400,400 800,500 T1200,300"
                        fill="none"
                        stroke="url(#gradient2)"
                        strokeWidth="1.5"
                        className="animate-pulse"
                        style={{ animationDuration: '4s', animationDelay: '1s' }}
                    />
                    {/* Exponential curve 3 */}
                    <path
                        d="M200,800 Q500,100 900,200 T1200,600"
                        fill="none"
                        stroke="url(#gradient3)"
                        strokeWidth="1"
                        className="animate-pulse"
                        style={{ animationDuration: '5s', animationDelay: '2s' }}
                    />
                    
                    <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3c959d" stopOpacity="0.6" />
                            <stop offset="50%" stopColor="#4ba5ad" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ef7335" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ef7335" stopOpacity="0.5" />
                            <stop offset="50%" stopColor="#4ba5ad" stopOpacity="0.7" />
                            <stop offset="100%" stopColor="#3c959d" stopOpacity="0.3" />
                        </linearGradient>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4ba5ad" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#3c959d" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#ef7335" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Enhanced Floating geometric elements */}
                <div className="absolute top-16 right-24 w-40 h-40 border-2 border-[#3c959d]/20 rounded-full animate-spin opacity-50" style={{ animationDuration: '25s' }}></div>
                <div className="absolute bottom-32 left-16 w-32 h-32 border-2 border-[#ef7335]/18 rotate-45 animate-pulse opacity-40"></div>
                <div className="absolute top-1/3 right-12 w-16 h-16 bg-gradient-to-br from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-2xl rotate-12 animate-bounce opacity-60" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-gradient-to-tr from-[#3c959d]/25 to-[#4ba5ad]/25 rounded-xl rotate-45 animate-pulse opacity-50" style={{ animationDelay: '2s' }}></div>
                
                {/* Moving lines/streaks */}
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#3c959d]/30 to-transparent animate-pulse" style={{ animationDuration: '6s' }}></div>
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ef7335]/25 to-transparent animate-pulse" style={{ animationDuration: '8s', animationDelay: '3s' }}></div>
                
                {/* Enhanced floating particles (render after mount to avoid hydration mismatch) */}
                {mounted && (
                    <div className="absolute inset-0 opacity-25">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-2 h-2 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full animate-ping"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${2 + Math.random() * 4}s`
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Enhanced wave effects */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#3c959d]/8 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#ef7335]/8 via-transparent to-transparent"></div>
            </div>

            {/* Main Form Container - Enhanced */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center px-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                {/* Form Card - Enhanced Design */}
                <div className="relative max-w-md w-full">
                    {/* Enhanced card background with multiple layers */}
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-3xl border border-white/90 shadow-2xl shadow-slate-900/20"></div>
                    
                    {/* Subtle animated border glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3c959d]/30 via-[#4ba5ad]/30 to-[#ef7335]/30 rounded-3xl blur-sm opacity-50 animate-pulse" style={{ animationDuration: '3s' }}></div>
                    
                    {/* Inner content shadow */}
                    <div className="absolute inset-2 bg-gradient-to-br from-white/80 to-white/60 rounded-3xl"></div>
                    
                    <div className="relative p-8 sm:p-10">
                        {/* Enhanced Header Section */}
                        <div className="text-center mb-8">
                            {/* Enhanced Logo/Icon with animated ring */}
                            <div className="inline-flex items-center justify-center mb-6">
                                <div className="relative group">
                                    {/* Animated ring around logo */}
                                    <div className="absolute -inset-3 border-2 border-gradient-to-r from-[#3c959d]/30 to-[#ef7335]/30 rounded-full animate-spin opacity-40" style={{ animationDuration: '8s' }}></div>
                                    <div className="absolute -inset-1 border border-[#4ba5ad]/20 rounded-full animate-ping opacity-30" style={{ animationDuration: '2s' }}></div>
                                    
                                    <img 
                                        src="/logo.png" 
                                        alt="Tunisie Business Solutions Logo" 
                                        className="h-14 w-auto object-contain transform group-hover:scale-105 transition-all duration-300 filter drop-shadow-lg relative z-10"
                                    />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-[#3c959d] to-slate-800 bg-clip-text text-transparent mb-4 tracking-tight">
                                {currentTranslations.auth.login.welcomeBack}
                            </h2>
                            <p className="text-base text-slate-600 font-light leading-relaxed">
                                {currentTranslations.auth.login.subtitle}
                            </p>
                            
                            {/* Decorative line */}
                            <div className="w-16 h-[3px] bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full mx-auto mt-4 opacity-60"></div>
                        </div>

                        {/* Enhanced Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Enhanced Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 tracking-wide uppercase">
                                    {currentTranslations.auth.login.emailLabel}
                                </label>
                                <div className="relative group">
                                    {/* Enhanced multi-layer glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d]/30 to-[#4ba5ad]/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3c959d]/20 to-[#4ba5ad]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                                    
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400 group-hover:text-[#3c959d] group-focus-within:text-[#3c959d] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="relative block w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3c959d]/20 focus:border-[#3c959d] transition-all duration-200 text-slate-800 text-base"
                                            placeholder={currentTranslations.auth.login.emailPlaceholder}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Password Field */}
                            <div className="space-y-3">
                                <label htmlFor="password" className="block text-sm font-bold text-slate-700 tracking-wide uppercase">
                                    {currentTranslations.auth.login.passwordLabel}
                                </label>
                                <div className="relative group">
                                    {/* Enhanced multi-layer glow effect */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#4ba5ad]/30 to-[#ef7335]/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                                    
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400 group-hover:text-[#4ba5ad] group-focus-within:text-[#4ba5ad] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="relative block w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ba5ad]/20 focus:border-[#4ba5ad] transition-all duration-200 text-slate-800 text-base"
                                            placeholder={currentTranslations.auth.login.passwordPlaceholder}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-all duration-200 group/btn"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5 text-slate-400 hover:text-[#ef7335] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-slate-400 hover:text-[#ef7335] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between pt-2">
                                <div className="flex items-center group">
                                    <div className="relative">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-[#3c959d] focus:ring-[#3c959d]/30 border-slate-300 rounded-md transition-all duration-200 cursor-pointer"
                                        />
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d]/20 to-[#4ba5ad]/20 rounded-md opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                                    </div>
                                    <label htmlFor="remember-me" className="ml-3 text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-200 font-medium cursor-pointer">
                                        {currentTranslations.auth.login.rememberMe}
                                    </label>
                                </div>
                                <div>
                                    <a href="#" className="text-sm font-semibold text-[#3c959d] hover:text-[#4ba5ad] transition-all duration-200 hover:underline decoration-2 underline-offset-4 relative group">
                                        <span className="relative z-10">{currentTranslations.auth.login.forgotPassword}</span>
                                        <div className="absolute -inset-2 bg-gradient-to-r from-[#3c959d]/10 to-[#4ba5ad]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                                    </a>
                                </div>
                            </div>

                            {/* IP Address Indicator */}
                            <div className="pt-2 pb-1">
                                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                                    {isFetchingIP ? (
                                        <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Detecting IP address...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <span>IP: {currentIP}</span>
                                            <button
                                                type="button"
                                                onClick={refreshIP}
                                                className="p-1 hover:bg-slate-100 rounded-full transition-colors duration-200"
                                                title="Refresh IP address"
                                            >
                                                <svg className="h-3 w-3 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Enhanced Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full overflow-hidden"
                                >
                                    {/* Enhanced button background with animation */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-xl"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#2a7a82] via-[#3d94a0] to-[#d45f2a] rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    
                                    {/* Animated shimmer effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                    
                                    {/* Enhanced button glow */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-xl blur opacity-30 group-hover:opacity-60 transition-all duration-300"></div>
                                    
                                    <div className="relative flex items-center justify-center py-3.5 px-6 text-white font-semibold text-base group-hover:scale-[0.995] transition-all duration-200 tracking-wide">
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="animate-pulse">{currentTranslations.auth.login.submit.loading}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span>{currentTranslations.auth.login.submit.idle}</span>
                                                <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Enhanced Sign Up Link */}
                            <div className="text-center pt-4">
                                <p className="text-slate-600 text-base">
                                    {currentTranslations.auth.login.noAccount}{' '}
                                    <a href="/register" className="font-semibold text-[#3c959d] hover:text-[#4ba5ad] transition-all duration-200 hover:underline decoration-2 underline-offset-4 relative group">
                                        <span className="relative z-10">{currentTranslations.auth.login.createAccount}</span>
                                        <div className="absolute -inset-2 bg-gradient-to-r from-[#3c959d]/10 to-[#4ba5ad]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
                                    </a>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}