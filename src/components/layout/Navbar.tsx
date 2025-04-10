import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  BriefcaseIcon, 
  User, 
  CalendarClock, 
  MessageSquare,
  Settings,
  Search,
  Bell,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Only show this navbar for authenticated employers in employer routes
  if (!userData || !userData.role || userData.role !== 'employer' || location.pathname.includes('/auth/') || location.pathname === '/') {
    return null;
  }

  const employerLinks = [
    { icon: <LayoutDashboard size={20} />, name: 'Dashboard', path: '/employer/dashboard' },
    { icon: <BriefcaseIcon size={20} />, name: 'Job Listings', path: '/employer/jobs' },
    { icon: <User size={20} />, name: 'Candidates', path: '/employer/candidates' },
    { icon: <CalendarClock size={20} />, name: 'Interviews', path: '/employer/interviews' },
    { icon: <MessageSquare size={20} />, name: 'Messages', path: '/employer/messages' },
    { icon: <Settings size={20} />, name: 'Settings', path: '/employer/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#1a1f2e] border-b border-slate-700/50">
      <nav className="h-16 px-6 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/employer/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-[#2563eb] rounded flex items-center justify-center text-white font-semibold">
            WW
          </div>
          <span className="text-white font-semibold text-xl">WorkWise</span>
        </Link>

        {/* Main Navigation */}
        <div className="hidden md:flex items-center space-x-1">
          {employerLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium",
                isActive(link.path)
                  ? "bg-[#2e374a] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#2e374a]"
              )}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#2e374a]">
            <Search size={20} />
          </button>

          <button className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#2e374a]">
            <Bell size={20} />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-[#2e374a] rounded-lg px-2 py-1.5">
                <div className="w-8 h-8 rounded bg-[#2563eb]/20 flex items-center justify-center text-white font-medium">
                  {userData.firstName[0]}{userData.lastName[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{userData.firstName} {userData.lastName}</p>
                  <p className="text-xs text-gray-400">employer</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 ml-1" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1a1f2e] border-slate-700/50">
              <div className="px-3 py-2 text-sm font-medium text-white">My Account</div>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuItem 
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2e374a] cursor-pointer"
                onClick={() => navigate('/employer/settings')}
              >
                <User size={16} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="px-3 py-2 text-gray-300 hover:text-white hover:bg-[#2e374a] cursor-pointer"
                onClick={() => navigate('/employer/settings')}
              >
                <Settings size={16} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <button
            className="p-2 rounded-lg md:hidden text-gray-300 hover:text-white hover:bg-[#2e374a]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700/50">
          <div className="p-4 space-y-2">
            {employerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive(link.path)
                    ? "bg-[#2e374a] text-white"
                    : "text-gray-300 hover:text-white hover:bg-[#2e374a]"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
