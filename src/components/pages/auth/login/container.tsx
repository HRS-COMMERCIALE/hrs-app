import LeftSideContent from './leftSideContent';
import RightSideContent from './rightSideContent';

export default function LoginContainer() {
    return (
        <div className="h-screen w-screen flex overflow-hidden fixed inset-0"> 
            <LeftSideContent />
            <RightSideContent />
        </div>
    );
}