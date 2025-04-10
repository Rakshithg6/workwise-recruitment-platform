import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add more delay before starting the animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000); // Increased initial delay to 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen flex flex-col justify-center items-center text-center px-4 bg-black overflow-hidden">
      {/* Content with animation */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <h1 
          className={`font-sans text-8xl md:text-9xl lg:text-[10rem] font-bold text-white tracking-tight mb-6 transition-all duration-1000 ease-out select-none flex items-center justify-center
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ letterSpacing: '0.02em', fontWeight: 700 }}
        >
          {'WorkWise'.split('').map((letter, index) => (
            <span
              key={index}
              className="inline-block"
              style={{
                animation: `letterAnimation 0.8s ease-out forwards ${2 + index * 0.3}s, titleGlow 4s ease-in-out infinite ${3.5 + index * 0.3}s`,
                opacity: 0,
                transform: 'translateY(20px)',
                display: 'inline-block'
              }}
            >
              {letter}
            </span>
          ))}
        </h1>
        
        <p 
          className={`text-xl md:text-2xl lg:text-3xl text-white/70 mb-10 max-w-2xl mx-auto transition-all duration-1000 delay-300 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Designed for Smart Recruiting
        </p>
        
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <Link 
            to="/auth/employer" 
            className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium border border-white/20 hover:bg-white/20 transition-all duration-300 relative overflow-hidden"
            style={{
              animation: 'glowing 4s ease-in-out infinite',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
            }}
          >
            Start Hiring
          </Link>
          
          <Link 
            to="/auth/candidate" 
            className="px-8 py-3 bg-transparent border border-white/20 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/10 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
            style={{
              animation: 'glowing 4s ease-in-out infinite 2s',
              textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
            }}
          >
            Apply Here <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
