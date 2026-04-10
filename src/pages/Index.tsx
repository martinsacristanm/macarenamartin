import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BookTeaser from "@/components/BookTeaser";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { useAdmin } from "@/components/AdminProvider";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const { isAdmin, adminPassword } = useAdmin();

  return (
    <div className="min-h-screen relative">
      {/* Global background image */}
      <div className="fixed inset-0 -z-10">
        <img src={heroBg} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/30" />
      </div>
      <Navbar />
      <HeroSection />
      <BookTeaser />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
