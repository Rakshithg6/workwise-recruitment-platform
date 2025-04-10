import { useState, useEffect } from 'react';
import { sampleInterviews } from '@/data/sampleInterviews';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Calendar, Video, Clock, User, MessageCircle, Search, Filter, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import ScheduleInterview from '@/components/interview/ScheduleInterview';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  company: string;
  position: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
  interviewer: {
    id: number;
    name: string;
    position: string;
    email: string;
  };
}

const Interviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduler, setShowScheduler] = useState(false);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All Statuses');
  const { toast } = useToast();

  useEffect(() => {
    document.title = 'My Interviews | WorkWise';
    // Always use sample interviews for now
    setInterviews(sampleInterviews);
    setFilteredInterviews(sampleInterviews);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [interviews, searchQuery, filterStatus]);

  const handleInterviewScheduled = (interviewData: Interview) => {
    const newInterview = {
      ...interviewData,
      id: interviews.length + 1,
      candidateId: 101,
      candidateName: "John Doe",
      status: 'Scheduled' as const,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const updatedInterviews = [...interviews, newInterview];
    setInterviews(updatedInterviews);
    setFilteredInterviews(updatedInterviews);
    
    toast({
      title: "Interview Scheduled",
      description: `Interview scheduled with ${newInterview.company} for ${format(new Date(newInterview.date), 'PPP')} at ${newInterview.time}`,
    });
    
    setShowScheduler(false);
  };

  const applyFilters = () => {
    let filtered = [...interviews];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(interview =>
        interview.company.toLowerCase().includes(query) ||
        interview.position.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'All Statuses') {
      filtered = filtered.filter(interview => interview.status === filterStatus);
    }
    
    // Sort by date, upcoming first
    filtered.sort((a, b) => new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime());
    
    setFilteredInterviews(filtered);
  };



  const handleJoinMeeting = (meetingLink: string) => {
    if (meetingLink && meetingLink.includes('meet.google.com')) {
      // Open Google Meet link in a new window with proper size
      const width = 1200;
      const height = 800;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      
      window.open(
        meetingLink,
        'GoogleMeet',
        `width=${width},height=${height},top=${top},left=${left},menubar=no,toolbar=no,location=yes,status=no`
      );
    } else {
      toast({
        title: 'Error',
        description: 'Meeting link is not available or invalid',
        variant: 'destructive'
      });
    }
  };

  const handleMessage = (interviewer: Interview['interviewer']) => {
    // Navigate to messages with the interviewer and company info
    const params = new URLSearchParams({
      recruiterId: interviewer.id.toString(),
      company: interviewer.position,
      name: interviewer.name,
      role: interviewer.position
    });
    navigate(`/candidate/messages?${params.toString()}`);
  };

  const handleStatusChange = (interviewId: number, newStatus: 'Scheduled' | 'Completed' | 'Cancelled') => {
    const updatedInterviews = interviews.map(interview =>
      interview.id === interviewId ? { ...interview, status: newStatus } : interview
    );
    
    setInterviews(updatedInterviews);
    localStorage.setItem('workwise-interviews', JSON.stringify(updatedInterviews));
    
    toast({
      title: `Interview ${newStatus}`,
      description: `The interview has been marked as ${newStatus.toLowerCase()}.`,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout type="candidate">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </DashboardLayout>
    );
  }

  const upcomingInterviews = interviews.filter(interview => interview.status === 'Scheduled');
  const completedInterviews = interviews.filter(interview => interview.status === 'Completed');
  const cancelledInterviews = interviews.filter(interview => interview.status === 'Cancelled');

  return (
    <DashboardLayout type="candidate">
      <div className="flex-1 p-8 bg-[#0f1729]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white">My Interviews</h1>
          </div>

          {showScheduler ? (
            <div className="mb-6">
              <ScheduleInterview 
                candidateName="John Doe"
                companyName="WorkWise"
                position="Software Engineer"
                onSchedule={handleInterviewScheduled}
                onClose={() => setShowScheduler(false)}
                isDialog
              />
            </div>
          ) : (
            <div className="flex gap-4 items-center mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8792a2]" size={18} />
                <Input
                  placeholder="Search interviews by company or position..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1a1f36] border-gray-800 text-white placeholder-[#8792a2] w-full"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#1a1f36] border border-gray-800 rounded-md px-4 py-2 text-white min-w-[140px]"
              >
                <option value="all">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

          {filteredInterviews.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredInterviews.map(interview => {
                const isPast = new Date(`${interview.date} ${interview.time}`) < new Date();
              
                return (
                  <div
                    key={interview.id}
                    className={`bg-gradient-to-br ${
                      interview.status === 'Scheduled'
                        ? isPast
                          ? 'from-yellow-950/50 to-gray-900/90'
                          : 'from-blue-950/50 to-gray-900/90'
                        : interview.status === 'Completed'
                        ? 'from-green-950/50 to-gray-900/90'
                        : 'from-red-950/50 to-gray-900/90'
                    } rounded-lg p-6 border border-white/10 shadow-md hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-lg font-semibold text-white">
                          {interview.company[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{interview.company}</h3>
                          <p className="text-sm text-white/60">{interview.position}</p>
                        </div>
                      </div>
                      <div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          interview.status === 'Scheduled' ? 'bg-blue-500/20 text-blue-400' :
                          interview.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {interview.status}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#8792a2]">
                          <Calendar size={18} />
                          <span>{format(new Date(interview.date), 'MMMM d, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#8792a2]">
                          <Clock size={18} />
                          <span>{interview.time} ({interview.duration} minutes)</span>
                        </div>

                      </div>
                      <div className="space-y-3 border-l border-white/10 pl-4">
                        <div className="flex items-center gap-2 text-[#8792a2]">
                          <User size={18} />
                          <div>
                            <p className="font-medium">{interview.interviewer.name}</p>
                            <p className="text-sm text-white/60">{interview.interviewer.position}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-[#8792a2]">
                          <Mail size={18} />
                          <span className="text-sm">{interview.interviewer.email}</span>
                        </div>
                      </div>
                    </div>
                    

                    
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                        onClick={() => handleMessage(interview.interviewer)}
                      >
                        <MessageCircle size={18} className="mr-2" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => handleJoinMeeting(interview.meetingLink)}
                      >
                        <Video size={18} className="mr-2" />
                        Join Meeting
                      </Button>
                      

                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
              <div className="bg-[#1a1f36] rounded-lg p-12 text-center border border-gray-800">
                <Calendar size={48} className="mx-auto text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Interviews Scheduled</h3>
                <p className="text-[#8792a2] mb-6">You don't have any interviews scheduled yet. Start by clicking the 'Schedule Interview' button above.</p>
                <Button 
                  onClick={() => setShowScheduler(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white mx-auto"
                >
                  <Calendar size={18} className="mr-2" />
                  Schedule Your First Interview
                </Button>
              </div>
            )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Interviews;
