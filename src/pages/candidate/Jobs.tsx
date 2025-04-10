import { useState, useEffect, useRef } from 'react';
import { Search, Building, MapPin, Banknote, Clock, ChevronLeft, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';
import { JobDetailsDialog } from '@/components/jobs/JobDetailsDialog';
import { useApplicationStore } from '@/store/applications';
import { useToast } from '@/components/ui/use-toast';

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const { isJobApplied, addApplication } = useApplicationStore();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    salaryRange: [5, 50], // in LPA
    locations: [] as string[],
    jobType: [] as string[],
    experience: [] as string[],
    workMode: [] as string[]
  });

  useEffect(() => {
    document.title = 'Job Search | WorkWise';
    // Check if URL has focus-search parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('focus-search') === 'true') {
      searchInputRef.current?.focus();
      searchInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TCS',
      location: 'Bangalore',
      salary: '25-35 LPA',
      posted: '2 days ago',
      description: 'Join TCS as a Senior Frontend Developer and work on cutting-edge projects for global clients. You will be responsible for building and maintaining high-performance web applications using modern frontend technologies.',
      skills: ['React', 'TypeScript', 'HTML/CSS', 'Redux', 'Next.js'],
      type: 'Full Time',
      experience: '5-8 years',
      workMode: 'Hybrid',
      responsibilities: [
        'Design and implement user interface components using React.js',
        'Optimize application for maximum speed and scalability',
        'Collaborate with back-end developers and web designers',
        'Write clean, maintainable, and efficient code',
        'Implement responsive design and ensure cross-browser compatibility',
        'Participate in code reviews and provide constructive feedback'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '5+ years of experience with React.js and modern JavaScript',
        'Strong proficiency in TypeScript and state management (Redux/MobX)',
        'Experience with modern frontend build pipelines and tools',
        'Excellent problem-solving and communication skills',
        'Knowledge of modern authorization mechanisms'
      ],
      benefits: [
        'Competitive salary package',
        'Health insurance for you and family',
        'Annual performance bonus',
        'Professional development opportunities',
        'Flexible work hours',
        'Regular team outings and events'
      ]
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'Infosys',
      location: 'Hyderabad',
      salary: '20-30 LPA',
      posted: '3 days ago',
      description: 'Looking for a Backend Engineer with strong Node.js and database skills to join our growing engineering team. You will be working on scalable microservices and cloud infrastructure.',
      skills: ['Node.js', 'MongoDB', 'Express', 'AWS', 'Docker'],
      type: 'Full Time',
      experience: '3-5 years',
      workMode: 'Remote',
      responsibilities: [
        'Design and implement scalable backend services',
        'Write clean, testable code with unit tests',
        'Optimize database queries for performance',
        'Implement security and data protection measures',
        'Create and maintain technical documentation',
        'Mentor junior developers'
      ],
      requirements: [
        'Bachelor\'s/Master\'s degree in Computer Science',
        '3+ years experience with Node.js and Express',
        'Strong understanding of MongoDB and database design',
        'Experience with AWS services',
        'Knowledge of Docker and containerization',
        'Excellent debugging and problem-solving skills'
      ],
      benefits: [
        'Competitive compensation package',
        'Remote work flexibility',
        'Health and dental insurance',
        'Learning and development budget',
        'Stock options',
        'Internet allowance'
      ]
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Wipro',
      location: 'Pune',
      salary: '18-28 LPA',
      posted: '5 days ago',
      description: 'Wipro is hiring Full Stack Developers with experience in MERN stack development.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express'],
      type: 'Full Time',
      experience: '4-7 years',
      workMode: 'Hybrid',
      responsibilities: [
        'Design and implement user interface components using React.js',
        'Optimize application for maximum speed and scalability',
        'Collaborate with back-end developers and web designers',
        'Write clean, maintainable, and efficient code',
        'Implement responsive design and ensure cross-browser compatibility',
        'Participate in code reviews and provide constructive feedback'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '4+ years of experience with React.js and modern JavaScript',
        'Strong proficiency in Node.js and MongoDB',
        'Experience with modern frontend build pipelines and tools',
        'Excellent problem-solving and communication skills',
        'Knowledge of modern authorization mechanisms'
      ],
      benefits: [
        'Competitive salary package',
        'Health insurance for you and family',
        'Annual performance bonus',
        'Professional development opportunities',
        'Flexible work hours',
        'Regular team outings and events'
      ]
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Accenture',
      location: 'Mumbai',
      salary: '15-25 LPA',
      posted: '1 week ago',
      description: 'Join our design team to create beautiful and intuitive user interfaces.',
      skills: ['Figma', 'Adobe XD', 'UI/UX'],
      type: 'Full Time',
      experience: '3-6 years',
      workMode: 'On-site',
      responsibilities: [
        'Design and implement user interface components using Figma and Adobe XD',
        'Optimize application for maximum speed and scalability',
        'Collaborate with back-end developers and web designers',
        'Write clean, maintainable, and efficient code',
        'Implement responsive design and ensure cross-browser compatibility',
        'Participate in code reviews and provide constructive feedback'
      ],
      requirements: [
        'Bachelor\'s degree in Computer Science or related field',
        '3+ years of experience with UI/UX design',
        'Strong proficiency in Figma and Adobe XD',
        'Experience with modern frontend build pipelines and tools',
        'Excellent problem-solving and communication skills',
        'Knowledge of modern authorization mechanisms'
      ],
      benefits: [
        'Competitive salary package',
        'Health insurance for you and family',
        'Annual performance bonus',
        'Professional development opportunities',
        'Flexible work hours',
        'Regular team outings and events'
      ]
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'HCL',
      location: 'Noida',
      salary: '22-32 LPA',
      posted: '2 weeks ago',
      description: 'Looking for a DevOps Engineer to improve our CI/CD pipeline and infrastructure.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      type: 'Full Time',
      experience: '4-8 years',
      workMode: 'Remote',
      responsibilities: [
        'Design and implement scalable backend services',
        'Write clean, testable code with unit tests',
        'Optimize database queries for performance',
        'Implement security and data protection measures',
        'Create and maintain technical documentation',
        'Mentor junior developers'
      ],
      requirements: [
        'Bachelor\'s/Master\'s degree in Computer Science',
        '4+ years experience with DevOps and CI/CD',
        'Strong understanding of AWS and Docker',
        'Experience with Kubernetes and containerization',
        'Knowledge of modern authorization mechanisms',
        'Excellent debugging and problem-solving skills'
      ],
      benefits: [
        'Competitive compensation package',
        'Remote work flexibility',
        'Health and dental insurance',
        'Learning and development budget',
        'Stock options',
        'Internet allowance'
      ]
    }
  ];

  const locations = ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi', 'Chennai', 'Noida'];
  const jobTypes = ['Full Time', 'Part Time', 'Contract', 'Internship'];
  const experienceLevels = ['0-2 years', '3-5 years', '5-8 years', '8+ years'];
  const workModes = ['Remote', 'Hybrid', 'On-site'];

  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleFilterChange = (type: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }));
  };

  useEffect(() => {
    const filtered = jobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const [minSalary] = job.salary.split('-').map(s => parseInt(s));
      const matchesSalary = minSalary >= filters.salaryRange[0] && minSalary <= filters.salaryRange[1];
      
      const matchesLocation = filters.locations.length === 0 || filters.locations.includes(job.location);
      const matchesJobType = filters.jobType.length === 0 || filters.jobType.includes(job.type);
      const matchesExperience = filters.experience.length === 0 || filters.experience.includes(job.experience);
      const matchesWorkMode = filters.workMode.length === 0 || filters.workMode.includes(job.workMode);

      return matchesSearch && matchesSalary && matchesLocation && 
             matchesJobType && matchesExperience && matchesWorkMode;
    });

    setFilteredJobs(filtered);
  }, [searchQuery, filters]);

  return (
    <DashboardLayout type="candidate">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/candidate/dashboard" 
              className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-blue-500/20"
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </Link>
            <h2 className="text-2xl font-semibold text-white">Find Your Next Role</h2>
          </div>
          <div className="text-sm text-white/70">
            {filteredJobs.length} jobs found
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-72 shrink-0 space-y-6">
            {/* Salary Range */}
            <div className="p-4 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl border border-blue-500/20">
              <h3 className="text-white font-medium mb-4">Salary Range (LPA)</h3>
              <div className="px-2">
                <Slider
                  value={filters.salaryRange}
                  min={5}
                  max={50}
                  step={5}
                  className="my-6"
                  onValueChange={(value) => handleFilterChange('salaryRange', value)}
                />
                <div className="flex justify-between text-sm text-white/70">
                  <span>₹{filters.salaryRange[0]} LPA</span>
                  <span>₹{filters.salaryRange[1]} LPA</span>
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div className="p-4 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl border border-blue-500/20">
              <h3 className="text-white font-medium mb-3">Location</h3>
              <div className="space-y-2">
                {locations.map(location => (
                  <label key={location} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.locations.includes(location)}
                      onChange={(e) => {
                        const newLocations = e.target.checked
                          ? [...filters.locations, location]
                          : filters.locations.filter(l => l !== location);
                        handleFilterChange('locations', newLocations);
                      }}
                      className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
                    />
                    <span className="text-white/70">{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Job Type Filter */}
            <div className="p-4 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl border border-blue-500/20">
              <h3 className="text-white font-medium mb-3">Job Type</h3>
              <div className="space-y-2">
                {jobTypes.map(type => (
                  <label key={type} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.jobType.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.jobType, type]
                          : filters.jobType.filter(t => t !== type);
                        handleFilterChange('jobType', newTypes);
                      }}
                      className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
                    />
                    <span className="text-white/70">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div className="p-4 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl border border-blue-500/20">
              <h3 className="text-white font-medium mb-3">Experience</h3>
              <div className="space-y-2">
                {experienceLevels.map(level => (
                  <label key={level} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.experience.includes(level)}
                      onChange={(e) => {
                        const newLevels = e.target.checked
                          ? [...filters.experience, level]
                          : filters.experience.filter(l => l !== level);
                        handleFilterChange('experience', newLevels);
                      }}
                      className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
                    />
                    <span className="text-white/70">{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Work Mode */}
            <div className="p-4 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl border border-blue-500/20">
              <h3 className="text-white font-medium mb-3">Work Mode</h3>
              <div className="space-y-2">
                {workModes.map(mode => (
                  <label key={mode} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.workMode.includes(mode)}
                      onChange={(e) => {
                        const newModes = e.target.checked
                          ? [...filters.workMode, mode]
                          : filters.workMode.filter(m => m !== mode);
                        handleFilterChange('workMode', newModes);
                      }}
                      className="rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500/30"
                    />
                    <span className="text-white/70">{mode}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search size={16} className="text-white/70" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search jobs by title, company, or skills"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div 
                  key={job.id}
                  className="p-6 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl shadow-sm border border-blue-500/20 backdrop-blur-sm hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-white">{job.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-white/70">
                        <div className="flex items-center gap-1">
                          <Building size={14} className="shrink-0" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="shrink-0" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Banknote size={14} className="shrink-0" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        className="border-blue-500/30 text-blue-400 hover:bg-blue-900/20"
                        onClick={() => setSelectedJob(job)}
                      >
                        View Details
                      </Button>
                      {isJobApplied(job.id) ? (
                        <Button disabled className="bg-green-500/20 text-green-400 hover:bg-green-500/20">
                          <CheckCircle2 size={16} className="mr-2" />
                          Applied
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => {
                            addApplication(job);
                            toast({
                              title: "Application Submitted!",
                              description: "Your application has been successfully submitted. We'll notify you of any updates.",
                              variant: "default",
                            });
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-white/70">{job.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-white/60">
                    <Clock size={14} />
                    <span>{job.posted}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Dialog */}
      {selectedJob && (
        <JobDetailsDialog
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          job={selectedJob}
        />
      )}
    </DashboardLayout>
  );
};

export default Jobs;
