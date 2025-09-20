'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard, CheckCircle, AlertCircle, X } from 'lucide-react';

export interface OrderData {
    // Simplified - no plan selection needed
    termsAccepted: boolean;
}

type OrderFormProps = {
    availablePlans: Array<{ id: string; name: string; price?: string }>; // Keep for compatibility but not used
    initialValues?: Partial<OrderData>;
    onSubmit: (data: OrderData) => void;
    collectedData?: unknown;
};

// Helper function to format validation error messages
const formatValidationError = (details: string): string => {
    if (!details) return 'Validation failed. Please check your input.';
    
    // Handle different error formats
    if (details.includes(':')) {
        const [field, message] = details.split(':').map(s => s.trim());
        
        // Map field names to user-friendly labels
        const fieldLabels: Record<string, string> = {
            'business.businessName': 'Business Name',
            'business.taxId': 'Tax ID',
            'business.industry': 'Industry',
            'business.currency': 'Currency',
            'business.size': 'Business Size',
            'business.cnssCode': 'CNSS Code',
            'address.country': 'Country',
            'address.governorate': 'Governorate',
            'address.postalCode': 'Postal Code',
            'address.address': 'Address',
            'address.phone': 'Phone'
        };
        
        const friendlyFieldName = fieldLabels[field] || field.replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return `${friendlyFieldName}: ${message}`;
    }
    
    return details;
};

// Helper function to get field name from error details
const getFieldFromError = (details: string): string | null => {
    if (!details || !details.includes(':')) return null;
    const field = details.split(':')[0].trim();
    return field;
};

// Helper functions for localStorage
const TERMS_ACCEPTANCE_KEY = 'register_terms_accepted';

const saveTermsAcceptance = (accepted: boolean) => {
    try {
        localStorage.setItem(TERMS_ACCEPTANCE_KEY, JSON.stringify(accepted));
    } catch (error) {
        console.warn('Failed to save terms acceptance to localStorage:', error);
    }
};

const loadTermsAcceptance = (): boolean => {
    try {
        const saved = localStorage.getItem(TERMS_ACCEPTANCE_KEY);
        return saved ? JSON.parse(saved) : false;
    } catch (error) {
        console.warn('Failed to load terms acceptance from localStorage:', error);
        return false;
    }
};

export default function OrderForm({ availablePlans, initialValues, onSubmit, collectedData }: OrderFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<OrderData>({
        termsAccepted: initialValues?.termsAccepted ?? false,
    });

    const [showTerms, setShowTerms] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);

    // Load terms acceptance from localStorage on component mount
    useEffect(() => {
        const savedAcceptance = loadTermsAcceptance();
        setAcceptedTerms(savedAcceptance);
        if (savedAcceptance) {
            setAgreeChecked(true);
        }
    }, []);

    // Notify container about terms acceptance
    useEffect(() => {
        try {
            window.dispatchEvent(new CustomEvent('order-terms-changed', { detail: { accepted: acceptedTerms } }));
        } catch {
            // noop
        }
    }, [acceptedTerms]);

    // Simplified - no pricing calculations needed

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);
        setValidationErrors([]);
        
        if (!acceptedTerms) {
            setSubmitError('Please accept the terms to continue.');
            return;
        }

        const submission: OrderData = {
            termsAccepted: formData.termsAccepted,
        };

        // Notify parent (logging, etc.)
        onSubmit(submission);

        // Build payload expected by the API (only business and address)
        const data = (collectedData as any) || {};
        const payload = {
            business: data.business,
            address: data.address,
        };

        // Basic guard
        if (!payload.business || !payload.address) {
            setSubmitError('Missing required information. Please complete previous steps.');
            return;
        }


        try {
            setIsSubmitting(true);
            
            // Create FormData to properly handle file uploads
            const formData = new FormData();
            
            // Add business data (including logo file)
            Object.entries(payload.business).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'logoFile' && value instanceof File) {
                        // Handle logo file separately
                        formData.append('business[logoFile]', value);
                    } else {
                        formData.append(`business[${key}]`, value.toString());
                    }
                }
            });
            
            // Add address data
            Object.entries(payload.address).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(`address[${key}]`, value.toString());
                }
            });
            
            // No subscription data needed
            
            // Log FormData contents
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
            }
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: formData, // Use FormData instead of JSON for file uploads
            });

            if (res.ok) {
                router.push('/dashboard');
                return;
            }

            // Try to extract server error message
            try {
                const errorData = await res.json();
                console.error('❌ Business creation failed:', errorData);
                
                // Handle specific error types from the API
                if (errorData.type === 'validation_error' && errorData.details) {
                    const formattedMessage = formatValidationError(errorData.details);
                    const field = getFieldFromError(errorData.details);
                    
                    if (field) {
                        setValidationErrors([{
                            field,
                            message: formattedMessage
                        }]);
                        
                        // Dispatch event to notify container about validation error
                        window.dispatchEvent(new CustomEvent('validation-error', {
                            detail: {
                                type: 'validation_error',
                                field,
                                message: formattedMessage
                            }
                        }));
                    } else {
                        setSubmitError(formattedMessage);
                    }
                } else if (errorData.type === 'plan_forbidden') {
                    setSubmitError('Your current plan does not allow creating a business. Please upgrade your plan.');
                } else if (errorData.type === 'plan_not_supported') {
                    setSubmitError('Business creation is not available for custom plans at this time.');
                } else if (errorData.type === 'business_limit_reached') {
                    setSubmitError('You have reached the maximum number of businesses allowed for your plan.');
                } else if (errorData.type === 'business_name_exists') {
                    setSubmitError('A business with this name already exists. Please choose a different name.');
                } else if (errorData.type === 'tax_id_exists') {
                    setSubmitError('A business with this Tax ID already exists. Please check your Tax ID.');
                } else if (errorData.type === 'cnss_code_exists') {
                    setSubmitError('A business with this CNSS code already exists. Please check your CNSS code.');
                } else if (errorData.type === 'payload_too_large') {
                    setSubmitError('The logo file is too large. Please choose a smaller image (max 10MB).');
                } else {
                    setSubmitError(errorData?.message || 'Business creation failed. Please try again.');
                }
            } catch {
                console.error('❌ Business creation failed with status:', res.status);
                setSubmitError('Business creation failed. Please try again.');
            }
        } catch (err) {
            console.error('❌ Network error during registration:', err);
            setSubmitError('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Function to clear specific validation error
    const clearValidationError = (field: string) => {
        setValidationErrors(prev => prev.filter(error => error.field !== field));
    };

    // Function to clear all errors
    const clearAllErrors = () => {
        setSubmitError(null);
        setValidationErrors([]);
    };

    // Function to handle terms acceptance
    const handleTermsAcceptance = () => {
        if (agreeChecked) {
            setAcceptedTerms(true);
            setFormData(prev => ({ ...prev, termsAccepted: true }));
            setShowTerms(false);
            // Save to localStorage
            saveTermsAcceptance(true);
        }
    };

    return (
        <div className="max-w-none mx-auto">
            {/* Top notice */}
            <div className="mb-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                <div className="text-sm text-green-800">
                    <p className="font-semibold mb-1">Ready to create your business!</p>
                    <p>
                        Once created, you'll be able to manage your business settings and invite team members.
                    </p>
                </div>
            </div>

            {/* Error Display Section */}
            {(submitError || validationErrors.length > 0) && (
                <div className="mb-6 space-y-3">
                    {/* General Error */}
                    {submitError && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-red-800 mb-1">Registration Error</h3>
                                    <p className="text-sm text-red-700">{submitError}</p>
                                </div>
                                <button
                                    onClick={clearAllErrors}
                                    className="text-red-400 hover:text-red-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Validation Errors */}
                    {validationErrors.map((error, index) => (
                        <div key={index} className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-orange-800 mb-1">Validation Error</h3>
                                    <p className="text-sm text-orange-700">{error.message}</p>
                                    <p className="text-xs text-orange-600 mt-1">
                                        Please go back and fix this field in the previous step.
                                    </p>
                                </div>
                                <button
                                    onClick={() => clearValidationError(error.field)}
                                    className="text-orange-400 hover:text-orange-600 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <form id="order-form" onSubmit={handleSubmit} className="space-y-6" data-terms-accepted={acceptedTerms ? 'true' : 'false'}>
                {/* Business Summary */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-[#3c959d]" />
                        Business Summary
                    </h2>
                    
                    <div className="space-y-3 text-sm">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="text-slate-600">Business Name:</span>
                                <span className="ml-2 font-semibold text-slate-800">{(collectedData as any)?.business?.businessName || 'Not provided'}</span>
                            </div>
                            <div>
                                <span className="text-slate-600">Industry:</span>
                                <span className="ml-2 font-semibold text-slate-800">{(collectedData as any)?.business?.industry || 'Not provided'}</span>
                            </div>
                            <div>
                                <span className="text-slate-600">Tax ID:</span>
                                <span className="ml-2 font-semibold text-slate-800">{(collectedData as any)?.business?.taxId || 'Not provided'}</span>
                            </div>
                            <div>
                                <span className="text-slate-600">Currency:</span>
                                <span className="ml-2 font-semibold text-slate-800">{(collectedData as any)?.business?.currency || 'Not provided'}</span>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-slate-200">
                            <span className="text-slate-600">Address:</span>
                            <span className="ml-2 font-semibold text-slate-800">{(collectedData as any)?.address?.address || 'Not provided'}</span>
                        </div>
                    </div>
                </div>

                {/* Terms of Service */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-700">
                            {acceptedTerms ? (
                                <span className="flex items-center gap-2 text-green-700">
                                    <CheckCircle className="w-4 h-4" />
                                    Terms accepted
                                </span>
                            ) : (
                                'You must accept the terms to continue'
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => { setShowTerms(true); setAgreeChecked(acceptedTerms); setHasScrolledToEnd(false); setScrollProgress(0); }}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
                        >
                            {acceptedTerms ? 'View Terms Again' : 'View Terms'}
                        </button>
                    </div>
                    
                    {/* Hidden checkbox for form state */}
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="hidden"
                    />
                </div>

                {/* Confirmation Message */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-green-800">
                            <p className="font-semibold mb-2">Ready to create your business!</p>
                            <p>Once created, you'll be able to manage your business settings, add team members, and start using all the features available in your plan.</p>
                        </div>
                    </div>
                </div>

                {/* Submit handled within Order Details card */}
            </form>

            {/* Terms Modal */}
            {showTerms && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="terms-title"
                >
                    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-[#f7fbfb] to-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#3c959d] to-[#ef7335] opacity-90" />
                                <div>
                                    <h3 id="terms-title" className="text-base font-bold text-slate-800">Terms of Service</h3>
                                    <p className="text-xs text-slate-500">Please review and accept to continue</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowTerms(false)}
                                className="inline-flex items-center rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 border border-slate-200"
                                aria-label="Close"
                            >
                                Close
                            </button>
                        </div>

                        {/* Scroll progress */}
                        <div className="h-1 w-full bg-slate-100">
                            <div
                                className="h-full bg-gradient-to-r from-[#3c959d] to-[#ef7335] transition-[width] duration-150"
                                style={{ width: `${scrollProgress}%` }}
                            />
                        </div>

                        <div
                            className="relative p-5 max-h-[65vh] overflow-y-auto text-sm text-slate-700"
                            onScroll={(e) => {
                                const el = e.currentTarget;
                                const progress = Math.min(100, Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
                                setScrollProgress(progress);
                                if (progress >= 98) setHasScrolledToEnd(true);
                            }}
                        >
                            {/* Top/Bottom fade masks */}
                            <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent" />
                            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent" />

                            <div className="space-y-5">
                                <section>
                                    <h4 className="text-sm font-semibold text-slate-900">1. Introduction</h4>
                                    <p className="mt-1 text-slate-600">hello</p>
                                </section>
                                <section>
                                    <h4 className="text-sm font-semibold text-slate-900">2. Use of Service</h4>
                                    <p className="mt-1 text-slate-600">hello</p>
                                </section>
                                <section>
                                    <h4 className="text-sm font-semibold text-slate-900">3. Privacy</h4>
                                    <p className="mt-1 text-slate-600">hello</p>
                                </section>
                                <section>
                                    <h4 className="text-sm font-semibold text-slate-900">4. Liability</h4>
                                    <p className="mt-1 text-slate-600">hello</p>
                                </section>
                                <section>
                                    <h4 className="text-sm font-semibold text-slate-900">5. Termination</h4>
                                    <p className="mt-1 text-slate-600">hello</p>
                                </section>
                                <section>
                                    <h4 className="text-sm font-semibold text-slate-900">6. Contact</h4>
                                    <p className="mt-1 text-slate-600">hello</p>
                                </section>
                            </div>
                        </div>

                        <div className="px-5 py-4 border-t border-slate-200 bg-white sticky bottom-0">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                                <label className="inline-flex items-start gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#3c959d] focus:ring-[#3c959d]"
                                        checked={agreeChecked}
                                        onChange={(e) => setAgreeChecked(e.target.checked)}
                                    />
                                    <span>I have read and accept the Terms of Service</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowTerms(false)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-100"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleTermsAcceptance}
                                        disabled={!agreeChecked}
                                        className={`rounded-lg px-4 py-2 text-white ${
                                            !agreeChecked
                                                ? 'bg-slate-300 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335]'
                                        }`}
                                    >
                                        Accept & Continue
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


