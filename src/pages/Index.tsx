import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BookTeaser from "@/components/BookTeaser";
import WritingsSection from "@/components/WritingsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BookTeaser />
      <WritingsSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;
