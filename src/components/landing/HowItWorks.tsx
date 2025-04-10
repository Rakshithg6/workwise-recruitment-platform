import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { UserCircle, Search, CheckCircle2, BarChart } from 'lucide-react';

// Import step images
import step1 from '/images/how-it-works/step1.jpg';
import step2 from '/images/how-it-works/step2.jpg';
import step3 from '/images/how-it-works/step3.jpg';
import step4 from '/images/how-it-works/step4.jpg';

interface Step {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  image: string;
}

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleStepClick = (index: number) => {
    setDirection(index > activeStep ? 'next' : 'prev');
    setActiveStep(index);
  };

  const steps: Step[] = [
    {
      icon: <UserCircle size={28} />,
      title: "Create Your Profile",
      description: "Sign up and create your professional profile with your skills, experience, and preferences.",
      color: "from-blue-500 to-blue-600",
      image: step1
    },
    {
      icon: <Search size={28} />,
      title: "Discover Opportunities",
      description: "Browse through thousands of verified job listings or let our AI recommend matching opportunities.",
      color: "from-purple-500 to-purple-600",
      image: step2
    },
    {
      icon: <CheckCircle2 size={28} />,
      title: "Apply with Ease",
      description: "Apply to jobs with a single click, track your applications, and get notified of updates.",
      color: "from-green-500 to-green-600",
      image: step3
    },
    {
      icon: <BarChart size={28} />,
      title: "Stand Out with Insights",
      description: "Access insider salary data and company reviews to make informed decisions about your career.",
      color: "from-orange-500 to-orange-600",
      image: step4
    }
  ];

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

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setDirection('next');
        setActiveStep((prev) => (prev === steps.length - 1 ? 0 : prev + 1));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, steps.length]);

  return (
    <section 
      ref={containerRef}
      className="min-h-[90vh] py-8 md:py-12 bg-black relative overflow-hidden flex items-center"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse-light"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-xl mx-auto mb-6 md:mb-8">
          <div className="inline-block mb-2 md:mb-3">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Simple Process
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-white animate-fade-in">
            How WorkWise Works
          </h2>
          <p className="text-white/80 animate-fade-in text-sm md:text-base px-4" style={{ animationDelay: '0.2s' }}>
            Finding your ideal job in India has never been easier with our streamlined process
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Steps List */}
          <div 
            className={cn(
              "order-2 lg:order-1 transition-all duration-500",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            )}
          >
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className={cn(
                    "group cursor-pointer transition-all duration-500",
                    activeStep === index ? "scale-105" : "opacity-70 hover:opacity-100"
                  )}
                  onClick={() => handleStepClick(index)}
                >
                  <div className={cn(
                    "rounded-xl p-6 transition-all duration-300",
                    activeStep === index ? "bg-gray-900/50 border border-gray-800" : "hover:bg-gray-900/30"
                  )}>
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br transition-all duration-300",
                        step.color,
                        activeStep === index ? "scale-110 shadow-lg" : "scale-100"
                      )}>
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-white">{step.title}</h3>
                        <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Display */}
          <div 
            className={cn(
              "order-1 lg:order-2 transition-all duration-500",
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
            )}
          >
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-2xl bg-gray-900/50">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "absolute inset-0 transition-all duration-500",
                    activeStep === index 
                      ? "opacity-100 translate-y-0 rotate-0 scale-100" 
                      : direction === 'next'
                        ? index < activeStep || (activeStep === 0 && index === steps.length - 1)
                          ? "opacity-0 -translate-y-full rotate-12 scale-95"
                          : "opacity-0 translate-y-full -rotate-12 scale-95"
                        : index > activeStep || (activeStep === steps.length - 1 && index === 0)
                          ? "opacity-0 translate-y-full -rotate-12 scale-95"
                          : "opacity-0 -translate-y-full rotate-12 scale-95"
                  )}
                >
                  <img 
                    src={step.image} 
                    alt={step.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className={cn(
                        "w-full h-1 mb-4 rounded-full bg-gradient-to-r transition-all duration-300",
                        step.color
                      )}></div>
                      <h4 className="text-xl font-semibold text-white mb-2">{step.title}</h4>
                      <p className="text-white/80 text-sm">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
