'use client';

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useLanguageStore } from '../../../store/languageStore';
import { useAuth } from '../../../store/authProvider';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Separator } from '../../../components/ui/separator';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with development-friendly options
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

// Secure Stripe Payment Form Component - PCI DSS Compliant
const SecureStripePaymentForm = forwardRef<any, { 
    onPaymentSuccess: () => void, 
    isProcessing: boolean, 
    setIsProcessing: (value: boolean) => void,
    planId: string,
    planName: string,
    planPrice: string,
    planCurrency: string
}>(({ onPaymentSuccess, isProcessing, setIsProcessing, planId, planName, planPrice, planCurrency }, ref) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [cardError, setCardError] = useState<string>('');
    const [stripeInitError, setStripeInitError] = useState<string>('');
    const [billingDetails, setBillingDetails] = useState({
        name: '',
        email: user?.email || '',
        address: {
            line1: '',
            line2: '',
            city: '',
            postal_code: '',
            country: 'TN'
        }
    });

    // Update email when user data changes
    useEffect(() => {
        if (user?.email) {
            setBillingDetails(prev => ({ ...prev, email: user.email }));
        }
        if (typeof window !== 'undefined') {
            // Helps debug publishable key presence at build-time
            // eslint-disable-next-line no-console
            console.log('Stripe key present:', Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY));
            const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string | undefined;
            if (!pk) {
                setStripeInitError('Stripe publishable key missing (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).');
            } else if (!/^pk_(test|live)_/.test(pk)) {
                setStripeInitError('Stripe publishable key format looks invalid. It should start with pk_test_ or pk_live_.');
            }
            // Fallback timeout: if Elements not ready after a short delay, show hint
            const t = setTimeout(() => {
                if (!elements) {
                    setStripeInitError(prev => prev || 'Stripe failed to initialize. Check your publishable key and network.');
                }
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [user?.email]);


    const handlePayment = async () => {
        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setCardError('');

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setIsProcessing(false);
            setCardError('Card element not found');
            return;
        }

        try {
            // Create payment method with billing details
            console.log('[Checkout] Creating payment method...');
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
                billing_details: {
                    name: billingDetails.name,
                    email: billingDetails.email,
                    address: billingDetails.address
                }
        });

        if (error) {
            console.error('Error creating payment method:', error);
                setCardError(error.message || 'Payment method creation failed');
            setIsProcessing(false);
                return;
            }

            console.log('[Checkout] Payment method created', { paymentMethodId: paymentMethod.id });

            // Send payment data to our API
            console.log('[Checkout] Calling /api/auth/payment to create PaymentIntent...', { planId });
            const response = await fetch('/api/auth/payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentMethodId: paymentMethod.id,
                    planId: planId,
                    // Optional idempotency key to avoid duplicate PaymentIntents on client retries
                    idempotencyKey: `${planId}-${billingDetails.email}-${Date.now()}`,
                }),
            });

            const result = await response.json();
            console.log('[Checkout] Payment API response', result);

            if (!response.ok || !result.success) {
                console.error('Payment API failed:', result?.error);
                setCardError(result?.error || 'Failed to create payment');
                setIsProcessing(false);
                return;
            }

            // Client-side confirmation using client_secret
            const clientSecret = result.clientSecret;
            if (!clientSecret) {
                console.error('Missing client secret from API');
                setCardError('Missing payment configuration. Please try again.');
                setIsProcessing(false);
                return;
            }

            console.log('[Checkout] Confirming card payment with clientSecret');
            const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });

            console.log('[Checkout] Stripe confirmation result', {
                hasError: Boolean(confirmError),
                errorMessage: confirmError?.message,
                status: paymentIntent?.status,
                paymentIntentId: paymentIntent?.id,
            });

            if (confirmError) {
                console.error('Payment confirmation error:', confirmError);
                setCardError(confirmError.message || 'Payment confirmation failed');
                setIsProcessing(false);
                return;
            }

            // Check if payment actually succeeded or is pending
            const finalStatus = paymentIntent?.status;
            const finalPaymentIntentId = paymentIntent?.id || result.paymentIntentId;
            console.log('[Checkout] Final PaymentIntent status', { finalStatus, finalPaymentIntentId });

            if (paymentIntent && finalStatus === 'succeeded') {
                console.log('[Checkout] Payment succeeded. Redirecting to success...');
                window.location.href = `/payment/success?payment_intent=${encodeURIComponent(finalPaymentIntentId)}`;
                return;
            }

            // Handle non-terminal but positive states more gracefully
            if (paymentIntent && finalStatus === 'processing') {
                console.warn('[Checkout] Payment is processing. Redirecting to success for verification...');
                window.location.href = `/payment/success?payment_intent=${encodeURIComponent(finalPaymentIntentId)}`;
                return;
            }

            if (paymentIntent && finalStatus === 'requires_action') {
                console.warn('[Checkout] Payment requires additional authentication after confirmCardPayment. Showing guidance.');
                setCardError('Additional authentication is required. Please follow the on-screen prompts or try again.');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && finalStatus === 'requires_payment_method') {
                console.error('[Checkout] Payment requires a new payment method (declined/invalid)');
                setCardError('Your card was declined. Please use a different card or try again.');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && finalStatus === 'canceled') {
                console.error('[Checkout] Payment was canceled by the user or bank');
                setCardError('Payment was canceled. You can try again when ready.');
                setIsProcessing(false);
                return;
            }

            // Fallback unknown state
            console.error('[Checkout] Payment did not reach a final state', { status: finalStatus, paymentIntent });
            setCardError(`Payment is not completed yet (status: ${finalStatus || 'unknown'}). Please try again or wait a moment.`);
            setIsProcessing(false);
            return; // Explicit return
        } catch (error) {
            console.error('Payment processing error:', error);
            setCardError('An error occurred while processing your payment. Please try again.');
            setIsProcessing(false);
            return; // Explicitly return to prevent any further processing
        } finally {
            setIsProcessing(false);
        }
    };

    // Expose the handlePayment function to parent component
    useImperativeHandle(ref, () => ({
        handlePayment
    }));

    return (
        <div className="space-y-4">
            {/* Email Display - Non-editable */}
            <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <div className="flex items-center justify-between">
                    <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                            Billing Email
                        </label>
                        <span className="text-sm font-medium text-slate-800">{billingDetails.email}</span>
                        </div>
                    <div className="flex items-center space-x-1 text-xs text-green-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                        <span>Verified</span>
                </div>
            </div>
        </div>

            {/* Compact Form Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {/* Billing Information */}
                <div className="bg-white border border-slate-200 rounded-md p-3 relative z-10">
                    <h3 className="text-xs font-semibold text-slate-800 mb-3">Billing Information</h3>
                    
                    <div className="space-y-2">
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={billingDetails.name}
                                onChange={(e) => setBillingDetails(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="John Doe"
                                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#3c959d]/20 focus:border-[#3c959d] bg-white"
                                required
                                disabled={false}
                                autoComplete="name"
                            />
                        </div>

                        {/* Address Line 1 */}
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                Address *
                                </label>
                                    <input
                                        type="text"
                                value={billingDetails.address.line1}
                                onChange={(e) => setBillingDetails(prev => ({ 
                                    ...prev, 
                                    address: { ...prev.address, line1: e.target.value }
                                }))}
                                placeholder="123 Main Street"
                                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#3c959d]/20 focus:border-[#3c959d]"
                                required
                                disabled={false}
                                    />
                                </div>

                        {/* City and Postal Code */}
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={billingDetails.address.city}
                                    onChange={(e) => setBillingDetails(prev => ({ 
                                        ...prev, 
                                        address: { ...prev.address, city: e.target.value }
                                    }))}
                                    placeholder="Tunis"
                                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#3c959d]/20 focus:border-[#3c959d]"
                                    required
                                    disabled={false}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                    Postal Code *
                                </label>
                                <input
                                    type="text"
                                    value={billingDetails.address.postal_code}
                                    onChange={(e) => setBillingDetails(prev => ({ 
                                        ...prev, 
                                        address: { ...prev.address, postal_code: e.target.value }
                                    }))}
                                    placeholder="1000"
                                    className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#3c959d]/20 focus:border-[#3c959d]"
                                    required
                                    disabled={false}
                                />
                            </div>
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                Country *
                            </label>
                            <select
                                value={billingDetails.address.country}
                                onChange={(e) => setBillingDetails(prev => ({ 
                                    ...prev, 
                                    address: { ...prev.address, country: e.target.value }
                                }))}
                                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#3c959d]/20 focus:border-[#3c959d]"
                                required
                                disabled={false}
                            >
                                <option value="TN">Tunisia</option>
                                <option value="FR">France</option>
                                <option value="DZ">Algeria</option>
                                <option value="MA">Morocco</option>
                            </select>
                        </div>
                        </div>
                        </div>

                {/* Card Information */}
                <div className="bg-white border border-slate-200 rounded-md p-3">
                    <h3 className="text-xs font-semibold text-slate-800 mb-3">Card Information</h3>
                    
                    <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-700 mb-1">
                                Card Details
                                </label>
                            <div className="p-2 border border-slate-300 rounded focus-within:ring-1 focus-within:ring-[#3c959d]/20 focus-within:border-[#3c959d] bg-white min-h-[40px] relative z-20 pointer-events-auto">
                                {elements ? (
                                    <CardElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: '12px',
                                                    color: '#374151',
                                                    fontFamily: 'system-ui, -apple-system, sans-serif',
                                                    '::placeholder': {
                                                        color: '#9CA3AF',
                                                    },
                                                    padding: '6px',
                                                },
                                                invalid: {
                                                    color: '#ef4444',
                                                },
                                            },
                                            hidePostalCode: true,
                                        }}
                                        onChange={(event) => {
                                            if (event.error) {
                                                setCardError(event.error.message);
                                            } else {
                                                setCardError('');
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="text-xs text-slate-500">Loading secure card field…</div>
                                )}
                            </div>
                            {cardError && (
                                <p className="text-xs text-red-500 mt-1">{cardError}</p>
                            )}
                            {stripeInitError && (
                                <p className="text-xs text-red-500 mt-1">{stripeInitError}</p>
                            )}
                            </div>

                        {/* Security Notice */}
                        <div className="space-y-2 pt-2 border-t border-slate-200">
                            <div className="flex items-center space-x-1 text-xs text-slate-500">
                                <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Secured by Stripe</span>
                            </div>
                            {process.env.NODE_ENV === 'development' && (
                                <div className="flex items-center space-x-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span>Dev Mode: HTTPS warning is normal for localhost</span>
                        </div>
                                )}
                            </div>
                    </div>
                </div>
                    </div>
                    </div>
    );
});

SecureStripePaymentForm.displayName = 'SecureStripePaymentForm';

interface PaymentRightSideContentProps {
    planId: string;
    planName: string;
    planPrice: string;
    planCurrency: string;
}

export default function PaymentRightSideContent({ planId, planName, planPrice, planCurrency }: PaymentRightSideContentProps) {
    const { currentTranslations } = useLanguageStore();
    const [mounted, setMounted] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCreditCardForm, setShowCreditCardForm] = useState(false);
    const stripeFormRef = useRef<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const paymentMethods = [
        {
            id: 'credit-card',
            name: 'Credit Card',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            ),
            description: 'Visa, Mastercard, American Express',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-200',
            available: true
        },
        {
            id: 'paypal',
            name: 'PayPal',
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.543-.676c-.95-1.08-2.453-1.71-4.266-1.71H9.673a.641.641 0 0 0-.633.74l1.12 7.106h4.19c.524 0 .968-.382 1.05-.9l1.12-7.106z"/>
                </svg>
            ),
            description: 'Pay with your PayPal account',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            available: false,
            comingSoon: true
        },
        {
            id: 'bank-transfer',
            name: 'Bank Transfer',
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            description: 'Direct bank transfer',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            borderColor: 'border-green-200',
            available: false,
            comingSoon: true
        },
    ];

    const handlePaymentMethodSelect = (methodId: string) => {
        const method = paymentMethods.find(m => m.id === methodId);
        if (method && method.available) {
            setSelectedPaymentMethod(methodId);
            setShowCreditCardForm(methodId === 'credit-card');
        } else if (method && !method.available) {
            // Show a more informative message for unavailable methods
            alert(`${method.name} is coming soon! Please select Credit Card for now.`);
        }
    };

    const handlePaymentSubmit = async () => {
        if (!selectedPaymentMethod) return;
        
        // Check if the selected payment method is available
        const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
        if (!selectedMethod || !selectedMethod.available) {
            alert('This payment method is not yet available. Please select Credit Card.');
            return;
        }
        
        setIsProcessing(true);
        
        try {
            console.log('[Checkout] Starting payment flow', { planId, planName, planPrice, planCurrency });
            if (selectedPaymentMethod === 'credit-card') {
                // For Stripe payments, use the ref to call the handlePayment function
                if (stripeFormRef.current) {
                    await stripeFormRef.current.handlePayment();
                } else {
                    throw new Error('Stripe form not available');
                }
            } else {
                // This should never happen since we check availability above
                throw new Error('Selected payment method is not available');
            }
        } catch (error: any) {
            console.error('Payment processing error:', error);
            alert(error.message || 'An error occurred while processing your payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center h-screen w-full bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335] relative overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Primary gradient overlays */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#3c959d]/30 via-transparent to-transparent"></div>
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#ef7335]/15 via-transparent to-transparent"></div>
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#4ba5ad]/10 via-transparent to-transparent"></div>
             
                {/* Enhanced grid pattern with animation */}
                <div className="absolute inset-0 opacity-8 pointer-events-none">
                    <div className="h-full w-full bg-[linear-gradient(rgba(60,149,157,0.15)_1px,transparent_1px),linear-gradient(90deg,rgba(60,149,157,0.15)_1px,transparent_1px)] bg-[size:60px_60px] animate-pulse" style={{ animationDuration: '4s' }}></div>
                </div>
                
                {/* Animated Exponential Curves */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 1200 800" preserveAspectRatio="none">
                    <path
                        d="M0,400 Q300,200 600,300 T1200,100"
                        fill="none"
                        stroke="url(#gradient1)"
                        strokeWidth="2"
                        className="animate-pulse"
                        style={{ animationDuration: '3s' }}
                    />
                    <path
                        d="M0,600 Q400,400 800,500 T1200,300"
                        fill="none"
                        stroke="url(#gradient2)"
                        strokeWidth="1.5"
                        className="animate-pulse"
                        style={{ animationDuration: '4s', animationDelay: '1s' }}
                    />
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
                <div className="absolute top-16 right-24 w-40 h-40 border-2 border-[#3c959d]/20 rounded-full animate-spin opacity-50 pointer-events-none" style={{ animationDuration: '25s' }}></div>
                <div className="absolute bottom-32 left-16 w-32 h-32 border-2 border-[#ef7335]/18 rotate-45 animate-pulse opacity-40 pointer-events-none"></div>
                <div className="absolute top-1/3 right-12 w-16 h-16 bg-gradient-to-br from-[#4ba5ad]/20 to-[#ef7335]/20 rounded-2xl rotate-12 animate-bounce opacity-60 pointer-events-none" style={{ animationDelay: '1.5s', animationDuration: '3s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-10 h-10 bg-gradient-to-tr from-[#3c959d]/25 to-[#4ba5ad]/25 rounded-xl rotate-45 animate-pulse opacity-50 pointer-events-none" style={{ animationDelay: '2s' }}></div>
                
                {/* Moving lines/streaks */}
                <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#3c959d]/30 to-transparent animate-pulse pointer-events-none" style={{ animationDuration: '6s' }}></div>
                <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ef7335]/25 to-transparent animate-pulse pointer-events-none" style={{ animationDuration: '8s', animationDelay: '3s' }}></div>
                
                {/* Enhanced floating particles */}
                {mounted && (
                    <div className="absolute inset-0 opacity-25 pointer-events-none">
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
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#3c959d]/8 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#ef7335]/8 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Main Payment Container - Full Coverage */}
            <div className={`relative z-10 w-full h-full transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                
                {/* Payment Form Card - Full Coverage */}
                <div className="relative w-full h-full bg-white/95 backdrop-blur-xl border border-white/90 shadow-xl shadow-slate-900/20 overflow-hidden">
                    {/* Subtle animated border glow - smaller */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#3c959d]/30 via-[#4ba5ad]/30 to-[#ef7335]/30 rounded-2xl blur-sm opacity-50 animate-pulse pointer-events-none" style={{ animationDuration: '3s' }}></div>
                    
                    {/* Header Section - Ultra Compact */}
                    <div className="text-center pb-3 pt-4 px-4">
                        {/* Enhanced Logo/Icon with animated ring */}
                        <div className="inline-flex items-center justify-center mb-3">
                            <div className="relative group">
                                {/* Animated ring around logo */}
                                <div className="absolute -inset-3 border-2 border-gradient-to-r from-[#3c959d]/30 to-[#ef7335]/30 rounded-full animate-spin opacity-40" style={{ animationDuration: '8s' }}></div>
                                <div className="absolute -inset-1 border border-[#4ba5ad]/20 rounded-full animate-ping opacity-30" style={{ animationDuration: '2s' }}></div>
                                
                                <img 
                                    src="/logo.png" 
                                    alt="Tunisie Business Solutions Logo" 
                                    className="h-16 w-auto object-contain transform group-hover:scale-105 transition-all duration-300 filter drop-shadow-lg relative z-10"
                                />
                            </div>
                        </div>

                        <h2 className="text-lg font-bold bg-gradient-to-r from-slate-800 via-[#3c959d] to-slate-800 bg-clip-text text-transparent mb-1 tracking-tight">
                            Choose Payment Method
                        </h2>
                        <p className="text-xs text-slate-600 font-light leading-relaxed">
                            Select your preferred payment option
                        </p>
                        
                        {/* Decorative line */}
                        <div className="w-8 h-[1px] bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full mx-auto mt-2 opacity-60"></div>
                    </div>

                    {/* Content Section - Ultra Compact Layout */}
                    <div className="px-4 pb-4 flex-1">
                        {/* Payment Methods - Ultra Compact Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className={`relative group transition-all duration-200 bg-white border rounded-md p-2 ${
                                        method.available 
                                            ? `cursor-pointer hover:shadow-sm ${
                                                selectedPaymentMethod === method.id 
                                                    ? 'ring-1 ring-[#3c959d] shadow-md scale-[1.01] border-[#3c959d]' 
                                                    : 'hover:scale-[1.005] border-slate-200 hover:border-slate-300'
                                            }`
                                            : 'cursor-not-allowed opacity-60 hover:opacity-70'
                                    }`}
                                    onClick={() => handlePaymentMethodSelect(method.id)}
                                >
                                    <div className="flex items-center space-x-2">
                                        {/* Selection indicator */}
                                        <div className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                                            selectedPaymentMethod === method.id
                                                ? 'border-[#3c959d] bg-[#3c959d]'
                                                : 'border-slate-300 group-hover:border-slate-400'
                                        }`}>
                                            {selectedPaymentMethod === method.id && (
                                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                            )}
                                        </div>

                                        {/* Method icon - ultra small */}
                                        <div className={`p-1 rounded ${method.bgColor} ${method.color}`}>
                                            <div className="w-4 h-4">
                                                {method.icon}
                                            </div>
                                        </div>

                                        {/* Method details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-slate-800 text-xs mb-0.5">
                                                {method.name}
                                            </h3>
                                            <p className="text-xs text-slate-500 leading-tight truncate">
                                                {method.description}
                                            </p>
                                        </div>

                                        {/* Coming Soon Badge */}
                                        {method.comingSoon && (
                                            <div className="absolute top-1 right-1">
                                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200 px-1 py-0.5 text-xs">
                                                    Soon
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Secure Stripe Credit Card Form - Shows when Credit Card is selected */}
                        {showCreditCardForm && (
                            <div className="flex-1 min-h-0 relative z-10">
                            <Elements stripe={stripePromise}>
                                    <SecureStripePaymentForm 
                                    ref={stripeFormRef}
                                    onPaymentSuccess={() => {
                                        console.log('Payment successful!');
                                        // Payment success is handled in the main payment logic
                                        // No need to redirect here as it's already handled
                                    }}
                                    isProcessing={isProcessing}
                                    setIsProcessing={setIsProcessing}
                                    planId={planId}
                                    planName={planName}
                                    planPrice={planPrice}
                                    planCurrency={planCurrency}
                                />
                            </Elements>
                            </div>
                        )}


                        {/* Enhanced Submit Button - Ultra Compact */}
                        <div className="mt-3">
                        <Button
                            onClick={handlePaymentSubmit}
                            disabled={!selectedPaymentMethod || isProcessing}
                                className="group relative w-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2a7a82] hover:via-[#3d94a0] hover:to-[#d45f2a] text-white font-medium py-2 px-3 text-xs tracking-wide rounded-md"
                        >
                            {/* Animated shimmer effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                            
                            <div className="relative flex items-center justify-center group-hover:scale-[0.995] transition-all duration-200">
                                {isProcessing ? (
                                    <div className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                            <span className="animate-pulse text-xs">Processing...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                            <span className="text-xs">Complete Payment</span>
                                            <svg className="ml-1.5 h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </Button>

                            {/* Back to Plans Link */}
                            <div className="text-center mt-2">
                            <Button 
                                variant="ghost" 
                                asChild
                                    className="text-xs font-medium text-[#3c959d] hover:text-[#4ba5ad] hover:bg-[#3c959d]/10 transition-all duration-200 py-0.5 px-1"
                            >
                                <a href="/businessPlans">
                                    ← Back to Plans
                                </a>
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
