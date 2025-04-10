import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button";
import { Skeleton } from '@/components/ui/skeleton';

// Updated companies data with proper logo sources in the public directory
const companies = [
  { 
    name: 'TCS', 
    industry: 'IT Services', 
    logo: '/companies/tcs logo.png',
    fallbackColor: 'bg-blue-500/20' 
  },
  { 
    name: 'Infosys', 
    industry: 'IT Services', 
    logo: '/companies/infosys logo.png',
    fallbackColor: 'bg-blue-600/20'
  },
  { 
    name: 'Wipro', 
    industry: 'IT Services', 
    logo: '/companies/wipro logo.png',
    fallbackColor: 'bg-green-500/20' 
  },
  { 
    name: 'HCL', 
    industry: 'IT Services', 
    logo: '/companies/hcl.png',
    fallbackColor: 'bg-blue-500/20' 
  },
  { 
    name: 'Capgemini', 
    industry: 'IT Services', 
    logo: '/companies/capgemini logo.png',
    fallbackColor: 'bg-blue-500/20' 
  },
  { 
    name: 'Accenture', 
    industry: 'IT Services', 
    logo: '/companies/Accenture-Logo.png',
    fallbackColor: 'bg-purple-500/20' 
  },
  { 
    name: 'IBM', 
    industry: 'IT Services', 
    logo: '/companies/IBM logo.png',
    fallbackColor: 'bg-blue-500/20'
  },
  { 
    name: 'Google', 
    industry: 'Technology', 
    logo: '/companies/google logo.png',
    fallbackColor: 'bg-blue-500/20'
  },
  { 
    name: 'Amazon', 
    industry: 'Technology', 
    logo: '/companies/amazon logo.png',
    fallbackColor: 'bg-orange-500/20'
  },
  { 
    name: 'Zomato', 
    industry: 'Food Delivery', 
    logo: '/companies/Zomato_logo.png',
    fallbackColor: 'bg-red-500/20'
  },
  { 
    name: 'Swiggy', 
    industry: 'Food Delivery', 
    logo: '/companies/Swiggy-logo.png',
    fallbackColor: 'bg-orange-500/20'
  },
  { 
    name: 'Paytm', 
    industry: 'Fintech', 
    logo: '/companies/paytm logo.png',
    fallbackColor: 'bg-blue-500/20'
  },
  { 
    name: 'HDFC Bank', 
    industry: 'Banking', 
    logo: '/companies/hdfc bank logo.png',
    fallbackColor: 'bg-blue-600/20'
  },
  { 
    name: 'ICICI Bank', 
    industry: 'Banking', 
    logo: '/companies/icici bank logo.png',
    fallbackColor: 'bg-orange-500/20'
  },
  { 
    name: 'Myntra', 
    industry: 'E-commerce', 
    logo: '/companies/myntra logo.png',
    fallbackColor: 'bg-pink-500/20'
  },
  { 
    name: "BYJU'S", 
    industry: 'EdTech', 
    logo: "/companies/byju's logo.png",
    fallbackColor: 'bg-purple-500/20'
  },
  { 
    name: 'Ola', 
    industry: 'Transportation', 
    logo: '/companies/ola logo.png',
    fallbackColor: 'bg-green-500/20'
  },
  { 
    name: 'Make My Trip', 
    industry: 'Travel', 
    logo: '/companies/make my trip.png',
    fallbackColor: 'bg-blue-500/20'
  }
];

const CompanyShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  // Track which logos failed to load
  const [failedLogos, setFailedLogos] = useState<{[key: string]: boolean}>({});
  const [imagesLoading, setImagesLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState(0);
  const totalImages = companies.length;

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Set a shorter timeout to hide loading state
    const timeout = setTimeout(() => {
      setImagesLoading(false);
    }, 1000);

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
      clearTimeout(timeout);
    };
  }, []);

  // Track when all images are loaded
  useEffect(() => {
    if (loadedImages >= totalImages) {
      setImagesLoading(false);
    }
  }, [loadedImages, totalImages]);

  // Handle logo loading error by replacing with a colored background with first letter
  const handleImageError = (company: string) => {
    // Mark this logo as failed
    setFailedLogos(prev => ({...prev, [company]: true}));
    // Increment loaded images count to ensure we don't wait forever
    setLoadedImages(prev => prev + 1);
  };

  const handleImageLoad = () => {
    // Increment loaded images count
    setLoadedImages(prev => prev + 1);
  };

  // Force all images to show after a delay even if they're still loading
  useEffect(() => {
    const forceShowTimeout = setTimeout(() => {
      setImagesLoading(false);
    }, 2000);
    
    return () => clearTimeout(forceShowTimeout);
  }, []);

  return (
    <section ref={containerRef} className="py-20 md:py-28 bg-black">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block mb-4">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Top Employers
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Leading Companies Trust Us
          </h2>
          <p className="text-white/80">
            Join thousands of companies across India who use WorkWise to find exceptional talent
          </p>
        </div>

        {!showAllCompanies ? (
          <div 
            className={cn(
              "relative overflow-hidden py-6 transition-all duration-1000",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {/* Gradient fade effect on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10"></div>

            {/* Company logos with infinite scroll animation */}
            <div className="flex space-x-8 animate-[scroll_60s_linear_infinite]">
              {companies.concat(companies).map((company, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center justify-center min-w-[160px] h-28 px-4 py-3 rounded-lg bg-gray-900/80 shadow-sm border border-gray-800 transform transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden"
                >
                  <div className="h-12 w-full flex items-center justify-center mb-2 relative">
                    {imagesLoading && (
                      <Skeleton className="h-10 w-24" />
                    )}
                    {!failedLogos[company.name] ? (
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`}
                        className={`max-h-10 max-w-full object-contain ${imagesLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                        onError={() => handleImageError(company.name)}
                        onLoad={handleImageLoad}
                      />
                    ) : (
                      <div className={`company-logo-fallback flex items-center justify-center w-full h-full ${company.fallbackColor} text-primary text-xl font-bold rounded`}>
                        {company.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm font-bold text-white truncate w-full text-center">{company.name}</div>
                  <div className="text-xs text-white/60 truncate w-full text-center">{company.industry}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={cn(
            "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 transition-all duration-500",
            isVisible ? "opacity-100" : "opacity-0"
          )}>
            {companies.map((company, index) => (
              <div 
                key={index}
                className="flex flex-col items-center justify-center h-28 px-4 py-3 rounded-lg bg-gray-900/80 shadow-sm border border-gray-800 transform transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden"
              >
                <div className="h-12 w-full flex items-center justify-center mb-2 relative">
                  {imagesLoading && (
                    <Skeleton className="h-10 w-24" />
                  )}
                  {!failedLogos[company.name] ? (
                    <img 
                      src={company.logo} 
                      alt={`${company.name} logo`}
                      className={`max-h-10 max-w-full object-contain ${imagesLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                      onError={() => handleImageError(company.name)}
                      onLoad={handleImageLoad}
                    />
                  ) : (
                    <div className={`company-logo-fallback flex items-center justify-center w-full h-full ${company.fallbackColor} text-primary text-xl font-bold rounded`}>
                      {company.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="text-sm font-bold text-white truncate w-full text-center">{company.name}</div>
                <div className="text-xs text-white/60 truncate w-full text-center">{company.industry}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Button 
            onClick={() => setShowAllCompanies(!showAllCompanies)}
            variant="outline"
            className="px-6 py-2 bg-transparent border border-white/20 text-white hover:bg-white/10"
          >
            {showAllCompanies ? "Show Scrolling View" : "View All Companies"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompanyShowcase;
