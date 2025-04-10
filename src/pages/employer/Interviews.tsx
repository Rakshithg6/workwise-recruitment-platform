import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, Clock, Search, Filter, 
  Video, MessageSquare, Check, X, ExternalLink, 
  ChevronDown, User, MapPin, Building, Mail,
  Link as LinkIcon
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Interview {
  id: number;
  candidateName: string;
  candidateRole: string;
  jobTitle: string;
  interviewType: string;
  date: string;
  time: string;
  status: string;
  location?: string;
  isOnline?: boolean;
  meetingLink?: string;
  candidateEmail?: string;
}

const STORAGE_KEY = 'workwise_interviews';

// Form schema for scheduling an interview
const scheduleFormSchema = z.object({
  candidateName: z.string().min(2, "Candidate name is required"),
  candidateEmail: z.string().email("Valid email is required"),
  candidateRole: z.string().min(2, "Role is required"),
  jobTitle: z.string().min(2, "Job title is required"),
  interviewType: z.string().min(2, "Interview type is required"),
  locationType: z.enum(["remote", "office"]),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
  meetingLink: z.string().url("Valid URL is required").optional().or(z.literal("")),
  location: z.string().optional(),
});

const Interviews = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    document.title = 'Interviews | WorkWise';
  }, []);

  const [initialInterviews] = useState<Interview[]>([
    {
      id: 1,
      candidateName: 'Priya Sharma',
      candidateRole: 'Senior Frontend Developer',
      jobTitle: 'Senior Frontend Developer',
      interviewType: 'Technical Interview',
      date: '2023-05-15',
      time: '10:30 AM',
      status: 'Scheduled',
      isOnline: true,
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/meeting_id123',
      candidateEmail: 'priya.sharma@example.com'
    },
    {
      id: 2,
      candidateName: 'Rahul Kumar',
      candidateRole: 'Product Manager',
      jobTitle: 'Product Manager',
      interviewType: 'Initial Screening',
      date: '2023-05-16',
      time: '02:00 PM',
      status: 'Scheduled',
      isOnline: true,
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/meeting_id456',
      candidateEmail: 'rahul.kumar@example.com'
    },
    {
      id: 3,
      candidateName: 'Sneha Patel',
      candidateRole: 'UX Designer',
      jobTitle: 'UX Designer',
      interviewType: 'Portfolio Review',
      date: '2023-05-14',
      time: '11:00 AM',
      status: 'Completed',
      isOnline: true,
      meetingLink: 'https://teams.microsoft.com/l/meetup-join/meeting_id789',
      candidateEmail: 'sneha.patel@example.com'
    },
    {
      id: 4,
      candidateName: 'Arjun Singh',
      candidateRole: 'DevOps Engineer',
      jobTitle: 'DevOps Engineer',
      interviewType: 'Technical Interview',
      date: '2023-05-17',
      time: '04:30 PM',
      status: 'Scheduled',
      isOnline: false,
      location: 'Corporate Headquarters, 4th Floor, Meeting Room B',
      candidateEmail: 'arjun.singh@example.com'
    }
  ]);

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    // Try to load interviews from localStorage
    const savedInterviews = localStorage.getItem(STORAGE_KEY);
    return savedInterviews ? JSON.parse(savedInterviews) : initialInterviews;
  });

  // Save interviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(interviews));
  }, [interviews]);

  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showConfirmationAlert, setShowConfirmationAlert] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<string>('All Interviews');
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>(interviews);

  useEffect(() => {
    let filtered = [...interviews];

    // Apply status filter
    if (selectedFilter !== 'All Interviews') {
      filtered = filtered.filter(interview => {
        switch (selectedFilter) {
          case 'Scheduled':
            return interview.status === 'Scheduled';
          case 'Confirmed':
            return interview.status === 'Confirmed';
          case 'Completed':
            return interview.status === 'Completed';
          case 'Rejected':
            return interview.status === 'Rejected';
          default:
            return true;
        }
      });
    }

    setFilteredInterviews(filtered);
  }, [selectedFilter, interviews]);

  // Form for scheduling interviews
  const scheduleForm = useForm<z.infer<typeof scheduleFormSchema>>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      candidateName: "",
      candidateEmail: "",
      candidateRole: "",
      jobTitle: "",
      interviewType: "Technical Interview",
      locationType: "remote",
      time: "",
      meetingLink: "",
      location: "",
    },
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleConfirm = (interviewId: number) => {
    const interview = interviews.find(i => i.id === interviewId);
    if (interview) {
      setSelectedInterview(interview);
      setShowConfirmationAlert(true);
    }
  };

  const handleConfirmationComplete = () => {
    if (selectedInterview) {
      setInterviews(interviews.map(i => 
        i.id === selectedInterview.id ? { ...i, status: 'Confirmed' } : i
      ));
      
      // Close the confirmation alert
      setShowConfirmationAlert(false);
      
      // Show success toast with email notification info
      toast({
        title: "Interview confirmed",
        description: `The interview with ${selectedInterview.candidateName} has been confirmed. A confirmation email has been sent to ${selectedInterview.candidateEmail}.`
      });
    }
  };

  const handleReject = (interview: Interview) => {
    setSelectedInterview(interview);
    setIsRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedInterview) {
      // Update interviews array
      setInterviews(interviews.map(interview => 
        interview.id === selectedInterview.id 
          ? { ...interview, status: 'Rejected' } 
          : interview
      ));
      
      // Close dialog and show toast
      setIsRejectDialogOpen(false);
      toast({
        title: "Interview rejected",
        description: `The candidate ${selectedInterview.candidateName} has been notified about the rejection.`
      });
    }
  };

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleMessage = (candidateName: string, interviewId: number) => {
    // Navigate to messages page with the specific candidate selected by ID
    navigate(`/employer/messages?candidate=${interviewId}`);
    toast({
      title: "Messaging initiated",
      description: `You can now message ${candidateName}.`
    });
  };

  const handleScheduleInterview = (data: z.infer<typeof scheduleFormSchema>) => {
    // Create a new interview object
    const newInterview: Interview = {
      id: interviews.length + 1,
      candidateName: data.candidateName,
      candidateRole: data.candidateRole,
      jobTitle: data.jobTitle,
      interviewType: data.interviewType,
      date: format(data.date, 'yyyy-MM-dd'),
      time: data.time,
      status: 'Scheduled',
      isOnline: data.locationType === 'remote',
      location: data.locationType === 'office' ? data.location : undefined,
      meetingLink: data.locationType === 'remote' ? data.meetingLink : undefined,
      candidateEmail: data.candidateEmail
    };

    // Add new interview to the array
    setInterviews([...interviews, newInterview]);
    
    // Close dialog and show success toast
    setIsScheduleDialogOpen(false);
    scheduleForm.reset();
    
    toast({
      title: "Interview scheduled",
      description: `A new interview with ${data.candidateName} has been scheduled for ${format(data.date, 'PPP')} at ${data.time}.`
    });
  };

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  const isPastInterview = (dateString: string, timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const isPM = timeString.includes('PM');
    
    const interviewDate = new Date(dateString);
    interviewDate.setHours(isPM && hours !== 12 ? hours + 12 : hours);
    interviewDate.setMinutes(minutes);
    
    return interviewDate < new Date();
  };

  const watchLocationType = scheduleForm.watch("locationType");

  return (
    <DashboardLayout type="employer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Scheduled Interviews</h1>
          <Button 
            onClick={() => setIsScheduleDialogOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
          >
            <Calendar size={18} className="mr-2" />
            Schedule New Interview
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
            <input
              type="text"
              placeholder="Search interviews..."
              className="w-full pl-10 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:outline-none text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-indigo-500/30 text-white hover:bg-indigo-600/20">
                  <Filter size={16} className="mr-2" />
                  Filter
                  <ChevronDown size={14} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gradient-to-b from-gray-800 to-black border-indigo-500/20 text-white">
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-indigo-600/20"
                  onClick={() => setSelectedFilter('All Interviews')}
                >
                  All Interviews
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-indigo-600/20"
                  onClick={() => setSelectedFilter('Scheduled')}
                >
                  Scheduled
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-indigo-600/20"
                  onClick={() => setSelectedFilter('Confirmed')}
                >
                  Confirmed
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-indigo-600/20"
                  onClick={() => setSelectedFilter('Completed')}
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer hover:bg-indigo-600/20"
                  onClick={() => setSelectedFilter('Rejected')}
                >
                  Rejected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInterviews.map((interview) => (
            <div 
              key={interview.id} 
              className={cn(
                "bg-gradient-to-b from-gray-800/90 to-black/90 rounded-xl overflow-hidden",
                interview.status === 'Scheduled' 
                  ? "border-2 border-indigo-500/30" 
                  : interview.status === 'Confirmed'
                    ? "border-2 border-blue-500/30"
                    : interview.status === 'Completed' 
                      ? "border-2 border-green-500/30"
                      : "border-2 border-red-500/30"
              )}
            >
              <div className={cn(
                "py-3 px-4 flex items-center justify-between",
                interview.status === 'Scheduled' 
                  ? "bg-indigo-900/30 border-b border-indigo-500/30"
                  : interview.status === 'Confirmed'
                    ? "bg-blue-900/30 border-b border-blue-500/30"
                    : interview.status === 'Completed' 
                      ? "bg-green-900/30 border-b border-green-500/30"
                      : "bg-red-900/30 border-b border-red-500/30"
              )}>
                <div className="flex items-center">
                  <span className={cn(
                    "w-2 h-2 rounded-full mr-2",
                    interview.status === 'Scheduled' ? "bg-indigo-500" :
                    interview.status === 'Confirmed' ? "bg-blue-500" :
                    interview.status === 'Completed' ? "bg-green-500" : "bg-red-500"
                  )}></span>
                  <span className="text-sm font-medium text-white">{interview.status}</span>
                </div>
                <span className="text-sm text-white/70">{interview.interviewType}</span>
              </div>
              
              <div className="p-4">
                <div className="flex items-start mb-4">
                  <Avatar className="h-12 w-12 mr-3 bg-indigo-500/20 border border-indigo-500/30">
                    <AvatarFallback>{getInitials(interview.candidateName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg text-white">{interview.candidateName}</h3>
                    <p className="text-sm text-white/70">{interview.candidateRole}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-white/80">
                    <Building size={16} className="mr-2 text-indigo-400" />
                    <span>{interview.jobTitle}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/80">
                    <Calendar size={16} className="mr-2 text-indigo-400" />
                    <span>{formatDate(interview.date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/80">
                    <Clock size={16} className="mr-2 text-indigo-400" />
                    <span>{interview.time}</span>
                  </div>
                  <div className="flex items-center text-sm text-white/80">
                    <MapPin size={16} className="mr-2 text-indigo-400" />
                    <span>
                      {interview.isOnline 
                        ? "Remote (Microsoft Teams)" 
                        : interview.location || "Office Location"}
                    </span>
                  </div>
                  {interview.status === 'Confirmed' && (
                    <div className="flex items-center text-sm text-blue-400">
                      <Mail size={16} className="mr-2 text-blue-400" />
                      <span>Confirmation email sent</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {interview.status === 'Scheduled' && (
                    <>
                      <button 
                        onClick={() => handleConfirm(interview.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-900/30 text-green-400 rounded-md text-sm border border-green-500/30 hover:bg-green-800/40 transition-colors"
                      >
                        <Check size={16} />
                        Confirm
                      </button>
                      <button 
                        onClick={() => handleReject(interview)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-900/30 text-red-400 rounded-md text-sm border border-red-500/30 hover:bg-red-800/40 transition-colors"
                      >
                        <X size={16} />
                        Reject
                      </button>
                      {interview.isOnline && (
                        <button 
                          onClick={() => handleJoinMeeting(interview.meetingLink || '')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-900/30 text-indigo-400 rounded-md text-sm border border-indigo-500/30 hover:bg-indigo-800/40 transition-colors"
                        >
                          <Video size={16} />
                          Join
                        </button>
                      )}
                      <button 
                        onClick={() => handleMessage(interview.candidateName, interview.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-md text-sm border border-blue-500/30 hover:bg-blue-800/40 transition-colors"
                      >
                        <MessageSquare size={16} />
                        Message
                      </button>
                    </>
                  )}
                  
                  {interview.status === 'Confirmed' && (
                    <>
                      {interview.isOnline && (
                        <button 
                          onClick={() => handleJoinMeeting(interview.meetingLink || '')}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-900/30 text-indigo-400 rounded-md text-sm border border-indigo-500/30 hover:bg-indigo-800/40 transition-colors"
                        >
                          <Video size={16} />
                          Join
                        </button>
                      )}
                      <button 
                        onClick={() => handleMessage(interview.candidateName, interview.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-md text-sm border border-blue-500/30 hover:bg-blue-800/40 transition-colors"
                      >
                        <MessageSquare size={16} />
                        Message
                      </button>
                    </>
                  )}
                  
                  {interview.status === 'Completed' && (
                    <>
                      <button 
                        className="flex items-center gap-1 px-3 py-1.5 bg-indigo-900/30 text-indigo-400 rounded-md text-sm border border-indigo-500/30 hover:bg-indigo-800/40 transition-colors" 
                        onClick={() => handleJoinMeeting(interview.meetingLink || '')}
                      >
                        <ExternalLink size={16} />
                        View Recording
                      </button>
                      <button 
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-md text-sm border border-blue-500/30 hover:bg-blue-800/40 transition-colors" 
                        onClick={() => handleMessage(interview.candidateName, interview.id)}
                      >
                        <MessageSquare size={16} />
                        Message
                      </button>
                    </>
                  )}
                  
                  {interview.status === 'Rejected' && (
                    <button 
                      className="flex items-center gap-1 px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-md text-sm border border-blue-500/30 hover:bg-blue-800/40 transition-colors" 
                      onClick={() => handleMessage(interview.candidateName, interview.id)}
                    >
                      <MessageSquare size={16} />
                      Message
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-2 border-red-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Reject Interview</DialogTitle>
            <DialogDescription className="text-white/70">
              {selectedInterview && (
                <span>Are you sure you want to reject the interview with {selectedInterview.candidateName}?</span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Reason for rejection (optional)</label>
              <textarea 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="w-full bg-black/30 border border-red-500/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:outline-none resize-none"
                placeholder="Provide a reason for the rejection..."
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsRejectDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleRejectConfirm}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border border-red-500/40"
            >
              <X size={16} className="mr-2" />
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={showConfirmationAlert} onOpenChange={setShowConfirmationAlert}>
        <AlertDialogContent className="bg-gradient-to-b from-gray-800 to-black border-2 border-blue-500/30 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Confirm Interview</AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              {selectedInterview && (
                <div className="space-y-2">
                  <p>
                    You are confirming the interview with <span className="text-white font-medium">{selectedInterview.candidateName}</span>
                  </p>
                  <p>
                    A confirmation email will be sent to {selectedInterview.candidateEmail} with the following details:
                  </p>
                  <div className="bg-black/40 p-3 rounded-md border border-blue-500/20 mt-2">
                    <p className="text-white/80 text-sm">• Date: {formatDate(selectedInterview.date)}</p>
                    <p className="text-white/80 text-sm">• Time: {selectedInterview.time}</p>
                    <p className="text-white/80 text-sm">
                      • Location: {selectedInterview.isOnline 
                          ? "Remote (Microsoft Teams meeting link will be provided)" 
                          : selectedInterview.location || "Office Location"
                        }
                    </p>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/10">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmationComplete}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border border-blue-500/40"
            >
              <Mail size={16} className="mr-2" />
              Confirm & Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Schedule Interview Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-2 border-indigo-500/30 text-white max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Schedule New Interview</DialogTitle>
            <DialogDescription className="text-white/70">
              Fill in the details to schedule a new interview with a candidate.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...scheduleForm}>
            <form onSubmit={scheduleForm.handleSubmit(handleScheduleInterview)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={scheduleForm.control}
                  name="candidateName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter full name" 
                          {...field} 
                          className="bg-black/30 border-indigo-500/30 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={scheduleForm.control}
                  name="candidateEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter email address" 
                          {...field} 
                          className="bg-black/30 border-indigo-500/30 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={scheduleForm.control}
                  name="candidateRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Candidate Role</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. Frontend Developer" 
                          {...field} 
                          className="bg-black/30 border-indigo-500/30 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={scheduleForm.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Position</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter job title" 
                          {...field} 
                          className="bg-black/30 border-indigo-500/30 text-white placeholder:text-white/50"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={scheduleForm.control}
                name="interviewType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-black/30 border-indigo-500/30 text-white">
                          <SelectValue placeholder="Select interview type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 border-indigo-500/30 text-white">
                        <SelectItem value="Initial Screening">Initial Screening</SelectItem>
                        <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                        <SelectItem value="HR Interview">HR Interview</SelectItem>
                        <SelectItem value="Final Interview">Final Interview</SelectItem>
                        <SelectItem value="Portfolio Review">Portfolio Review</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={scheduleForm.control}
                name="locationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Interview Location</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="remote" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Remote (Microsoft Teams)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="office" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Office / In-person
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={scheduleForm.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Interview Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal border-indigo-500/30 bg-black/30 text-white",
                                !field.value && "text-white/50"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Select date</span>
                              )}
                              <Calendar className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-gray-800 border-indigo-500/30" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={scheduleForm.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interview Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="bg-black/30 border-indigo-500/30 text-white"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
              
              {watchLocationType === "remote" ? (
                <FormField
                  control={scheduleForm.control}
                  name="meetingLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Microsoft Teams Meeting Link</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                          <Input
                            {...field}
                            placeholder="https://teams.microsoft.com/l/meetup-join/..."
                            className="bg-black/30 border-indigo-500/30 text-white pl-10 placeholder:text-white/50"
                          />
                        </div>
                      </FormControl>
                      <FormDescription className="text-white/60">
                        Paste the Microsoft Teams meeting link here
                      </FormDescription>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={scheduleForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Office Location</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="e.g. Corporate HQ, Floor 4, Meeting Room B"
                          className="bg-black/30 border-indigo-500/30 text-white placeholder:text-white/50 min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              )}
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsScheduleDialogOpen(false)}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
                >
                  <Calendar size={16} className="mr-2" />
                  Schedule Interview
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Interviews;
