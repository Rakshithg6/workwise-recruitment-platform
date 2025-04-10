import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, MapPin, Filter, BriefcaseIcon, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import JobCard, { JobCardProps } from '@/components/ui/JobCard';
import ChatbotButton from '@/components/ui/ChatbotButton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

// Mock job data
const mockJobs: JobCardProps[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TCS',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹20-30 LPA',
    jobType: 'Full-time',
    postedAt: '2 days ago',
    description: 'We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and AWS. The ideal candidate will lead development efforts for our flagship product.',
    isNew: true,
    skills: ['React', 'Node.js', 'AWS', 'TypeScript']
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Flipkart',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹25-35 LPA',
    jobType: 'Full-time',
    postedAt: '1 week ago',
    description: 'As a Product Manager at Flipkart, you will be responsible for driving product strategy and execution for our mobile app. You will work closely with engineering, design, and marketing teams.',
    skills: ['Product Strategy', 'Agile', 'Analytics', 'UX']
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'Myntra',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹18-28 LPA',
    jobType: 'Full-time',
    postedAt: '3 days ago',
    description: 'Looking for a Data Scientist to design and implement ML models for our recommendation engine. Experience with Python, TensorFlow, and recommendation systems is required.',
    isNew: true,
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL']
  },
  {
    id: '4',
    title: 'UI/UX Designer',
    company: 'Swiggy',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹15-25 LPA',
    jobType: 'Full-time',
    postedAt: '5 days ago',
    description: 'We are seeking a talented UI/UX Designer to create amazing user experiences for our app. You will work on designing user flows, wireframes, and high-fidelity mockups.',
    skills: ['Figma', 'User Research', 'Prototyping', 'Visual Design']
  },
  {
    id: '5',
    title: 'Frontend Developer',
    company: 'BYJU\'S',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹12-18 LPA',
    jobType: 'Full-time',
    postedAt: '1 week ago',
    description: 'Join our team as a Frontend Developer to build responsive and interactive web applications. Strong knowledge of React, Redux, and modern JavaScript is required.',
    skills: ['React', 'Redux', 'JavaScript', 'CSS3']
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: 'Ola',
    location: 'Bangalore, Karnataka',
    salaryRange: '₹18-28 LPA',
    jobType: 'Full-time',
    postedAt: '2 weeks ago',
    description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. Experience with AWS, Docker, Kubernetes, and CI/CD pipelines is required.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
  },
  {
    id: '7',
    title: 'Backend Engineer',
    company: 'Paytm',
    location: 'Noida, Uttar Pradesh',
    salaryRange: '₹15-25 LPA',
    jobType: 'Full-time',
    postedAt: '1 week ago',
    description: 'Join our engineering team to build scalable backend services for our payment platform. Experience with Java, Spring Boot, and microservices architecture is required.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'SQL']
  },
  {
    id: '8',
    title: 'Marketing Manager',
    company: 'Amazon',
    location: 'Hyderabad, Telangana',
    salaryRange: '₹20-30 LPA',
    jobType: 'Full-time',
    postedAt: '3 days ago',
    description: 'We are seeking a Marketing Manager to develop and execute marketing strategies for our consumer products. Experience in digital marketing and brand management is required.',
    isNew: true,
    skills: ['Digital Marketing', 'Brand Management', 'Analytics', 'Campaign Planning']
  }
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState<JobCardProps[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<JobCardProps[]>(mockJobs);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    jobType: '',
    salaryRange: '',
    datePosted: '',
    experience: ''
  });
  
  const locationParams = useLocation();
  
  useEffect(() => {
    // Parse URL query params
    const params = new URLSearchParams(locationParams.search);
    const q = params.get('q');
    const loc = params.get('location');
    const category = params.get('category');
    
    if (q) setSearchQuery(q);
    if (loc) setLocation(loc);
    
    // Apply filters based on URL params
    let filtered = jobs;
    
    if (q) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(q.toLowerCase()) ||
        job.company.toLowerCase().includes(q.toLowerCase()) ||
        job.description.toLowerCase().includes(q.toLowerCase())
      );
    }
    
    if (loc) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(loc.toLowerCase())
      );
    }
    
    if (category) {
      filtered = filtered.filter(job => 
        job.skills?.some(skill => skill.toLowerCase().includes(category.toLowerCase()))
      );
    }
    
    setFilteredJobs(filtered);
    
    // Set page title
    document.title = "Job Listings | WorkWise India";
  }, [locationParams.search, jobs]);
  
  const applyFilters = () => {
    let filtered = jobs;
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply location filter
    if (location) {
      filtered = filtered.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    // Apply job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job => 
        job.jobType.toLowerCase() === filters.jobType.toLowerCase()
      );
    }
    
    // Apply salary range filter
    if (filters.salaryRange) {
      // Just a simple example - in a real app you'd parse the salary range properly
      if (filters.salaryRange === 'above-20') {
        filtered = filtered.filter(job => 
          parseInt(job.salaryRange.split('-')[1].split(' ')[0]) >= 20
        );
      } else if (filters.salaryRange === '10-20') {
        filtered = filtered.filter(job => {
          const min = parseInt(job.salaryRange.split('-')[0].replace('₹', ''));
          const max = parseInt(job.salaryRange.split('-')[1].split(' ')[0]);
          return min >= 10 && max <= 20;
        });
      } else if (filters.salaryRange === 'below-10') {
        filtered = filtered.filter(job => 
          parseInt(job.salaryRange.split('-')[0].replace('₹', '')) < 10
        );
      }
    }
    
    // Apply date posted filter
    if (filters.datePosted) {
      // This would be more sophisticated in a real app
      if (filters.datePosted === 'today') {
        filtered = filtered.filter(job => job.postedAt.includes('hours') || job.postedAt.includes('hour'));
      } else if (filters.datePosted === 'this-week') {
        filtered = filtered.filter(job => 
          job.postedAt.includes('day') || 
          job.postedAt.includes('days') ||
          job.postedAt.includes('hour') || 
          job.postedAt.includes('hours')
        );
      } else if (filters.datePosted === 'this-month') {
        filtered = filtered.filter(job => 
          !job.postedAt.includes('month') || 
          job.postedAt.includes('week') || 
          job.postedAt.includes('weeks') ||
          job.postedAt.includes('day') || 
          job.postedAt.includes('days')
        );
      }
    }
    
    setFilteredJobs(filtered);
    // On mobile, close the filter panel after applying
    if (window.innerWidth < 768) {
      setFilterOpen(false);
    }
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setLocation('');
    setFilters({
      jobType: '',
      salaryRange: '',
      datePosted: '',
      experience: ''
    });
    setFilteredJobs(jobs);
  };
  
  useEffect(() => {
    // Apply filters whenever filters state changes
    applyFilters();
  }, [filters, searchQuery, location, jobs]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-dark">
      <Navbar />
      
      <div className="pt-24 pb-16 bg-black/30 backdrop-blur-sm">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link to="/candidate/dashboard">
                <Button variant="outline" size="sm" className="gap-1 border-blue-500/30 text-blue-400 hover:bg-blue-900/20">
                  <ArrowLeft size={16} />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-white">Find Jobs in India</h1>
            </div>
            
            {/* Search bar */}
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-lg p-4 border border-blue-500/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Job title, skills, or company"
                    className="input-primary pl-10 w-full bg-black/50 border-blue-500/30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-blue-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Location"
                    className="input-primary pl-10 w-full bg-black/50 border-blue-500/30"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 shadow-md shadow-blue-500/20" 
                  onClick={applyFilters}
                >
                  <Search size={18} />
                  <span>Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-8 bg-background">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters sidebar */}
            <div 
              className={cn(
                "lg:w-64 bg-gradient-to-b from-gray-800 to-black border border-blue-500/20 rounded-xl shadow-sm p-4 h-fit transition-all",
                filterOpen 
                  ? "fixed inset-0 z-40 w-full h-full overflow-y-auto lg:static lg:w-64 lg:h-auto"
                  : "hidden lg:block"
              )}
            >
              {filterOpen && (
                <div className="flex justify-between items-center mb-6 lg:hidden">
                  <h3 className="text-lg font-semibold text-white">Filters</h3>
                  <button 
                    onClick={() => setFilterOpen(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white">Job Type</h3>
                  <div className="space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          type="radio"
                          id={`job-type-${type}`}
                          name="job-type"
                          className="mr-2"
                          checked={filters.jobType === type}
                          onChange={() => setFilters({...filters, jobType: type})}
                        />
                        <label htmlFor={`job-type-${type}`} className="text-sm text-white">{type}</label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white">Salary Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="salary-above-20"
                        name="salary-range"
                        className="mr-2"
                        checked={filters.salaryRange === 'above-20'}
                        onChange={() => setFilters({...filters, salaryRange: 'above-20'})}
                      />
                      <label htmlFor="salary-above-20" className="text-sm text-white">Above ₹20 LPA</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="salary-10-20"
                        name="salary-range"
                        className="mr-2"
                        checked={filters.salaryRange === '10-20'}
                        onChange={() => setFilters({...filters, salaryRange: '10-20'})}
                      />
                      <label htmlFor="salary-10-20" className="text-sm text-white">₹10 - ₹20 LPA</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="salary-below-10"
                        name="salary-range"
                        className="mr-2"
                        checked={filters.salaryRange === 'below-10'}
                        onChange={() => setFilters({...filters, salaryRange: 'below-10'})}
                      />
                      <label htmlFor="salary-below-10" className="text-sm text-white">Below ₹10 LPA</label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white">Date Posted</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="date-today"
                        name="date-posted"
                        className="mr-2"
                        checked={filters.datePosted === 'today'}
                        onChange={() => setFilters({...filters, datePosted: 'today'})}
                      />
                      <label htmlFor="date-today" className="text-sm text-white">Today</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="date-this-week"
                        name="date-posted"
                        className="mr-2"
                        checked={filters.datePosted === 'this-week'}
                        onChange={() => setFilters({...filters, datePosted: 'this-week'})}
                      />
                      <label htmlFor="date-this-week" className="text-sm text-white">This Week</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="date-this-month"
                        name="date-posted"
                        className="mr-2"
                        checked={filters.datePosted === 'this-month'}
                        onChange={() => setFilters({...filters, datePosted: 'this-month'})}
                      />
                      <label htmlFor="date-this-month" className="text-sm text-white">This Month</label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <button
                    onClick={resetFilters}
                    className="w-full button-secondary"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>
            
            {/* Job listings */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  {filteredJobs.length} Jobs Found
                </h2>
                
                <button
                  className="lg:hidden flex items-center gap-1.5 button-secondary"
                  onClick={() => setFilterOpen(true)}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>
              
              {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} {...job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gradient-to-b from-gray-800 to-black border border-blue-500/20 rounded-xl">
                  <BriefcaseIcon size={48} className="mx-auto text-blue-400/50 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">No Jobs Found</h3>
                  <p className="text-white/70 mb-4">
                    We couldn't find any jobs matching your criteria.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Jobs;
