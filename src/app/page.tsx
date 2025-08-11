import Header from '@/components/layout/Header/Header';
import HeroSection from '@/components/pages/HomePage/HeroSection';
import BusinessSolutions from "@/components/pages/HomePage/BusinessSolutions"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#03071a] via-[#0f1a2e] to-[#1a2a4a]">
      <Header />
      <main>
        <HeroSection />
        <BusinessSolutions/>
      </main>
    </div>
  );
}