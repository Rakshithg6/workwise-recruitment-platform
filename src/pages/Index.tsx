import { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import CompanyShowcase from '@/components/landing/CompanyShowcase';
import Footer from '@/components/layout/Footer';

const Index = () => {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
    
    // Set page title
    document.title = "WorkWise - Smart Recruitment Platform";
    
    // Add dark background style to body
    document.body.classList.add('bg-black');
    document.documentElement.classList.add('dark');
    
    return () => {
      // Remove dark background when component unmounts
      document.body.classList.remove('bg-black');
      document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <CompanyShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
