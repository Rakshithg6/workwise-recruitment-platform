import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Send, Phone, Video, User, MessageSquare } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Contact {
  id: number;
  name: string;
  role: string;
  lastActive: string;
  isOnline: boolean;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isRead: boolean;
}

const Messages = () => {
  const location = useLocation();
  
  useEffect(() => {
    document.title = 'Messages | WorkWise';
  }, []);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: 1,
      name: 'Priya Sharma',
      role: 'Senior Frontend Developer',
      lastActive: '2 min ago',
      isOnline: true,
      unreadCount: 2,
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      role: 'Product Manager',
      lastActive: '1 hour ago',
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: 3,
      name: 'Sneha Patel',
      role: 'UX Designer',
      lastActive: '30 min ago',
      isOnline: true,
      unreadCount: 0,
    },
    {
      id: 4,
      name: 'Arjun Singh',
      role: 'DevOps Engineer',
      lastActive: '3 hours ago',
      isOnline: false,
      unreadCount: 0,
    },
    {
      id: 5,
      name: 'Neha Gupta',
      role: 'Content Writer',
      lastActive: '1 day ago',
      isOnline: false,
      unreadCount: 0,
    },
  ]);

  // Parse candidate ID from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const candidateIdParam = searchParams.get('candidate');
  
  // Find initial contact based on URL parameter
  const findInitialContact = () => {
    if (candidateIdParam) {
      const candidateId = parseInt(candidateIdParam, 10);
      const foundContact = contacts.find(c => c.id === candidateId);
      if (foundContact) return foundContact;
    }
    return contacts[0]; // Default to first contact if no match
  };

  const [activeContact, setActiveContact] = useState<Contact | null>(() => findInitialContact());
  
  // Update active contact when URL parameter changes
  useEffect(() => {
    if (candidateIdParam) {
      const candidateId = parseInt(candidateIdParam, 10);
      const foundContact = contacts.find(c => c.id === candidateId);
      if (foundContact) {
        setActiveContact(foundContact);
      }
    }
  }, [candidateIdParam, contacts]);

  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      {
        id: 1,
        senderId: 1,
        text: "Hello! I'm interested in the position you posted.",
        timestamp: "2023-05-14T10:30:00",
        isRead: true,
      },
      {
        id: 2,
        senderId: 0, // 0 means the current user (employer)
        text: "Hi Priya! Thanks for your interest. Your profile looks impressive.",
        timestamp: "2023-05-14T10:32:00",
        isRead: true,
      },
      {
        id: 3,
        senderId: 1,
        text: "Thank you. I have experience with the technologies mentioned in the job description.",
        timestamp: "2023-05-14T10:35:00",
        isRead: true,
      },
      {
        id: 4,
        senderId: 0,
        text: "Great! Would you be available for an interview next week?",
        timestamp: "2023-05-14T10:40:00",
        isRead: true,
      },
      {
        id: 5,
        senderId: 1,
        text: "Yes, I'm available on Tuesday and Thursday morning.",
        timestamp: "2023-05-14T10:45:00",
        isRead: false,
      },
      {
        id: 6,
        senderId: 1,
        text: "Would that work for you?",
        timestamp: "2023-05-14T10:46:00",
        isRead: false,
      },
    ],
    2: [
      {
        id: 1,
        senderId: 2,
        text: "Hello, I saw your product manager posting.",
        timestamp: "2023-05-13T14:20:00",
        isRead: true,
      },
      {
        id: 2,
        senderId: 0,
        text: "Hi Rahul! Thanks for reaching out.",
        timestamp: "2023-05-13T14:25:00",
        isRead: true,
      },
    ],
    3: [
      {
        id: 1,
        senderId: 3,
        text: "Hi there, I submitted my application for the UX Designer role.",
        timestamp: "2023-05-14T09:10:00",
        isRead: true,
      },
    ],
    4: [
      {
        id: 1,
        senderId: 4,
        text: "Hello, I'm Arjun. I applied for the DevOps Engineer position.",
        timestamp: "2023-05-14T15:10:00",
        isRead: true,
      },
      {
        id: 2,
        senderId: 0,
        text: "Hi Arjun! Thank you for your application. We're reviewing it now.",
        timestamp: "2023-05-14T15:15:00",
        isRead: true,
      },
    ],
  });

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [activeContact, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleContactSelect = (contact: Contact) => {
    // Mark messages as read when selecting a contact
    if (contact.unreadCount > 0) {
      const updatedContacts = contacts.map(c => 
        c.id === contact.id ? { ...c, unreadCount: 0 } : c
      );
      setContacts(updatedContacts);
      
      // Mark messages as read
      if (messages[contact.id]) {
        const updatedMessages = messages[contact.id].map(m => 
          m.senderId !== 0 ? { ...m, isRead: true } : m
        );
        setMessages({
          ...messages,
          [contact.id]: updatedMessages
        });
      }
    }
    
    setActiveContact(contact);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeContact) return;
    
    const newMsg: Message = {
      id: Math.max(0, ...messages[activeContact.id].map(m => m.id)) + 1,
      senderId: 0, // 0 is the current user (employer)
      text: newMessage,
      timestamp: new Date().toISOString(),
      isRead: true,
    };
    
    setMessages({
      ...messages,
      [activeContact.id]: [...(messages[activeContact.id] || []), newMsg]
    });
    
    setNewMessage('');
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  return (
    <DashboardLayout type="employer">
      <div className="flex h-[calc(100vh-10rem)]">
        {/* Contacts sidebar */}
        <div className="w-full sm:w-80 md:w-96 bg-gradient-to-r from-gray-800 to-black/80 border-r border-indigo-500/20 rounded-l-xl flex flex-col">
          <div className="p-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 py-2 bg-black/30 border border-white/10 rounded-lg focus:ring-1 focus:ring-white/20 focus:outline-none text-white placeholder:text-white/50"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                className={cn(
                  "w-full flex items-start p-4 text-left hover:bg-indigo-600/10 transition-colors",
                  activeContact?.id === contact.id && "bg-indigo-600/20 border-l-4 border-indigo-500",
                  contact.unreadCount > 0 && "bg-blue-600/10"
                )}
                onClick={() => handleContactSelect(contact)}
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 bg-indigo-500/20 text-indigo-100 border border-indigo-500/30">
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-black"></span>
                  )}
                </div>
                
                <div className="ml-3 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-white truncate">{contact.name}</h3>
                    <span className="text-xs text-white/70">{contact.lastActive}</span>
                  </div>
                  <p className="text-xs text-white/70 truncate">{contact.role}</p>
                </div>
                
                {contact.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 bg-indigo-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Chat area */}
        <div className="hidden sm:flex flex-col flex-1 bg-gradient-to-r from-gray-800/80 to-black/90 rounded-r-xl overflow-hidden">
          {activeContact ? (
            <>
              {/* Chat header - improved styling */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-500/20 bg-gradient-to-r from-indigo-900/20 to-gray-900/30">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3 bg-indigo-500/20 text-indigo-100 border border-indigo-500/30">
                    <AvatarFallback>{getInitials(activeContact.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-white flex items-center">
                      {activeContact.name}
                      {activeContact.isOnline && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-green-500"></span>
                      )}
                    </h3>
                    <p className="text-xs text-white/70">
                      {activeContact.isOnline ? (
                        <span className="text-green-400">Online</span>
                      ) : (
                        `Last active ${activeContact.lastActive}`
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-600/20">
                    <Phone size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-600/20">
                    <Video size={18} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-indigo-600/20">
                    <User size={18} />
                  </Button>
                </div>
              </div>
              
              {/* Messages - enhanced style */}
              <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-gray-900/30 to-black/20">
                <div className="space-y-4">
                  {messages[activeContact.id]?.map((message) => (
                    <div 
                      key={message.id} 
                      className={cn(
                        "flex",
                        message.senderId === 0 ? "justify-end" : "justify-start"
                      )}
                    >
                      <div 
                        className={cn(
                          "max-w-[80%] px-4 py-2 rounded-lg shadow-lg",
                          message.senderId === 0 
                            ? "chat-message-user" 
                            : "chat-message-assistant"
                        )}
                      >
                        <p>{message.text}</p>
                        <div 
                          className={cn(
                            "text-xs mt-1",
                            message.senderId === 0 ? "text-white/70 text-right" : "text-white/70 text-right",
                            "flex items-center justify-end gap-1"
                          )}
                        >
                          {formatMessageTime(message.timestamp)}
                          {message.senderId === 0 && message.isRead && (
                            <span className="text-blue-400">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Message input - improved styling */}
              <div className="p-4 border-t border-indigo-500/20 bg-gradient-to-r from-indigo-900/10 to-gray-900/20">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-black/30 border-indigo-500/30 text-white placeholder:text-white/50 focus-visible:ring-indigo-500/40"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="bg-indigo-500/20 rounded-full p-6 mb-4 border border-indigo-500/30">
                <MessageSquare size={48} className="text-indigo-400" />
              </div>
              <h3 className="text-xl font-medium text-white">Your Messages</h3>
              <p className="text-white/70 mt-2 text-center max-w-md">
                Select a conversation from the list to view and respond to messages from candidates.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
