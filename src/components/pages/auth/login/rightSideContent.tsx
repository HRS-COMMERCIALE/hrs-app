'use client';

import { useState, useEffect } from 'react';

export default function RightSideContent() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            console.log('Login attempt:', formData);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="flex-1 flex items-center justify-center min-h-screen w-full bg-gradient-to-bl from-slate-50 via-white to-slate-100 relative overflow-hidden">
            {/* Enhanced Background Elements - Full Screen Coverage */}
            <div className="absolute inset-0 w-full h-full">
                {/* Primary gradient overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3c959d]/8 via-white to-white"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#ef7335]/5 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4ba5ad]/3 via-transparent to-transparent"></div>
                
                {/* Enhanced grid pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="h-full w-full bg-[linear-gradient(rgba(60,149,157,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(60,149,157,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                </div>
                
                {/* Floating geometric elements */}
                <div className="absolute top-16 right-24 w-40 h-40 border-2 border-[#3c959d]/15 rounded-full animate-spin opacity-40" style={{ animationDuration: '25s' }}></div>
                <div className="absolute bottom-32 left-16 w-32 h-32 border-2 border-[#ef7335]/12 rotate-45 animate-pulse opacity-30"></div>
                <div className="absolute top-1/3 right-12 w-12 h-12 bg-gradient-to-br from-[#4ba5ad]/15 to-[#ef7335]/15 rounded-xl rotate-12 animate-bounce opacity-50" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-gradient-to-tr from-[#3c959d]/20 to-[#4ba5ad]/20 rounded-lg rotate-45 animate-pulse opacity-40" style={{ animationDelay: '2s' }}></div>
                
                {/* Additional floating elements */}
                <div className="absolute top-1/2 left-8 w-6 h-6 border border-[#ef7335]/20 rounded-full animate-ping opacity-30" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute top-1/4 right-1/3 w-10 h-10 bg-gradient-to-br from-[#3c959d]/10 to-[#ef7335]/10 rounded-full animate-bounce opacity-35" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
                
                {/* Enhanced floating particles */}
                <div className="absolute inset-0 opacity-20">
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full animate-ping"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 4}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                {/* Subtle wave effects */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#3c959d]/5 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#ef7335]/5 via-transparent to-transparent"></div>
            </div>

            {/* Main Form Container - Full Screen Coverage */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center px-6 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                
                {/* Form Card - Enhanced Design */}
                <div className="relative max-w-md w-full">
                    {/* Enhanced card background with improved glassmorphism */}
                    <div className="absolute inset-0 bg-white/25 backdrop-blur-2xl rounded-3xl border border-white/40 shadow-2xl shadow-slate-900/15"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#3c959d]/15 via-transparent to-[#ef7335]/12 rounded-3xl"></div>
                    
                    {/* Enhanced border glow */}
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#3c959d]/40 via-[#4ba5ad]/30 to-[#ef7335]/40 rounded-3xl blur-md opacity-90"></div>
                    
                    <div className="relative p-10">
                        {/* Enhanced Header Section */}
                        <div className="text-center mb-10">
                            {/* Enhanced Logo/Icon */}
                            <div className="inline-flex items-center justify-center mb-8">
                                <div className="relative group">
                                    <img 
                                        src="/logo.png" 
                                        alt="Tunisie Business Solutions Logo" 
                                        className="h-16 w-auto object-contain transform group-hover:scale-105 transition-all duration-300 filter drop-shadow-lg"
                                    />
                                </div>
                            </div>

                            <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-4">
                                Welcome Back
                            </h2>
                            <p className="text-lg text-slate-600 font-light">
                                Sign in to continue your journey with us
                            </p>
                        </div>

                        {/* Enhanced Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Enhanced Email Field */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    {/* Enhanced input background glow */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d]/25 to-[#4ba5ad]/25 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400 group-hover:text-[#3c959d] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            className="relative block w-full pl-12 pr-4 py-4 bg-white/90 border border-white/60 rounded-xl shadow-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3c959d]/40 focus:border-[#3c959d] transition-all duration-300 backdrop-blur-sm text-slate-800 font-medium"
                                            placeholder="Enter your email address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Password Field */}
                            <div className="space-y-3">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                    Password
                                </label>
                                <div className="relative group">
                                    {/* Enhanced input background glow */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#4ba5ad]/25 to-[#ef7335]/25 rounded-xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-slate-400 group-hover:text-[#4ba5ad] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            className="relative block w-full pl-12 pr-14 py-4 bg-white/90 border border-white/60 rounded-xl shadow-lg placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ba5ad]/40 focus:border-[#4ba5ad] transition-all duration-300 backdrop-blur-sm text-slate-800 font-medium"
                                            placeholder="Enter your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:scale-110 transition-all duration-200"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5 text-slate-400 hover:text-[#ef7335] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-slate-400 hover:text-[#ef7335] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Enhanced Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center group">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#3c959d] focus:ring-[#3c959d]/30 border-slate-300 rounded transition-all duration-200"
                                    />
                                    <label htmlFor="remember-me" className="ml-3 text-sm text-slate-600 group-hover:text-slate-800 transition-colors duration-200 font-medium">
                                        Remember me
                                    </label>
                                </div>
                                <div>
                                    <a href="#" className="text-sm font-semibold text-[#3c959d] hover:text-[#4ba5ad] transition-colors duration-200 hover:underline decoration-2 underline-offset-4">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* Enhanced Submit Button */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="group relative w-full overflow-hidden"
                                >
                                    {/* Enhanced button background */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-xl"></div>
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d]/90 via-[#4ba5ad]/90 to-[#ef7335]/90 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                    
                                    {/* Enhanced button glow */}
                                    <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-xl blur opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                                    
                                    <div className="relative flex items-center justify-center py-4 px-6 text-white font-semibold text-lg group-hover:scale-[0.98] transition-all duration-200">
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing you in...
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span>Sign In</span>
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
                                <p className="text-slate-600">
                                    Don't have an account?{' '}
                                    <a href="/register" className="font-semibold text-[#3c959d] hover:text-[#4ba5ad] transition-colors duration-200 hover:underline decoration-2 underline-offset-4">
                                        Create your account
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