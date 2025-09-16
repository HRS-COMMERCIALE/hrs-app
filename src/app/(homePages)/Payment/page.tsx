'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import PaymentContainer from '../../../components/pages/payment/PaymentContainer';
import { getPlanById, isValidPlanId, PaymentPlan } from '../../api/stripe-config/PaymentPlanceConfig';

function PaymentPageContent() {
    const [mounted, setMounted] = useState(false);
    const [planData, setPlanData] = useState<PaymentPlan | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3c959d] via-[#4ba5ad] to-[#ef7335]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
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
