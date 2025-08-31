'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard, CheckCircle, AlertCircle, X } from 'lucide-react';

export interface OrderData {
    planId: string;
    seats: number;
    billingCycle: 'monthly' | 'yearly';
    coupon?: string;
}

type OrderFormProps = {
    availablePlans: Array<{ id: string; name: string; price?: string }>;
    selectedPlan?: { id: string; name: string; price: string };
    initialValues?: Partial<OrderData>;
    onSubmit: (data: OrderData) => void;
    onPlanChange?: (planId: string) => void;
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
            'user.firstName': 'First Name',
            'user.lastName': 'Last Name',
            'user.email': 'Email',
            'user.mobile': 'Mobile Number',
            'user.title': 'Job Title',
            'business.businessName': 'Business Name',
            'business.taxId': 'Tax ID',
            'business.industry': 'Industry',
            'business.currency': 'Currency',
            'business.size': 'Business Size',
            'business.cnssCode': 'CNSS Code',
            'address.street': 'Street Address',
            'address.city': 'City',
            'address.governorate': 'Governorate',
            'address.postalCode': 'Postal Code',
            'address.country': 'Country'
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

export default function OrderForm({ availablePlans, selectedPlan, initialValues, onSubmit, onPlanChange, collectedData }: OrderFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<OrderData>({
        planId: initialValues?.planId ?? (selectedPlan?.id ?? availablePlans[0]?.id ?? ''),
        seats: 1, // Default to 1 seat
        billingCycle: 'monthly', // Default to monthly
        coupon: initialValues?.coupon ?? '',
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

    // Plan pricing mapping - using the actual plan names and prices from subscription
    const planPricing = {
        'plan-0': { name: 'Basic Plan', price: 59.99 },
        'plan-1': { name: 'Pro Plan', price: 129.00 },
        'plan-2': { name: 'Enterprise Plan', price: 270.00 }
    };

    // Update formData when selectedPlan changes
    useEffect(() => {
        if (selectedPlan?.id && selectedPlan.id !== formData.planId) {
            setFormData(prev => ({
                ...prev,
                planId: selectedPlan.id
            }));
        }
    }, [selectedPlan?.id]);

    // Get the actual plan data from subscription or fallback to availablePlans
    const actualPlan = selectedPlan?.id === formData.planId ? selectedPlan : null;
    const availablePlan = availablePlans.find(p => p.id === formData.planId);
    
    const currentPlan = actualPlan ? {
        name: actualPlan.name,
        price: parseFloat(actualPlan.price.replace(/[^\d.]/g, '')) || 0
    } : availablePlan ? {
        name: availablePlan.name,
        price: parseFloat(availablePlan.price?.replace(/[^\d.]/g, '') || '0')
    } : planPricing[formData.planId as keyof typeof planPricing] || planPricing['plan-0'];
    
    const unitPrice = currentPlan.price;
    const discount = 0; // Always 0 for now
    const discountAmount = (unitPrice * formData.seats * discount) / 100;
    const subtotal = unitPrice * formData.seats;
    const tva = 19; // Always 19%
    const tvaAmount = (subtotal - discountAmount) * (tva / 100);
    const totalHT = subtotal - discountAmount;
    const totalTTC = totalHT + tvaAmount;

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'seats' ? Number(value) : value,
        }));
        
        // If plan changes, notify parent component
        if (name === 'planId' && onPlanChange) {
            const updatedFormData: OrderData = {
                ...formData,
                planId: value,
            };
            // eslint-disable-next-line no-console
            console.log('OrderForm plan changed. Updated order data:', updatedFormData);
            onPlanChange(value);
        }
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
            planId: formData.planId,
            seats: Math.max(1, Number(formData.seats) || 1),
            billingCycle: formData.billingCycle,
            coupon: formData.coupon?.trim() || '',
        };

        // Notify parent (logging, etc.)
        onSubmit(submission);

        // Build payload expected by the API
        const data = (collectedData as any) || {};
        const payload = {
            user: data.user,
            business: data.business,
            address: data.address,
            subscription: data.subscription,
        };

        // Basic guard
        if (!payload.user || !payload.business || !payload.address || !payload.subscription) {
            setSubmitError('Missing required information. Please complete previous steps.');
            return;
        }

        // Log what we're about to send to the backend
        console.log('📤 Sending to Backend API:', payload);
        console.log('🖼️ Logo File in Business Data:', {
            exists: !!payload.business?.logoFile,
            type: payload.business?.logoFile?.type,
            size: payload.business?.logoFile?.size,
            name: payload.business?.logoFile?.name,
            isFile: payload.business?.logoFile instanceof File
        });
        console.log('📊 Complete Business Object:', payload.business);

        try {
            setIsSubmitting(true);
            
            // Create FormData to properly handle file uploads
            const formData = new FormData();
            
            // Add user data
            Object.entries(payload.user).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(`user[${key}]`, value.toString());
                }
            });
            
            // Add business data (including logo file)
            Object.entries(payload.business).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (key === 'logoFile' && value instanceof File) {
                        // Handle logo file separately
                        formData.append('business[logoFile]', value);
                        console.log('✅ Logo file added to FormData:', value.name, value.size, value.type);
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
            
            // Add subscription data
            Object.entries(payload.subscription).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(`subscription[${key}]`, value.toString());
                }
            });
            
            // Log FormData contents
            console.log('📋 FormData entries:');
            for (let [key, value] of formData.entries()) {
                console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
            }
            console.log('🚀 FormData:', formData);
            console.log('🚀 FormData entries:', formData.entries());
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                body: formData, // Use FormData instead of JSON for file uploads
            });

            if (res.ok) {
                console.log('✅ Registration successful! Redirecting to dashboard...');
                router.push('/dashboard');
                return;
            }

            // Try to extract server error message
            try {
                const errorData = await res.json();
                console.error('❌ Registration failed:', errorData);
                
                // Handle validation errors specifically
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
                } else {
                    setSubmitError(errorData?.message || 'Registration failed. Please try again.');
                }
            } catch {
                console.error('❌ Registration failed with status:', res.status);
                setSubmitError('Registration failed. Please try again.');
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
                    <p className="font-semibold mb-1">Congratulations, we are about to finalize the creation of your business account!</p>
                    <p>
                        Once your validation is completed, you will receive an email containing all the access information to your email address:
                        <span className="ml-1 font-mono bg-green-100 px-2 py-0.5 rounded text-xs">qsfqfqqgqsfgfze@ismartsense.online</span>
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
                {/* Order Configuration */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#3c959d]" />
                        Order Configuration
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="planId" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                Plan
                                <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
                                    Required
                                </span>
                            </label>
                            <select
                                id="planId"
                                name="planId"
                                value={formData.planId}
                                onChange={handleChange}
                                required
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                            >
                                {availablePlans.map(plan => {
                                    // Find the actual plan data from subscription
                                    const actualPlan = selectedPlan?.id === plan.id ? selectedPlan : null;
                                    const displayName = actualPlan?.name || plan.name;
                                    const displayPrice = actualPlan?.price || '';
                                    
                                    return (
                                        <option key={plan.id} value={plan.id}>
                                            {displayName} {displayPrice && `(${displayPrice})`}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="coupon" className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1.5">
                                Coupon Code (Optional)
                            </label>
                            <input
                                id="coupon"
                                name="coupon"
                                value={formData.coupon}
                                onChange={handleChange}
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 transition-all duration-200 hover:border-slate-300 focus:border-[#3c959d] focus:outline-none focus:ring-2 focus:ring-[#3c959d]/10 focus:shadow-sm"
                                placeholder="Enter coupon code"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing Table */}
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-[#3c959d]" />
                        Order Details
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-2 px-2 font-semibold text-slate-700">Description</th>
                                    <th className="text-right py-2 px-2 font-semibold text-slate-700">Unit Price</th>
                                    <th className="text-right py-2 px-2 font-semibold text-slate-700">Discount</th>
                                    <th className="text-right py-2 px-2 font-semibold text-slate-700">Quantity</th>
                                    <th className="text-right py-2 px-2 font-semibold text-slate-700">VAT</th>
                                    <th className="text-right py-2 px-2 font-semibold text-slate-700">Total HT</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100">
                                    <td className="py-2 px-2 text-slate-800">{currentPlan.name}</td>
                                    <td className="py-2 px-2 text-right text-slate-800">TND {unitPrice.toFixed(3)}</td>
                                    <td className="py-2 px-2 text-right text-slate-800">{discount.toFixed(3)}%</td>
                                    <td className="py-2 px-2 text-right text-slate-800">{formData.seats}</td>
                                    <td className="py-2 px-2 text-right text-slate-800">{tva.toFixed(3)}%</td>
                                    <td className="py-2 px-2 text-right text-slate-800">TND {totalHT.toFixed(3)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Totals */}
                    <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between py-1">
                            <span className="text-slate-600">Total Discount:</span>
                            <span className="font-semibold text-slate-800">TND {discountAmount.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-slate-600">Total HT:</span>
                            <span className="font-semibold text-slate-800">TND {totalHT.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between py-1">
                            <span className="text-slate-600">Total VAT:</span>
                            <span className="font-semibold text-slate-800">TND {tvaAmount.toFixed(3)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-t border-slate-200 pt-2">
                            <span className="text-lg font-bold text-slate-800">Total TTC:</span>
                            <span className="text-lg font-bold text-[#3c959d]">TND {totalTTC.toFixed(3)}</span>
                        </div>
                    </div>

                    {/* Submit button moved to container footer */}
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
                </div>

                {/* Confirmation Message */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-green-800">
                            <p className="font-semibold mb-2">Congratulations, we are about to finalize the creation of your business account!</p>
                            <p>Once your validation is completed, you will receive an email containing all the access information to your email address: <span className="font-mono bg-green-100 px-2 py-1 rounded text-xs">qsfqfqqgqsfgfze@ismartsense.online</span></p>
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


