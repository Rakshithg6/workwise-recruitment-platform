
import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Award, Clock, Building, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  skills: Skill[];
  experience: number;
  education: string[];
  jobHistory: {
    company: string;
    role: string;
    duration: string;
  }[];
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  jobType: string;
  postedAt: string;
  description: string;
  companyLogo: string;
  skills: string[];
  matchPercentage: number;
}

const mockResumeData: ResumeData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  skills: [
    { name: "React", level: "Advanced" },
    { name: "TypeScript", level: "Intermediate" },
    { name: "Node.js", level: "Intermediate" },
    { name: "CSS/SCSS", level: "Advanced" },
    { name: "Redux", level: "Intermediate" },
    { name: "RESTful APIs", level: "Advanced" },
    { name: "Git", level: "Intermediate" },
  ],
  experience: 4,
  education: [
    "B.Tech in Computer Science, IIT Delhi (2015-2019)",
    "Higher Secondary, Delhi Public School (2013-2015)"
  ],
  jobHistory: [
    {
      company: "TechInnovate",
      role: "Senior Frontend Developer",
      duration: "Jan 2021 - Present"
    },
    {
      company: "CodeCraft Solutions",
      role: "Frontend Developer",
      duration: "Jun 2019 - Dec 2020"
    }
  ]
};

const mockRecommendedJobs = [
  {
    id: "1",
    title: "Senior Frontend Engineer",
    company: "TCS",
    location: "Bangalore",
    salaryRange: "25-30 LPA",
    jobType: "Full-time",
    postedAt: "2 days ago",
    description: "Join our team to build innovative web applications using React, TypeScript and modern frontend technologies.",
    companyLogo: "/tcs-logo.png",
    skills: ["React", "TypeScript", "Redux", "REST APIs"],
    matchPercentage: 92,
  },
  {
    id: "2",
    title: "Frontend Team Lead",
    company: "Infosys",
    location: "Hyderabad",
    salaryRange: "30-40 LPA",
    jobType: "Full-time",
    postedAt: "5 days ago",
    description: "Looking for an experienced frontend developer to lead our web application development team.",
    companyLogo: "/infosys-logo.png",
    skills: ["React", "TypeScript", "Team Leadership", "Architecture"],
    matchPercentage: 85,
  },
  {
    id: "3",
    title: "React Developer",
    company: "HCL",
    location: "Pune",
    salaryRange: "18-25 LPA",
    jobType: "Full-time",
    postedAt: "1 week ago",
    description: "Develop and maintain frontend applications using React, Redux and modern JavaScript frameworks.",
    companyLogo: "/hcl-logo.png",
    skills: ["React", "JavaScript", "CSS", "Redux"],
    matchPercentage: 88,
  },
];

const ResumeScreening: React.FC = () => {
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fileName, setFileName] = useState("");
  const [analyzingProgress, setAnalyzingProgress] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, or DOCX file.",
        variant: "destructive"
      });
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Resume must be less than 10MB.",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    simulateFileUpload();
  };

  const simulateFileUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setResumeUploaded(true);
        toast({
          title: "Resume uploaded successfully",
          description: "Your resume has been uploaded and is ready for analysis.",
        });
      }
    }, 100);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeResume = () => {
    setIsAnalyzing(true);
    let progress = 0;
    // Simulate analysis progress
    const interval = setInterval(() => {
      progress += 5;
      setAnalyzingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setResumeData(mockResumeData);
          setRecommendedJobs(mockRecommendedJobs);
          setResumeAnalyzed(true);
          setIsAnalyzing(false);
          toast({
            title: "Resume analysis complete",
            description: "We've found matched jobs based on your skills and experience.",
          });
        }, 500);
      }
    }, 200);
  };

  const getLevelColor = (level: string) => {
    switch(level) {
      case 'Beginner': return 'bg-blue-900/30 text-blue-400';
      case 'Intermediate': return 'bg-green-900/30 text-green-400';
      case 'Advanced': return 'bg-purple-900/30 text-purple-400';
      case 'Expert': return 'bg-amber-900/30 text-amber-400';
      default: return 'bg-blue-900/30 text-blue-400';
    }
  };

  return (
    <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white mb-6">Resume Screening & Job Matching</h2>
      
      {!resumeUploaded ? (
        <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
          <Upload size={48} className="mx-auto text-white/50 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Upload Your Resume</h3>
          <p className="text-white/70 mb-4">We'll analyze your resume and find matching jobs</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            className="hidden"
            accept=".pdf,.doc,.docx"
          />
          <Button 
            onClick={handleUploadClick}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <FileText className="mr-2" size={16} />
            Upload Resume
          </Button>
          
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-4">
              <p className="text-white/70 text-sm mb-2">Uploading...</p>
              <Progress value={uploadProgress} className="h-2 bg-white/10" />
            </div>
          )}
        </div>
      ) : !resumeAnalyzed ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <span className="text-green-400">Resume uploaded successfully</span>
            </div>
            <span className="text-white/70 text-sm">{fileName}</span>
          </div>
          
          {isAnalyzing ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Analyzing your resume...</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Extracting skills and experience</span>
                  <span className="text-white/70">{Math.min(analyzingProgress, 40)}%</span>
                </div>
                <Progress value={Math.min(analyzingProgress, 40)} className="h-2 bg-white/10" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Finding matching jobs</span>
                  <span className="text-white/70">{analyzingProgress > 40 ? Math.min(analyzingProgress - 40, 40) : 0}%</span>
                </div>
                <Progress value={analyzingProgress > 40 ? Math.min(analyzingProgress - 40, 40) : 0} className="h-2 bg-white/10" />
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Calculating job compatibility</span>
                  <span className="text-white/70">{analyzingProgress > 80 ? Math.min(analyzingProgress - 80, 20) : 0}%</span>
                </div>
                <Progress value={analyzingProgress > 80 ? Math.min(analyzingProgress - 80, 20) : 0} className="h-2 bg-white/10" />
              </div>
              
              <p className="text-white/50 text-sm mt-6 text-center">This may take a moment...</p>
            </div>
          ) : (
            <Button 
              onClick={analyzeResume} 
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              Analyze Resume & Find Matching Jobs
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <CheckCircle size={20} className="text-green-500 mr-2" />
              <span className="text-green-400 font-medium">Resume Analysis Complete</span>
            </div>
            <p className="text-white/70 text-sm">We've analyzed your resume and found {recommendedJobs.length} matching jobs</p>
          </div>
          
          {/* Resume Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-3">
                <Award className="text-blue-400 mr-2" size={18} />
                <h3 className="text-lg font-medium text-white">Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeData?.skills.map((skill) => (
                  <span 
                    key={skill.name} 
                    className={`px-2 py-1 ${getLevelColor(skill.level)} rounded-full text-xs`}
                  >
                    {skill.name} ({skill.level})
                  </span>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-3">
                <Clock className="text-blue-400 mr-2" size={18} />
                <h3 className="text-lg font-medium text-white">Experience</h3>
              </div>
              <p className="text-white font-medium">{resumeData?.experience} years</p>
              <div className="mt-3 space-y-3">
                {resumeData?.jobHistory.map((job, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500/30 pl-3">
                    <p className="text-white font-medium">{job.role}</p>
                    <div className="flex items-center mt-1 text-sm">
                      <Building className="text-white/50 mr-1" size={14} />
                      <p className="text-white/70">{job.company}</p>
                    </div>
                    <p className="text-white/60 text-sm mt-1">{job.duration}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-3">
                <GraduationCap className="text-blue-400 mr-2" size={18} />
                <h3 className="text-lg font-medium text-white">Education</h3>
              </div>
              <div className="space-y-2">
                {resumeData?.education.map((edu, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500/30 pl-3">
                    <p className="text-white">{edu}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="flex items-center mb-3">
                <Briefcase className="text-blue-400 mr-2" size={18} />
                <h3 className="text-lg font-medium text-white">Contact Information</h3>
              </div>
              <div className="space-y-2 text-white">
                <p>{resumeData?.name}</p>
                <p className="text-white/70">{resumeData?.email}</p>
                <p className="text-white/70">{resumeData?.phone}</p>
              </div>
            </div>
          </div>
          
          {/* Recommended Jobs */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Recommended Jobs</h3>
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <div key={job.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-medium">{job.title}</h4>
                      <p className="text-white/70">{job.company} • {job.location}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {job.skills.map((skill: string) => (
                          <span key={skill} className="px-2 py-0.5 bg-blue-900/30 text-blue-400 rounded-full text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                        job.matchPercentage >= 90 ? 'bg-green-900/30 text-green-400' : 
                        job.matchPercentage >= 80 ? 'bg-blue-900/30 text-blue-400' : 
                        'bg-yellow-900/30 text-yellow-400'
                      }`}>
                        <span className="text-sm font-medium">{job.matchPercentage}%</span>
                      </div>
                      <p className="text-xs text-white/70 mt-1">Match</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-white/70 text-sm">{job.salaryRange} • {job.jobType}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-blue-500/30 hover:bg-blue-900/30 text-blue-400"
                    >
                      View Job
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScreening;
