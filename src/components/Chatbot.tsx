import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@/contexts/UserContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateResponse } from '@/lib/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  onClose: () => void;
  userType?: 'candidate' | 'employer';
}

const Chatbot = ({ onClose, userType }: ChatbotProps) => {
  const { userData } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  const getInitialMessage = () => {
    const userName = userData.firstName ? `, ${userData.firstName}` : '';

    if (userType === 'candidate') {
      return `Hi there${userName}! I'm Eva - Your Assistant. I can help you find jobs, prepare for interviews, and optimize your profile. How can I assist with your job search today?`;
    } else if (userType === 'employer') {
      return `Hello${userName}! I'm Eva - Your Assistant. I can help you post jobs, find candidates, and streamline your hiring process. How can I assist with your recruitment needs today?`;
    } else {
      return `Hi there${userName}! I'm Eva - Your Assistant. How can I help you today?`;
    }
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getInitialMessage(),
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Process the user message
    processUserMessage(input.trim());
  };

  // Get job listings from local storage or use sample data
  const getJobListings = () => {
    const sampleListings = [
      {
        id: 'job1',
        title: 'Senior Software Engineer',
        company: 'WorkWise',
        location: 'Bangalore',
        type: 'Full-time',
        description: 'Seeking a senior software engineer...',
        requirements: ['5+ years experience', 'React', 'Node.js'],
        status: 'active',
        postedDate: '2025-04-05',
        applications: 12
      },
      {
        id: 'job2',
        title: 'Product Manager',
        company: 'WorkWise',
        location: 'Mumbai',
        type: 'Full-time',
        description: 'Seeking a product manager to lead our team...',
        requirements: ['3+ years experience', 'Agile', 'Product Development'],
        status: 'active',
        applications: 8
      },
      {
        id: 'job3',
        title: 'UI/UX Designer',
        company: 'WorkWise',
        location: 'Bangalore',
        type: 'Full-time',
        description: 'Seeking a UI/UX designer to join our team...',
        requirements: ['3+ years experience', 'Figma', 'User Research'],
        status: 'active',
        applications: 5
      }
    ];

    try {
      const savedListings = localStorage.getItem('workwise-job-listings');
      return savedListings ? JSON.parse(savedListings) : sampleListings;
    } catch (error) {
      console.error('Error getting job listings:', error);
      return sampleListings;
    }
  };

  // Get candidates from local storage or use sample data
  const getCandidates = () => {
    const sampleCandidatesList = [
      {
        id: 'cand1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        experience: 5,
        skills: ['React', 'Node.js', 'TypeScript'],
        status: 'interviewing',
        appliedFor: 'job1'
      },
      {
        id: 'cand2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        experience: 3,
        skills: ['Product Management', 'Agile', 'JIRA'],
        status: 'interviewing',
        appliedFor: 'job2'
      },
      {
        id: 'cand3',
        name: 'Priya Kumar',
        email: 'priya@example.com',
        phone: '+91 9876543212',
        experience: 4,
        skills: ['UI/UX', 'Figma', 'User Research'],
        status: 'shortlisted',
        appliedFor: 'job3'
      }
    ];

    try {
      const savedCandidates = localStorage.getItem('workwise-candidates');
      return savedCandidates ? JSON.parse(savedCandidates) : sampleCandidatesList;
    } catch (error) {
      console.error('Error getting candidates:', error);
      return sampleCandidatesList;
    }
  };

  // Get upcoming interviews or use sample data
  const getUpcomingInterviews = () => {
    const sampleInterviewsList = [
      {
        id: 'int1',
        candidateId: 'cand1',
        jobId: 'job1',
        date: '2025-04-10',
        time: '14:00',
        type: 'video',
        status: 'scheduled',
        meetingLink: 'https://meet.workwise.com/int1'
      },
      {
        id: 'int2',
        candidateId: 'cand2',
        jobId: 'job2',
        date: '2025-04-10',
        time: '16:30',
        type: 'phone',
        status: 'scheduled'
      },
      {
        id: 'int3',
        candidateId: 'cand3',
        jobId: 'job3',
        date: '2025-04-11',
        time: '11:00',
        type: 'onsite',
        status: 'scheduled'
      }
    ];

    try {
      const savedInterviews = localStorage.getItem('workwise-interviews');
      if (savedInterviews) {
        const parsedInterviews = JSON.parse(savedInterviews);
        // If no interviews in localStorage, use sample data
        return parsedInterviews.length > 0 ? parsedInterviews : sampleInterviewsList;
      }
      return sampleInterviewsList;
    } catch (error) {
      console.error('Error getting interviews:', error);
      return sampleInterviewsList;
    }
  };

  // Initialize localStorage with sample data
  const initializeLocalStorage = () => {
    const sampleJobListings = [
      {
        id: 'job1',
        title: 'Senior Software Engineer',
        company: 'WorkWise',
        location: 'Bangalore',
        type: 'Full-time',
        description: 'Seeking a senior software engineer...',
        requirements: ['5+ years experience', 'React', 'Node.js'],
        status: 'active',
        postedDate: '2025-04-05',
        applications: 12
      },
      {
        id: 'job2',
        title: 'Product Manager',
        company: 'WorkWise',
        location: 'Mumbai',
        type: 'Full-time',
        description: 'Seeking a product manager to lead our team...',
        requirements: ['3+ years experience', 'Agile', 'Product Development'],
        status: 'active',
        applications: 8
      },
      {
        id: 'job3',
        title: 'UI/UX Designer',
        company: 'WorkWise',
        location: 'Bangalore',
        type: 'Full-time',
        description: 'Seeking a UI/UX designer to join our team...',
        requirements: ['3+ years experience', 'Figma', 'User Research'],
        status: 'active',
        applications: 5
      }
    ];

    const sampleCandidates = [
      {
        id: 'cand1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        experience: 5,
        skills: ['React', 'Node.js', 'TypeScript'],
        status: 'interviewing',
        appliedFor: 'job1'
      },
      {
        id: 'cand2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        experience: 3,
        skills: ['Product Management', 'Agile', 'JIRA'],
        status: 'interviewing',
        appliedFor: 'job2'
      },
      {
        id: 'cand3',
        name: 'Priya Kumar',
        email: 'priya@example.com',
        phone: '+91 9876543212',
        experience: 4,
        skills: ['UI/UX', 'Figma', 'User Research'],
        status: 'shortlisted',
        appliedFor: 'job3'
      }
    ];

    const sampleInterviews = [
      {
        id: 'int1',
        candidateId: 'cand1',
        jobId: 'job1',
        date: '2025-04-10',
        time: '14:00',
        type: 'video',
        status: 'scheduled',
        meetingLink: 'https://meet.workwise.com/int1'
      },
      {
        id: 'int2',
        candidateId: 'cand2',
        jobId: 'job2',
        date: '2025-04-10',
        time: '16:30',
        type: 'phone',
        status: 'scheduled'
      },
      {
        id: 'int3',
        candidateId: 'cand3',
        jobId: 'job3',
        date: '2025-04-11',
        time: '11:00',
        type: 'onsite',
        status: 'scheduled'
      }
    ];

    // Save to localStorage
    localStorage.setItem('workwise-job-listings', JSON.stringify(sampleJobListings));
    localStorage.setItem('workwise-candidates', JSON.stringify(sampleCandidates));
    localStorage.setItem('workwise-interviews', JSON.stringify(sampleInterviews));
  };

  // Initialize data when component mounts
  useEffect(() => {
    initializeLocalStorage();
  }, []);

  // Process user message and get response
  const processUserMessage = async (userInput: string) => {
    try {
      const inputLower = userInput.toLowerCase();
      const jobListings = getJobListings();
      const interviews = getUpcomingInterviews();
      
      // Get user's profile data
      const userProfile = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        skills: userData.skills || [],
        experiences: userData.experiences || [],
        education: userData.education || []
      };

      // Profile related queries
      if (inputLower.includes('profile') || inputLower.includes('my details') || inputLower.includes('about me')) {
        let response = `👤 Your Profile\n`;
        response += `━━━━━━━━━━━━━━\n`;
        response += `Name: ${userProfile.firstName} ${userProfile.lastName}\n`;
        response += `Email: ${userProfile.email}\n\n`;
        
        if (userProfile.skills?.length > 0) {
          response += `Skills:\n`;
          userProfile.skills.forEach(skill => {
            response += `• ${skill.name} (${skill.proficiency}%)\n`;
          });
          response += '\n';
        }

        if (userProfile.experiences?.length > 0) {
          response += `Experience:\n`;
          userProfile.experiences.forEach(exp => {
            response += `• ${exp.role} at ${exp.company}\n`;
            response += `  ${exp.startDate} - ${exp.endDate || 'Present'}\n`;
          });
          response += '\n';
        }

        if (userProfile.education?.length > 0) {
          response += `Education:\n`;
          userProfile.education.forEach(edu => {
            response += `• ${edu.degree} from ${edu.institution}\n`;
            response += `  ${edu.startDate} - ${edu.endDate}\n`;
          });
        }

        addAssistantResponse(response);
        return;
      }

      // Job listing queries
      if (inputLower.includes('job') || inputLower.includes('list') || inputLower.includes('position') || inputLower.includes('posting')) {
        const activeJobs = jobListings.filter(job => job.status === 'active');
        
        // Filter jobs based on user's skills if available
        let matchingJobs = activeJobs;
        if (userProfile.skills?.length > 0) {
          const userSkills = userProfile.skills.map(s => s.name.toLowerCase());
          matchingJobs = activeJobs.filter(job => 
            job.requirements.some(req => 
              userSkills.some(skill => req.toLowerCase().includes(skill))
            )
          );
        }

        let response = `💼 Recommended Jobs\n`;
        response += `Matching Your Skills: ${matchingJobs.length}\n`;
        response += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        if (matchingJobs.length > 0) {
          matchingJobs.forEach((job, index) => {
            response += `📋 Position ${index + 1}\n`;
            response += `━━━━━━━━━━━━\n`;
            response += `Role: ${job.title}\n`;
            response += `Company: ${job.company}\n`;
            response += `Location: ${job.location}\n`;
            response += `Type: ${job.type}\n`;
            response += `Requirements:\n${job.requirements.map(req => `• ${req}`).join('\n')}\n`;
            response += `Applications: ${job.applications}\n\n`;
          });
        } else {
          response += `No exact matches found. Here are all available positions:\n\n`;
          activeJobs.forEach((job, index) => {
            response += `📋 Position ${index + 1}\n`;
            response += `━━━━━━━━━━━━\n`;
            response += `Role: ${job.title}\n`;
            response += `Company: ${job.company}\n`;
            response += `Location: ${job.location}\n`;
            response += `Type: ${job.type}\n\n`;
          });
        }
        addAssistantResponse(response);
        return;
      }

      // Interview queries
      if (inputLower.includes('interview') || inputLower.includes('schedule')) {
        // Filter interviews for the current user
        const userInterviews = interviews.filter(i => 
          i.candidateName === `${userProfile.firstName} ${userProfile.lastName}` ||
          i.email === userProfile.email
        );

        const today = new Date().toISOString().split('T')[0];
        const upcomingInterviews = userInterviews.filter(i => i.date >= today);
        const pastInterviews = userInterviews.filter(i => i.date < today);

        let response = `📅 Your Interviews\n`;
        response += `━━━━━━━━━━━━━━\n\n`;
        
        if (upcomingInterviews.length > 0) {
          response += `Upcoming Interviews:\n`;
          response += `━━━━━━━━━━━━━━━━━\n`;
          upcomingInterviews.forEach((interview, index) => {
            response += `🕒 Interview ${index + 1}\n`;
            response += `Company: ${interview.company}\n`;
            response += `Position: ${interview.position}\n`;
            response += `Date: ${interview.date}\n`;
            response += `Time: ${interview.time}\n`;
            response += `Status: ${interview.status}\n`;
            if (interview.meetingLink) {
              response += `Meeting Link: ${interview.meetingLink}\n`;
            }
            response += '\n';
          });
        } else {
          response += `No upcoming interviews scheduled.\n\n`;
        }

        if (pastInterviews.length > 0) {
          response += `Past Interviews:\n`;
          response += `━━━━━━━━━━━━━\n`;
          pastInterviews.forEach((interview, index) => {
            response += `🕒 Interview ${index + 1}\n`;
            response += `Company: ${interview.company}\n`;
            response += `Position: ${interview.position}\n`;
            response += `Date: ${interview.date}\n`;
            response += `Status: ${interview.status}\n\n`;
          });
        }
        addAssistantResponse(response);
        return;
      }

      // Help message
      addAssistantResponse(
        `🤖 WorkWise Assistant\n` +
        `━━━━━━━━━━━━━━━━━\n\n` +
        `I can help you with:\n\n` +
        `1️⃣ Job Listings\n` +
        `   • Show active jobs\n` +
        `   • View all positions\n` +
        `   • Check applications\n\n` +
        `2️⃣ Candidates\n` +
        `   • View all candidates\n` +
        `   • Search by skills\n` +
        `   • Check status\n\n` +
        `3️⃣ Interviews\n` +
        `   • View today's schedule\n` +
        `   • Check upcoming interviews\n` +
        `   • Get interview details\n\n` +
        `Try these commands:\n` +
        `• "show job listings"\n` +
        `• "list all candidates"\n` +
        `• "today's interviews"`
      );
    } catch (error) {
      console.error('Error processing message:', error);
      addAssistantResponse(
        `❌ Error\n` +
        `━━━━━━━\n\n` +
        `I apologize, but I'm having trouble processing your request.\n` +
        `Please try again or contact support@workwise.com if the issue persists.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const addAssistantResponse = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/20 bg-gradient-to-r from-primary/20 to-black backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Bot size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-white">Eva - Your Assistant</h3>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-800/90 via-black/80 to-black/90">
        {messages.map(message => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 animate-fade-in",
              message.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot size={18} className="text-primary" />
              </div>
            )}

            <div
              className={cn(
                "max-w-[80%] rounded-xl p-3 text-sm",
                message.role === 'user'
                  ? "bg-gradient-to-r from-blue-600 to-primary/80 text-white rounded-tr-none border border-blue-400/20"
                  : "bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-tl-none shadow-sm border border-white/10"
              )}
            >
              {message.content}
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <User size={18} className="text-blue-400" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot size={18} className="text-primary" />
            </div>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl rounded-tl-none p-3 text-sm animate-pulse shadow-sm border border-white/10">
              <Loader2 size={16} className="animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary/20 bg-gradient-to-r from-gray-800 to-black backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 min-h-[44px] max-h-[120px] resize-none bg-gray-700/70 border border-white/20 rounded-lg text-white placeholder:text-white/50 p-2 focus:outline-none focus:ring-1 focus:ring-primary/30"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-primary/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors hover:from-blue-500 hover:to-primary/70"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
