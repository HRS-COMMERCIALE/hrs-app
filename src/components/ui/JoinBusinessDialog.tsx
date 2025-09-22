"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Hash, ArrowRight, Copy, Check, CheckCircle2, AlertTriangle } from 'lucide-react';

interface JoinBusinessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinedSuccess?: () => void;
}

const JoinBusinessDialog: React.FC<JoinBusinessDialogProps> = ({ open, onOpenChange, onJoinedSuccess }) => {
  const [businessCode, setBusinessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessCode.trim()) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    
    try {
      const response = await fetch('/api/dashboard/settings/invitation/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          invitationCode: businessCode.trim(),
          acceptTerms: true
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Show success in-dialog instead of alert
        setSubmitSuccess(data.message || 'Successfully joined the business! Your membership is pending approval.');
      } else {
        // Show error inline
        setSubmitError(data.error || 'Failed to join business. Please try again.');
      }
    } catch (error) {
      console.error('Error joining business:', error);
      setSubmitError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(businessCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader className="text-center">
          {submitSuccess ? (
            <>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">Request Sent</DialogTitle>
              <DialogDescription className="text-slate-300 text-base">
                {submitSuccess}
              </DialogDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-white">Join Business</DialogTitle>
              <DialogDescription className="text-slate-300 text-base">
                Enter the invitation code to join a business
              </DialogDescription>
            </>
          )}
        </DialogHeader>

        {submitSuccess ? (
          <div className="space-y-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-slate-200 text-sm">
              Your membership is pending admin approval. You'll see the business once approved.
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                type="button"
                onClick={() => { setBusinessCode(''); setSubmitSuccess(null); onOpenChange(false); onJoinedSuccess && onJoinedSuccess(); }}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105"
              >
                Done
              </Button>
              <Button 
                type="button"
                variant="outline"
                onClick={() => { setBusinessCode(''); setSubmitSuccess(null); onOpenChange(false); }}
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2 text-red-300">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <span className="text-sm">{submitError}</span>
            </div>
          )}
          {/* Business Code Field */}
          <div className="space-y-2">
            <Label htmlFor="businessCode" className="text-white font-medium">
              Invitation Code
            </Label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                id="businessCode"
                type="text"
                placeholder="ABC123XYZ"
                value={businessCode}
                onChange={(e) => setBusinessCode(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              {businessCode && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyCode}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-slate-700"
                >
                  {copiedCode ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                <Users className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-sm text-slate-300">
                <p className="font-medium text-blue-400 mb-1">How to get the invitation code:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Ask your business admin for the invitation code</li>
                  <li>• Get the code from your team lead</li>
                  <li>• Check your email for invitation details</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              type="submit"
              disabled={!businessCode.trim() || isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Joining...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  <span>Join Business</span>
                </div>
              )}
            </Button>
            <Button 
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default JoinBusinessDialog;
