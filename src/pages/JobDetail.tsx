import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, BriefcaseIcon, Banknote, Clock, Calendar, GraduationCap, Building, ArrowLeft, BookmarkIcon, Share2, Heart, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatbotButton from '@/components/ui/ChatbotButton';

// Mock job data - in a real app, this would come from an API
const jobData = {
  id: '1',
  title: 'Senior Software Engineer',
  company: 'TCS',
  location: 'Bangalore, Karnataka',
  salaryRange: '₹20-30 LPA',
  jobType: 'Full-time',
  postedAt: '2 days ago',
  description: `
    <p>TCS is looking for a Senior Software Engineer to join our growing team.</p>
    
    <h3>Responsibilities:</h3>
    <ul>
      <li>Design, develop and maintain high-performance, reliable, and reusable code</li>
      <li>Work with cross-functional teams to define, design, and ship new features</li>
      <li>Collaborate with other team members and stakeholders</li>
      <li>Identify and resolve performance and scalability issues</li>
      <li>Participate in code reviews and mentor junior developers</li>
    </ul>
    
    <h3>Requirements:</h3>
    <ul>
      <li>5+ years of experience in software development</li>
      <li>Strong proficiency in React, Node.js, and TypeScript</li>
      <li>Experience with AWS services</li>
      <li>Familiarity with agile development methodologies</li>
      <li>Excellent problem-solving skills and attention to detail</li>
      <li>Strong communication skills</li>
    </ul>
    
    <h3>Benefits:</h3>
    <ul>
      <li>Competitive salary and bonus structure</li>
      <li>Health insurance for you and your family</li>
      <li>Generous paid time off</li>
      <li>Professional development opportunities</li>
      <li>Flexible work arrangements</li>
    </ul>
    
    <p>TCS is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.</p>
  `,
  skills: ['React', 'Node.js', 'AWS', 'TypeScript', 'JavaScript', 'REST API', 'MongoDB', 'SQL'],
  experience: '5+ years',
  education: "Bachelor's degree in Computer Science or related field",
  companyDescription: 'Tata Consultancy Services (TCS) is an Indian multinational information technology services and consulting company headquartered in Mumbai. It is part of the Tata Group and operates in 46 countries.',
  benefits: [
    'Health Insurance',
    'Life Insurance',
    'Paid Time Off',
    'Performance Bonus',
    'Professional Development',
    'Flexible Work Arrangements'
  ],
  applicationUrl: '#',
  companyLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Tata_Consultancy_Services_Logo.svg/2560px-Tata_Consultancy_Services_Logo.svg.png'
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState(jobData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  useEffect(() => {
    // In a real app, fetch the job data using the ID
    // For now, we'll just use the mock data
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Set page title
    document.title = `${jobData.title} at ${jobData.company} | WorkWise India`;
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-40 bg-secondary rounded mb-4"></div>
            <div className="h-6 w-80 bg-secondary rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleApply = () => {
    // In a real app, this would redirect to application form or track the application
    setShowSuccessModal(true);
  };
  
  const toggleSaved = () => {
    setIsSaved(!isSaved);
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => {
      setShowShareModal(false);
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 bg-background">
        <div className="container-custom">
          {/* Back button */}
          <Link to="/jobs" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Jobs</span>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job header */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 shadow-sm">
                <div className="sm:flex items-start gap-6">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-4 sm:mb-0 overflow-hidden">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-contain p-2" />
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        {job.company.substring(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
                    <p className="text-lg">{job.company}</p>
                    
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin size={16} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Banknote size={16} />
                        <span>{job.salaryRange}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BriefcaseIcon size={16} />
                        <span>{job.jobType}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>Posted {job.postedAt}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button 
                        className="button-primary sm:px-6" 
                        onClick={handleApply}
                      >
                        Apply Now
                      </button>
                      <button 
                        className={cn(
                          "button-secondary",
                          isSaved && "text-primary"
                        )}
                        onClick={toggleSaved}
                      >
                        {isSaved ? (
                          <Heart size={18} className="fill-primary" />
                        ) : (
                          <Heart size={18} />
                        )}
                      </button>
                      <button 
                        className="button-secondary"
                        onClick={() => setShowShareModal(true)}
                      >
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Job description */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                <div 
                  className="prose max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
                
                {/* Skills */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span 
                        key={skill} 
                        className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-sm font-medium text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Company info */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4">About {job.company}</h2>
                <p className="text-muted-foreground mb-6">{job.companyDescription}</p>
                <Link to={`/companies/${job.company.toLowerCase()}`} className="text-primary font-medium hover:underline">
                  View Company Profile
                </Link>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Job details */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Job Details</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Job Type</p>
                      <p className="text-sm text-muted-foreground">{job.jobType}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BriefcaseIcon size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Experience</p>
                      <p className="text-sm text-muted-foreground">{job.experience}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Education</p>
                      <p className="text-sm text-muted-foreground">{job.education}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building size={18} className="text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Industry</p>
                      <p className="text-sm text-muted-foreground">IT Services</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Benefits */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Benefits</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Similar jobs */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Similar Jobs</h2>
                <div className="space-y-4">
                  <Link to="/job/2" className="block group">
                    <h3 className="font-medium group-hover:text-primary transition-colors">Frontend Developer</h3>
                    <p className="text-sm text-muted-foreground">Infosys • Bangalore</p>
                    <p className="text-sm">₹12-18 LPA</p>
                  </Link>
                  <Link to="/job/3" className="block group">
                    <h3 className="font-medium group-hover:text-primary transition-colors">Full Stack Developer</h3>
                    <p className="text-sm text-muted-foreground">Wipro • Bangalore</p>
                    <p className="text-sm">₹15-25 LPA</p>
                  </Link>
                  <Link to="/job/4" className="block group">
                    <h3 className="font-medium group-hover:text-primary transition-colors">Backend Engineer</h3>
                    <p className="text-sm text-muted-foreground">IBM • Hyderabad</p>
                    <p className="text-sm">₹18-28 LPA</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Success modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-end">
              <button onClick={() => setShowSuccessModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground mb-4">
                Your application for <span className="font-medium text-foreground">{job.title}</span> at <span className="font-medium text-foreground">{job.company}</span> has been submitted successfully.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                We'll notify you when the employer responds to your application.
              </p>
              <button 
                className="button-primary w-full"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Share modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-end">
              <button onClick={() => setShowShareModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Share This Job</h3>
              <p className="text-muted-foreground mb-6">
                Share this job opportunity with your network
              </p>
              
              <div className="flex justify-center gap-4 mb-6">
                <a href="#" className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="#" className="h-12 w-12 rounded-full bg-blue-400 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a>
                <a href="#" className="h-12 w-12 rounded-full bg-blue-700 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
                <a href="#" className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                  </svg>
                </a>
              </div>
              
              <div className="relative mb-6">
                <input 
                  type="text" 
                  value={window.location.href} 
                  readOnly
                  className="input-primary pr-20 w-full"
                />
                <button 
                  className="absolute right-1.5 top-1.5 bg-primary text-white px-3 py-1 rounded text-sm"
                  onClick={copyToClipboard}
                >
                  Copy
                </button>
              </div>
              
              <button 
                className="button-secondary w-full"
                onClick={() => setShowShareModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default JobDetail;
