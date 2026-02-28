import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BookTeaser from "@/components/BookTeaser";
import WritingsSection from "@/components/WritingsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { useAdmin } from "@/components/AdminProvider";

const Index = () => {
  const { isAdmin, adminPassword } = useAdmin();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BookTeaser />
      {/* WritingsSection eliminada temporalmente */}
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
