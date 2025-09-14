'use client';

import { useState, useEffect } from 'react';
import { useLanguageStore } from '../../../store/languageStore';
import Header from '../../../components/layout/Header/Header';
import AboutUs from '../../../components/pages/HomePage/AboutUs';
import Footer from '../../../components/pages/HomePage/footer';
import { companyInfo } from '../../../lib/config/companyInfo';

export default function ContactUsPage() {
    const { currentTranslations } = useLanguageStore();
    const [mounted, setMounted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [submitMessage, setSubmitMessage] = useState('');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setSubmitMessage('');
        setFieldErrors({});

        try {
            const response = await fetch('/api/homepage/contactUs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setSubmitStatus('success');
                setSubmitMessage(result.message);
                // Reset form
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitStatus('error');
                setSubmitMessage(result.message || 'Failed to send message. Please try again.');
                if (result.errors) {
                    setFieldErrors(result.errors);
                }
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitStatus('error');
            setSubmitMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
        );
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
                                <span className="text-slate-200 font-medium">We're here to help</span>
                            </div>
                        </div>

                        {/* Main Hero Content */}
                        <div className="mb-12">
                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight transform transition-all duration-1000">
                                <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-4">
                                    Contact
                                </span>
                                <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent relative">
                                    Us
                                    <div className="absolute -inset-2 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 blur-xl -z-10 animate-pulse"></div>
                                </span>
                            </h1>
                            
                            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto mb-12 leading-relaxed transform transition-all duration-1000">
                                Get in touch with our team and let's discuss how we can 
                                <span className="text-[#4ba5ad] font-semibold"> help your business grow</span>
                            </p>

                            {/* Trust Indicators */}
                            <div className="transform transition-all duration-1000">
                                <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-400">
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                        {companyInfo.trustIndicators.quickResponse}
                                    </span>
                                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                        </svg>
                                        {companyInfo.trustIndicators.support247}
                                    </span>
                                    <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                                    <span className="flex items-center gap-2">
                                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" />
                                        </svg>
                                        {companyInfo.trustIndicators.securePrivate}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

            {/* Contact Form Section */}
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
                            Get In Touch
                        </h2>
                        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Contact Information - Left Side */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="text-center lg:text-left">
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-[#3c959d] to-slate-800 bg-clip-text text-transparent mb-6">
                                    Contact Information
                                </h3>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    We're here to help and answer any question you might have. We look forward to hearing from you.
                                </p>
                            </div>

                            {/* Contact Cards */}
                            <div className="space-y-6">
                                {/* Phone */}
                                <div className="group relative p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#3c959d]/10 via-transparent to-[#4ba5ad]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3c959d]/20 to-[#4ba5ad]/20 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                                    <div className="relative flex items-center space-x-6">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#3c959d] to-[#4ba5ad] rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 mb-2">{companyInfo.contact.phone.label}</h4>
                                            <p className="text-slate-600 text-lg">{companyInfo.contact.phone.numbers[0]}</p>
                                            <p className="text-slate-500 text-sm">{companyInfo.businessHours.weekdays}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="group relative p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#4ba5ad]/10 via-transparent to-[#ef7335]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                                    <div className="relative flex items-center space-x-6">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#4ba5ad] to-[#ef7335] rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 mb-2">{companyInfo.contact.email.label}</h4>
                                            <p className="text-slate-600 text-lg">{companyInfo.contact.email.value}</p>
                                            <p className="text-slate-500 text-sm">We'll reply within 24 hours</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="group relative p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#ef7335]/10 via-transparent to-[#3c959d]/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ef7335]/20 to-[#3c959d]/20 rounded-3xl blur opacity-0 group-hover:opacity-50 transition-all duration-500"></div>
                                    <div className="relative flex items-center space-x-6">
                                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#ef7335] to-[#3c959d] rounded-2xl flex items-center justify-center shadow-lg">
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-slate-800 mb-2">{companyInfo.contact.address.label}</h4>
                                            <p className="text-slate-600 text-lg">{companyInfo.contact.address.lines[0]}</p>
                                            <p className="text-slate-500 text-sm">{companyInfo.contact.address.lines[1]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form - Right Side */}
                        <div className="lg:col-span-2 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#3c959d]/5 via-transparent to-[#ef7335]/5 rounded-3xl"></div>
                            <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/40">
                                <div className="mb-8">
                                    <h3 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-[#3c959d] to-slate-800 bg-clip-text text-transparent mb-4">
                                        Send us a Message
                                    </h3>
                                    <p className="text-slate-600 text-lg">
                                        Fill out the form below and we'll get back to you as soon as possible.
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Success/Error Messages */}
                                    {submitStatus === 'success' && (
                                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
                                            <div className="flex items-center">
                                                <svg className="w-6 h-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <p className="text-green-800 font-medium">{submitMessage}</p>
                                            </div>
                                        </div>
                                    )}

                                    {submitStatus === 'error' && (
                                        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                                            <div className="flex items-center">
                                                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <p className="text-red-800 font-medium">{submitMessage}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Name and Email Row */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <div className="space-y-3">
                                            <label htmlFor="name" className="block text-sm font-bold text-slate-700 tracking-wide uppercase">
                                                Full Name *
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d]/20 to-[#4ba5ad]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className={`relative block w-full px-6 py-4 bg-white border rounded-2xl shadow-sm placeholder-slate-500 focus:outline-none transition-all duration-200 text-slate-800 text-lg ${
                                                        fieldErrors.name 
                                                            ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-500' 
                                                            : 'border-slate-200 focus:ring-2 focus:ring-[#3c959d]/20 focus:border-[#3c959d]'
                                                    }`}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            {fieldErrors.name && (
                                                <p className="text-red-600 text-sm mt-1">{fieldErrors.name}</p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div className="space-y-3">
                                            <label htmlFor="email" className="block text-sm font-bold text-slate-700 tracking-wide uppercase">
                                                Email Address *
                                            </label>
                                            <div className="relative group">
                                                <div className="absolute -inset-1 bg-gradient-to-r from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="relative block w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ba5ad]/20 focus:border-[#4ba5ad] transition-all duration-200 text-slate-800 text-lg"
                                                    placeholder="Enter your email address"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Subject Field */}
                                    <div className="space-y-3">
                                        <label htmlFor="subject" className="block text-sm font-bold text-slate-700 tracking-wide uppercase">
                                            Subject *
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                                            <select
                                                id="subject"
                                                name="subject"
                                                required
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                className="relative block w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3c959d]/20 focus:border-[#3c959d] transition-all duration-200 text-slate-800 text-lg"
                                            >
                                                <option value="">Select a subject</option>
                                                <option value="general">General Inquiry</option>
                                                <option value="business">Business Consultation</option>
                                                <option value="support">Technical Support</option>
                                                <option value="partnership">Partnership</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div className="space-y-3">
                                        <label htmlFor="message" className="block text-sm font-bold text-slate-700 tracking-wide uppercase">
                                            Message *
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={6}
                                                required
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                className="relative block w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4ba5ad]/20 focus:border-[#4ba5ad] transition-all duration-200 text-slate-800 text-lg resize-none"
                                                placeholder="Tell us about your project or inquiry..."
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-6">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="group relative w-full overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-2xl"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#2a7a82] via-[#3d94a0] to-[#d45f2a] rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                                            <div className="absolute -inset-1 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] rounded-2xl blur opacity-30 group-hover:opacity-60 transition-all duration-300"></div>
                                            
                                            <div className="relative flex items-center justify-center py-5 px-8 text-white font-bold text-xl group-hover:scale-[0.995] transition-all duration-200">
                                                {isSubmitting ? (
                                                    <div className="flex items-center">
                                                        <svg className="animate-spin -ml-1 mr-4 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        <span className="animate-pulse">Sending Message...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <span>Send Message</span>
                                                        <svg className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
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
