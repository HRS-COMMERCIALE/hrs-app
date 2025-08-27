'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CreditCard, CheckCircle } from 'lucide-react';

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
    const [scrollProgress, setScrollProgress] = useState(0);
    const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
    const [agreeChecked, setAgreeChecked] = useState(false);

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

        try {
            setIsSubmitting(true);
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                router.push('/dashboard');
                return;
            }

            // Try to extract server error message
            try {
                const err = await res.json();
                setSubmitError(err?.message || 'Registration failed. Please try again.');
            } catch {
                setSubmitError('Registration failed. Please try again.');
            }
        } catch (err) {
            setSubmitError('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
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
                                <span className="ml-1 inline-flex items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-600 border border-red-200">
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
                            {acceptedTerms ? 'Terms accepted' : 'You must accept the terms to continue'}
                        </div>
                        <button
                            type="button"
                            onClick={() => { setShowTerms(true); setAgreeChecked(false); setHasScrolledToEnd(false); setScrollProgress(0); }}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-slate-700 hover:bg-slate-50"
                        >
                            View Terms
                        </button>
                    </div>
                </div>

                {submitError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm p-3">
                        {submitError}
                    </div>
                )}

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
                                        className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { if (agreeChecked) { setAcceptedTerms(true); setShowTerms(false); } }}
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


