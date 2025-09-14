"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '../../../store/languageStore';
import { Plus, Building2, Users, Calendar, ArrowRight, Star, Globe, Shield } from 'lucide-react';

const BusinessOption = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<number | null>(null);

  const { currentTranslations } = useLanguageStore();

  // Fake business data
  const businesses = [
    {
      id: 1,
      name: "TechCorp Solutions",
      industry: "Technology",
      size: "50-100 employees",
      status: "Active",
      description: "Leading technology solutions provider",
      logo: "🏢",
      color: "from-blue-500 to-cyan-500",
      features: ["Cloud Services", "AI Solutions", "Data Analytics"],
      lastActive: "2 hours ago"
    },
    {
      id: 2,
      name: "Green Energy Co",
      industry: "Renewable Energy",
      size: "20-50 employees",
      status: "Active",
      description: "Sustainable energy solutions for the future",
      logo: "🌱",
      color: "from-green-500 to-emerald-500",
      features: ["Solar Power", "Wind Energy", "Sustainability"],
      lastActive: "1 day ago"
    },
    {
      id: 3,
      name: "Creative Agency",
      industry: "Marketing",
      size: "10-20 employees",
      status: "Active",
      description: "Full-service creative marketing agency",
      logo: "🎨",
      color: "from-purple-500 to-pink-500",
      features: ["Brand Design", "Digital Marketing", "Content Creation"],
      lastActive: "3 hours ago"
    },
    {
      id: 4,
      name: "HealthCare Plus",
      industry: "Healthcare",
      size: "100+ employees",
      status: "Active",
      description: "Comprehensive healthcare management system",
      logo: "🏥",
      color: "from-red-500 to-orange-500",
      features: ["Patient Care", "Medical Records", "Telemedicine"],
      lastActive: "30 minutes ago"
    }
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
    router.push('/business/create');
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#3c959d]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#ef7335]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#3c959d]/5 to-[#ef7335]/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEwOF8xNzgpIj4KPHBhdGggZD0iTTQwIDEuNUgwVjBINDBWMS41WiIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTA4XzE3OCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K')] opacity-30"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#4ba5ad]/40 rounded-full animate-pulse"
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
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#3c959d]/15 to-[#ef7335]/15 backdrop-blur-sm border border-[#3c959d]/30 rounded-full px-6 py-3 text-sm mb-8">
            <Building2 className="w-4 h-4 text-[#3c959d]" />
            <span className="text-slate-200 font-medium">Select Your Business</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-4">
              Choose Your
            </span>
            <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent relative">
              Business Workspace
              <div className="absolute -inset-2 bg-gradient-to-r from-[#3c959d]/20 to-[#ef7335]/20 blur-xl -z-10 animate-pulse"></div>
            </span>
          </h2>
          
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Access your business dashboard or create a new business to get started with our comprehensive management platform.
          </p>
        </div>

        {/* Business Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {businesses.map((business, index) => (
            <div 
              key={business.id}
              className={`group relative overflow-hidden border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-[#3c959d]/20 rounded-2xl ${
                selectedBusiness === business.id ? 'ring-2 ring-[#3c959d] bg-slate-800/80' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleBusinessSelect(business.id)}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
              
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${business.color} flex items-center justify-center text-2xl shadow-lg`}>
                      {business.logo}
                    </div>
                    <div>
                      <h3 className="text-xl text-white group-hover:text-[#3c959d] transition-colors duration-300 font-semibold">
                        {business.name}
                      </h3>
                      <p className="text-slate-400 mt-1 text-sm">
                        {business.industry}
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-1 rounded-full text-xs font-medium">
                    {business.status}
                  </span>
                </div>
              </div>
              
              <div className="px-6 pb-6 space-y-4">
                <p className="text-slate-300 text-sm leading-relaxed">
                  {business.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="w-3 h-3" />
                  <span>{business.size}</span>
                  <span>•</span>
                  <Calendar className="w-3 h-3" />
                  <span>{business.lastActive}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {business.features.map((feature, idx) => (
                    <span key={idx} className="text-xs border border-slate-600 text-slate-400 px-2 py-1 rounded-md">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-slate-400">4.8</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#3c959d] group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create New Business Section */}
        <div className={`text-center transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="max-w-2xl mx-auto">
            <div className="border-2 border-dashed border-slate-600/50 rounded-3xl p-12 bg-slate-800/30 backdrop-blur-sm hover:border-[#3c959d]/50 hover:bg-slate-800/50 transition-all duration-300 group cursor-pointer"
                 onClick={handleCreateBusiness}>
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#3c959d] to-[#ef7335] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#3c959d] transition-colors duration-300">
                    Create New Business
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Start a new business workspace and begin managing your operations with our comprehensive platform.
                  </p>
                </div>
                
                <button 
                  className="bg-gradient-to-r from-[#3c959d] to-[#ef7335] hover:from-[#2d7a82] hover:to-[#e05a2b] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 group-hover:scale-105 flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Create Business
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className={`flex flex-wrap justify-center items-center gap-8 mt-16 text-sm text-slate-400 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Secure & Encrypted</span>
          </div>
          <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Global Access</span>
          </div>
          <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Team Collaboration</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessOption;
