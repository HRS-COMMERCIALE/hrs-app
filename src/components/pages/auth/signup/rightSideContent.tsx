'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '../../../../store/languageStore';
import { apiClient } from '../../../../utils/client/client';
import { useRouter } from 'next/navigation';

export default function RightSideContent() {
    const { currentTranslations } = useLanguageStore();
    const router = useRouter();

    const [formData, setFormData] = useState({
        status: 'active',
        title: '',
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        landline: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const [apiError, setApiError] = useState<string>('');
    const [apiErrors, setApiErrors] = useState<{[key: string]: string}>({});

    // Password strength calculation
    const getPasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score <= 2) return { level: 'weak', color: 'bg-red-500', text: 'Weak' };
        if (score <= 4) return { level: 'medium', color: 'bg-yellow-500', text: 'Medium' };
        return { level: 'strong', color: 'bg-green-500', text: 'Strong' };
    };

    const passwordStrength = getPasswordStrength(formData.password);

    // Validation functions
    const validateField = (name: string, value: string) => {
        const newErrors = { ...errors };
        
        switch (name) {
            case 'firstName':
                if (!value.trim()) newErrors.firstName = 'Required';
                else if (value.trim().length < 2) newErrors.firstName = 'Too short';
                else delete newErrors.firstName;
                break;
            case 'lastName':
                if (!value.trim()) newErrors.lastName = 'Required';
                else if (value.trim().length < 2) newErrors.lastName = 'Too short';
                else delete newErrors.lastName;
                break;
            case 'email':
                if (!value.trim()) newErrors.email = 'Required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = 'Invalid email';
                else delete newErrors.email;
                break;
            case 'mobile':
                if (!value.trim()) newErrors.mobile = 'Required';
                else if (!/^\d+$/.test(value)) newErrors.mobile = 'Must be a number';
                else delete newErrors.mobile;
                break;
            case 'password':
                if (!value) newErrors.password = 'Required';
                else if (value.length < 8) newErrors.password = 'Too short';
                else delete newErrors.password;
                break;
            case 'landline':
                if (value.trim() && !/^\d+$/.test(value)) newErrors.landline = 'Must be a number';
                else delete newErrors.landline;
                break;
        }
        
        setErrors(newErrors);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        validateField(name, value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Clear previous API errors
        setApiError('');
        setApiErrors({});
        
        // Prevent multiple submissions
        if (isLoading || isSubmitted) {
            return;
        }

        // Validate all fields before submission
        const newErrors: {[key: string]: string} = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'Required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Required';
        if (!formData.title.trim()) newErrors.title = 'Required';
        if (!formData.email.trim()) newErrors.email = 'Required';
        if (!formData.mobile.trim()) newErrors.mobile = 'Required';
        if (!formData.password.trim()) newErrors.password = 'Required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        setIsSubmitted(true);

        try {
            const response = await apiClient
                .post()
                .to('/api/auth/signUp')
                .withBody(formData)
                .execute();
            
            if (response && response.success) {
                // Redirect to email verification page
                window.location.href = '/verify-email';
            } else {
                // Reset isSubmitted to allow retry
                setIsSubmitted(false);
                
                // Handle API response errors - check multiple possible locations
                const errors = response?.errors || response?.data?.errors;
                const message = response?.message || response?.data?.message || response?.error;
                
                if (errors && Array.isArray(errors)) {
                    // Convert API errors to field-specific errors
                    const fieldErrors: {[key: string]: string} = {};
                    errors.forEach((err: any) => {
                        fieldErrors[err.field] = err.message;
                    });
                    setApiErrors(fieldErrors);
                    setApiError(message || 'Please fix the errors below');
                } else {
                    setApiError(message || 'Signup failed. Please try again.');
                }
            }
        } catch (error: any) {
            // Reset isSubmitted to allow retry
            setIsSubmitted(false);
            
            // Handle different types of errors
            if (error?.response?.status === 400) {
                const errorData = error.response.data;
                
                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    const fieldErrors: {[key: string]: string} = {};
                    errorData.errors.forEach((err: any) => {
                        fieldErrors[err.field] = err.message;
                    });
                    setApiErrors(fieldErrors);
                    setApiError(errorData.message || 'Please fix the errors below');
                } else {
                    setApiError(errorData?.message || errorData?.error || 'Invalid data provided. Please check your information and try again.');
                }
            } else if (error?.response?.status === 409) {
                const errorData = error.response.data;
                
                if (errorData?.errors && Array.isArray(errorData.errors)) {
                    const fieldErrors: {[key: string]: string} = {};
                    errorData.errors.forEach((err: any) => {
                    fieldErrors[err.field] = err.message;
                });
                    setApiErrors(fieldErrors);
                }
                setApiError(errorData?.message || errorData?.error || 'An account with this email already exists. Please use a different email or try logging in.');
            } else if (error?.response?.status === 422) {
                setApiError('Please fill in all required fields correctly.');
            } else {
                setApiError(error?.message || 'An error occurred during signup. Please try again later.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center h-full w-full bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335] relative overflow-hidden">
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

            {/* Main Form Container - Compact */}
            <div className={`relative z-10 w-full h-full flex items-center justify-center px-4 py-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                {/* Form Card - Extra Wide Design */}
                <div className="relative max-w-xl w-full">
                    {/* Compact card background with multiple layers */}
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-xl rounded-2xl border border-white/90 shadow-2xl shadow-slate-900/20"></div>
                    
                    {/* Subtle animated border glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3c959d]/30 via-[#4ba5ad]/30 to-[#ef7335]/30 rounded-2xl blur-sm opacity-50 animate-pulse" style={{ animationDuration: '3s' }}></div>
                    
                    {/* Inner content shadow */}
                    <div className="absolute inset-2 bg-gradient-to-br from-white/80 to-white/60 rounded-2xl"></div>
                    
                    <div className="relative p-5">
                        {/* Enhanced Header Section */}
                        <div className="text-center mb-3">
                            {/* Enhanced Logo/Icon with animated ring */}
                            <div className="inline-flex items-center justify-center mb-3">
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

                            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 via-[#3c959d] to-slate-800 bg-clip-text text-transparent mb-1 tracking-tight">
                                Create Account
                            </h2>
                            <p className="text-xs text-slate-600 font-light leading-relaxed">
                                Join us and get started today
                            </p>
                            
                            {/* Decorative line */}
                            <div className="w-10 h-[1px] bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full mx-auto mt-2 opacity-60"></div>
                        </div>

                        {/* API Error Display */}
                        {apiError && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-3 h-3 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-xs text-red-700">{apiError}</p>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Form */}
                        <form onSubmit={handleSubmit} className="space-y-2">
                            {/* Email - First Priority */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                                    Email Address *
                                </label>
                                <div className="relative group">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-slate-400 group-hover:text-[#3c959d] group-focus-within:text-[#3c959d] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                                            className={`relative block w-full pl-10 pr-3 py-2.5 bg-white border rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 text-sm ${
                                                errors.email || apiErrors.email
                                                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                                                    : 'border-slate-200 focus:ring-[#3c959d]/20 focus:border-[#3c959d]'
                                            }`}
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                    {(errors.email || apiErrors.email) && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {apiErrors.email || errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Name Row - Second Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label htmlFor="firstName" className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                                        First Name *
                                    </label>
                                    <div className="relative group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-slate-400 group-hover:text-[#3c959d] group-focus-within:text-[#3c959d] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className={`relative block w-full pl-10 pr-3 py-2.5 bg-white border rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 text-sm ${
                                                    errors.firstName || apiErrors.firstName
                                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                                                        : 'border-slate-200 focus:ring-[#3c959d]/20 focus:border-[#3c959d]'
                                                }`}
                                                placeholder="First name"
                                            />
                                        </div>
                                        {(errors.firstName || apiErrors.firstName) && (
                                            <p className="text-xs text-red-500 mt-1 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {apiErrors.firstName || errors.firstName}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="lastName" className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                                        Last Name *
                                    </label>
                                    <div className="relative group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-slate-400 group-hover:text-[#4ba5ad] group-focus-within:text-[#4ba5ad] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                required
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className={`relative block w-full pl-10 pr-3 py-2.5 bg-white border rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 text-sm ${
                                                    errors.lastName || apiErrors.lastName
                                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                                                        : 'border-slate-200 focus:ring-[#4ba5ad]/20 focus:border-[#4ba5ad]'
                                                }`}
                                                placeholder="Last name"
                                            />
                                        </div>
                                        {(errors.lastName || apiErrors.lastName) && (
                                            <p className="text-xs text-red-500 mt-1 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {apiErrors.lastName || errors.lastName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Title Row - Third Priority */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label htmlFor="title" className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                                        Title *
                                    </label>
                                    <div className="relative group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-slate-400 group-hover:text-[#3c959d] group-focus-within:text-[#3c959d] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <select
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="relative block w-full pl-10 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3c959d]/20 focus:border-[#3c959d] transition-all duration-200 text-slate-800 text-sm"
                                            >
                                                <option value="">Select Title</option>
                                                <option value="Mr">Mr</option>
                                                <option value="Ms">Ms</option>
                                                <option value="Mrs">Mrs</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Mobile and Landline Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label htmlFor="mobile" className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                                        Mobile *
                                    </label>
                                    <div className="relative group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-slate-400 group-hover:text-[#4ba5ad] group-focus-within:text-[#4ba5ad] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="mobile"
                                                name="mobile"
                                                type="tel"
                                                required
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                pattern="[0-9]*"
                                                inputMode="numeric"
                                                className={`relative block w-full pl-10 pr-3 py-2.5 bg-white border rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 text-sm ${
                                                    errors.mobile || apiErrors.mobile
                                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                                                        : 'border-slate-200 focus:ring-[#4ba5ad]/20 focus:border-[#4ba5ad]'
                                                }`}
                                                placeholder="Mobile number (numbers only)"
                                            />
                                        </div>
                                        {(errors.mobile || apiErrors.mobile) && (
                                            <p className="text-xs text-red-500 mt-1 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {apiErrors.mobile || errors.mobile}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label htmlFor="landline" className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                                        Landline
                                    </label>
                                    <div className="relative group">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-4 w-4 text-slate-400 group-hover:text-[#3c959d] group-focus-within:text-[#3c959d] transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="landline"
                                                name="landline"
                                                type="tel"
                                                value={formData.landline}
                                                onChange={handleInputChange}
                                                pattern="[0-9]*"
                                                inputMode="numeric"
                                                className={`relative block w-full pl-10 pr-3 py-2.5 bg-white border rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 text-sm ${
                                                    errors.landline || apiErrors.landline
                                                        ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                                                        : 'border-slate-200 focus:ring-[#3c959d]/20 focus:border-[#3c959d]'
                                                }`}
                                                placeholder="Landline (optional, numbers only)"
                                            />
                                        </div>
                                        {(errors.landline || apiErrors.landline) && (
                                            <p className="text-xs text-red-500 mt-1 flex items-center">
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {apiErrors.landline || errors.landline}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-xs font-bold text-slate-700 tracking-wide uppercase">
                                    Password *
                                </label>
                                <div className="relative group">
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
                                            autoComplete="new-password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={`relative block w-full pl-10 pr-10 py-2.5 bg-white border rounded-lg shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 text-slate-800 text-sm ${
                                                errors.password || apiErrors.password
                                                    ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' 
                                                    : 'border-slate-200 focus:ring-[#4ba5ad]/20 focus:border-[#4ba5ad]'
                                            }`}
                                            placeholder="Enter password"
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
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-<｜tool▁sep｜>9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {(errors.password || apiErrors.password) && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center">
                                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            {apiErrors.password || errors.password}
                                        </p>
                                    )}
                                </div>
                                
                                {/* Ultra Compact Password Strength Indicator */}
                                {formData.password && !errors.password && !apiErrors.password && (
                                    <div className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-slate-600">Strength:</span>
                                            <span className={`font-semibold ${
                                                passwordStrength.level === 'weak' ? 'text-red-500' : 
                                                passwordStrength.level === 'medium' ? 'text-yellow-500' : 
                                                'text-green-500'
                                            }`}>
                                                {passwordStrength.text}
                                            </span>
                                        </div>
                                        <div className="flex space-x-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                                                        level <= (passwordStrength.level === 'weak' ? 2 : 
                                                               passwordStrength.level === 'medium' ? 4 : 5)
                                                            ? passwordStrength.color
                                                            : 'bg-slate-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            <div className="flex flex-wrap gap-1">
                                                <span className={formData.password.length >= 8 ? 'text-green-500' : 'text-slate-400'}>
                                                    ✓8+
                                                </span>
                                                <span className={/[a-z]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}>
                                                    ✓a-z
                                                </span>
                                                <span className={/[A-Z]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}>
                                                    ✓A-Z
                                                </span>
                                                <span className={/[0-9]/.test(formData.password) ? 'text-green-500' : 'text-slate-400'}>
                                                    ✓0-9
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Enhanced Submit Button */}
                            <div className="pt-2">
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
                                    
                                    <div className="relative flex items-center justify-center py-2.5 px-4 text-white font-semibold text-sm group-hover:scale-[0.995] transition-all duration-200 tracking-wide">
                                        {isLoading ? (
                                            <div className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                <span className="animate-pulse text-xs">Creating...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center">
                                                <span>Create Account</span>
                                                <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </div>

                            {/* Enhanced Sign Up Link */}
                            <div className="text-center pt-2">
                                <p className="text-slate-600 text-xs">
                                    Already have an account?{' '}
                                    <a href="/login" className="font-semibold text-[#3c959d] hover:text-[#4ba5ad] transition-all duration-200 hover:underline decoration-1 underline-offset-2 relative group">
                                        <span className="relative z-10">Sign in</span>
                                        <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d]/10 to-[#4ba5ad]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></div>
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
