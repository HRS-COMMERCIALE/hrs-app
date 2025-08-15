import LeftSideContent from './leftSideContent';
import RightSideContent from './rightSideContent';

export default function LoginContainer() {
    return (
        <div className="min-h-screen flex">
            <LeftSideContent />
            <RightSideContent />
        </div>
    );
}