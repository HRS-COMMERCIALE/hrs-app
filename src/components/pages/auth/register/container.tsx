'use client';

import { useState, useTransition, useRef, useCallback, useEffect } from 'react';
import AddressForm, { AddressData } from './Address';
import BusinessForm, { BusinessData } from './Business';
import OrderForm, { OrderData } from './Order';
import SubscriptionForm, { SubscriptionData } from './Subscription';
import UserForm, { UserData } from './User';
import { Building2, MapPin, User as UserIcon, CreditCard, ShoppingCart, AlertCircle } from 'lucide-react';

type CollectedData = {
    user?: Partial<UserData>;
    business?: Partial<BusinessData>;
    address?: Partial<AddressData>;
    subscription?: SubscriptionData;
    order?: OrderData;
};

const plans: Array<{ id: string; name: string; price?: string }> = [
    { id: 'plan-0', name: 'Basic Plan', price: 'TND 59.99' },
    { id: 'plan-1', name: 'Pro Plan', price: 'TND 129.00' },
    { id: 'plan-2', name: 'Enterprise Plan', price: 'TND 270.00' }
];

export default function RegisterContainer() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<CollectedData>({});
    const [isPending, startTransition] = useTransition();
    const lastLoggedRef = useRef<string>('');
    const [validationError, setValidationError] = useState<string | null>(null);
    
    const logCollectedData = useCallback((snapshot: CollectedData) => {
        try {
            const str = JSON.stringify(snapshot);
            if (lastLoggedRef.current !== str) {
                // eslint-disable-next-line no-console
                lastLoggedRef.current = str;
            }
        } catch {
            // fallback without blocking UI
            // eslint-disable-next-line no-console
        }
    }, []);

    const totalSteps = 5;
    const isSubscriptionStep = step === 0;
    const isBusinessStep = step === 1;
    const isAddressStep = step === 2;
    const isUserStep = step === 3;
    const isOrderStep = step === 4;
    const isWideStep = isSubscriptionStep || isBusinessStep || isAddressStep || isUserStep || isOrderStep;
    const canProceedFromSubscription = !isSubscriptionStep || Boolean(data.subscription?.selectedPlanId);
    const canProceedFromBusiness = !isBusinessStep || Boolean(
        (data.business?.businessName || '').toString().trim() &&
        (data.business?.taxId || '').toString().trim() &&
        (data.business?.industry || '').toString().trim() &&
        (data.business?.currency || '').toString().trim() &&
        (data.business?.size || '').toString().trim() &&
        (data.business?.cnssCode || '').toString().trim()
    );
    const progressPercent = Math.round(((step + 1) / totalSteps) * 100);
    const stepMeta = [
        { label: 'Subscription', icon: CreditCard },
        { label: 'Business', icon: Building2 },
        { label: 'Address', icon: MapPin },
        { label: 'User', icon: UserIcon },
        { label: 'Order', icon: ShoppingCart },
    ] as const;

    const goNext = () => {
        setValidationError(null); // Clear validation errors when moving forward
        setStep(s => Math.min(s + 1, totalSteps - 1));
    };
    
    const goBack = () => {
        setValidationError(null); // Clear validation errors when going back
        setStep(s => Math.max(s - 1, 0));
    };
    
    const [canSubmitOrder, setCanSubmitOrder] = useState(false);
    
    // Listen to order terms changes
    useEffect(() => {
        const handler = (e: any) => {
            if (!e || !e.detail) return;
            setCanSubmitOrder(Boolean(e.detail.accepted));
        };
        window.addEventListener('order-terms-changed', handler as any);
        return () => window.removeEventListener('order-terms-changed', handler as any);
    }, []);

    // Listen to validation errors from OrderForm
    useEffect(() => {
        const handler = (e: any) => {
            if (!e || !e.detail) return;
            if (e.detail.type === 'validation_error') {
                setValidationError(e.detail.message);
                // Automatically go back to the relevant step based on the error
                const field = e.detail.field;
                if (field?.startsWith('user.')) {
                    setStep(3); // User step
                } else if (field?.startsWith('business.')) {
                    setStep(1); // Business step
                } else if (field?.startsWith('address.')) {
                    setStep(2); // Address step
                } else if (field?.startsWith('subscription.')) {
                    setStep(0); // Subscription step
                }
            }
        };
        window.addEventListener('validation-error', handler as any);
        return () => window.removeEventListener('validation-error', handler as any);
    }, []);

    const handleUser = (payload: UserData) => {
        setData(prev => {
            const next = { ...prev, user: payload };
            logCollectedData(next);
            return next;
        });
        goNext();
    };
    const handleBusiness = (payload: BusinessData) => {
        setData(prev => ({ ...prev, business: payload }));
        goNext();
    };
    const handleAddress = (payload: AddressData) => {
        setData(prev => {
            const next = { ...prev, address: payload };
            logCollectedData(next);
            return next;
        });
        goNext();
    };
    const handleSubscription = (payload: SubscriptionData) => {
        setData(prev => {
            const next = { ...prev, subscription: payload };
            logCollectedData(next);
            return next;
        });
        goNext();
    };
    const handleOrder = (payload: OrderData) => {
        const finalPayload = { ...data, order: payload } as Required<CollectedData>;
        
    };

    // Handle business form changes including logo file
    const handleBusinessChange = (partial: Partial<BusinessData>) => {
        startTransition(() => {
            setData(prev => {
                const next = { 
                    ...prev, 
                    business: { 
                        ...(prev.business ?? {}), 
                        ...partial,
                        // Ensure logoFile is preserved when updating other fields
                        logoFile: partial.logoFile !== undefined ? partial.logoFile : prev.business?.logoFile
                    } 
                };
                logCollectedData(next);
                return next;
            });
        });
    };

    return (
        <div className={`min-h-screen w-full flex items-start justify-center ${isWideStep ? 'bg-gradient-to-br from-slate-50 to-[#eef8f9]' : 'bg-slate-50'} py-0 px-4`}>
            <div className={`w-full ${isWideStep ? 'max-w-6xl' : 'max-w-2xl'} bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xl`}>
                {/* Validation Error Banner */}
                {validationError && (
                    <div className="px-6 py-4 border-b border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-orange-800 mb-1">Validation Error Detected</h3>
                                <p className="text-sm text-orange-700 mb-2">{validationError}</p>
                                <p className="text-xs text-orange-600">
                                    You've been redirected to the relevant step. Please fix the issue and continue.
                                </p>
                            </div>
                            <button
                                onClick={() => setValidationError(null)}
                                className="text-orange-400 hover:text-orange-600 transition-colors text-sm"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                )}

                <div className="px-5 py-3 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {(() => {
                                const Icon = stepMeta[step].icon;
                                return (
                                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#3c959d]/15 to-[#ef7335]/15 flex items-center justify-center ring-1 ring-[#3c959d]/20 shadow-sm">
                                        <Icon className="w-5 h-5 text-[#3c959d]" />
                                    </div>
                                );
                            })()}
                            <div>
                                <div className="text-lg md:text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#3c959d] to-[#ef7335]">{stepMeta[step].label}</div>
                                <div className="mt-0.5 text-[11px] text-slate-500">Step {step + 1} of {totalSteps}</div>
                            </div>
                        </div>
                        <div className="w-28 text-right text-xs text-slate-500">{progressPercent}%</div>
                    </div>
                    <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335]" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {step === 0 && (
                        <SubscriptionForm
                            initialValues={data.subscription}
                            onSubmit={handleSubscription}
                            onPlanChange={(payload) => {
                                setData(prev => {
                                    const next = { ...prev, subscription: payload };
                                    logCollectedData(next);
                                    return next;
                                });
                            }}
                        />
                    )}
                    {step === 1 && (
                        <BusinessForm
                            initialValues={data.business}
                            onSubmit={handleBusiness}
                            onChange={handleBusinessChange}
                        />
                    )}
                    {step === 2 && (
                        <AddressForm
                            initialValues={data.address}
                            onSubmit={handleAddress}
                            onChange={(partial) => {
                                startTransition(() => {
                                    setData(prev => {
                                        const next = { ...prev, address: { ...(prev.address ?? {}), ...partial } };
                                        logCollectedData(next);
                                        return next;
                                    });
                                });
                            }}
                        />
                    )}
                    {step === 3 && (
                        <UserForm
                            initialValues={data.user}
                            onSubmit={handleUser}
                            onChange={(partial) => {
                                startTransition(() => {
                                    setData(prev => {
                                        const next = { ...prev, user: { ...(prev.user ?? {}), ...partial } };
                                        logCollectedData(next);
                                        return next;
                                    });
                                });
                            }}
                        />
                    )}
                    {step === 4 && (
                        <OrderForm 
                            availablePlans={plans} 
                            selectedPlan={data.subscription ? {
                                id: data.subscription.selectedPlanId,
                                name: data.subscription.selectedPlanName,
                                price: data.subscription.selectedPlanPrice
                            } : undefined}
                            initialValues={data.order} 
                            collectedData={data}
                            onSubmit={handleOrder}
                            onPlanChange={(planId) => {
                                const selectedPlan = plans.find(p => p.id === planId);
                                if (!selectedPlan) return;
                                setData(prev => ({
                                    ...prev,
                                    subscription: {
                                        ...(prev.subscription ?? {} as any),
                                        selectedPlanId: planId,
                                        selectedPlanName: selectedPlan.name,
                                        selectedPlanPrice: selectedPlan.price || ''
                                    }
                                }));
                            }}
                        />
                    )}
                </div>

                <div className="px-6 pb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={goBack}
                        disabled={step === 0}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-slate-700 disabled:opacity-50"
                    >
                        Back
                    </button>
                    <div className="text-sm text-slate-500">
                        {step === 0 && 'Abonnement'}
                        {step === 1 && 'Entreprise'}
                        {step === 2 && 'Adresse'}
                        {step === 3 && 'Utilisateur'}
                        {step === 4 && 'Commande'}
                    </div>
                    {step < totalSteps - 1 ? (
                        <button
                            type="button"
                            onClick={goNext}
                            disabled={!canProceedFromSubscription || !canProceedFromBusiness}
                            className={`rounded-lg px-4 py-2 text-white disabled:opacity-50 ${
                                !canProceedFromSubscription || !canProceedFromBusiness
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335]'
                            }`}
                            title={!canProceedFromSubscription ? 'Please select a plan to continue' : (!canProceedFromBusiness ? 'Please complete required business fields to continue' : undefined)}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            type="submit"
                            form="order-form"
                            disabled={!canSubmitOrder}
                            className={`rounded-lg px-4 py-2 text-white ${
                                !canSubmitOrder
                                    ? 'bg-slate-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335]'
                            }`}
                        >
                            Create Account
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}


