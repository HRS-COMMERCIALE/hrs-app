'use client';

import { useState } from 'react';
import { useLanguageStore } from '../../../../store/languageStore';

export interface SubscriptionData {
    selectedPlanId: string;
    selectedPlanName: string;
    selectedPlanPrice: string;
}

interface PlanOption {
    id: string;
    name: string;
    price: string;
    currency?: string;
    features: string[];
    popular?: boolean;
    isCustom?: boolean;
}

type SubscriptionFormProps = {
    initialValues?: Partial<SubscriptionData>;
    onSubmit: (data: SubscriptionData) => void;
    onPlanChange?: (data: SubscriptionData) => void;
};

export default function SubscriptionForm({ initialValues, onSubmit, onPlanChange }: SubscriptionFormProps) {
    const { currentTranslations } = useLanguageStore();
    const language = currentTranslations.homePage.BusinessPlan;

    // Build plans from language object (pricingTiers + optional custom plan)
    const tierPlans: PlanOption[] = (language?.pricingTiers ?? []).map((tier: any, index: number) => ({
        id: `plan-${index}`,
        name: String(tier?.name ?? ''),
        price: String(tier?.price ?? ''),
        currency: tier?.currency ? String(tier.currency) : undefined,
        features: Array.isArray(tier?.features) ? tier.features as string[] : [],
        popular: Boolean(tier?.popular),
    }));

    const customPlan: PlanOption[] = language?.customPlan
        ? [{
            id: 'custom',
            name: String(language.customPlan.name ?? 'Custom Plan'),
            price: String(language.customPlan.price ?? ''),
            currency: '',
            features: Array.isArray(language.customPlan.features) ? language.customPlan.features as string[] : [],
            popular: false,
            isCustom: true,
        }]
        : [];

    const availablePlans: PlanOption[] = [...tierPlans, ...customPlan];

    const defaultPlan: PlanOption | undefined = availablePlans[0];

    const [formData, setFormData] = useState<SubscriptionData>({
        selectedPlanId: initialValues?.selectedPlanId ?? '',
        selectedPlanName: initialValues?.selectedPlanName ?? '',
        selectedPlanPrice: initialValues?.selectedPlanPrice ?? '',
    });
    const [hasUserSelected, setHasUserSelected] = useState<boolean>(Boolean(initialValues?.selectedPlanId));
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.selectedPlanId) {
            setError('Please select a plan to continue.');
            return;
        }
        const selectedPlan = availablePlans.find(p => p.id === formData.selectedPlanId);
        onSubmit({
            selectedPlanId: formData.selectedPlanId,
            selectedPlanName: selectedPlan?.name || '',
            selectedPlanPrice: selectedPlan?.price || '',
        });
    };

    const handlePlanChange = (planId: string) => {
        setFormData(prev => ({ ...prev, selectedPlanId: planId }));
        setHasUserSelected(true);
        if (error) setError(null);
        if (onPlanChange) {
            const selectedPlan = availablePlans.find(p => p.id === planId);
            onPlanChange({
                selectedPlanId: planId,
                selectedPlanName: selectedPlan?.name || '',
                selectedPlanPrice: selectedPlan?.price || '',
            });
        }
    };

    // Prevent copying/pasting and selection on plan texts
    const preventCopy = (e: React.ClipboardEvent) => e.preventDefault();
    const preventCut = (e: React.ClipboardEvent) => e.preventDefault();
    const preventContextMenu = (e: React.MouseEvent) => e.preventDefault();
    const preventDragStart = (e: React.DragEvent) => e.preventDefault();

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header moved to container for consistency */}

            {/* Business plan options matching businessPlan.tsx styling */}
            <div>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none"
                    onCopy={preventCopy}
                    onCut={preventCut}
                    onContextMenu={preventContextMenu}
                    onDragStart={preventDragStart}
                >
                    {availablePlans.map((plan, index) => {
                        const checked = formData.selectedPlanId === plan.id;
                        const isCustom = plan.id === 'custom' || plan.isCustom;
                        
                        return (
                            <label key={plan.id} className={`relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group ${
                                checked ? 'scale-105' : ''
                            }`}>
                                {/* Main Card - matching businessPlan.tsx styling */}
                                <div className={`relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border-2 transition-all duration-300 flex flex-col h-full ${
                                    checked
                                        ? 'border-[#3c959d] ring-2 ring-[#3c959d]/20'
                                        : 'border-gray-200 hover:border-[#3c959d]/50'
                                } ${isCustom ? 'bg-gradient-to-br from-purple-600 to-indigo-700 border-purple-500' : ''}`}>
                                    {checked && (
                                        <div className="absolute top-3 right-3 z-10">
                                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-md ring-2 ring-[#3c959d]">
                                                <svg className="h-4 w-4 text-[#3c959d]" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Card Background Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${
                                        isCustom
                                            ? 'from-purple-500/20 to-indigo-600/20'
                                            : 'from-[#3c959d]/5 to-[#ef7335]/5'
                                    } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

                                    {/* Popular Badge */}
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-[#3c959d] to-[#ef7335] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    {/* Plan Header */}
                                    <div className="text-center mb-6 relative z-10">
                                        <h3 className={`text-xl font-bold mb-2 ${
                                            isCustom ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline justify-center">
                                            <span className={`text-3xl font-bold ${
                                                isCustom ? 'text-white' : 'text-gray-900'
                                            }`}>
                                                {plan.price}
                                            </span>
                                            {plan.currency && (
                                                <span className={`text-base ml-1 ${
                                                    isCustom ? 'text-purple-100' : 'text-gray-500'
                                                }`}>
                                                    {plan.currency}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features List */}
                                    <ul className="space-y-2 mb-6 flex-1 relative z-10">
                                        {plan.features.map((feature, featureIndex) => (
                                            <li key={featureIndex} className="flex items-start">
                                                <svg
                                                    className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                                                        isCustom ? 'text-purple-200' : 'text-green-500'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <span className={`text-xs ${
                                                    isCustom ? 'text-purple-100' : 'text-gray-700'
                                                }`}>
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Radio Input */}
                                    <input
                                        type="radio"
                                        name="selectedPlanId"
                                        value={plan.id}
                                        checked={checked}
                                        onChange={(e) => handlePlanChange(e.target.value)}
                                        className="sr-only"
                                    />

                                    {/* Selection Indicator */}
                                    <div className={`w-full h-1 rounded-full transition-all duration-300 mt-auto ${
                                        checked 
                                            ? 'bg-gradient-to-r from-[#3c959d] to-[#ef7335]' 
                                            : isCustom
                                            ? 'bg-purple-400'
                                            : 'bg-gray-200'
                                    }`}></div>
                                </div>
                            </label>
                        );
                    })}
                </div>
                {error && (
                    <div className="mt-3 text-sm text-red-600" aria-live="polite">{error}</div>
                )}
            </div>

            {/* Selected Plan Summary */}
            <div
                className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur px-4 py-3 shadow-sm select-none"
                onCopy={preventCopy}
                onCut={preventCut}
                onContextMenu={preventContextMenu}
                onDragStart={preventDragStart}
            >
                {(() => {
                    const selected = availablePlans.find(p => p.id === formData.selectedPlanId);
                    return (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3c959d] to-[#ef7335] text-white flex items-center justify-center text-sm font-semibold shadow">
                                    {selected?.name?.charAt(0) ?? '?'}
                                </div>
                                <div>
                                    <div className="text-sm text-slate-500">Selected Plan</div>
                                    <div className="text-slate-900 font-semibold">{selected?.name ?? '—'}</div>
                                </div>
                            </div>
                            <div className="text-slate-900 font-bold">
                                {selected?.price}
                                {selected?.currency && <span className="ml-1 text-slate-500 font-medium text-sm">{selected.currency}</span>}
                            </div>
                        </div>
                    );
                })()}
            </div>
        </form>
    );
}


