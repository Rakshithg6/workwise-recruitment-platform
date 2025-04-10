
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, FileText, BriefcaseIcon, Building, MapPin, Banknote, Clock } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    companyName: userData.companyName || '',
    location: '',
    jobType: 'Full-time',
    salaryRange: '',
    description: '',
    requirements: '',
    qualifications: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!formData.title || !formData.department || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Get existing jobs
    const savedJobs = localStorage.getItem('workwise-job-listings');
    let jobsList = [];
    
    if (savedJobs) {
      try {
        jobsList = JSON.parse(savedJobs);
      } catch (e) {
        console.error('Failed to parse saved jobs:', e);
      }
    }
    
    // Create new job
    const newJob = {
      id: Date.now(),
      title: formData.title,
      department: formData.department,
      companyName: formData.companyName,
      location: formData.location,
      jobType: formData.jobType,
      salaryRange: formData.salaryRange,
      description: formData.description,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      qualifications: formData.qualifications.split('\n').filter(q => q.trim()),
      applicants: 0,
      status: 'Active',
      postedDate: new Date().toISOString()
    };
    
    // Add to list and save
    jobsList.push(newJob);
    localStorage.setItem('workwise-job-listings', JSON.stringify(jobsList));
    
    // Show success message
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Job Posted Successfully",
        description: "Your job listing has been published."
      });
      navigate('/employer/jobs');
    }, 1000);
  };
  
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
            <h1 className="text-2xl font-bold text-white">Post New Job</h1>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/90 to-black/90 border border-indigo-500/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-white mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Engineering"
                    className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-white mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40"
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-white mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Remote, India"
                    className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="jobType" className="block text-sm font-medium text-white mb-1">
                      Job Type
                    </label>
                    <select
                      id="jobType"
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="salaryRange" className="block text-sm font-medium text-white mb-1">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      id="salaryRange"
                      name="salaryRange"
                      value={formData.salaryRange}
                      onChange={handleInputChange}
                      placeholder="e.g. ₹15-25 LPA"
                      className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                    Job Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe the role, responsibilities, and other details"
                    className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40 min-h-[100px]"
                  />
                </div>
                
                <div>
                  <label htmlFor="requirements" className="block text-sm font-medium text-white mb-1">
                    Requirements (one per line)
                  </label>
                  <textarea
                    id="requirements"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="e.g. 3+ years of experience with React.js"
                    className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40 min-h-[80px]"
                  />
                </div>
                
                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-white mb-1">
                    Qualifications (one per line)
                  </label>
                  <textarea
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    placeholder="e.g. Bachelor's degree in Computer Science"
                    className="w-full bg-gray-700/70 border border-white/20 rounded-lg text-white p-2.5 focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-white/40 min-h-[80px]"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/employer/dashboard')}
                className="mr-2 border-indigo-500/30 text-white hover:bg-indigo-600/20"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Post Job
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostJob;
