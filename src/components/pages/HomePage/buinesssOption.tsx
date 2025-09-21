"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../store/authProvider';
import { useUserBusinesses } from '../../../hooks/useUserBusinesses';
import { Plus, Building2, Users, Calendar, ArrowRight, Globe, Shield, TrendingUp, Zap, UserPlus, Search, Download, Star } from 'lucide-react';
import UpgradePlanDialog from '../../ui/UpgradePlanDialog';
import JoinBusinessDialog from '../../ui/JoinBusinessDialog';
import { PAYMENT_PLANS } from '../../../app/api/stripe-config/PaymentPlanceConfig';
import { useI18n } from '@/i18n/hooks';

const BusinessOption = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const { user, isPaidPlan, businessCount, businessLimit, canCreateBusiness } = useAuth();
  const { businesses, loading: businessesLoading, error: businessesError, refetch } = useUserBusinesses();
  const { tNested } = useI18n();
  const t = tNested('homePage.businessOption');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBusinessSelect = (businessId: number) => {
    setSelectedBusiness(businessId);
    // Navigate to dashboard with business selection
    router.push(`/dashboard?businessId=${businessId}`);
  };

  // Transform real business data for display
  const transformedBusinesses = businesses.map((businessAssociation, index) => {
    const business = businessAssociation.business;
    if (!business) return null;

    const colors = [
      "from-blue-500 via-blue-600 to-cyan-500",
      "from-green-500 via-emerald-600 to-teal-500", 
      "from-purple-500 via-pink-600 to-rose-500",
      "from-orange-500 via-red-600 to-pink-500",
      "from-indigo-500 via-purple-600 to-blue-500"
    ];
    
    const logos = ["🏢", "🌱", "🎨", "⚡", "🚀"];
    
    return {
      id: business.id,
      name: business.businessName,
      industry: business.industry,
      size: business.size,
      status: businessAssociation.isOnline ? t('status.online') : t('status.offline'),
      description: `${business.industry} ${t('cards.descriptionWithSize', { size: business.size })}`,
      logo: business.logoFile || logos[index % logos.length],
      color: colors[index % logos.length],
      borderColor: `border-${colors[index % logos.length].split('-')[1]}-500/30`,
      glowColor: `shadow-${colors[index % logos.length].split('-')[1]}-500/20`,
      features: [business.currency, business.industry, businessAssociation.role],
      lastActive: businessAssociation.lastActiveAt ? 
        new Date(businessAssociation.lastActiveAt).toLocaleDateString() : 
        businessAssociation.joinedAt ? 
        new Date(businessAssociation.joinedAt).toLocaleDateString() : 
        t('cards.unknown'),
      role: businessAssociation.role,
      joinedAt: businessAssociation.joinedAt
    };
  }).filter(Boolean);

  const handleCreateBusiness = () => {
    // Check if user can create business
    if (!canCreateBusiness) {
    if (user?.plan === 'free') {
      setShowUpgradeDialog(true);
        return;
      }
      
      // User has reached their business limit
      if (user?.plan === 'Diamond' && businessCount >= 3) {
        alert(t('limits.reachedDiamond'));
        return;
      }
      
      if ((user?.plan === 'Premium' || user?.plan === 'Platinum') && businessCount >= 1) {
        alert(t('limits.reachedPremiumOrPlatinum'));
        return;
      }
      
      return;
    }
    
    router.push('/business/create');
  };

  const handleJoinBusiness = () => {
    setShowJoinDialog(true);
  };

  const handleViewPlans = () => {
    router.push('/businessPlans');
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pt-28 pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#3c959d]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#ef7335]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 rounded-full blur-3xl animate-tilt"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEwOF8xNzgpIj4KPHBhdGggZD0iTTQwIDEuNUgwVjBINDBWMS41WiIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTA4XzE3OCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K')] opacity-20"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#4ba5ad]/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-12 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] text-white font-semibold px-6 py-3 text-sm rounded-full shadow-2xl border border-white/20 backdrop-blur-sm mb-6">
            <Building2 className="w-4 h-4" />
            {t('badge')}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-2">
              {t('title.chooseYour')}
            </span>
            <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent">
              {t('title.businessHub')}
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            {t('subtitle')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={handleJoinBusiness}
              className="group relative bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-2xl"
            >
              <UserPlus className="w-5 h-5" />
              {t('buttons.joinBusiness')}
            </button>
            <button 
              onClick={handleCreateBusiness}
              disabled={!canCreateBusiness}
              className={`group relative font-semibold px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-2xl ${
                canCreateBusiness 
                  ? 'bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white hover:scale-110' 
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Plus className="w-5 h-5" />
              {canCreateBusiness ? t('buttons.createBusiness') : t('buttons.createBusinessLimit')}
            </button>
            {user?.plan === 'free' && (
              <button 
                onClick={handleViewPlans}
                className="group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-2xl"
              >
                <Star className="w-5 h-5" />
                {t('buttons.viewPlans')}
              </button>
            )}
            {isPaidPlan && (
              <button 
                onClick={() => router.push('/download-saas')}
                className="group relative bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-110 flex items-center gap-2 shadow-2xl"
              >
                <Download className="w-5 h-5" />
                {t('buttons.downloadApp')}
              </button>
            )}
          </div>
          
          {/* Business Limit Indicator */}
          {user && (
            <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl backdrop-blur-sm">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#3c959d]" />
                  <span className="text-slate-300">
                    {t('limits.label', { count: businessCount, limit: businessLimit }) || `Businesses: ${businessCount}/${businessLimit}`}
                    {businessLimit === 0 && ` ${t('limits.upgradeNote0')}`}
                    {businessLimit === 1 && ` ${t('limits.upgradeNote1')}`}
                    {businessLimit === 3 && ` ${t('limits.upgradeNote3')}`}
                  </span>
                </div>
                {!canCreateBusiness && user.plan !== 'free' && (
                  <button 
                    onClick={() => router.push('/businessPlans')}
                    className="text-[#3c959d] hover:text-[#4ba5ad] transition-colors text-xs font-medium"
                  >
                    {t('buttons.upgradePlan')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Available Businesses Section */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#ef7335] flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{t('available.title')}</h3>
          </div>
          
          {businessesLoading ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-600 border-t-[#3c959d] rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-[#ef7335] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              </div>
              <div className="mt-4 text-slate-300 text-lg font-medium">{t('available.loading')}</div>
              <div className="mt-2 text-slate-500 text-sm">Loading your businesses...</div>
            </div>
          ) : businessesError ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                <div className="w-8 h-8 text-red-400">⚠️</div>
              </div>
              <div className="text-red-400 text-lg font-medium mb-2">Error Loading Businesses</div>
              <div className="text-slate-500 text-sm text-center max-w-md">{t('available.error', { error: String(businessesError) })}</div>
            </div>
          ) : transformedBusinesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-slate-500/20 flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-slate-400" />
              </div>
              <div className="text-slate-300 text-lg font-medium mb-2">{t('available.empty')}</div>
              <div className="text-slate-500 text-sm text-center">Create your first business to get started</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transformedBusinesses.map((business, index) => {
                if (!business) return null;
                
                return (
            <div 
              key={business.id}
              className={`group relative overflow-hidden border border-slate-700/50 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-xl rounded-2xl ${
                selectedBusiness === business.id ? 'ring-2 ring-[#3c959d] bg-slate-800/70' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleBusinessSelect(business.id)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              
              <div className="relative z-10 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${business.color} flex items-center justify-center text-lg shadow-lg overflow-hidden`}>
                      {business.logo && business.logo.startsWith('http') ? (
                        <img 
                          src={business.logo} 
                          alt={business.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{business.logo}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg text-white group-hover:text-[#3c959d] transition-colors duration-300 font-semibold">
                        {business.name}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {business.industry}
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-lg text-xs font-medium">
                    {business.status}
                  </span>
                </div>
                
                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {business.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Users className="w-3 h-3" />
                  <span>{business.size}</span>
                  <span>•</span>
                  <Calendar className="w-3 h-3" />
                  <span>{business.lastActive}</span>
                      <span>•</span>
                      <span className="capitalize">{business.role}</span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {business.features.map((feature, idx) => (
                    <span key={idx} className="text-xs border border-slate-600/50 bg-slate-800/30 text-slate-300 px-2 py-1 rounded-lg">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
                  <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">{t('available.joinedLabel')}</span>
                        <span className="text-sm text-slate-300 font-medium">
                          {business.joinedAt ? new Date(business.joinedAt).toLocaleDateString() : t('cards.unknown')}
                        </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3c959d] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className={`flex flex-wrap justify-center items-center gap-8 mt-12 text-sm transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { icon: Shield, text: t('trust.secure'), color: "text-emerald-400" },
            { icon: Globe, text: t('trust.global'), color: "text-blue-400" },
            { icon: Users, text: t('trust.team'), color: "text-purple-400" },
            { icon: Zap, text: t('trust.fast'), color: "text-yellow-400" }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-slate-400">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <UpgradePlanDialog 
        open={showUpgradeDialog} 
        onOpenChange={setShowUpgradeDialog} 
      />
      <JoinBusinessDialog 
        open={showJoinDialog} 
        onOpenChange={setShowJoinDialog} 
      />
    </section>
  );
};

export default BusinessOption;