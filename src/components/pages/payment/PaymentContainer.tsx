import PaymentLeftSideContent from './PaymentLeftSideContent';
import PaymentRightSideContent from './PaymentRightSideContent';

interface PaymentContainerProps {
    planId: string;
    planName: string;
    planPrice: string;
    planCurrency: string;
}

export default function PaymentContainer({ planId, planName, planPrice, planCurrency }: PaymentContainerProps) {
    return (
        <div className="h-screen w-screen flex overflow-hidden fixed inset-0"> 
            <PaymentLeftSideContent 
                planName={planName}
                planPrice={planPrice}
                planCurrency={planCurrency}
            />
            <PaymentRightSideContent 
                planId={planId}
                planName={planName}
                planPrice={planPrice}
                planCurrency={planCurrency}
            />
        </div>
    );
}
