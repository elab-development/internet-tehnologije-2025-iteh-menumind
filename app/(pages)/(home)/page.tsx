import CTA from "./_components/CTA";
import Features from "./_components/Features";
import Footer from "./_components/Footer";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import Navbar from "./_components/Navbar";
import Pricing from "./_components/Pricing";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}
