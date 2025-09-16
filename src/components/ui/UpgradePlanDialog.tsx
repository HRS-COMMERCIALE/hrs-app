"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Shield, Users, Star, Building2 } from 'lucide-react';

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const UpgradePlanDialog: React.FC<UpgradePlanDialogProps> = ({ open, onOpenChange }) => {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/businessPlans');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Upgrade Required
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-base">
            You need a premium plan to create a business workspace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Features List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-3">Premium Features:</h3>
            {[
              { icon: Building2, text: "Create unlimited businesses", color: "text-blue-400" },
              { icon: Users, text: "Team collaboration tools", color: "text-green-400" },
              { icon: Shield, text: "Advanced security features", color: "text-purple-400" },
              { icon: Zap, text: "Priority support", color: "text-yellow-400" },
              { icon: Star, text: "Premium integrations", color: "text-pink-400" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-slate-300">
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <Crown className="w-5 h-5 mr-2" />
              View Plans & Upgrade
            </Button>
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlanDialog;
