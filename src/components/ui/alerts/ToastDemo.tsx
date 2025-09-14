'use client';

import React, { useState } from 'react';
import { useToast } from './ToastContainer';
import { Alert, EmailVerificationSuccess, VerificationCodeSent, VerificationError } from './index';

export default function ToastDemo() {
  const { showToast } = useToast();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showWarningAlert, setShowWarningAlert] = useState(false);
  const [showInfoAlert, setShowInfoAlert] = useState(false);
  const [showCodeSentAlert, setShowCodeSentAlert] = useState(false);
  const [showVerificationErrorAlert, setShowVerificationErrorAlert] = useState(false);
  const [showEmailSuccessAlert, setShowEmailSuccessAlert] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Toast & Alert Components Demo</h1>
        
        {/* Toast Demonstrations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Toast Notifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => showToast('success', 'This is a success toast!')}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              Success Toast
            </button>
            <button
              onClick={() => showToast('error', 'This is an error toast!')}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Error Toast
            </button>
            <button
              onClick={() => showToast('warning', 'This is a warning toast!')}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              Warning Toast
            </button>
            <button
              onClick={() => showToast('info', 'This is an info toast!')}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Info Toast
            </button>
          </div>
        </div>

        {/* Alert Demonstrations */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Alert Components</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setShowSuccessAlert(!showSuccessAlert)}
              className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
            >
              Success Alert
            </button>
            <button
              onClick={() => setShowErrorAlert(!showErrorAlert)}
              className="px-4 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
            >
              Error Alert
            </button>
            <button
              onClick={() => setShowWarningAlert(!showWarningAlert)}
              className="px-4 py-2 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors"
            >
              Warning Alert
            </button>
            <button
              onClick={() => setShowInfoAlert(!showInfoAlert)}
              className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Info Alert
            </button>
            <button
              onClick={() => setShowCodeSentAlert(!showCodeSentAlert)}
              className="px-4 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 transition-colors"
            >
              Code Sent Alert
            </button>
            <button
              onClick={() => setShowVerificationErrorAlert(!showVerificationErrorAlert)}
              className="px-4 py-2 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
            >
              Verification Error
            </button>
            <button
              onClick={() => setShowEmailSuccessAlert(!showEmailSuccessAlert)}
              className="px-4 py-2 bg-indigo-500 text-white rounded text-sm hover:bg-indigo-600 transition-colors"
            >
              Email Success
            </button>
          </div>

          <div className="space-y-4">
            {showSuccessAlert && (
              <Alert
                type="success"
                title="Success!"
                message="This is a success alert example with auto-close functionality."
                onClose={() => setShowSuccessAlert(false)}
                autoClose={true}
                autoCloseDelay={3000}
              />
            )}
            
            {showErrorAlert && (
              <Alert
                type="error"
                title="Error!"
                message="This is an error alert example."
                onClose={() => setShowErrorAlert(false)}
              />
            )}
            
            {showWarningAlert && (
              <Alert
                type="warning"
                title="Warning!"
                message="This is a warning alert example."
                onClose={() => setShowWarningAlert(false)}
              />
            )}
            
            {showInfoAlert && (
              <Alert
                type="info"
                title="Information"
                message="This is an info alert example."
                onClose={() => setShowInfoAlert(false)}
              />
            )}
            
            {showCodeSentAlert && (
              <VerificationCodeSent
                onClose={() => setShowCodeSentAlert(false)}
                countdown={600}
              />
            )}
            
            {showVerificationErrorAlert && (
              <VerificationError
                error="invalid_code"
                onClose={() => setShowVerificationErrorAlert(false)}
              />
            )}

            {showEmailSuccessAlert && (
              <EmailVerificationSuccess
                onClose={() => setShowEmailSuccessAlert(false)}
              />
            )}
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Usage Instructions</h2>
          <div className="space-y-4 text-sm text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900">Toast Notifications:</h3>
              <p>Use the <code className="bg-gray-100 px-1 rounded">useToast()</code> hook to show toast notifications:</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
{`const { showToast } = useToast();
showToast('success', 'Operation completed successfully!');`}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Alert Components:</h3>
              <p>Import and use alert components directly:</p>
              <pre className="bg-gray-100 p-2 rounded mt-2 text-xs">
{`import { Alert } from '@/components/ui/alerts';

<Alert
  type="success"
  title="Success!"
  message="Your action was successful!"
  onClose={() => setShowAlert(false)}
/>`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
