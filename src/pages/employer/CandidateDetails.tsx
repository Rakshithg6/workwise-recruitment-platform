import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, MapPin, Briefcase, Calendar, Phone } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { InterviewScheduleDialog } from '@/components/dialogs/InterviewScheduleDialog';

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  experience: string;
  location: string;
  status: string;
  appliedDate: string;
  skills: string[];
}

const candidatesData = {
  1: {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    role: 'Senior Frontend Developer',
    experience: '7 years',
    location: 'Bangalore, India',
    status: 'Applied',
    appliedDate: '2 days ago',
    skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'TailwindCSS']
  },
  2: {
    id: 2,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'Backend Engineer',
    experience: '5 years',
    location: 'Mumbai, India',
    status: 'Interview',
    appliedDate: '3 days ago',
    skills: ['Node.js', 'Python', 'MongoDB', 'Docker', 'AWS']
  },
  3: {
    id: 3,
    name: 'Vikram Singh',
    email: 'vikram.singh@example.com',
    role: 'Full Stack Developer',
    experience: '4 years',
    location: 'Delhi, India',
    status: 'New',
    appliedDate: '1 day ago',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Redis']
  },
  4: {
    id: 4,
    name: 'Ananya Gupta',
    email: 'ananya.gupta@example.com',
    role: 'UI/UX Designer',
    experience: '6 years',
    location: 'Hyderabad, India',
    status: 'Shortlisted',
    appliedDate: '4 hours ago',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research', 'Prototyping']
  }
};

const STORAGE_KEY = 'workwise_interviews';

const CandidateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [existingInterview, setExistingInterview] = useState<any>(null);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);

  useEffect(() => {
    // Get candidate data based on ID
    const candidateId = Number(id);
    const foundCandidate = candidatesData[candidateId as keyof typeof candidatesData];
    setCandidate(foundCandidate || null);

    // Check if interview already exists
    const savedInterviews = localStorage.getItem(STORAGE_KEY);
    if (savedInterviews) {
      const interviews = JSON.parse(savedInterviews);
      const interview = interviews.find((i: any) => 
        i.candidateEmail === foundCandidate?.email && 
        i.status !== 'Rejected'
      );
      setExistingInterview(interview || null);
    }
  }, [id]);

  if (!candidate) {
    return (
      <DashboardLayout type="employer">
        <div className="p-6">
          <Button
            variant="ghost"
            className="mb-6 text-white/70 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-center text-white/70">
            Candidate not found
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="employer">
      <div className="p-6">
        <Button
          variant="ghost"
          className="mb-6 text-white/70 hover:text-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold text-white mb-4">{candidate.name}</h1>
                <div className="space-y-2">
                  <div className="flex items-center text-white/70">
                    <Briefcase className="h-4 w-4 mr-2" />
                    <span>{candidate.role}</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Applied {candidate.appliedDate}</span>
                  </div>
                  <div className="flex items-center text-white/70">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>{candidate.email}</span>
                  </div>
                </div>
              </div>
              <div>
                <span className="text-sm font-medium px-3 py-1 bg-primary/20 text-primary rounded-full">
                  {candidate.status}
                </span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-900/50 border border-white/10 rounded-lg p-6">
            <h2 className="text-lg font-medium text-white mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 mt-6">
            <Button 
              variant="outline"
              className="border border-gray-600 hover:bg-gray-800 text-white px-6 py-2 flex items-center"
              onClick={() => setShowContactDialog(true)}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Details
            </Button>

            {/* Contact Details Dialog */}
            <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
              <DialogContent className="bg-gray-900 text-white">
                <DialogHeader>
                  <DialogTitle>Contact Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-white/70">Email:</span>
                    <span>{candidate?.name}@example.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-white/70">Phone:</span>
                    <span>+91 {Math.floor(1000000000 + Math.random() * 9000000000)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-white/70">Location:</span>
                    <span>{candidate?.location}</span>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {existingInterview ? (
              <Button
                variant="outline"
                className="border border-gray-600 hover:bg-gray-800 text-white px-6 py-2 flex items-center"
                onClick={() => navigate('/employer/interviews')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                View Interview Details
              </Button>
            ) : (
              <Button
                variant="outline"
                className="border border-gray-600 hover:bg-gray-800 text-white px-6 py-2 flex items-center"
                onClick={() => setShowInterviewDialog(true)}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            )}
          </div>

          {/* Interview Schedule Dialog */}
          {candidate && !existingInterview && (
            <InterviewScheduleDialog
              open={showInterviewDialog}
              onClose={() => setShowInterviewDialog(false)}
              candidate={{
                id: candidate.id,
                name: candidate.name,
                email: candidate.email
              }}
              onSchedule={(interviewDetails) => {
                // Get existing interviews
                const savedInterviews = localStorage.getItem(STORAGE_KEY);
                const interviews = savedInterviews ? JSON.parse(savedInterviews) : [];
                
                // Create new interview
                const newInterview = {
                  id: interviews.length + 1,
                  candidateName: candidate.name,
                  candidateRole: candidate.role,
                  jobTitle: candidate.role,
                  interviewType: 'Initial Interview',
                  date: interviewDetails.date,
                  time: interviewDetails.time,
                  status: 'Scheduled',
                  isOnline: interviewDetails.type === 'remote',
                  location: interviewDetails.type === 'offline' ? interviewDetails.location : undefined,
                  meetingLink: interviewDetails.type === 'remote' ? interviewDetails.location : undefined,
                  candidateEmail: candidate.email
                };
                
                // Save to localStorage
                localStorage.setItem(STORAGE_KEY, JSON.stringify([...interviews, newInterview]));
                
                // Show success message and close dialog
                toast({
                  title: 'Interview Scheduled',
                  description: `Interview scheduled with ${candidate.name} for ${interviewDetails.date} at ${interviewDetails.time}`
                });
                setShowInterviewDialog(false);
                setExistingInterview(newInterview);
              }}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateDetails;
