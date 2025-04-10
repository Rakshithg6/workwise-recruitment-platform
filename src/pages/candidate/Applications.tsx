import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, CheckCircle, XCircle, AlertCircle, 
  FileText, Building, Calendar, MapPin, Video,
  Globe, Briefcase as BriefcaseIcon, Banknote
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

const Applications = () => {
  useEffect(() => {
    document.title = 'My Applications | WorkWise';
  }, []);

  // State for job details dialog
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  
  // State for interview details dialog
  const [isInterviewDetailsOpen, setIsInterviewDetailsOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

  const applications = [
    {
      id: 1,
      company: "TCS",
      role: "Senior Frontend Developer",
      location: "Bangalore",
      appliedDate: "2023-05-01",
      status: "Interview Scheduled",
      statusType: "progress", // progress, success, rejected, pending
      nextStep: "Interview on May 15, 2023",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/2560px-Tata_Consultancy_Services_Logo.svg.png",
      description: "We are looking for a Senior Frontend Developer with 5+ years of experience in React.js. You will be responsible for building high-performance user interfaces for our digital transformation projects.",
      requirements: [
        "5+ years of experience with React.js",
        "Strong knowledge of JavaScript, HTML5, and CSS3",
        "Experience with responsive design",
        "Familiarity with RESTful APIs"
      ],
      salary: "₹25-35 LPA",
      jobType: "Full-time",
      interview: {
        date: "May 15, 2023",
        time: "2:00 PM",
        type: "Remote",
        platform: "Microsoft Teams",
        link: "https://teams.microsoft.com/meeting/join-123",
        interviewers: ["Rajesh Kumar (Technical Lead)", "Priya Singh (HR)"]
      }
    },
    {
      id: 2,
      company: "Infosys",
      role: "UI/UX Developer",
      location: "Hyderabad",
      appliedDate: "2023-04-25",
      status: "Application Accepted",
      statusType: "success",
      nextStep: "Waiting for interview scheduling",
      companyLogo: "https://www.infosys.com/content/dam/infosys-web/en/global-resource/media-resources/infosys-nyn-tagline-png.png",
      description: "Join our UI/UX team to design intuitive and engaging user experiences for our enterprise clients. You'll work closely with product managers and developers to create beautiful and functional interfaces.",
      requirements: [
        "3+ years of UI/UX design experience",
        "Proficiency in Figma and Adobe Creative Suite",
        "Portfolio showcasing UI/UX projects",
        "Knowledge of design systems"
      ],
      salary: "₹18-25 LPA",
      jobType: "Full-time"
    },
    {
      id: 3,
      company: "Wipro",
      role: "Frontend Engineer",
      location: "Pune",
      appliedDate: "2023-04-20",
      status: "Application Rejected",
      statusType: "rejected",
      nextStep: null,
      companyLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhhklAWlfkA3Lgl6oZK79mCKp94jJvTSLB-UPUMJy2wMLz7FvF",
      description: "As a Frontend Engineer at Wipro, you'll be part of our digital transformation team working on cutting-edge web applications for global clients.",
      requirements: [
        "Experience with React.js and modern JavaScript frameworks",
        "Strong CSS skills and responsive design experience",
        "Knowledge of state management libraries",
        "Experience with testing frameworks"
      ],
      salary: "₹15-22 LPA",
      jobType: "Full-time"
    },
    {
      id: 4,
      company: "HCL",
      role: "React Developer",
      location: "Noida",
      appliedDate: "2023-05-05",
      status: "Under Review",
      statusType: "pending",
      nextStep: "Application being reviewed",
      companyLogo: "https://www.hcltech.com/sites/default/files/images/special-pages/supercharging-progress/HCLTech_logo.png",
      description: "We're seeking a React Developer to join our growing frontend team. You'll be responsible for building and maintaining React applications for our enterprise clients.",
      requirements: [
        "3+ years of experience with React.js",
        "Strong knowledge of JavaScript and TypeScript",
        "Experience with RESTful APIs",
        "Knowledge of responsive design principles"
      ],
      salary: "₹16-24 LPA",
      jobType: "Full-time"
    },
    {
      id: 5,
      company: "Tech Mahindra",
      role: "Frontend Team Lead",
      location: "Chennai",
      appliedDate: "2023-04-28",
      status: "Initial Screening",
      statusType: "progress",
      nextStep: "Technical assessment to be scheduled",
      companyLogo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqsw6WSoJZ_ytUWR4HjjG4QJhXyYV3SHpbBL6sKwjQ",
      description: "As a Frontend Team Lead, you'll guide a team of developers and ensure the delivery of high-quality frontend solutions for our clients.",
      requirements: [
        "7+ years of frontend development experience",
        "3+ years in a team lead role",
        "Strong knowledge of React.js and modern JavaScript",
        "Experience with Agile methodologies"
      ],
      salary: "₹30-40 LPA",
      jobType: "Full-time",
      interview: {
        date: "May 18, 2023",
        time: "11:30 AM",
        type: "On-site",
        location: "Tech Mahindra Chennai Office, Sholinganallur",
        address: "Tech Mahindra Ltd, SEZ, Block 1, Plot No. 17A/18, ELCOT IT Park, Sholinganallur, Chennai - 600119",
        interviewers: ["Vikram Mehta (Engineering Manager)", "Anjali Desai (Senior Developer)"]
      }
    },
  ];

  const getStatusIcon = (statusType: string) => {
    switch (statusType) {
      case 'success':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={18} className="text-red-500" />;
      case 'progress':
        return <Clock size={18} className="text-yellow-500" />;
      case 'pending':
        return <AlertCircle size={18} className="text-blue-500" />;
      default:
        return <AlertCircle size={18} className="text-white" />;
    }
  };
  
  const handleViewJob = (job: any) => {
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };
  
  const handleViewInterview = (job: any) => {
    setSelectedInterview(job);
    setIsInterviewDetailsOpen(true);
  };

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'success': return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'rejected': return 'bg-red-500/10 border-red-500/30 text-red-500';
      case 'progress': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      case 'pending': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
      default: return 'bg-white/10 border-white/30 text-white';
    }
  };

  return (
    <DashboardLayout type="candidate">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">My Applications</h1>
        <p className="text-white/70">Track and manage your job applications</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {applications.length > 0 ? (
          applications.map((app) => (
            <div 
              key={app.id} 
              className="bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{app.role}</h3>
                    <div className="flex items-center mt-1">
                      <Building size={16} className="text-white/70 mr-1" />
                      <span className="text-white/70 mr-4">{app.company}</span>
                      <MapPin size={16} className="text-white/70 mr-1" />
                      <span className="text-white/70">{app.location}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className={`flex items-center px-3 py-1.5 rounded-full ${getStatusColor(app.statusType)}`}>
                    {getStatusIcon(app.statusType)}
                    <span className="ml-2 font-medium text-sm">
                      {app.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-t border-white/10 pt-4 mt-4">
                <div className="flex items-center">
                  <Calendar size={16} className="text-white/70 mr-1" />
                  <span className="text-white/70">Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                </div>
                <div className="mt-3 md:mt-0 flex gap-2">
                  {app.statusType !== 'rejected' && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="gap-1 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 hover:from-indigo-500/30 hover:to-indigo-600/30 border border-indigo-500/30 text-white"
                      onClick={() => handleViewJob(app)}
                    >
                      <FileText size={14} />
                      View Job
                    </Button>
                  )}
                  
                  {app.statusType === 'progress' && app.interview && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-900/50"
                      onClick={() => handleViewInterview(app)}
                    >
                      <Calendar size={14} />
                      View Interview
                    </Button>
                  )}
                </div>
              </div>
              
              {app.nextStep && (
                <div className="mt-4 bg-white/5 p-3 rounded border border-white/10">
                  <p className="text-white/90 text-sm">
                    <span className="font-medium text-white">Next Step:</span> {app.nextStep}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm p-8 text-center">
            <FileText size={48} className="mx-auto text-white/30 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Applications Yet</h3>
            <p className="text-white/70 mb-6">Start applying for jobs to track your applications here</p>
            <Link to="/jobs">
              <Button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium">
                Browse Jobs
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Job Details Dialog */}
      <Dialog open={isJobDetailsOpen} onOpenChange={setIsJobDetailsOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-primary/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-3">
              <span>{selectedJob?.role} at {selectedJob?.company}</span>
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Complete job details for your application
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Job Overview */}
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-lg font-medium mb-3 text-white">Job Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <Building className="text-blue-400 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-white">Company</p>
                    <p className="text-white/70">{selectedJob?.company}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="text-blue-400 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p className="text-white/70">{selectedJob?.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Banknote className="text-blue-400 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-white">Salary</p>
                    <p className="text-white/70">{selectedJob?.salary}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <BriefcaseIcon className="text-blue-400 mt-0.5" size={16} />
                  <div>
                    <p className="font-medium text-white">Job Type</p>
                    <p className="text-white/70">{selectedJob?.jobType}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-white">Job Description</h3>
              <p className="text-white/80 mb-4">{selectedJob?.description}</p>
            </div>
            
            {/* Requirements */}
            {selectedJob?.requirements && (
              <div>
                <h3 className="text-lg font-medium mb-3 text-white">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-white/80">
                  {selectedJob?.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Application Status */}
            <div className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-lg font-medium mb-3 text-white">Application Status</h3>
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(selectedJob?.statusType)}
                <span className={`font-medium ${
                  selectedJob?.statusType === 'success' ? 'text-green-500' : 
                  selectedJob?.statusType === 'rejected' ? 'text-red-500' : 
                  selectedJob?.statusType === 'progress' ? 'text-yellow-500' : 
                  'text-blue-500'
                }`}>
                  {selectedJob?.status}
                </span>
              </div>
              {selectedJob?.nextStep && (
                <p className="text-white/80">
                  <span className="font-medium">Next Step:</span> {selectedJob?.nextStep}
                </p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsJobDetailsOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={() => {
                setIsJobDetailsOpen(false);
                if (selectedJob?.interview) {
                  handleViewInterview(selectedJob);
                }
              }}
              disabled={!selectedJob?.interview}
            >
              {selectedJob?.interview ? "View Interview Details" : "No Interview Scheduled"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interview Details Dialog */}
      <Dialog open={isInterviewDetailsOpen} onOpenChange={setIsInterviewDetailsOpen}>
        <DialogContent className="bg-gradient-to-b from-gray-800 to-black border-blue-500/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Interview Details</DialogTitle>
            <DialogDescription className="text-white/70">
              Your scheduled interview for {selectedInterview?.role} at {selectedInterview?.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Interview Information */}
            <div className="bg-blue-500/10 rounded-lg p-5 border border-blue-500/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <Calendar className="text-blue-400 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-white">Date</p>
                    <p className="text-white/80">{selectedInterview?.interview?.date}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="text-blue-400 mt-0.5" size={18} />
                  <div>
                    <p className="font-medium text-white">Time</p>
                    <p className="text-white/80">{selectedInterview?.interview?.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  {selectedInterview?.interview?.type === "Remote" ? (
                    <Video className="text-blue-400 mt-0.5" size={18} />
                  ) : (
                    <MapPin className="text-blue-400 mt-0.5" size={18} />
                  )}
                  <div>
                    <p className="font-medium text-white">Interview Type</p>
                    <p className="text-white/80">{selectedInterview?.interview?.type}</p>
                  </div>
                </div>
                {selectedInterview?.interview?.type === "Remote" ? (
                  <div className="flex items-start gap-2">
                    <Globe className="text-blue-400 mt-0.5" size={18} />
                    <div>
                      <p className="font-medium text-white">Platform</p>
                      <p className="text-white/80">{selectedInterview?.interview?.platform}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <Building className="text-blue-400 mt-0.5" size={18} />
                    <div>
                      <p className="font-medium text-white">Location</p>
                      <p className="text-white/80">{selectedInterview?.interview?.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Additional Details */}
            {selectedInterview?.interview?.type === "Remote" && selectedInterview?.interview?.link && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Meeting Link</h3>
                <a 
                  href={selectedInterview?.interview?.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:underline break-all"
                >
                  {selectedInterview?.interview?.link}
                </a>
              </div>
            )}
            
            {selectedInterview?.interview?.type === "On-site" && selectedInterview?.interview?.address && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Office Address</h3>
                <p className="text-white/80">{selectedInterview?.interview?.address}</p>
              </div>
            )}
            
            {selectedInterview?.interview?.interviewers && (
              <div>
                <h3 className="text-lg font-medium mb-2 text-white">Interviewers</h3>
                <ul className="list-disc pl-5 space-y-1 text-white/80">
                  {selectedInterview?.interview?.interviewers.map((interviewer: string, index: number) => (
                    <li key={index}>{interviewer}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Preparation Tips */}
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-medium mb-2 text-white">Preparation Tips</h3>
              <ul className="list-disc pl-5 space-y-1 text-white/80">
                <li>Research about {selectedInterview?.company} before the interview</li>
                <li>Prepare examples of your past work related to {selectedInterview?.role}</li>
                <li>Review the job description and prepare relevant questions</li>
                <li>{selectedInterview?.interview?.type === "Remote" ? "Test your audio/video setup before the interview" : "Plan your travel route in advance"}</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInterviewDetailsOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Close
            </Button>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={() => {
                const event = {
                  title: `Interview for ${selectedInterview?.role} at ${selectedInterview?.company}`,
                  date: selectedInterview?.interview?.date,
                  time: selectedInterview?.interview?.time,
                  location: selectedInterview?.interview?.type === "Remote" ? 
                    `Remote via ${selectedInterview?.interview?.platform}` : 
                    selectedInterview?.interview?.location
                };
                
                // In a real app, this would add the event to the user's calendar
                alert("Added to calendar: " + JSON.stringify(event));
              }}
            >
              Add to Calendar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Applications;
