"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '../../../store/languageStore';
import { useAuth } from '../../../store/authProvider';
import { Plus, Building2, Users, Calendar, ArrowRight, Star, Globe, Shield, TrendingUp, Zap, UserPlus, Search } from 'lucide-react';
import UpgradePlanDialog from '../../ui/UpgradePlanDialog';
import JoinBusinessDialog from '../../ui/JoinBusinessDialog';
import { PAYMENT_PLANS } from '../../../app/api/stripe-config/PaymentPlanceConfig';

const BusinessOption = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const { currentTranslations } = useLanguageStore();
  const { user } = useAuth();

  // Fake business data
  const businesses = [
    {
      id: 1,
      name: "TechCorp Solutions",
      industry: "Technology",
      size: "50-100 employees",
      status: "Active",
      description: "Leading technology solutions provider specializing in cutting-edge software development",
      logo: "🏢",
      color: "from-blue-500 via-blue-600 to-cyan-500",
      borderColor: "border-blue-500/30",
      glowColor: "shadow-blue-500/20",
      features: ["Cloud Services", "AI Solutions", "Data Analytics"],
      lastActive: "2 hours ago",
      growth: "+12%",
      revenue: "$2.4M"
    },
    {
      id: 2,
      name: "Green Energy Co",
      industry: "Renewable Energy",
      size: "20-50 employees",
      status: "Active",
      description: "Sustainable energy solutions for the future with innovative green technologies",
      logo: "🌱",
      color: "from-green-500 via-emerald-600 to-teal-500",
      borderColor: "border-green-500/30",
      glowColor: "shadow-green-500/20",
      features: ["Solar Power", "Wind Energy", "Sustainability"],
      lastActive: "1 day ago",
      growth: "+8%",
      revenue: "$1.2M"
    },
    {
      id: 3,
      name: "Creative Agency",
      industry: "Marketing",
      size: "10-20 employees",
      status: "Active",
      description: "Full-service creative marketing agency delivering exceptional brand experiences",
      logo: "🎨",
      color: "from-purple-500 via-pink-600 to-rose-500",
      borderColor: "border-purple-500/30",
      glowColor: "shadow-purple-500/20",
      features: ["Brand Design", "Digital Marketing", "Content Creation"],
      lastActive: "3 hours ago",
      growth: "+15%",
      revenue: "$890K"
    },
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleBusinessSelect = (businessId: number) => {
    setSelectedBusiness(businessId);
    // Navigate to business dashboard
    router.push(`/dashboard/business/${businessId}`);
  };

  const handleCreateBusiness = () => {
    // Check if user has free plan
    if (user?.plan === 'free') {
      setShowUpgradeDialog(true);
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
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#3c959d]/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#ef7335]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 rounded-full blur-3xl"></div>
        
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
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 text-sm mb-6 shadow-xl">
            <Building2 className="w-4 h-4 text-[#3c959d]" />
            <span className="text-white font-medium">Business Workspace</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-2">
              Choose Your
            </span>
            <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent">
              Business Hub
            </span>
          </h2>
          
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            Access your business dashboard, join an existing business, or create a new one to get started.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={handleJoinBusiness}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="w-5 h-5" />
              Join Business
            </button>
            <button 
              onClick={handleCreateBusiness}
              className="group bg-gradient-to-r from-[#3c959d] to-[#ef7335] hover:from-[#2d7a82] hover:to-[#e05a2b] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create Business
            </button>
            <button 
              onClick={handleViewPlans}
              className="group bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Star className="w-5 h-5" />
              View Plans
            </button>
          </div>
        </div>

        {/* Available Businesses Section */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#3c959d] to-[#ef7335] flex items-center justify-center">
              <Search className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">Available Businesses</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business, index) => (
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
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${business.color} flex items-center justify-center text-lg shadow-lg`}>
                      {business.logo}
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
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-slate-300 font-medium">4.8</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3c959d] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`flex flex-wrap justify-center items-center gap-8 mt-12 text-sm transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {[
            { icon: Shield, text: "Secure & Encrypted", color: "text-emerald-400" },
            { icon: Globe, text: "Global Access", color: "text-blue-400" },
            { icon: Users, text: "Team Collaboration", color: "text-purple-400" },
            { icon: Zap, text: "Lightning Fast", color: "text-yellow-400" }
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