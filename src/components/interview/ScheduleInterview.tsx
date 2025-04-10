import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ScheduleInterviewProps {
  candidateId?: number;
  candidateName: string;
  companyName: string;
  position: string;
  interviewer?: {
    id: number;
    name: string;
    position: string;
    email: string;
  };
  onSchedule: (interviewData: any) => void;
  onClose?: () => void;
  isDialog?: boolean;
}

const ScheduleInterview = ({ 
  candidateId, 
  candidateName, 
  companyName,
  position,
  interviewer,
  onSchedule, 
  onClose, 
  isDialog = false 
}: ScheduleInterviewProps) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [meetingLink, setMeetingLink] = useState('');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast({
        title: "Date Required",
        description: "Please select an interview date",
        variant: "destructive"
      });
      return;
    }
    
    if (!time) {
      toast({
        title: "Time Required",
        description: "Please select an interview time",
        variant: "destructive"
      });
      return;
    }
    
    // Create the interview object
    const interviewData = {
      id: Math.floor(Math.random() * 10000),
      candidateId: candidateId || Math.floor(Math.random() * 10000),
      candidateName,
      company: companyName,
      position,
      date: format(date, 'yyyy-MM-dd'),
      time,
      duration: Number(duration),
      meetingLink: meetingLink || 'https://meet.google.com/' + Math.random().toString(36).substring(2, 10),
      notes,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
      interviewer: interviewer || {
        id: Math.floor(Math.random() * 1000),
        name: 'Hiring Manager',
        position: 'Technical Interviewer',
        email: `${companyName.toLowerCase().replace(/\s+/g, '.')}@example.com`
      }
    };

    // Save to localStorage
    const savedInterviews = localStorage.getItem('workwise-interviews');
    const interviews = savedInterviews ? JSON.parse(savedInterviews) : [];
    interviews.push(interviewData);
    localStorage.setItem('workwise-interviews', JSON.stringify(interviews));
    
    // Callback
    onSchedule(interviewData);
    
    // Show success message
    toast({
      title: "Interview Scheduled",
      description: `Interview with ${candidateName} scheduled for ${format(date, 'PPP')} at ${time}`,
    });
    
    // Close if in dialog mode
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={cn("bg-black/90 backdrop-blur-sm", isDialog ? "p-4 rounded-lg" : "p-6 rounded-xl border border-indigo-500/20 shadow-lg")}>
      {isDialog && (
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Schedule Interview</h2>
          {onClose && (
            <Button variant="ghost" onClick={onClose} className="text-white hover:bg-white/10 h-8 w-8 p-0">
              <X size={18} />
            </Button>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="candidate" className="text-white">Candidate</Label>
          <Input id="candidate" value={candidateName} disabled className="bg-gray-800/80 border-gray-700 text-white mt-1" />
        </div>
        
        <div>
          <Label htmlFor="company" className="text-white">Company</Label>
          <Input id="company" value={companyName} disabled className="bg-gray-800/80 border-gray-700 text-white mt-1" />
        </div>
        
        <div>
          <Label htmlFor="position" className="text-white">Position</Label>
          <Input id="position" value={position} disabled className="bg-gray-800/80 border-gray-700 text-white mt-1" />
        </div>
        
        <div>
          <Label htmlFor="date" className="text-white">Interview Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal mt-1",
                  !date && "text-muted-foreground",
                  "bg-gray-800/80 border-gray-700 text-white hover:bg-gray-700/80"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border border-gray-700">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className={cn("p-3 pointer-events-auto text-white")}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="time" className="text-white">Time</Label>
            <Select onValueChange={setTime} value={time}>
              <SelectTrigger id="time" className="bg-gray-800/80 border-gray-700 text-white mt-1">
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                {/* Generate time slots from 9 AM to 6 PM */}
                {Array.from({ length: 19 }, (_, i) => {
                  const hour = Math.floor(i / 2) + 9;
                  const minute = i % 2 === 0 ? '00' : '30';
                  const period = hour >= 12 ? 'PM' : 'AM';
                  const displayHour = hour > 12 ? hour - 12 : hour;
                  const timeSlot = `${displayHour}:${minute} ${period}`;
                  return (
                    <SelectItem key={timeSlot} value={timeSlot}>{timeSlot}</SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="duration" className="text-white">Duration (minutes)</Label>
            <Select onValueChange={setDuration} value={duration}>
              <SelectTrigger id="duration" className="bg-gray-800/80 border-gray-700 text-white mt-1">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border border-gray-700 text-white">
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">60 minutes</SelectItem>
                <SelectItem value="90">90 minutes</SelectItem>
                <SelectItem value="120">120 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <Label htmlFor="meetingLink" className="text-white">Meeting Link (optional)</Label>
          <Input 
            id="meetingLink" 
            placeholder="https://meet.google.com/..." 
            value={meetingLink} 
            onChange={(e) => setMeetingLink(e.target.value)} 
            className="bg-gray-800/80 border-gray-700 text-white mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="notes" className="text-white">Notes (optional)</Label>
          <Input 
            id="notes" 
            placeholder="Any additional notes..." 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            className="bg-gray-800/80 border-gray-700 text-white mt-1"
          />
        </div>
        
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
          Schedule Interview
        </Button>
      </form>
    </div>
  );
};

export default ScheduleInterview;
