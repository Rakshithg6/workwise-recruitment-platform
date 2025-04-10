import { useState, useRef } from 'react';
import { Upload, Loader2, Building2, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GEMINI_API_KEY = 'AIzaSyDwlS39w8DpJDCNiLX2QAkxRLekBLVXS-8';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const mockResults = {
  matchingJobs: [
    {
      id: 1,
      title: "Full Stack Developer",
      company: "TechCorp Solutions",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹18-25 LPA",
      score: 92,
      skills: ["React", "TypeScript", "Node.js", "MongoDB", "REST APIs"],
      requirements: ["AWS", "Docker", "Microservices"],
      description: "We are looking for a skilled Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.",
      responsibilities: [
        "Design and implement scalable web applications",
        "Work with both frontend and backend technologies",
        "Collaborate with cross-functional teams",
        "Write clean, maintainable code",
        "Participate in code reviews and technical discussions"
      ],
      benefits: [
        "Competitive salary package",
        "Health insurance",
        "Flexible work hours",
        "Learning and development opportunities",
        "Annual bonus"
      ]
    },
    {
      id: 2,
      title: "Frontend Engineer",
      company: "InnovateX Digital",
      location: "Bangalore, India (Hybrid)",
      type: "Full-time",
      experience: "2-4 years",
      salary: "₹15-20 LPA",
      score: 88,
      skills: ["React", "TypeScript", "HTML/CSS", "UI/UX", "State Management"],
      requirements: ["Vue.js", "Testing", "Performance Optimization"],
      description: "Join our frontend team to build beautiful and performant user interfaces. We're looking for someone passionate about creating exceptional user experiences.",
      responsibilities: [
        "Build responsive web applications",
        "Optimize application performance",
        "Implement UI/UX designs",
        "Write unit and integration tests",
        "Mentor junior developers"
      ],
      benefits: [
        "Remote work options",
        "Health and wellness programs",
        "Stock options",
        "Professional development budget",
        "Modern tech stack"
      ]
    },
    {
      id: 3,
      title: "Software Engineer",
      company: "GlobalTech Systems",
      location: "Bangalore, India (On-site)",
      type: "Full-time",
      experience: "2-6 years",
      salary: "₹16-22 LPA",
      score: 85,
      skills: ["JavaScript", "Git", "Problem Solving", "Data Structures"],
      requirements: ["System Design", "Cloud Services", "CI/CD"],
      description: "We're seeking a talented Software Engineer to join our engineering team. You'll work on challenging problems and help build scalable solutions.",
      responsibilities: [
        "Design and implement software solutions",
        "Work on complex technical challenges",
        "Collaborate with product and design teams",
        "Improve system performance",
        "Participate in agile ceremonies"
      ],
      benefits: [
        "Competitive compensation",
        "Work-life balance",
        "Health benefits",
        "Learning allowance",
        "Team events"
      ]
    }
  ],
  feedback: `Based on your resume analysis:

Strengths:
• Strong frontend development skills with React and TypeScript
• Good understanding of modern web technologies
• Experience with full-stack development

Areas for Improvement:
1. Add more quantifiable achievements and metrics
2. Include specific project outcomes and impact
3. Highlight leadership and team collaboration experiences

Recommendations:
• Consider adding cloud certifications (AWS/Azure)
• Expand experience with containerization and microservices
• Include more details about system design experience`
};

const ResumeScreening = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    matchingJobs: Array<{
      id: number;
      title: string;
      company: string;
      location: string;
      type: string;
      experience: string;
      salary: string;
      score: number;
      skills: string[];
      requirements: string[];
      description: string;
      responsibilities: string[];
      benefits: string[];
    }>;
    feedback: string;
  } | null>(null);
  const [selectedJob, setSelectedJob] = useState<typeof mockResults.matchingJobs[0] | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    event.target.value = '';

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResults(mockResults);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been successfully analyzed!",
        variant: "default",
      });
    } catch (error) {
      console.error('Error processing resume:', error);
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (job: typeof mockResults.matchingJobs[0]) => {
    toast({
      title: "Application Submitted!",
      description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      variant: "default",
    });
    setSelectedJob(null);
  };

  return (
    <div className="w-full">
      <div className="border border-dashed border-gray-700 rounded-lg p-16 flex flex-col items-center justify-center w-full">
        <Upload className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Upload Your Resume</h3>
        <p className="text-gray-400 text-center mb-6">We'll analyze your resume and find matching jobs</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button 
          onClick={handleUploadClick}
          disabled={isLoading}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Upload Resume'
          )}
        </Button>
      </div>

      {results && (
        <div className="w-full">
          <h2 className="text-2xl font-bold text-white mb-6">Best Job Matches</h2>
          <div className="grid grid-cols-1 gap-6">
            {results.matchingJobs.map((job) => (
              <div 
                key={job.id} 
                className="rounded-lg bg-white/5 p-4 border border-blue-500/20 hover:bg-white/10 transition-colors cursor-pointer"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-white">{job.title}</h4>
                  <span className={`px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-bold ${
                    job.score >= 90 ? 'bg-green-900/30 text-green-400' :
                    job.score >= 80 ? 'bg-blue-900/30 text-blue-400' :
                    'bg-yellow-900/30 text-yellow-400'
                  }`}>
                    {job.score}% Match
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-400 mb-4 font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{job.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-gray-400 mb-6 font-medium">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{job.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-white font-bold mb-2">Your Matching Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-bold mb-2">Recommended Skills</h5>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, reqIndex) => (
                        <span 
                          key={reqIndex}
                          className="px-3 py-1 bg-yellow-900/30 text-yellow-400 rounded-full text-sm font-medium"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {results && (
        <ScrollArea className="h-[500px] rounded-lg border border-blue-500/20 bg-white/5 p-6 mt-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Best Job Matches</h3>
              <div className="space-y-4">
                {results.matchingJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="rounded-lg bg-white/5 p-4 border border-blue-500/20 hover:bg-white/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedJob(job)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-white text-lg mb-1">{job.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                        </div>
                      </div>
                      <span className={`text-sm px-3 py-1 rounded-full ${
                        job.score >= 90 ? 'bg-green-500/20 text-green-400' :
                        job.score >= 80 ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {job.score}% Match
                      </span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex gap-4 text-sm text-white/70">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {job.type}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.experience}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {job.salary}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white/70 mb-2">Your Matching Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, skillIndex) => (
                            <span 
                              key={skillIndex}
                              className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white/70 mb-2">Recommended Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, reqIndex) => (
                            <span 
                              key={reqIndex}
                              className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-lg font-semibold text-white mb-4">Resume Feedback</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">{results.feedback}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
      )}

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex-shrink-0 border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <DialogTitle className="text-xl font-semibold mb-1">{selectedJob?.title}</DialogTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {selectedJob?.company}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedJob?.location}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{selectedJob?.type}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{selectedJob?.experience}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span>{selectedJob?.salary}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedJob?.score >= 90 ? 'bg-green-500/20 text-green-400' :
                  selectedJob?.score >= 80 ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {selectedJob?.score}% Match
                </span>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto">
            <div className="space-y-6 p-4">
              <div className="bg-white/5 rounded-lg p-4 border border-border/50">
                <h4 className="font-medium mb-3 text-lg">Job Description</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedJob?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-border/50">
                  <h4 className="font-medium mb-3 text-lg">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob?.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-border/50">
                  <h4 className="font-medium mb-3 text-lg">Additional Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob?.requirements?.map((req, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-border/50">
                <h4 className="font-medium mb-3 text-lg">Key Responsibilities</h4>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {selectedJob?.responsibilities.map((resp, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="rounded-full h-1.5 w-1.5 bg-blue-500 mt-2 flex-shrink-0" />
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-lg p-4 border border-border/50">
                  <h4 className="font-medium mb-3 text-lg">Benefits & Perks</h4>
                  <ul className="space-y-2">
                    {selectedJob?.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="rounded-full h-1.5 w-1.5 bg-green-500 mt-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-lg p-4 border border-border/50">
                  <h4 className="font-medium mb-3 text-lg">About {selectedJob?.company}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedJob?.company} is a leading technology company focused on innovation and excellence. 
                    We offer a dynamic work environment, opportunities for growth, and a culture of continuous learning.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      Company Size: 500-1000
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Headquarters: Bangalore
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-border/50">
                <h4 className="font-medium mb-3 text-lg">Application Process</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">1</div>
                    <h5 className="font-medium text-sm mb-1">Submit Application</h5>
                    <p className="text-xs text-muted-foreground">Apply with your resume and profile</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">2</div>
                    <h5 className="font-medium text-sm mb-1">Initial Review</h5>
                    <p className="text-xs text-muted-foreground">Review by HR team within 2-3 days</p>
                  </div>
                  <div className="text-center p-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto mb-2">3</div>
                    <h5 className="font-medium text-sm mb-1">Interview Process</h5>
                    <p className="text-xs text-muted-foreground">Technical and cultural fit interviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 border-t p-4 mt-auto">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{selectedJob?.score}% Match</span> with your profile
              </div>
              <Button
                onClick={() => selectedJob && handleApply(selectedJob)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ResumeScreening;
