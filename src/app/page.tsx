import Header from '@/components/layout/Header/Header';
import HeroSection from '@/components/pages/HomePage/HeroSection';
import BusinessSolutions from "@/components/pages/HomePage/BusinessSolutions"
import Container from "@/components/pages/HomePage/container"
import Footer from "@/components/pages/HomePage/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <BusinessSolutions/>
        <Container/>
        <Footer/>
      </main>
    </div>
  );
}