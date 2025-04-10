
import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowUpRight, BriefcaseIcon, Users, BuildingIcon, TrendingUp, Shield, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl p-6 border border-gray-800 bg-gray-900/50 transition-all duration-700 transform",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

const Features = () => {
  const features: FeatureProps[] = [
    {
      icon: <BriefcaseIcon size={24} />,
      title: "Curated Job Listings",
      description: "Access thousands of verified job opportunities from top companies across India, updated daily."
    },
    {
      icon: <Users size={24} />,
      title: "AI-Powered Matching",
      description: "Our intelligent algorithms match your skills and preferences with the perfect job opportunities."
    },
    {
      icon: <BuildingIcon size={24} />,
      title: "Verified Companies",
      description: "All companies on our platform are verified to ensure legitimacy and quality job opportunities."
    },
    {
      icon: <TrendingUp size={24} />,
      title: "Salary Insights",
      description: "Get accurate salary information for different roles across industries and cities in India."
    },
    {
      icon: <Shield size={24} />,
      title: "Data Privacy",
      description: "Your personal information is secure. Control who can view your profile and contact you."
    },
    {
      icon: <CreditCard size={24} />,
      title: "100% Free for Job Seekers",
      description: "Finding your dream job shouldn't cost you. Our platform is always free for candidates."
    }
  ];

  return (
    <section className="py-20 md:py-32 bg-black relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/10 to-transparent -z-10" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/10 to-transparent -z-10" />
      
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Why Choose WorkWise
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            The Smarter Way to Find Your Next Job
          </h2>
          <p className="text-white/80">
            Our platform is designed to make your job search efficient, transparent, and tailored to your needs across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            to="/auth/candidate" 
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <span>Explore available jobs</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Features;
