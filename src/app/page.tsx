import Header from '@/components/layout/Header/Header';
import HeroSection from '@/components/pages/HomePage/HeroSection';
import BusinessSolutions from "@/components/pages/HomePage/BusinessSolutions"
import BusinessPlan from "@/components/pages/HomePage/businessPlan"
import AboutUs from "@/components/pages/HomePage/AboutUs"
import Footer from "@/components/pages/HomePage/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BusinessSolutions/>
        <BusinessPlan/>
        <AboutUs/>
        <Footer/>
      </main>
    </div>
  );
}