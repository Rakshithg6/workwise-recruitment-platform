import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Info, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatbotButton from '@/components/ui/ChatbotButton';
import { Button } from '@/components/ui/button';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    jobType: '',
    workplaceType: '',
    minSalary: '',
    maxSalary: '',
    description: '',
    requirements: '',
    benefits: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Set page title
    document.title = "Post a Job | WorkWise India";
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for field
    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = 'Job title is required';
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
      if (!formData.location.trim()) newErrors.location = 'Location is required';
      if (!formData.jobType) newErrors.jobType = 'Job type is required';
      if (!formData.workplaceType) newErrors.workplaceType = 'Workplace type is required';
    } else if (step === 2) {
      if (!formData.description.trim()) newErrors.description = 'Job description is required';
      if (!formData.requirements.trim()) newErrors.requirements = 'Job requirements are required';
    } else if (step === 3) {
      if (!formData.minSalary.trim()) newErrors.minSalary = 'Minimum salary is required';
      if (!formData.maxSalary.trim()) newErrors.maxSalary = 'Maximum salary is required';
      if (parseInt(formData.minSalary) > parseInt(formData.maxSalary)) {
        newErrors.minSalary = 'Minimum salary cannot be greater than maximum salary';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      setSubmitting(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
      } catch (error) {
        console.error('Error posting job:', error);
        setErrors({
          submit: 'Failed to post job. Please try again later.'
        });
      } finally {
        setSubmitting(false);
      }
    }
  };
  
  // Custom input class for better visibility
  const inputClass = "bg-gray-800 border-2 border-indigo-500/40 text-white rounded-lg px-4 py-3 w-full focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:outline-none";
  
  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Navbar />
        
        <main className="flex-grow pt-32 pb-16">
          <div className="container-custom max-w-2xl">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 border-green-500/40 p-8 shadow-2xl text-center">
              <div className="h-20 w-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6 border-2 border-green-500/40">
                <Check size={40} className="text-green-500" />
              </div>
              
              <h1 className="text-2xl font-bold mb-4 text-white">Job Posted Successfully!</h1>
              <p className="text-white/80 mb-8">
                Your job listing has been submitted and will be reviewed before being published. You'll receive a confirmation email shortly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.location.href = '/employer/dashboard'} 
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium shadow-lg shadow-blue-500/20"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'} 
                  variant="secondary"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 text-white hover:text-blue-400 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-2 border-indigo-500/30 shadow-2xl overflow-hidden">
            {/* Progress header */}
            <div className="bg-indigo-900/40 p-4 border-b border-indigo-500/40">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-white">Post a Job</h1>
                <div className="flex items-center">
                  <span className="text-sm font-medium text-white/80">Step {currentStep} of 3</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className={cn(
                  "h-2 rounded-full",
                  currentStep >= 1 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gray-600"
                )} />
                <div className={cn(
                  "h-2 rounded-full",
                  currentStep >= 2 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gray-600"
                )} />
                <div className={cn(
                  "h-2 rounded-full",
                  currentStep >= 3 ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-gray-600"
                )} />
              </div>
            </div>
            
            {/* Form content */}
            <form onSubmit={handleSubmit} className="p-6 text-white">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-6 text-white">Basic Information</h2>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-2 text-white">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className={cn(
                        inputClass,
                        errors.title && "border-red-500"
                      )}
                      placeholder="e.g. Senior Software Engineer"
                      value={formData.title}
                      onChange={handleChange}
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2 text-white">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      className={cn(
                        inputClass,
                        errors.company && "border-red-500"
                      )}
                      placeholder="e.g. Acme Inc."
                      value={formData.company}
                      onChange={handleChange}
                    />
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-2 text-white">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="location"
                      name="location"
                      type="text"
                      className={cn(
                        inputClass,
                        errors.location && "border-red-500"
                      )}
                      placeholder="e.g. Bangalore, Karnataka"
                      value={formData.location}
                      onChange={handleChange}
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="jobType" className="block text-sm font-medium mb-2 text-white">
                        Job Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="jobType"
                        name="jobType"
                        className={cn(
                          inputClass,
                          errors.jobType && "border-red-500"
                        )}
                        value={formData.jobType}
                        onChange={handleChange}
                      >
                        <option value="">Select Job Type</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Freelance">Freelance</option>
                      </select>
                      {errors.jobType && (
                        <p className="mt-1 text-sm text-red-500">{errors.jobType}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="workplaceType" className="block text-sm font-medium mb-2 text-white">
                        Workplace Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="workplaceType"
                        name="workplaceType"
                        className={cn(
                          inputClass,
                          errors.workplaceType && "border-red-500"
                        )}
                        value={formData.workplaceType}
                        onChange={handleChange}
                      >
                        <option value="">Select Workplace Type</option>
                        <option value="On-site">On-site</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Remote">Remote</option>
                      </select>
                      {errors.workplaceType && (
                        <p className="mt-1 text-sm text-red-500">{errors.workplaceType}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-6 text-white">Job Details</h2>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-2 text-white">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={8}
                      className={cn(
                        inputClass,
                        "resize-y",
                        errors.description && "border-red-500"
                      )}
                      placeholder="Describe the responsibilities, day-to-day activities, and the impact of this role..."
                      value={formData.description}
                      onChange={handleChange}
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                    )}
                    <div className="mt-1 flex items-start gap-1 text-xs text-white/60">
                      <Info size={12} className="mt-0.5 text-blue-400" />
                      <span>
                        Tip: A detailed job description helps attract qualified candidates. Include responsibilities, required experience, and what makes this role unique.
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="requirements" className="block text-sm font-medium mb-2 text-white">
                      Requirements <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="requirements"
                      name="requirements"
                      rows={6}
                      className={cn(
                        inputClass,
                        "resize-y",
                        errors.requirements && "border-red-500"
                      )}
                      placeholder="List the skills, qualifications, and experience required for this role..."
                      value={formData.requirements}
                      onChange={handleChange}
                    />
                    {errors.requirements && (
                      <p className="mt-1 text-sm text-red-500">{errors.requirements}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="benefits" className="block text-sm font-medium mb-2 text-white">
                      Benefits
                    </label>
                    <textarea
                      id="benefits"
                      name="benefits"
                      rows={4}
                      className={cn(inputClass, "resize-y")}
                      placeholder="Describe the benefits offered with this position (healthcare, remote work, flexible hours, etc.)..."
                      value={formData.benefits}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold mb-6 text-white">Compensation & Finalize</h2>
                  
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30 flex items-start gap-3 mb-6">
                    <Info size={20} className="text-blue-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-white">Why should you include salary information?</h3>
                      <p className="text-sm text-white/70">
                        Job posts with salary information receive up to 2x more applications. Being transparent about compensation helps attract the right candidates.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Salary Range (₹ LPA) <span className="text-red-500">*</span>
                    </label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-white/70">₹</span>
                          <input
                            id="minSalary"
                            name="minSalary"
                            type="number"
                            className={cn(
                              inputClass,
                              "pl-8",
                              errors.minSalary && "border-red-500"
                            )}
                            placeholder="Min"
                            value={formData.minSalary}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.minSalary && (
                          <p className="mt-1 text-sm text-red-500">{errors.minSalary}</p>
                        )}
                      </div>
                      
                      <div>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3 flex items-center text-white/70">₹</span>
                          <input
                            id="maxSalary"
                            name="maxSalary"
                            type="number"
                            className={cn(
                              inputClass,
                              "pl-8",
                              errors.maxSalary && "border-red-500"
                            )}
                            placeholder="Max"
                            value={formData.maxSalary}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.maxSalary && (
                          <p className="mt-1 text-sm text-red-500">{errors.maxSalary}</p>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-white/60">Enter annual salary in Lakhs Per Annum (LPA)</p>
                  </div>
                  
                  <div className="border-t border-blue-500/20 pt-6 mt-6">
                    <h3 className="font-medium mb-4 text-white">Company Logo (Optional)</h3>
                    
                    <div className="border-2 border-dashed border-blue-500/30 rounded-lg p-8 text-center bg-blue-900/10">
                      <div className="flex flex-col items-center">
                        <Upload size={24} className="text-blue-400 mb-2" />
                        <p className="text-sm text-white/70 mb-2">
                          Drag and drop your logo here, or click to browse
                        </p>
                        <p className="text-xs text-white/60 mb-4">
                          Supported formats: PNG, JPG, SVG (Max 5MB)
                        </p>
                        <Button variant="secondary" className="text-sm bg-white/10 hover:bg-white/20 text-white border border-blue-500/30">
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {errors.submit && (
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30 text-red-400 text-sm">
                      {errors.submit}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-between mt-8 pt-6 border-t border-indigo-500/30">
                {currentStep > 1 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleBack}
                    className="bg-white/10 hover:bg-white/20 text-white border border-indigo-500/40"
                  >
                    Back
                  </Button>
                ) : (
                  <div></div>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={cn(
                      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 min-w-[120px]",
                      submitting && "opacity-80 cursor-not-allowed"
                    )}
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>Posting...</span>
                      </div>
                    ) : (
                      'Post Job'
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default PostJob;
