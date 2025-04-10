
import { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useTheme } from '@/contexts/ThemeContext';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
  category?: 'job' | 'interview' | 'message' | 'system';
}

// Function to get current timestamp in ISO format
const getCurrentTimestamp = () => new Date().toISOString();

// Get notifications from localStorage
const getStoredNotifications = (): Notification[] => {
  const storedNotifications = localStorage.getItem('workwise-notifications');
  if (storedNotifications) {
    try {
      return JSON.parse(storedNotifications);
    } catch (error) {
      console.error('Failed to parse notifications from localStorage:', error);
      return getDemoNotifications();
    }
  }
  return getDemoNotifications();
};

// Save notifications to localStorage
const saveNotifications = (notifications: Notification[]) => {
  localStorage.setItem('workwise-notifications', JSON.stringify(notifications));
};

// Generate demo notifications
const getDemoNotifications = (): Notification[] => {
  return [
    {
      id: '1',
      title: 'New Job Match',
      description: 'We found a new job that matches your skills: Senior Frontend Developer at TechCorp.',
      timestamp: '2023-04-15T10:30:00Z',
      read: false,
      link: '/jobs',
      category: 'job'
    },
    {
      id: '2',
      title: 'Interview Scheduled',
      description: 'Your interview with Infosys for the Software Engineer position has been scheduled for April 20, 2023.',
      timestamp: '2023-04-14T15:45:00Z',
      read: false,
      link: '/candidate/interviews',
      category: 'interview'
    },
    {
      id: '3',
      title: 'Application Update',
      description: 'Your application for Product Manager at Google has moved to the next stage.',
      timestamp: '2023-04-13T09:15:00Z',
      read: true,
      link: '/candidate/applications',
      category: 'job'
    },
    {
      id: '4',
      title: 'New Message',
      description: 'You have a new message from the hiring manager at Amazon.',
      timestamp: '2023-04-12T14:20:00Z',
      read: true,
      link: '/candidate/messages',
      category: 'message'
    },
    {
      id: '5',
      title: 'Profile Completion',
      description: 'Your profile is 75% complete. Complete it to improve your job matches.',
      timestamp: '2023-04-11T11:10:00Z',
      read: true,
      link: '/candidate/settings',
      category: 'system'
    }
  ];
};

// Light and dark mode styles
const notificationItemBg = 'bg-blue-900/20';

export function NotificationDropdown() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [notifications, setNotifications] = useState<Notification[]>(getStoredNotifications);
  const [isAllNotificationsOpen, setIsAllNotificationsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Save notifications to localStorage whenever they change
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);
  
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    setNotifications(updatedNotifications);
    
    toast({
      title: "Notifications marked as read",
      description: "All notifications have been marked as read."
    });
  };
  
  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    setNotifications(updatedNotifications);
  };
  
  const clearAll = () => {
    setNotifications([]);
    
    toast({
      title: "Notifications cleared",
      description: "All notifications have been cleared."
    });
    
    setIsAllNotificationsOpen(false);
  };
  
  const handleNotificationClick = (notification: Notification) => {
    // Mark the notification as read
    markAsRead(notification.id);
    
    // Close dropdowns and dialogs before navigation
    setIsDropdownOpen(false);
    setIsAllNotificationsOpen(false);
    
    // If there's a link, navigate to it
    if (notification.link) {
      // Use a small timeout to ensure UI state is updated before navigation
      setTimeout(() => {
        navigate(notification.link || '/');
      }, 50);
    }
  };
  
  const renderCategoryIcon = (category?: 'job' | 'interview' | 'message' | 'system') => {
    switch (category) {
      case 'job':
        return <div className="bg-blue-500/20 p-2 rounded-full"><Bell className="h-4 w-4 text-blue-500" /></div>;
      case 'interview':
        return <div className="bg-green-500/20 p-2 rounded-full"><Bell className="h-4 w-4 text-green-500" /></div>;
      case 'message':
        return <div className="bg-purple-500/20 p-2 rounded-full"><Bell className="h-4 w-4 text-purple-500" /></div>;
      case 'system':
        return <div className="bg-yellow-500/20 p-2 rounded-full"><Bell className="h-4 w-4 text-yellow-500" /></div>;
      default:
        return <div className="bg-gray-500/20 p-2 rounded-full"><Bell className="h-4 w-4 text-gray-500" /></div>;
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `${Math.round(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className={`w-[350px] overflow-hidden p-0 ${theme === 'light' ? 'bg-white' : 'bg-gray-900'}`}>
          <div className={`p-4 ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-800'} flex justify-between items-center`}>
            <h3 className={`font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs h-7 ${theme === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700'}`}
                onClick={markAllAsRead}
              >
                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`px-4 py-3 cursor-pointer ${!notification.read ? (theme === 'light' ? 'bg-blue-50' : notificationItemBg) : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                  onSelect={(e) => e.preventDefault()} // Prevent auto-closing
                >
                  <div className="flex gap-3 w-full">
                    <div className={`w-2 self-stretch rounded-full ${!notification.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                    <div className="flex-shrink-0">
                      {renderCategoryIcon(notification.category)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className={`font-medium truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {notification.title}
                      </div>
                      <div className={`text-xs truncate ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
                        {notification.description}
                      </div>
                      <div className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-400'}`}>
                        {formatTimestamp(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <div className={`py-8 text-center ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                No notifications
              </div>
            )}
          </DropdownMenuGroup>
          
          {notifications.length > 0 && (
            <>
              <Separator />
              <div className="p-2">
                <Button 
                  variant="ghost" 
                  className={`w-full text-sm h-8 ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-blue-900/20'}`}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    setIsAllNotificationsOpen(true);
                  }}
                >
                  View all notifications
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isAllNotificationsOpen} onOpenChange={setIsAllNotificationsOpen}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>All Notifications</DialogTitle>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Mark all as read
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={clearAll}>
                  Clear all
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 -mx-6 px-6">
            {notifications.length > 0 ? (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      !notification.read 
                        ? (theme === 'light' ? 'bg-blue-50' : notificationItemBg) 
                        : (theme === 'light' ? 'bg-gray-50' : 'bg-gray-800/50')
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        {renderCategoryIcon(notification.category)}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{notification.title}</div>
                        <div className="text-sm opacity-80 mt-1">{notification.description}</div>
                        <div className="text-xs opacity-60 mt-1">{formatTimestamp(notification.timestamp)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center opacity-50">
                No notifications
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
