import React from 'react';
import Alert from './Alert';

interface VerificationErrorProps {
  error: 'invalid_code' | 'expired_code' | 'too_many_attempts' | 'network_error' | 'unknown';
  onClose?: () => void;
  className?: string;
  customMessage?: string;
}

const errorMessages = {
  invalid_code: 'The verification code you provided is incorrect. Please try again.',
  expired_code: 'Verification code has expired. Please request a new code.',
  too_many_attempts: 'Too many attempts. Please wait before trying again.',
  network_error: 'Network error. Please check your connection and try again.',
  unknown: 'An error occurred. Please try again.',
};

const errorTitles = {
  invalid_code: 'Invalid Code',
  expired_code: 'Code Expired',
  too_many_attempts: 'Too Many Attempts',
  network_error: 'Network Error',
  unknown: 'Error',
};

export default function VerificationError({
  error,
  onClose,
  className = '',
  customMessage,
}: VerificationErrorProps) {
  return (
    <Alert
      type="error"
      title={errorTitles[error]}
      message={customMessage || errorMessages[error]}
      onClose={onClose}
      className={className}
      showIcon={true}
      autoClose={false}
    />
  );
}
