import React from 'react';
import Alert from './Alert';

interface VerificationCodeSentProps {
  onClose?: () => void;
  className?: string;
  countdown?: number;
}

export default function VerificationCodeSent({
  onClose,
  className = '',
  countdown,
}: VerificationCodeSentProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Alert
      type="success"
      title="Verification Code Sent!"
      message={
        countdown 
          ? `Check your email for the verification code. Code expires in ${formatTime(countdown)}.`
          : "Check your email for the verification code."
      }
      onClose={onClose}
      className={className}
      showIcon={true}
      autoClose={false}
    />
  );
}
