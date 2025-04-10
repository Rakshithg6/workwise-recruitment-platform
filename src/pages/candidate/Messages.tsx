import { useEffect, useState } from 'react';
import { Search, Send, User, MoreVertical, Phone, Video, Paperclip, Image, MessageSquare } from 'lucide-react';
import ThemeAwareDashboardLayout from '@/components/dashboard/ThemeAwareDashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useLocation, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar?: string;
  isRecruiter: boolean;
  company?: string;
  role?: string;
  status: 'online' | 'offline' | 'away';
}

interface Message {
  id: string;
  content: string;
  sender: 'me' | 'other';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'typing';
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

const Messages = () => {
  useEffect(() => {
    document.title = 'Messages | WorkWise';
  }, []);

  const location = useLocation();
  const { interviewerId } = useParams();
  const searchParams = new URLSearchParams(location.search);
  const recruiterId = interviewerId || searchParams.get('recruiterId');
  const company = searchParams.get('company');

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>({});

  // Load chats from localStorage or initialize with sample data
  useEffect(() => {
    const savedChats = localStorage.getItem('workwise-chats');
    if (savedChats) {
      setChats(JSON.parse(savedChats));
    } else {
      const initialChats: Chat[] = [
        {
          id: 'rec123',
          name: 'Rahul Sharma',
          company: 'TCS',
          role: 'Engineering Lead',
          lastMessage: 'Looking forward to our interview tomorrow.',
          time: '10:30 AM',
          unread: 0,
          isRecruiter: true,
          status: 'online'
        },
        {
          id: 'rec456',
          name: 'Amit Kumar',
          company: 'Infosys',
          role: 'Design Director',
          lastMessage: 'Please send your portfolio before the interview.',
          time: 'Yesterday',
          unread: 2,
          isRecruiter: true,
          status: 'away'
        }
      ];
      setChats(initialChats);
      localStorage.setItem('workwise-chats', JSON.stringify(initialChats));
    }
  }, []);

  // Auto-select chat if recruiterId is provided in URL
  useEffect(() => {
    if (recruiterId && company) {
      // First check if recruiter exists in any chat by ID or company
      const existingChat = chats.find(chat => 
        chat.id === recruiterId || 
        (chat.isRecruiter && chat.company && chat.company.toLowerCase() === company.toLowerCase())
      );

      if (existingChat) {
        // Move existing chat to top of the list
        setChats(prevChats => {
          const updatedChats = prevChats.filter(chat => chat.id !== existingChat.id);
          const newChats = [existingChat, ...updatedChats];
          localStorage.setItem('workwise-chats', JSON.stringify(newChats));
          return newChats;
        });
        handleSelectChat(existingChat.id);
      } else {
        // Create a new chat for this recruiter
        const newChat: Chat = {
          id: recruiterId,
          name: searchParams.get('name') || 'Recruiter',
          company: company,
          role: searchParams.get('role') || 'Recruiter',
          lastMessage: 'No messages yet',
          time: format(new Date(), 'h:mm a'),
          unread: 0,
          isRecruiter: true,
          status: 'online'
        };

        // Add new chat to the top of the list
        setChats(prevChats => {
          const updatedChats = prevChats.filter(chat => 
            chat.company?.toLowerCase() !== company.toLowerCase()
          );
          const newChats = [newChat, ...updatedChats];
          localStorage.setItem('workwise-chats', JSON.stringify(newChats));
          return newChats;
        });

        handleSelectChat(recruiterId);
      }
    }
  }, [recruiterId, company, searchParams]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    // Mark messages as read when selecting chat
    setChats(prevChats => {
      const selectedChat = prevChats.find(chat => chat.id === chatId);
      if (!selectedChat) return prevChats;

      // Remove the selected chat and add it to the top with unread set to 0
      const otherChats = prevChats.filter(chat => chat.id !== chatId);
      const updatedChat = { ...selectedChat, unread: 0 };
      const newChats = [updatedChat, ...otherChats];
      
      // Update localStorage
      localStorage.setItem('workwise-chats', JSON.stringify(newChats));
      return newChats;
    });
    
    // Initialize messages array if it doesn't exist
    if (!messages[chatId]) {
      setMessages(prev => ({
        ...prev,
        [chatId]: []
      }));
    }
  };

  const [filter, setFilter] = useState<'all' | 'unread' | 'recruiters'>('all');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample responses for ghost messaging
  const sampleResponses = [
    "Thank you for your message. I'll get back to you shortly.",
    "That's great! Looking forward to discussing this further in the interview.",
    "Could you please provide more details about your experience?",
    "Perfect! I'll make a note of that.",
    "Yes, we can definitely discuss that during the interview.",
    "Thanks for letting me know. Is there anything specific you'd like to prepare?",
    "I appreciate your prompt response. Let me check with the team and get back to you.",
    "That sounds good. Please make sure to bring your portfolio to the interview."
  ];

  const handleSendMessage = () => {
    if (!selectedChat || !newMessage.trim()) return;
    
    const currentChat = chats.find(chat => chat.id === selectedChat);
    if (!currentChat) return;

    const timestamp = format(new Date(), 'h:mm a');
    
    const newMsg: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'me',
      timestamp,
      status: 'sent'
    };
    
    // Add message to chat
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), newMsg]
    }));
    
    // Update last message in chat list and move to top
    setChats(prevChats => {
      const otherChats = prevChats.filter(chat => chat.id !== selectedChat);
      const updatedChat = {
        ...currentChat,
        lastMessage: newMessage,
        time: timestamp
      };
      const newChats = [updatedChat, ...otherChats];
      localStorage.setItem('workwise-chats', JSON.stringify(newChats));
      return newChats;
    });
    
    setNewMessage('');
    
    // Simulate typing indicator
    setTimeout(() => {
      const typingMsg: Message = {
        id: 'typing',
        content: '...',
        sender: 'other',
        timestamp: format(new Date(), 'h:mm a'),
        status: 'typing'
      };
      
      setMessages(prev => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), typingMsg]
      }));
      
      // Remove typing indicator and send response after delay
      setTimeout(() => {
        const randomResponse = sampleResponses[Math.floor(Math.random() * sampleResponses.length)];
        const responseTimestamp = format(new Date(), 'h:mm a');
        
        const responseMsg: Message = {
          id: Date.now().toString(),
          content: randomResponse,
          sender: 'other',
          timestamp: responseTimestamp,
          status: 'sent'
        };
        
        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...prev[selectedChat].filter(m => m.id !== 'typing'), responseMsg]
        }));
        
        // Update chat list
        setChats(prevChats => {
          const otherChats = prevChats.filter(chat => chat.id !== selectedChat);
          const updatedChat = {
            ...currentChat,
            lastMessage: randomResponse,
            time: responseTimestamp
          };
          const newChats = [updatedChat, ...otherChats];
          localStorage.setItem('workwise-chats', JSON.stringify(newChats));
          return newChats;
        });
        
        // Show notification
        toast({
          title: `New message from ${currentChat.name}`,
          description: randomResponse.length > 50 ? randomResponse.substring(0, 50) + '...' : randomResponse,
        });
      }, 2000); // Show response after 2 seconds
    }, 1000); // Start typing after 1 second
  };

  const filteredChats = chats.filter(chat => {
    // Apply search filter
    const matchesSearch = chat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (chat.company && chat.company.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Apply tab filter
    if (filter === 'unread') return chat.unread > 0 && matchesSearch;
    if (filter === 'recruiters') return chat.isRecruiter && matchesSearch;
    
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedChatData = chats.find(chat => chat.id === selectedChat);

  return (
    <ThemeAwareDashboardLayout type="candidate">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="flex mb-6 items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
        </div>
        
        <div className="flex h-full bg-black/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
          {/* Conversation List */}
          <div className="w-full md:w-1/3 xl:w-1/4 border-r border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                <Input 
                  placeholder="Search messages..." 
                  className="pl-9 bg-white/5 border-white/10"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'unread' | 'recruiters')} className="mt-4">
                <TabsList className="w-full bg-white/5">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                  <TabsTrigger value="recruiters" className="flex-1">Recruiters</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {filteredChats.length > 0 ? (
                filteredChats.map(chat => (
                  <div 
                    key={chat.id}
                    className={`p-3 cursor-pointer border-b border-white/5 hover:bg-white/5 transition-colors ${
                      selectedChat === chat.id ? 'bg-white/10' : ''
                    }`}
                    onClick={() => handleSelectChat(chat.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center text-white">
                          {chat.avatar ? (
                            <img src={chat.avatar} alt={chat.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <User size={20} />
                          )}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(chat.status)} rounded-full border-2 border-black`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-white truncate">{chat.name}</h3>
                          <span className="text-xs text-white/50">{chat.time}</span>
                        </div>
                        
                        {chat.isRecruiter && chat.company && (
                          <p className="text-xs text-blue-400 mt-0.5">
                            {chat.role} at {chat.company}
                          </p>
                        )}
                        
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-sm text-white/70 truncate pr-2">{chat.lastMessage}</p>
                          {chat.unread > 0 && (
                            <div className="min-w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs text-white">
                              {chat.unread}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center">
                  <MessageSquare className="mx-auto text-white/20 mb-3" size={48} />
                  <p className="text-white/50">No messages found</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="hidden md:flex flex-col flex-1">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 flex items-center justify-center text-white">
                        <User size={20} />
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 ${
                        getStatusColor(selectedChatData?.status || 'offline')
                      } rounded-full border-2 border-black`}></div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-white">{selectedChatData?.name}</h3>
                      {selectedChatData?.isRecruiter && selectedChatData.company && (
                        <p className="text-xs text-blue-400">
                          {selectedChatData.role} at {selectedChatData.company}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                      <Phone size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                      <Video size={18} />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
                      <MoreVertical size={18} />
                    </Button>
                  </div>
                </div>
                
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages[selectedChat]?.length > 0 ? (
                    messages[selectedChat].map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'me' 
                              ? 'bg-blue-600 text-white' 
                              : message.status === 'typing' 
                                ? 'bg-white/10 text-white/70' 
                                : 'bg-white/10 text-white'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div className="flex justify-end items-center mt-1 gap-1">
                            <span className="text-xs opacity-70">{message.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <MessageSquare className="text-white/20 mb-3" size={48} />
                      <h3 className="text-white font-medium">No messages yet</h3>
                      <p className="text-white/50 text-sm mt-1">Send a message to start the conversation</p>
                    </div>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Textarea 
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="min-h-10 py-2 bg-white/5 border-white/10 resize-none"
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <div className="absolute right-2 bottom-2 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/50 hover:text-white">
                          <Paperclip size={15} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white/50 hover:text-white">
                          <Image size={15} />
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()} 
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <MessageSquare className="text-white/20 mb-4" size={64} />
                <h2 className="text-xl font-medium text-white">Your Messages</h2>
                <p className="text-white/50 mt-2 max-w-md">
                  Select a conversation from the list to view messages, or start a new conversation with a recruiter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeAwareDashboardLayout>
  );
};

export default Messages;
