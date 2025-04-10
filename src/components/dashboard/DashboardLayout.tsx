import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BriefcaseIcon, CalendarClock, Bell, MessageSquare, 
  Settings, LogOut, Menu, X, ChevronDown, User, Building
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from '@/hooks/use-toast';
import ChatbotButton from '../ui/ChatbotButton';
import { cn } from '@/lib/utils';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '../ui/NotificationDropdown';
import { useUserContext } from '@/contexts/UserContext';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  href: string;
  active: boolean;
  onClick?: () => void;
}

interface DashboardLayoutProps {
  children: ReactNode;
  type: 'candidate' | 'employer';
}

// Separate component for nav item to handle navigation
const NavItem = ({ icon, label, href, active, onClick }: NavItemProps) => (
  <Link
    to={href}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
      active 
        ? 'bg-gradient-to-r from-blue-600/30 to-primary/30 text-white font-medium border border-blue-500/20' 
        : 'hover:bg-white/10 text-white/80 hover:text-white'
    }`}
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const DashboardLayout = ({ children, type }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const { userName, userRole, userData } = useUserContext();

  // State to control chatbot visibility
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  // Auto-open chatbot after login
  useEffect(() => {
    // Check if this is the first time loading the page
    const hasGreeted = sessionStorage.getItem('chatbotHasGreeted');
    
    if (!hasGreeted) {
      // Open chatbot after a short delay
      const timer = setTimeout(() => {
        setIsChatbotOpen(true);
        // Mark that we've greeted the user
        sessionStorage.setItem('chatbotHasGreeted', 'true');
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Ensure active state correctly reflects current route
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLogout = () => {
    // This would be replaced with actual logout logic
    toast({
      title: "Logged out successfully",
    });
    navigate('/');
  };
  
  const candidateLinks = [
    {
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
      href: '/candidate/dashboard',
    },
    {
      icon: <BriefcaseIcon size={18} />,
      label: 'Applications',
      href: '/candidate/applications',
    },
    {
      icon: <CalendarClock size={18} />,
      label: 'Interviews',
      href: '/candidate/interviews',
    },
    {
      icon: <MessageSquare size={18} />,
      label: 'Messages',
      href: '/candidate/messages',
    },
    {
      icon: <Settings size={18} />,
      label: 'Settings',
      href: '/candidate/settings',
    },
  ];
  
  const employerLinks = [
    {
      icon: <LayoutDashboard size={18} />,
      label: 'Dashboard',
      href: '/employer/dashboard',
    },
    {
      icon: <BriefcaseIcon size={18} />,
      label: 'Job Listings',
      href: '/employer/jobs',
    },
    {
      icon: <User size={18} />,
      label: 'Candidates',
      href: '/employer/candidates',
    },
    {
      icon: <CalendarClock size={18} />,
      label: 'Interviews',
      href: '/employer/interviews',
    },
    {
      icon: <MessageSquare size={18} />,
      label: 'Messages',
      href: '/employer/messages',
    },
    {
      icon: <Settings size={18} />,
      label: 'Settings',
      href: '/employer/settings',
    },
  ];
  
  const links = type === 'candidate' ? candidateLinks : employerLinks;
  
  // Use actual user name from context or fall back to defaults
  const displayName = userName || (type === 'candidate' ? 'John Doe' : 'Sarah Johnson');
  const displayRole = userData?.jobTitle || userRole || (type === 'candidate' ? 'Software Engineer' : 'HR Manager at TechCorp');
  const userAvatar = displayName.split(' ').map(n => n[0]).join('').slice(0, 2);
  
  // Random metrics for the dashboard
  const randomMetrics = {
    activeJobs: Math.floor(Math.random() * 20) + 5,
    totalCandidates: Math.floor(Math.random() * 200) + 100,
    interviewsScheduled: Math.floor(Math.random() * 15) + 3,
    applicationRate: Math.floor(Math.random() * 30) + 70,
  };
  
  // Handle direct navigation to prevent page reloads
  const handleNavigation = (href: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigate(href);
    setIsMobileSidebarOpen(false);
  };
  
  return (
    <Dialog>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-gradient-to-r from-gray-800/90 to-black/90 border-b border-blue-500/20 sticky top-0 z-40 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-4">
              <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                <SheetTrigger asChild>
                  <button
                    className="p-2 rounded-lg hover:bg-white/10 md:hidden"
                    aria-label="Open menu"
                  >
                    <Menu size={20} className="text-white" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-[280px] bg-gradient-to-b from-gray-800 to-black border-white/10">
                  <div className="px-6 py-6 border-b border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <Link to="/" className="text-xl font-bold text-white">WorkWise</Link>
                      <SheetClose>
                        <X size={20} className="text-white" />
                      </SheetClose>
                    </div>
                    <p className="text-xs text-white/70">{type === 'candidate' ? 'Candidate Portal' : 'Employer Portal'}</p>
                  </div>
                  
                  <div className="px-3 py-6 space-y-1">
                    {links.map((link) => (
                      <SheetClose key={link.href} asChild>
                        <NavItem
                          icon={link.icon}
                          label={link.label}
                          href={link.href}
                          active={isActive(link.href)}
                          onClick={() => handleNavigation(link.href)}
                        />
                      </SheetClose>
                    ))}
                    
                    <button
                      onClick={() => {
                        setIsMobileSidebarOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg w-full hover:bg-red-900/30 text-red-400 transition-colors mt-8"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Link 
                to={`/${type}/dashboard`} 
                className="flex items-center gap-2"
                onClick={(e) => handleNavigation(`/${type}/dashboard`, e)}
              >
                <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/20">
                  WW
                </div>
                <span className="font-semibold hidden sm:inline-block text-white">WorkWise</span>
              </Link>
            </div>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center space-x-1">
              {links.map((link) => (
                <NavItem
                  key={link.href}
                  icon={link.icon}
                  label={link.label}
                  href={link.href}
                  active={isActive(link.href)}
                  onClick={() => handleNavigation(link.href)}
                />
              ))}
            </div>
            
            {/* Right Section - User Menu & Notifications */}
            <div className="flex items-center gap-2">
              
              <NotificationDropdown />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 hover:bg-white/10 rounded-lg px-2 py-1.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-primary/20 flex items-center justify-center text-sm font-medium text-white border border-white/10">
                      {userAvatar}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <p className="text-sm font-medium text-white truncate max-w-[120px] sm:max-w-[150px]">{displayName}</p>
                      <p className="text-xs text-white/70 truncate max-w-[120px] sm:max-w-[150px]">{displayRole}</p>
                    </div>
                    <ChevronDown size={16} className="text-white/70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gradient-to-b from-gray-800 to-black border-blue-500/20 text-white">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem 
                    className="hover:bg-white/10 cursor-pointer"
                    onClick={() => navigate(`/${type}/settings`)}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="hover:bg-white/10 cursor-pointer"
                    onClick={() => navigate(`/${type}/settings`)}
                  >
                    <Settings size={16} className="mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-400 focus:text-red-400 cursor-pointer hover:bg-red-900/20">
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-b from-gray-800/80 via-gray-900/70 to-gray-800/80">
          <div className="w-full max-w-7xl mx-auto">
            {children}

            {/* Enhanced Action Buttons - visible on all pages */}
            <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 flex flex-col gap-2 sm:gap-3 z-30">
              {location.pathname.includes('/employer') && (
                <>
                  <Button 
                    onClick={() => navigate('/post-job')}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base shadow-xl shadow-blue-500/30 border-2 border-blue-400/50 animate-pulse hover:animate-none whitespace-nowrap"
                  >
                    <BriefcaseIcon size={18} className="mr-2 hidden sm:inline" />
                    <span className="sm:hidden">+ Job</span>
                    <span className="hidden sm:inline">Post New Job</span>
                  </Button>
                  
                  {location.pathname.includes('/interviews') && (
                    <Button 
                      onClick={() => navigate('/employer/candidates')}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-3 sm:px-4 py-2 shadow-lg shadow-green-500/20 border border-green-400/30 text-sm sm:text-base whitespace-nowrap"
                    >
                      <CalendarClock size={18} className="mr-2 hidden sm:inline" />
                      <span className="sm:hidden">+ Interview</span>
                      <span className="hidden sm:inline">Schedule Interview</span>
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
        
        {/* Chatbot */}
        <ChatbotButton 
          userType={type} 
          autoGreet={true}
        />
      </div>
    </Dialog>
  );
};

export default DashboardLayout;
