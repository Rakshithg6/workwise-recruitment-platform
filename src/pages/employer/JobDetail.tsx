
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Edit, Users, Calendar, BarChart, CheckCircle, XCircle, Clock,
  MapPin, BriefcaseIcon, Banknote, Building, User
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import CandidateProfileDialog from '@/components/dialogs/CandidateProfileDialog';
import ScheduleInterviewDialog from '@/components/dialogs/ScheduleInterviewDialog';

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  description: string;
  requirements: string[];
  qualifications: string[];
  salaryRange: string;
  applicants: number;
  status: 'Active' | 'Paused' | 'Closed';
  postedDate: string;
  companyName?: string;
  jobType: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const APPLICANT_STATUS = ['Pending', 'Reviewed', 'Interview', 'Hired', 'Rejected'];

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Dialog states
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Mock data for analytics
  const [viewData] = useState([
    { name: 'Mon', views: 15 },
    { name: 'Tue', views: 20 },
    { name: 'Wed', views: 25 },
    { name: 'Thu', views: 30 },
    { name: 'Fri', views: 22 },
    { name: 'Sat', views: 18 },
    { name: 'Sun', views: 16 },
  ]);

  const [applicantsData] = useState([
    { name: 'Pending', value: 15 },
    { name: 'Reviewed', value: 10 },
    { name: 'Interview', value: 5 },
    { name: 'Hired', value: 3 },
    { name: 'Rejected', value: 7 },
  ]);

  const [applicantsByDay] = useState([
    { name: 'Mon', count: 2 },
    { name: 'Tue', count: 5 },
    { name: 'Wed', count: 3 },
    { name: 'Thu', count: 7 },
    { name: 'Fri', count: 4 },
    { name: 'Sat', count: 1 },
    { name: 'Sun', count: 1 },
  ]);

  // Filtered applicants data based on job role
  const [applicants, setApplicants] = useState<any[]>([
    { 
      id: 1, 
      name: 'Rahul Sharma', 
      role: 'Senior Frontend Developer',
      experience: '7 years', 
      applied: '2 days ago', 
      status: 'Pending',
      match: '92%',
      photo: null,
      email: 'rahul.sharma@example.com',
      phone: '+91 9876543210'
    },
    { 
      id: 2, 
      name: 'Priya Patel', 
      role: 'Backend Engineer',
      experience: '5 years', 
      applied: '3 days ago', 
      status: 'Interview',
      match: '87%',
      photo: null,
      email: 'priya.patel@example.com',
      phone: '+91 9876543211'
    },
    { 
      id: 3, 
      name: 'Vikram Singh', 
      role: 'Full Stack Developer',
      experience: '4 years', 
      applied: '1 day ago', 
      status: 'Reviewed',
      match: '78%',
      photo: null,
      email: 'vikram.singh@example.com',
      phone: '+91 9876543212'
    },
    { 
      id: 4, 
      name: 'Ananya Gupta', 
      role: 'UI/UX Designer',
      experience: '6 years', 
      applied: '4 hours ago', 
      status: 'Pending',
      match: '95%',
      photo: null,
      email: 'ananya.gupta@example.com',
      phone: '+91 9876543213'
    },
  ]);

  // Fetch job data - for now using mock data
  // Load and filter applicants based on job role
  useEffect(() => {
    const savedApplicants = localStorage.getItem('workwise-applicants');
    let allApplicants = [];
    
    if (savedApplicants) {
      try {
        allApplicants = JSON.parse(savedApplicants);
      } catch (e) {
        console.error('Failed to parse applicants:', e);
      }
    } else {
      // Default mock data if no saved applicants
      allApplicants = [
        { 
          id: 1, 
          name: 'Rahul Sharma',
          jobId: '1', 
          role: 'Senior Frontend Developer',
          experience: '7 years', 
          applied: '2 days ago', 
          status: 'Pending',
          match: '92%',
          photo: null,
          email: 'rahul.sharma@example.com',
          phone: '+91 9876543210'
        },
        { 
          id: 2, 
          name: 'Priya Patel',
          jobId: '2', 
          role: 'Backend Engineer',
          experience: '5 years', 
          applied: '3 days ago', 
          status: 'Interview',
          match: '87%',
          photo: null,
          email: 'priya.patel@example.com',
          phone: '+91 9876543211'
        },
        { 
          id: 3, 
          name: 'Vikram Singh',
          jobId: '1', 
          role: 'Full Stack Developer',
          experience: '4 years', 
          applied: '1 day ago', 
          status: 'Reviewed',
          match: '78%',
          photo: null,
          email: 'vikram.singh@example.com',
          phone: '+91 9876543212'
        },
        { 
          id: 4, 
          name: 'Ananya Gupta',
          jobId: '2', 
          role: 'UI/UX Designer',
          experience: '6 years', 
          applied: '4 hours ago', 
          status: 'Pending',
          match: '95%',
          photo: null,
          email: 'ananya.gupta@example.com',
          phone: '+91 9876543213'
        },
      ];
      localStorage.setItem('workwise-applicants', JSON.stringify(allApplicants));
    }
    
    // Filter applicants for this specific job
    const jobApplicants = allApplicants.filter((applicant: any) => applicant.jobId === id);
    setApplicants(jobApplicants);
  }, [id]);

  useEffect(() => {
    // In a real app, this would be an API call
    // For now, let's simulate loading job data
    const fetchJob = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        // Get saved jobs from localStorage or use default
        const savedJobs = localStorage.getItem('workwise-job-listings');
        let jobsList = [];
        
        if (savedJobs) {
          try {
            jobsList = JSON.parse(savedJobs);
          } catch (e) {
            console.error('Failed to parse saved jobs:', e);
          }
        }
        
        // Find the job by ID
        const foundJob = jobsList.find((j: any) => j.id.toString() === id);
        
        if (foundJob) {
          // Add some mock data that might not be in the saved job
          setJob({
            ...foundJob,
            description: foundJob.description || "This is a job description for the position. The role involves working with our team to deliver high-quality products.",
            requirements: foundJob.requirements || ["3+ years of experience", "Strong communication skills", "Team player"],
            qualifications: foundJob.qualifications || ["Bachelor's degree in related field", "Certifications are a plus"],
            jobType: foundJob.jobType || "Full-time",
            companyName: foundJob.companyName || localStorage.getItem('workwise-user-companyName') || "Your Company"
          });
        } else {
          toast({
            title: "Job not found",
            description: "The job you're looking for doesn't exist or has been removed.",
            variant: "destructive"
          });
          navigate('/employer/jobs');
        }
        
        setIsLoading(false);
      }, 600);
    };
    
    fetchJob();
  }, [id, navigate]);

  const handleUpdateStatus = (newStatus: 'Active' | 'Paused' | 'Closed') => {
    if (!job) return;
    
    // Update job locally
    const updatedJob = { ...job, status: newStatus };
    setJob(updatedJob);
    
    // In a real app, this would be an API call
    // For now, update in localStorage
    const savedJobs = localStorage.getItem('workwise-job-listings');
    
    if (savedJobs) {
      try {
        const jobsList = JSON.parse(savedJobs);
        const updatedJobs = jobsList.map((j: any) => 
          j.id.toString() === id ? { ...j, status: newStatus } : j
        );
        
        localStorage.setItem('workwise-job-listings', JSON.stringify(updatedJobs));
        
        toast({
          title: "Status Updated",
          description: `Job status has been updated to ${newStatus}.`
        });
      } catch (e) {
        console.error('Failed to update job status:', e);
        toast({
          title: "Update Failed",
          description: "There was an error updating the job status.",
          variant: "destructive"
        });
      }
    }
  };

  const handleUpdateJob = () => {
    if (!job) return;
    
    // In a real app, this would be an API call to update the job
    // For now, we'll just update localStorage
    const savedJobs = localStorage.getItem('workwise-job-listings');
    
    if (savedJobs) {
      try {
        const jobsList = JSON.parse(savedJobs);
        const updatedJobs = jobsList.map((j: any) => 
          j.id.toString() === id ? job : j
        );
        
        localStorage.setItem('workwise-job-listings', JSON.stringify(updatedJobs));
        
        toast({
          title: "Job Updated",
          description: "Job details have been successfully updated."
        });
        
        setIsEditing(false);
      } catch (e) {
        console.error('Failed to update job:', e);
        toast({
          title: "Update Failed",
          description: "There was an error updating the job.",
          variant: "destructive"
        });
      }
    }
  };

  // Handle viewing a candidate's profile
  const handleViewCandidateProfile = (candidateId: number) => {
    const candidate = applicants.find(a => a.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsProfileDialogOpen(true);
    }
  };

  // Handle scheduling an interview
  const handleScheduleInterviewClick = (candidateId: number) => {
    const candidate = applicants.find(a => a.id === candidateId);
    if (candidate) {
      setSelectedCandidate(candidate);
      setIsInterviewDialogOpen(true);
    }
  };

  // Handle completing the interview scheduling
  const handleInterviewScheduled = (interviewData: any) => {
    // Save to localStorage for the candidate list
    const savedInterviews = localStorage.getItem('workwise-interviews');
    let interviews = [];
    
    if (savedInterviews) {
      try {
        interviews = JSON.parse(savedInterviews);
      } catch (e) {
        console.error('Failed to parse saved interviews:', e);
      }
    }
    
    interviews.push(interviewData);
    localStorage.setItem('workwise-interviews', JSON.stringify(interviews));
    
    setIsInterviewDialogOpen(false);
    
    // Show success message
    toast({
      title: "Interview Scheduled",
      description: "The interview has been scheduled successfully."
    });
  };

  const handleUpdateApplicantStatus = (candidateId: number, newStatus: string) => {
    toast({
      title: "Status Updated",
      description: `Applicant status has been updated to ${newStatus}.`
    });
  };

  if (isLoading || !job) {
    return (
      <DashboardLayout type="employer">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/employer/jobs')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Job Listings
            </Button>
          </div>
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 w-48 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout type="employer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/employer/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-white">Job Details</h1>
          </div>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Edit size={16} className="mr-2" />
              Edit Job
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="border-indigo-500/30 text-white hover:bg-indigo-600/20"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateJob}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-gray-800/90 to-black/90 rounded-xl border border-indigo-500/20 p-6 backdrop-blur-sm shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {isEditing ? (
                  <input 
                    type="text" 
                    value={job.title} 
                    onChange={(e) => setJob({...job, title: e.target.value})}
                    className="bg-gray-700/70 border border-white/20 rounded-lg text-white p-2 focus:outline-none focus:ring-1 focus:ring-primary/30 w-full"
                  />
                ) : (
                  job.title
                )}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Building size={16} />
                  <span>{job.companyName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={job.location} 
                      onChange={(e) => setJob({...job, location: e.target.value})}
                      className="bg-gray-700/70 border border-white/20 rounded-lg text-white p-1 focus:outline-none focus:ring-1 focus:ring-primary/30 w-40"
                    />
                  ) : (
                    <span>{job.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <BriefcaseIcon size={16} />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={job.jobType} 
                      onChange={(e) => setJob({...job, jobType: e.target.value})}
                      className="bg-gray-700/70 border border-white/20 rounded-lg text-white p-1 focus:outline-none focus:ring-1 focus:ring-primary/30 w-32"
                    />
                  ) : (
                    <span>{job.jobType}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Banknote size={16} />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={job.salaryRange} 
                      onChange={(e) => setJob({...job, salaryRange: e.target.value})}
                      className="bg-gray-700/70 border border-white/20 rounded-lg text-white p-1 focus:outline-none focus:ring-1 focus:ring-primary/30 w-32"
                    />
                  ) : (
                    <span>{job.salaryRange}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className={`px-3 py-1 h-auto rounded-full border ${
                  job.status === 'Active' ? 'border-green-500 text-green-400' :
                  job.status === 'Paused' ? 'border-yellow-500 text-yellow-400' :
                  'border-red-500 text-red-400'
                }`}
                onClick={() => {
                  const statuses: ('Active' | 'Paused' | 'Closed')[] = ['Active', 'Paused', 'Closed'];
                  const currentIndex = statuses.indexOf(job.status);
                  const nextIndex = (currentIndex + 1) % statuses.length;
                  handleUpdateStatus(statuses[nextIndex]);
                }}
              >
                {job.status === 'Active' ? (
                  <CheckCircle size={16} className="mr-1 text-green-400" />
                ) : job.status === 'Paused' ? (
                  <Clock size={16} className="mr-1 text-yellow-400" />
                ) : (
                  <XCircle size={16} className="mr-1 text-red-400" />
                )}
                {job.status}
              </Button>
              
              <div className="flex items-center gap-1 bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full">
                <Users size={16} />
                <span>{job.applicants} applicants</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-gray-900/80 border border-white/10">
              <TabsTrigger value="details" className="data-[state=active]:bg-indigo-600/30">
                Details
              </TabsTrigger>
              <TabsTrigger value="applications" className="data-[state=active]:bg-indigo-600/30">
                Applications ({applicants.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600/30">
                Analytics
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="mt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
                  {isEditing ? (
                    <textarea
                      value={job.description}
                      onChange={(e) => setJob({...job, description: e.target.value})}
                      className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-3 focus:outline-none focus:ring-1 focus:ring-primary/30 min-h-[150px]"
                    />
                  ) : (
                    <p className="text-white/80">{job.description}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Requirements</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            value={req}
                            onChange={(e) => {
                              const newRequirements = [...job.requirements];
                              newRequirements[index] = e.target.value;
                              setJob({...job, requirements: newRequirements});
                            }}
                            className="flex-1 bg-gray-700/70 border border-white/20 rounded-lg text-white p-2 focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newRequirements = job.requirements.filter((_, i) => i !== index);
                              setJob({...job, requirements: newRequirements});
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <XCircle size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setJob({...job, requirements: [...job.requirements, ""]});
                        }}
                        className="mt-2 border-indigo-500/30 text-white hover:bg-indigo-600/20"
                      >
                        Add Requirement
                      </Button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-white/80">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  )}
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Qualifications</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      {job.qualifications.map((qual, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            value={qual}
                            onChange={(e) => {
                              const newQualifications = [...job.qualifications];
                              newQualifications[index] = e.target.value;
                              setJob({...job, qualifications: newQualifications});
                            }}
                            className="flex-1 bg-gray-700/70 border border-white/20 rounded-lg text-white p-2 focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newQualifications = job.qualifications.filter((_, i) => i !== index);
                              setJob({...job, qualifications: newQualifications});
                            }}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <XCircle size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setJob({...job, qualifications: [...job.qualifications, ""]});
                        }}
                        className="mt-2 border-indigo-500/30 text-white hover:bg-indigo-600/20"
                      >
                        Add Qualification
                      </Button>
                    </div>
                  ) : (
                    <ul className="list-disc list-inside space-y-1 text-white/80">
                      {job.qualifications.map((qual, index) => (
                        <li key={index}>{qual}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="mt-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-indigo-500/20 bg-black/30">
                      <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Candidate</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Applied</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Match</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-white/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applicants.map((applicant) => (
                      <tr key={applicant.id} className="border-b border-indigo-500/20 hover:bg-indigo-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-600/20 flex items-center justify-center">
                              {applicant.photo ? (
                                <img src={applicant.photo} alt={applicant.name} className="h-10 w-10 rounded-full object-cover" />
                              ) : (
                                <User size={18} className="text-indigo-400" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-white">{applicant.name}</div>
                              <div className="text-sm text-white/70">{applicant.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                          <div className="flex items-center gap-1">
                            <Clock size={14} className="text-white/70" />
                            {applicant.applied}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <select
                            value={applicant.status}
                            onChange={(e) => handleUpdateApplicantStatus(applicant.id, e.target.value)}
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              applicant.status === 'Pending' ? 'bg-gray-900/30 text-white border-white/20' :
                              applicant.status === 'Reviewed' ? 'bg-blue-900/30 text-blue-400 border-blue-500/30' :
                              applicant.status === 'Interview' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30' :
                              applicant.status === 'Hired' ? 'bg-green-900/30 text-green-400 border-green-500/30' :
                              'bg-red-900/30 text-red-400 border-red-500/30'
                            } bg-transparent appearance-none cursor-pointer`}
                          >
                            {APPLICANT_STATUS.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-400">
                            {applicant.match}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-indigo-500/30 text-white hover:bg-indigo-600/20"
                              onClick={() => handleViewCandidateProfile(applicant.id)}
                            >
                              View
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              onClick={() => handleScheduleInterviewClick(applicant.id)}
                            >
                              <Calendar size={14} className="mr-1" />
                              Interview
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/60 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">Job Views (Last 7 days)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={viewData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: 'white' }} />
                      <Area type="monotone" dataKey="views" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center text-white/70">
                    <p className="text-sm">Total Views: {viewData.reduce((sum, item) => sum + item.views, 0)}</p>
                  </div>
                </div>
                
                <div className="bg-black/60 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">Applicant Status</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={applicantsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {applicantsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: 'white' }} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="bg-black/60 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">Applications Received (Last 7 days)</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <RechartsBarChart data={applicantsByDay}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: 'white' }} />
                      <Bar dataKey="count" fill="#00C49F" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                  <div className="mt-4 text-center text-white/70">
                    <p className="text-sm">Total Applications: {applicantsByDay.reduce((sum, item) => sum + item.count, 0)}</p>
                  </div>
                </div>
                
                <div className="bg-black/60 rounded-xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold mb-4 text-white">Key Metrics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/70">Total Applicants</span>
                      <span className="font-medium text-white">{job.applicants}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/70">Average Time to Apply</span>
                      <span className="font-medium text-white">3.2 days</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/70">Applicants in Pipeline</span>
                      <span className="font-medium text-white">{
                        applicantsData.reduce((sum, item) => {
                          if (['Pending', 'Reviewed', 'Interview'].includes(item.name)) {
                            return sum + item.value;
                          }
                          return sum;
                        }, 0)
                      }</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-white/10">
                      <span className="text-white/70">Conversion Rate</span>
                      <span className="font-medium text-white">
                        {Math.round((applicantsData.find(i => i.name === 'Hired')?.value || 0) / job.applicants * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button 
                      onClick={() => navigate('/employer/analytics')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <BarChart size={16} className="mr-2" />
                      View Detailed Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Candidate Profile Dialog */}
      {selectedCandidate && (
        <CandidateProfileDialog 
          isOpen={isProfileDialogOpen}
          candidate={selectedCandidate}
          onScheduleInterview={handleScheduleInterviewClick}
          onClose={() => setIsProfileDialogOpen(false)}
        />
      )}

      {/* Schedule Interview Dialog */}
      {selectedCandidate && (
        <ScheduleInterviewDialog
          isOpen={isInterviewDialogOpen}
          candidateId={selectedCandidate.id}
          candidateName={selectedCandidate.name}
          onSchedule={handleInterviewScheduled}
          onClose={() => setIsInterviewDialogOpen(false)}
        />
      )}
    </DashboardLayout>
  );
};

export default JobDetail;
