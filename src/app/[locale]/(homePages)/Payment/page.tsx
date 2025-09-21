'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/hooks';
import PaymentContainer from '../../../../components/pages/payment/PaymentContainer';
import { getPlanById, isValidPlanId, PaymentPlan } from '../../../../app/api/stripe-config/PaymentPlanceConfig';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner/LoadingSpinner';
import { CreditCard } from 'lucide-react';

function PaymentPageContent() {
    const [mounted, setMounted] = useState(false);
    const [planData, setPlanData] = useState<PaymentPlan | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const { tNested } = useI18n();
    const tPayment = tNested('payment');
    const tCommon = tNested('common');

    useEffect(() => {
        setMounted(true);
    }, []);

    // Get plan ID from URL parameters
    const planId = searchParams.get('planId') || 'premium';

    // Fetch plan data from centralized configuration
    useEffect(() => {
        if (mounted) {
            if (!planId || !isValidPlanId(planId)) {
                router.push('/businessPlans');
                return;
            }

            const plan = getPlanById(planId);
            if (plan) {
                setPlanData(plan);
            } else {
                router.push('/businessPlans');
            }
        }
    }, [mounted, planId, router]);

    if (!mounted || !planData) {
        return (
            <LoadingSpinner 
                icon={CreditCard}
                message={tPayment('loading')}
                variant="fullscreen"
                size="lg"
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <PaymentContainer 
                planId={planData.id}
                planName={planData.name}
                planPrice={planData.price.toString()}
                planCurrency={planData.currency}
            />
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PaymentPageContent />
        </Suspense>
    );
}
