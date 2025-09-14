import LeftSideContent from '@/components/pages/auth/signup/leftSideContent';
import RightSideContent from '@/components/pages/auth/signup/rightSideContent';

export default function SignupContainer() {
    return (
        <div className="h-screen w-screen flex overflow-hidden fixed inset-0"> 
            <LeftSideContent />
            <RightSideContent />
        </div>
    );
}
