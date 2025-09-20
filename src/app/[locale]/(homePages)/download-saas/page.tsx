'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/hooks';
import { useAuth } from '../../../../store/authProvider';
import { useDownload } from '../../../../hooks/useDownload';
import Header from '../../../../components/layout/Header/Header';
import { LoadingSpinner } from '../../../../components/shared/LoadingSpinner/LoadingSpinner';
import Footer from '../../../../components/pages/HomePage/footer';
import { Button } from '../../../../components/ui/button';
import { Badge } from '../../../../components/ui/badge';
import { 
  Download, 
  Monitor, 
  Database, 
  Shield, 
  Zap, 
  Users, 
  BarChart3, 
  Settings, 
  CheckCircle, 
  Star,
  ArrowRight,
  Globe,
  Lock,
  Clock,
  FileText,
  ShoppingCart,
  CreditCard,
  Package,
  Truck,
  Building2,
  Sparkles,
  Play,
  Pause,
  Volume2,
  Heart,
  Award
} from 'lucide-react';

export default function DownloadSaaSPage() {
  const router = useRouter();
  const { authState, user, isPaidPlan } = useAuth();
  const { download, isDownloading, progress, error, fileInfo } = useDownload();
  const { tNested } = useI18n();
  const t = tNested('downloadSaaS');
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [particleCount, setParticleCount] = useState(0);

  const features = [
    {
      icon: Monitor,
      title: "Point of Sale System",
      description: "Complete POS solution with barcode scanning, receipt printing, and inventory management",
      color: "from-blue-500 to-cyan-500",
      gradient: "from-blue-500/20 via-cyan-500/20 to-transparent"
    },
    {
      icon: Database,
      title: "Inventory Management",
      description: "Real-time stock tracking, low stock alerts, and automated reorder points",
      color: "from-green-500 to-emerald-500",
      gradient: "from-green-500/20 via-emerald-500/20 to-transparent"
    },
    {
      icon: Users,
      title: "Customer Management",
      description: "Comprehensive CRM with customer profiles, purchase history, and loyalty programs",
      color: "from-purple-500 to-pink-500",
      gradient: "from-purple-500/20 via-pink-500/20 to-transparent"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Detailed sales reports, profit analysis, and business insights dashboard",
      color: "from-orange-500 to-red-500",
      gradient: "from-orange-500/20 via-red-500/20 to-transparent"
    },
    {
      icon: CreditCard,
      title: "Payment Processing",
      description: "Multiple payment methods, secure transactions, and financial reconciliation",
      color: "from-indigo-500 to-blue-500",
      gradient: "from-indigo-500/20 via-blue-500/20 to-transparent"
    },
    {
      icon: Package,
      title: "Order Management",
      description: "Complete order lifecycle from creation to fulfillment and delivery tracking",
      color: "from-teal-500 to-green-500",
      gradient: "from-teal-500/20 via-green-500/20 to-transparent"
    }
  ];

  useEffect(() => {
    // Check authentication and plan status
    if (authState === 'loading') return;
    
    if (authState === 'notAuthenticated') {
      router.push('/login');
      return;
    }
    
    if (authState === 'authenticated' && !isPaidPlan) {
      router.push('/');
      return;
    }
    
    setIsLoading(false);
  }, [authState, isPaidPlan, router]);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features]);

  // Particle animation counter
  useEffect(() => {
    const particleInterval = setInterval(() => {
      setParticleCount(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(particleInterval);
  }, []);

  // Show loading while checking auth
  if (isLoading || authState === 'loading') {
    return <LoadingSpinner appName={t('common.appName')} />;
  }

  // Don't render if not authenticated or not paid plan
  if (authState !== 'authenticated' || !isPaidPlan) {
    return null;
  }

  const handleDownload = async () => {
    try {
      await download({
        fileName: 'WX240PACKHFSQLCS.exe',
        onProgress: (progress) => {
          console.log(`Download progress: ${progress}%`);
        },
        onSuccess: (downloadUrl) => {
          console.log('Download started successfully:', downloadUrl);
        },
        onError: (error) => {
          console.error('Download failed:', error);
        },
      });
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const systemRequirements = [
    { requirement: "Operating System", value: "Windows 7/10/11, macOS 10.12+, Ubuntu 16.04+" },
    { requirement: "RAM", value: "Minimum 2GB, Recommended 4GB+" },
    { requirement: "Storage", value: "200MB free space for application" },
    { requirement: "Network", value: "Offline capable, optional cloud sync" },
    { requirement: "Display", value: "1024x768 minimum resolution" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
        
        {/* Interactive mouse glow */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-[#3c959d]/10 via-[#ef7335]/10 to-purple-500/10 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transform: `scale(${isHovered ? 1.5 : 1})`
          }}
        />
      </div>

      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Enhanced background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#3c959d]/8 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#ef7335]/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-cyan-500/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            {/* Enhanced badge with animation */}
            <div className="inline-flex items-center mb-6">
              <Badge className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] text-white font-semibold px-6 py-3 text-sm rounded-full shadow-2xl animate-pulse border border-white/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                {t('hero.badge')}
                <Award className="w-4 h-4 ml-2" />
              </Badge>
            </div>
            
            {/* Animated title with stagger effect */}
            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-white via-slate-100 to-white bg-clip-text text-transparent mb-4 animate-fade-in-up">
                {t('hero.title.line1')}
              </span>
              <span className="block bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] bg-clip-text text-transparent animate-gradient-x animate-fade-in-up delay-200">
                {t('hero.title.line2')}
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12 animate-fade-in-up delay-400">
              {t('hero.description')}
            </p>

            {/* Enhanced download button removed as requested */}

              {/* Download Progress Bar */}
              {isDownloading && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#3c959d] to-[#ef7335] h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-slate-400 text-sm mt-2 text-center">
                    {progress < 50 ? t('download.progress.preparing') : 
                     progress < 100 ? t('download.progress.starting') : 
                     t('download.progress.complete')}
                  </p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 text-red-400 mr-3">
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-red-400 font-medium">{t('download.error')}</h4>
                        <p className="text-red-300 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* File Info */}
              {fileInfo && (
                <div className="mt-6 max-w-md mx-auto">
                  <div className="bg-slate-800/50 border border-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{fileInfo.fileName}</h4>
                        <p className="text-slate-400 text-sm">
                          {(fileInfo.fileSize / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                      <div className="text-green-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          {/* Enhanced App Preview */}
          <div className="relative max-w-5xl mx-auto">
            {/* Floating elements around preview */}
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-2xl flex items-center justify-center animate-float shadow-2xl">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center animate-float-delayed shadow-2xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center animate-float shadow-2xl">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center animate-float-delayed shadow-2xl">
              <Zap className="w-8 h-8 text-white" />
            </div>

            {/* Main preview container with glassmorphism */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl hover:bg-white/8 transition-all duration-700 group">
              {/* Animated border glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#3c959d] via-transparent to-[#ef7335] p-px">
                <div className="w-full h-full bg-slate-900/90 backdrop-blur-xl rounded-3xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-8">
                  <div className="relative">
                    <img 
                      src="/HRSCommerciale.png" 
                      alt="HRS Commerciale Application" 
                      className="max-w-full h-auto rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-700 border border-white/20"
                    />
                    {/* Image overlay with play button effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent mb-3">
                    HRS Commerciale
                  </h3>
                  <p className="text-slate-300 mb-8 text-lg">Complete Business Management Solution</p>
                  
                  {/* Super enhanced download section */}
                  <div className="bg-gradient-to-br from-slate-800/30 via-slate-700/30 to-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                    <div className="text-center mb-6">
                      <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                        {t('download.title')}
                      </h4>
                      <p className="text-slate-300 mt-2">{t('download.subtitle')}</p>
                    </div>

                    <div className="flex justify-center mb-6">
                      <Button
                        onClick={handleDownload}
                        size="lg"
                        className="bg-gradient-to-r from-[#3c959d] via-[#4ba5ad] to-[#ef7335] hover:from-[#2d7a82] hover:via-[#3c959d] hover:to-[#e05a2b] text-white font-bold px-10 py-6 text-xl rounded-2xl shadow-2xl hover:shadow-[#3c959d]/50 transition-all duration-300"
                      >
                        <Download className="w-7 h-7 mr-4" />
                        <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                          {t('download.button')}
                        </span>
                        <ArrowRight className="w-6 h-6 ml-4" />
                      </Button>
                    </div>

                    <div className="flex justify-center gap-4 text-sm">
                      <div className="flex items-center bg-green-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/20">
                        <Shield className="w-5 h-5 mr-2 text-green-400" />
                        <span className="text-green-300 font-medium">{t('download.security')}</span>
                      </div>
                      <div className="flex items-center bg-blue-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/20">
                        <Clock className="w-5 h-5 mr-2 text-blue-400" />
                        <span className="text-blue-300 font-medium">{t('download.offline')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-700 hover:transform hover:scale-105 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                
                {/* Floating icon background */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full opacity-50"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Hover arrow */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 text-[#3c959d]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Detailed App Information */}
      <section className="py-20 relative">
        {/* Section background */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800/20 via-slate-700/20 to-slate-800/20 backdrop-blur-sm"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent mb-6">
                {t('appInfo.title')}
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                {t('appInfo.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-[#3c959d] to-[#ef7335] bg-clip-text text-transparent mb-8">
                  {t('appInfo.sectionTitle')}
                </h3>
                <div className="space-y-6">
                  {[
                    t('appInfo.features.pos'),
                    t('appInfo.features.inventory'),
                    t('appInfo.features.crm'),
                    t('appInfo.features.analytics'),
                    t('appInfo.features.multiLocation'),
                    t('appInfo.features.offline'),
                    t('appInfo.features.languages'),
                    t('appInfo.features.tax')
                  ].map((item: string, index: number) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-4 group hover:transform hover:translate-x-2 transition-all duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-slate-300 group-hover:text-white transition-colors duration-300 text-lg">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/8 transition-all duration-700">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#3c959d]/5 via-transparent to-[#ef7335]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-8 flex items-center">
                    <Settings className="w-6 h-6 mr-3 text-[#3c959d]" />
                    {t('systemRequirements.title')}
                  </h4>
                  <div className="space-y-4">
                    {[
                      { key: 'os', req: t('systemRequirements.requirements.os') },
                      { key: 'ram', req: t('systemRequirements.requirements.ram') },
                      { key: 'storage', req: t('systemRequirements.requirements.storage') },
                      { key: 'network', req: t('systemRequirements.requirements.network') },
                      { key: 'display', req: t('systemRequirements.requirements.display') }
                    ].map((item: any, index: number) => (
                      <div 
                        key={item.key} 
                        className="flex justify-between items-center py-4 px-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 group/item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <span className="text-slate-200 font-semibold group-hover/item:text-white transition-colors duration-300">
                          {item.req.name}:
                        </span>
                        <span className="text-slate-400 text-sm bg-slate-800/50 px-3 py-1 rounded-full group-hover/item:text-slate-300 transition-colors duration-300">
                          {item.req.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Security & Trust Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-6">
              <div className="w-3 h-3 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full animate-pulse mr-3"></div>
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 font-semibold px-4 py-2 text-sm rounded-full border border-green-500/30">
                {t('security.badge')}
              </Badge>
              <div className="w-3 h-3 bg-gradient-to-r from-[#3c959d] to-[#ef7335] rounded-full animate-pulse ml-3"></div>
            </div>
            
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent">
                {t('security.title').split(' ')[0]} & 
              </span>
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                {t('security.title').split(' ')[1]}
              </span>
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              {t('security.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform scale-150"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                {/* Orbiting elements */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-green-300 transition-colors duration-300">
                {t('security.features.encryption.title')}
              </h3>
              <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                {t('security.features.encryption.description')}
              </p>
              
              {/* Progress bar effect */}
              <div className="mt-4 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transform translate-x-0 group-hover:translate-x-0 transition-transform duration-1000 animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform scale-150"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                {/* Floating locks */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400/50 rounded-sm transform rotate-12 animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-400/50 rounded-sm transform -rotate-12 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors duration-300">
                {t('security.features.access.title')}
              </h3>
              <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                {t('security.features.access.description')}
              </p>
              
              {/* Security badges */}
              <div className="mt-4 flex justify-center space-x-2">
                <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 transform scale-150"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                {/* Clock hands animation */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-1 h-4 bg-white/80 rounded-full transform -translate-y-2 animate-spin" style={{ animationDuration: '2s' }}></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors duration-300">
                {t('security.features.support.title')}
              </h3>
              <p className="text-slate-300 group-hover:text-slate-200 transition-colors duration-300 leading-relaxed">
                {t('security.features.support.description')}
              </p>
              
              {/* Support status indicator */}
              <div className="mt-4 flex justify-center items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400 font-medium">{t('security.features.support.title')} Online</span>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 text-center">
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#3c959d]" />
                <span className="text-slate-400 font-medium">{t('security.certifications.iso')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-slate-400 font-medium">{t('security.certifications.gdpr')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-blue-500" />
                <span className="text-slate-400 font-medium">{t('security.certifications.soc')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-slate-400 font-medium">{t('security.certifications.uptime')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <Footer />
      
      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-5deg); }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes tilt {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(1deg); }
          75% { transform: rotate(-1deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 6s ease-in-out infinite;
          animation-delay: 2s;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
        
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        
        .delay-200 { animation-delay: 200ms; }
        .delay-400 { animation-delay: 400ms; }
      `}</style>
    </div>
  );
}