'use client';

import React, { useState } from 'react';
import Alert from './Alert';
import { 
  EmailVerificationSuccess, 
  VerificationCodeSent, 
  VerificationError,
  AlertType 
} from './index';

export default function AlertExamples() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEmailSuccess, setShowEmailSuccess] = useState(false);
  const [showCodeSent, setShowCodeSent] = useState(false);
  const [showVerificationError, setShowVerificationError] = useState(false);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Alert Components Examples</h1>
      
      {/* Basic Alert Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Basic Alerts</h2>
        
        <div className="space-y-2">
          <button
            onClick={() => setShowSuccess(!showSuccess)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Toggle Success Alert
          </button>
          {showSuccess && (
            <Alert
              type="success"
              title="Success!"
              message="This is a success message with a title."
              onClose={() => setShowSuccess(false)}
              autoClose={true}
              autoCloseDelay={3000}
            />
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowError(!showError)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Toggle Error Alert
          </button>
          {showError && (
            <Alert
              type="error"
              title="Error!"
              message="This is an error message with a title."
              onClose={() => setShowError(false)}
            />
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowWarning(!showWarning)}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Toggle Warning Alert
          </button>
          {showWarning && (
            <Alert
              type="warning"
              title="Warning!"
              message="This is a warning message with a title."
              onClose={() => setShowWarning(false)}
            />
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Info Alert
          </button>
          {showInfo && (
            <Alert
              type="info"
              title="Information"
              message="This is an information message with a title."
              onClose={() => setShowInfo(false)}
            />
          )}
        </div>
      </div>

      {/* Specialized Alert Examples */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Specialized Alerts</h2>
        
        <div className="space-y-2">
          <button
            onClick={() => setShowEmailSuccess(!showEmailSuccess)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Toggle Email Verification Success
          </button>
          {showEmailSuccess && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <EmailVerificationSuccess
                onClose={() => setShowEmailSuccess(false)}
                showRedirectMessage={true}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowCodeSent(!showCodeSent)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Verification Code Sent
          </button>
          {showCodeSent && (
            <VerificationCodeSent
              onClose={() => setShowCodeSent(false)}
              countdown={600}
            />
          )}
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setShowVerificationError(!showVerificationError)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Toggle Verification Error
          </button>
          {showVerificationError && (
            <VerificationError
              error="invalid_code"
              onClose={() => setShowVerificationError(false)}
            />
          )}
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Usage Instructions</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Basic Alert:</strong> Use for general notifications with different types (success, error, warning, info)</p>
          <p><strong>EmailVerificationSuccess:</strong> Use for email verification success states</p>
          <p><strong>VerificationCodeSent:</strong> Use when verification codes are sent successfully</p>
          <p><strong>VerificationError:</strong> Use for specific verification error types</p>
        </div>
      </div>
    </div>
  );
}
