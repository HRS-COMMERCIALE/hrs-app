'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './button';
import { Badge } from './badge';
import { X, CheckCircle, Star, Zap, Shield, Users, BarChart3 } from 'lucide-react';

interface PaymentSuccessPopupProps {
  planName: string;
  onClose: () => void;
}

export default function PaymentSuccessPopup({ planName, onClose }: PaymentSuccessPopupProps) {
  const router = useRouter();

  // Get plan-specific features and benefits
  const getPlanFeatures = (plan: string) => {
    const features = {
      'Premium': [
        { icon: BarChart3, text: 'Advanced Analytics Dashboard', color: 'text-blue-600' },
        { icon: Users, text: 'Team Management (Up to 10 users)', color: 'text-green-600' },
        { icon: Zap, text: 'Priority Support', color: 'text-yellow-600' },
        { icon: Shield, text: 'Enhanced Security Features', color: 'text-purple-600' }
      ],
      'Platinum': [
        { icon: BarChart3, text: 'Premium Analytics & Reports', color: 'text-blue-600' },
        { icon: Users, text: 'Unlimited Team Members', color: 'text-green-600' },
        { icon: Star, text: 'VIP Support & Consultation', color: 'text-yellow-600' },
        { icon: Zap, text: 'Advanced Automation Tools', color: 'text-orange-600' },
        { icon: Shield, text: 'Enterprise Security', color: 'text-purple-600' }
      ],
      'custom': [
        { icon: Star, text: 'Custom Solutions', color: 'text-purple-600' },
        { icon: Users, text: 'Dedicated Account Manager', color: 'text-green-600' },
        { icon: Zap, text: 'Priority Implementation', color: 'text-yellow-600' }
      ]
    };
    
    return features[plan as keyof typeof features] || features['Premium'];
  };

  const features = getPlanFeatures(planName);

  const handleGetStarted = () => {
    onClose();
    router.push('/dashboard');
  };

  const handleExploreFeatures = () => {
    onClose();
    router.push('/businessPlans');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header */}
        <div className="p-8 pb-6">
          <div className="text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome to {planName}! 🎉
            </h1>
            <p className="text-slate-600 mb-6">
              Your subscription has been activated successfully. You now have access to premium features!
            </p>

            {/* Plan Badge */}
            <Badge 
              variant="secondary" 
              className={`text-lg px-4 py-2 ${
                planName === 'Premium' ? 'bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] text-white' :
                planName === 'Platinum' ? 'bg-gradient-to-r from-[#ef7335] to-[#ff6b35] text-white' :
                'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
              }`}
            >
              {planName} Plan
            </Badge>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-8 pb-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4 text-center">
            What you can do now:
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                <span className="text-slate-700 font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8">
          <div className="space-y-3">
            <Button 
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-[#3c959d] to-[#4ba5ad] hover:from-[#2a7a82] hover:to-[#3d94a0] text-white text-lg py-3"
            >
              Get Started with Dashboard
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleExploreFeatures}
              className="w-full text-slate-600 hover:bg-slate-50"
            >
              Explore All Features
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-800 font-medium mb-1">
                  Your subscription is valid for 1 year
                </p>
                <p className="text-xs text-blue-600">
                  You'll receive a confirmation email shortly. Need help? Contact our support team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
