import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Chatbot from '../Chatbot';
import { useUser } from '@/contexts/UserContext';

interface ChatbotButtonProps {
  userType?: 'candidate' | 'employer';
  autoGreet?: boolean;
}

const ChatbotButton = ({ userType, autoGreet = false }: ChatbotButtonProps) => {
  const { userData } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);

  // Use localStorage to persist dismissal state
  const [hasBeenDismissed, setHasBeenDismissed] = useState(() => {
    const dismissed = localStorage.getItem('workwise-chatbot-dismissed');
    return dismissed === 'true';
  });

  // Auto-greet functionality - open immediately after login/signup if not manually dismissed
  useEffect(() => {
    const hasGreeted = sessionStorage.getItem('workwise-chatbot-greeted');
    
    if (autoGreet && !hasBeenDismissed && !hasGreeted) {
      setIsOpen(true);
      // Mark that we've greeted in this session
      sessionStorage.setItem('workwise-chatbot-greeted', 'true');
    }
  }, [autoGreet, hasBeenDismissed]);

  // Save dismissal state to localStorage
  useEffect(() => {
    localStorage.setItem('workwise-chatbot-dismissed', hasBeenDismissed.toString());
  }, [hasBeenDismissed]);

  // Handle clicks outside the chatbot
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        chatbotRef.current && 
        buttonRef.current &&
        !chatbotRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setHasBeenDismissed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const toggleChatbot = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // If user manually closes the chatbot, mark it as dismissed
    if (!newIsOpen) {
      setHasBeenDismissed(true);
    } else {
      // If user manually opens the chatbot, clear the dismissal state
      setHasBeenDismissed(false);
    }
  };

  // Determine user role from props or context
  const effectiveUserType = userType || 
    (userData.jobTitle ? 'candidate' : userData.companyName ? 'employer' : undefined);

  return (
    <>
      {/* Chatbot toggle button */}
      <button
        ref={buttonRef}
        onClick={toggleChatbot}
        className={cn(
          "chatbot-toggle fixed right-6 bottom-6 z-40 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 shadow-xl shadow-blue-500/30 text-white rounded-full transition-all duration-500 transform hover:scale-105 focus:outline-none border-2 border-white/40",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
        )}
        aria-label="Open chatbot assistant"
      >
        {isOpen ? 
          <X size={28} className="text-white" /> : 
          <MessageCircle size={28} className="text-white" />
        }
      </button>

      {/* Chatbot panel */}
      <div
        ref={chatbotRef}
        className={cn(
          "fixed right-6 bottom-24 z-40 w-[95vw] sm:w-[450px] h-[600px] max-h-[calc(100vh-120px)] bg-gradient-to-b from-gray-800 to-black text-white rounded-xl shadow-2xl transition-all duration-500 transform border-2 border-blue-400/40 overflow-hidden backdrop-blur-sm",
          isOpen ? "translate-y-0 opacity-100 visible" : "translate-y-8 opacity-0 invisible"
        )}
      >
        <Chatbot onClose={toggleChatbot} userType={effectiveUserType} />
      </div>
    </>
  );
};

export default ChatbotButton;
