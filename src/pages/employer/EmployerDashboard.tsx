import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BriefcaseIcon, Users, CalendarClock, TrendingUp, Search, Clock, Filter,
  ChevronRight, BarChart, PieChart, LineChart, Edit 
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useUser } from '@/contexts/UserContext';
import { FilterDialog, FilterOptions } from '@/components/dialogs/FilterDialog';
import { JobEditDialog, JobListing } from '@/components/dialogs/JobEditDialog';

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const { userData } = useUser();
  const [dashboardStats, setDashboardStats] = useState({
    totalCandidates: 0,
    newApplications: 0,
    weeklyViews: 0,
    hiringRate: 0,
    activeJobs: 0
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isJobEditOpen, setIsJobEditOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    experience: '',
    role: '',
    status: ''
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCandidates, setFilteredCandidates] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Senior Frontend Developer',
      experience: '7 years',
      applied: '2 days ago',
      match: '92%',
      status: 'Applied'
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Backend Engineer',
      experience: '5 years',
      applied: '3 days ago',
      match: '87%',
      status: 'Interview'
    },
    {
      id: 3,
      name: 'Vikram Singh',
      role: 'Full Stack Developer',
      experience: '4 years',
      applied: '1 day ago',
      match: '78%',
      status: 'New'
    },
    {
      id: 4,
      name: 'Ananya Gupta',
      role: 'UI/UX Designer',
      experience: '6 years',
      applied: '4 hours ago',
      match: '95%',
      status: 'Shortlisted'
    },
  ]);

  const recentCandidates = [
    {
      id: 1,
      name: 'Rahul Sharma',
      role: 'Senior Frontend Developer',
      experience: '7 years',
      applied: '2 days ago',
      match: '92%',
      status: 'Applied'
    },
    {
      id: 2,
      name: 'Priya Patel',
      role: 'Backend Engineer',
      experience: '5 years',
      applied: '3 days ago',
      match: '87%',
      status: 'Interview'
    },
    {
      id: 3,
      name: 'Vikram Singh',
      role: 'Full Stack Developer',
      experience: '4 years',
      applied: '1 day ago',
      match: '78%',
      status: 'New'
    },
    {
      id: 4,
      name: 'Ananya Gupta',
      role: 'UI/UX Designer',
      experience: '6 years',
      applied: '4 hours ago',
      match: '95%',
      status: 'Shortlisted'
    },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidate: 'Ananya Desai',
      role: 'DevOps Engineer',
      date: 'May 15, 2023',
      time: '2:00 PM',
    },
    {
      id: 2,
      candidate: 'Karthik Reddy',
      role: 'Software Development Engineer',
      date: 'May 18, 2023',
      time: '11:30 AM',
    },
    {
      id: 3,
      candidate: 'Shreya Verma',
      role: 'Product Manager',
      date: 'May 20, 2023',
      time: '3:30 PM',
    },
  ];

  const activeJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      location: 'New York',
      postedDate: '2023-05-01',
      views: 120,
      applicants: 2,
      salary: { min: 100000, max: 150000, currency: 'USD' },
      requirements: ['JavaScript', 'React', 'CSS'],
      status: 'active'
    },
    {
      id: 2,
      title: 'Backend Engineer',
      location: 'San Francisco',
      postedDate: '2023-05-05',
      views: 90,
      applicants: 2,
      salary: { min: 80000, max: 120000, currency: 'USD' },
      requirements: ['Java', 'Spring Boot', 'MySQL'],
      status: 'paused'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      location: 'Chicago',
      postedDate: '2023-05-10',
      views: 150,
      applicants: 2,
      salary: { min: 90000, max: 140000, currency: 'USD' },
      requirements: ['JavaScript', 'React', 'Node.js'],
      status: 'closed'
    },
  ];

  useEffect(() => {
    document.title = 'Employer Dashboard | WorkWise';
    
    // Initialize dashboard stats with the required values
    setDashboardStats({
      activeJobs: 3,          // Set active jobs to 3
      totalCandidates: 5,     // Set total candidates to 5
      newApplications: 2,     // New applications this week
      weeklyViews: 150,       // Job posting views this week
      hiringRate: 75          // Set conversion/hiring rate to 75%
    });

    // Load data from localStorage or initialize if not present
    const jobListings = [
      {
        id: 'job1',
        title: 'Senior Software Engineer',
        company: 'WorkWise',
        location: 'Bangalore',
        type: 'Full-time',
        description: 'Seeking a senior software engineer...',
        requirements: ['5+ years experience', 'React', 'Node.js'],
        status: 'active',
        postedDate: '2025-04-05',
        applications: 12
      },
      {
        id: 'job2',
        title: 'Product Manager',
        company: 'WorkWise',
        location: 'Mumbai',
        type: 'Full-time',
        description: 'Seeking a product manager to lead our team...',
        requirements: ['3+ years experience', 'Agile', 'Product Development'],
        status: 'active',
        applications: 8
      },
      {
        id: 'job3',
        title: 'UI/UX Designer',
        company: 'WorkWise',
        location: 'Bangalore',
        type: 'Full-time',
        description: 'Seeking a UI/UX designer to join our team...',
        requirements: ['3+ years experience', 'Figma', 'User Research'],
        status: 'active',
        applications: 5
      }
    ];

    localStorage.setItem('workwise-job-listings', JSON.stringify(jobListings));

    const candidates = [
      {
        id: 'cand1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        experience: 5,
        skills: ['React', 'Node.js', 'TypeScript'],
        status: 'interviewing',
        appliedFor: 'job1'
      },
      {
        id: 'cand2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        experience: 3,
        skills: ['Product Management', 'Agile', 'JIRA'],
        status: 'interviewing',
        appliedFor: 'job2'
      },
      {
        id: 'cand3',
        name: 'Priya Kumar',
        email: 'priya@example.com',
        phone: '+91 9876543212',
        experience: 4,
        skills: ['UI/UX', 'Figma', 'User Research'],
        status: 'shortlisted',
        appliedFor: 'job3'
      },
      {
        id: 'cand4',
        name: 'Raj Malhotra',
        email: 'raj@example.com',
        phone: '+91 9876543213',
        experience: 6,
        skills: ['React', 'Angular', 'Vue'],
        status: 'applied',
        appliedFor: 'job1'
      },
      {
        id: 'cand5',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+91 9876543214',
        experience: 4,
        skills: ['Product Design', 'User Research', 'Prototyping'],
        status: 'applied',
        appliedFor: 'job3'
      }
    ];

    localStorage.setItem('workwise-candidates', JSON.stringify(candidates));

    const interviews = [
      {
        id: 'int1',
        candidateId: 'cand1',
        jobId: 'job1',
        date: '2025-04-10',
        time: '14:00',
        type: 'video',
        status: 'scheduled',
        meetingLink: 'https://meet.workwise.com/int1'
      },
      {
        id: 'int2',
        candidateId: 'cand2',
        jobId: 'job2',
        date: '2025-04-10',
        time: '16:30',
        type: 'phone',
        status: 'scheduled'
      },
      {
        id: 'int3',
        candidateId: 'cand3',
        jobId: 'job3',
        date: '2025-04-11',
        time: '11:00',
        type: 'onsite',
        status: 'scheduled'
      }
    ];

    localStorage.setItem('workwise-interviews', JSON.stringify(interviews));
  }, []);

  const getJobListings = () => {
    const savedJobs = localStorage.getItem('workwise-job-listings');
    if (savedJobs) {
      try {
        return JSON.parse(savedJobs);
      } catch (e) {
        console.error('Failed to parse saved jobs:', e);
      }
    }
    return [];
  };

  // Handle filter application
  const handleFilterApply = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    let filtered = [...recentCandidates];
    
    if (newFilters.experience) {
      filtered = filtered.filter(candidate => {
        const years = parseInt(candidate.experience);
        if (newFilters.experience === '8+') {
          return years >= 8;
        }
        const [min, max] = newFilters.experience.split('-').map(Number);
        return years >= min && years <= max;
      });
    }
    
    if (newFilters.role) {
      filtered = filtered.filter(candidate => {
        const candidateRole = candidate.role.toLowerCase();
        const filterRole = newFilters.role.toLowerCase();
        return candidateRole.includes(filterRole) || 
               (filterRole === 'frontend' && candidateRole.includes('front')) ||
               (filterRole === 'backend' && candidateRole.includes('back')) ||
               (filterRole === 'fullstack' && (candidateRole.includes('full') || candidateRole.includes('stack'))) ||
               (filterRole === 'ui' && (candidateRole.includes('ui') || candidateRole.includes('ux'))) ||
               (filterRole === 'devops' && candidateRole.includes('devops'));
      });
    }
    
    if (newFilters.status) {
      filtered = filtered.filter(candidate => {
        const candidateStatus = candidate.status.toLowerCase();
        const filterStatus = newFilters.status.toLowerCase();
        return candidateStatus.includes(filterStatus);
      });
    }
    
    setFilteredCandidates(filtered);
  };

  const handleJobEdit = (job: any) => {
    setSelectedJob({
      ...job,
      salary: job.salary || { min: 0, max: 0, currency: 'USD' },
      requirements: job.requirements || [],
      status: job.status || 'active'
    });
    setIsJobEditOpen(true);
  };

  const handleJobUpdate = (updatedJob: JobListing) => {
    const jobs = getJobListings();
    const updatedJobs = jobs.map(job => 
      job.id === updatedJob.id ? updatedJob : job
    );
    localStorage.setItem('workwise-job-listings', JSON.stringify(updatedJobs));
  };

  const handleCandidateSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCandidates(recentCandidates);
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const filtered = recentCandidates.filter(candidate => 
      candidate.name.toLowerCase().includes(lowerQuery) ||
      candidate.role.toLowerCase().includes(lowerQuery)
    );
    
    setFilteredCandidates(filtered);
  };

  return (
    <DashboardLayout type="employer">
      {/* Welcome Message */}
      <div className="mb-8 bg-gradient-to-r from-black/90 to-gray-900/80 backdrop-blur-sm text-white p-6 rounded-xl border border-white/10 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Welcome back, {userData.firstName || 'there'}!</h1>
        <p className="text-white/80">Your hiring dashboard is showing positive trends this week with {dashboardStats.newApplications} new applicants and {dashboardStats.totalCandidates} candidates shortlisted.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Active Jobs</h3>
            <div className="p-2 rounded-full bg-blue-900/30 text-blue-400">
              <BriefcaseIcon size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{dashboardStats.activeJobs}</p>
          <p className="text-sm text-white/70">Open positions</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link to="/employer/jobs" className="text-primary text-sm flex items-center">
              View all jobs <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Candidates</h3>
            <div className="p-2 rounded-full bg-green-900/30 text-green-400">
              <Users size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{dashboardStats.totalCandidates}</p>
          <p className="text-sm text-white/70">{dashboardStats.newApplications} new this week</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link to="/employer/candidates" className="text-primary text-sm flex items-center">
              View candidates <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Interviews</h3>
            <div className="p-2 rounded-full bg-purple-900/30 text-purple-400">
              <CalendarClock size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{upcomingInterviews.length}</p>
          <p className="text-sm text-white/70">Scheduled this week</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link to="/employer/interviews" className="text-primary text-sm flex items-center">
              View schedule <ChevronRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium text-white">Conversion</h3>
            <div className="p-2 rounded-full bg-amber-900/30 text-amber-400">
              <TrendingUp size={18} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{dashboardStats.hiringRate}%</p>
          <p className="text-sm text-white/70">Hiring success rate</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <Link to="/employer/analytics" className="text-primary text-sm flex items-center">
              View analytics <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Recent Applicants</h3>
              <Link to="/employer/candidates" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder="Search candidates"
                  value={searchQuery}
                  onChange={(e) => handleCandidateSearch(e.target.value)}
                  className="input-primary pl-10 w-full bg-black/30 border border-white/10 text-white placeholder:text-white/50"
                />
              </div>
              
              <button 
                onClick={() => setIsFilterOpen(true)}
                className="button-outline flex items-center gap-2 border border-white/10 px-3 py-2 rounded-md hover:bg-white/5 transition-colors text-white"
              >
                <Filter size={16} />
                <span>Filter</span>
              </button>
            </div>
            
            <div className="space-y-4">
              {filteredCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className="block"
                  onClick={() => navigate(`/employer/candidates/${candidate.id}`)}
                >
                  <div className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{candidate.name}</h4>
                        <p className="text-sm text-white/70">{candidate.role} • {candidate.experience}</p>
                      </div>
                      <span className="text-sm font-medium px-2 py-0.5 bg-white/10 text-primary rounded-full">
                        {candidate.match} match
                      </span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-white/70">
                      <Clock size={14} className="mr-1" />
                      <span>Applied {candidate.applied}</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-white/70">
                      <span>Status: {candidate.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 mt-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Active Job Listings</h3>
              <Link to="/employer/jobs" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            
            <div className="space-y-4">
              {activeJobs.length > 0 ? (
                activeJobs.map((job) => (
                  <div key={job.id} className="p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{job.title}</h4>
                        <p className="text-sm text-white/70">
                          <span className="inline-block px-2 py-0.5 bg-black/50 text-white rounded-full text-xs mr-2">
                            {job.location}
                          </span>
                          Posted {new Date(job.postedDate).toLocaleDateString()} • {job.views || Math.floor(Math.random() * 200) + 100} views
                        </p>
                      </div>
                      <span className="text-sm font-medium px-2 py-0.5 bg-blue-900/20 text-blue-400 rounded-full">
                        {job.applicants} applicants
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/employer/job/${job.id}`} className="text-sm button-outline py-1 px-3 border border-white/10 rounded-md hover:bg-white/5 transition-colors text-white">
                        View Details
                      </Link>
                      <button 
                        onClick={() => handleJobEdit(job)}
                        className="text-sm button-outline py-1 px-3 border border-white/10 rounded-md hover:bg-white/5 transition-colors text-white"
                      >
                        <Edit size={14} className="inline mr-1" />
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 bg-black/30 rounded-lg border border-white/10">
                  <BriefcaseIcon size={32} className="mx-auto text-white/30 mb-2" />
                  <p className="text-white/70 mb-4">No active job listings</p>
                  <Link to="/post-job" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md inline-block text-center hover:bg-primary/90 transition-colors w-full">
                    Post Your First Job
                  </Link>
                </div>
              )}
            </div>
            
            <Link to="/post-job" className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 px-4 rounded-md inline-block text-center hover:bg-primary/90 transition-colors w-full">
              Post New Job
            </Link>
          </div>
        </div>
        
        <div>
          <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Upcoming Interviews</h3>
              <Link to="/employer/interviews" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-3">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-white">{interview.candidate}</h4>
                      <span className="text-xs px-2 py-0.5 bg-white/10 text-primary rounded-full">
                        {interview.date}
                      </span>
                    </div>
                    <p className="text-sm text-white/70">{interview.role}</p>
                    <div className="flex items-center mt-2 text-xs">
                      <Clock size={14} className="mr-1 text-white/70" />
                      <span className="text-white/70">{interview.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarClock size={40} className="mx-auto text-white/50 mb-2" />
                <p className="text-white/70">No upcoming interviews</p>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-black/60 rounded-xl shadow-sm border border-white/10 mt-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-4 text-white">Hiring Activity</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/90">Applications this week</span>
                <span className="font-medium text-white">{dashboardStats.newApplications}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/90">Interviews conducted</span>
                <span className="font-medium text-white">{Math.floor(dashboardStats.newApplications * 0.6)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/90">Candidates shortlisted</span>
                <span className="font-medium text-white">{Math.floor(dashboardStats.newApplications * 0.4)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/90">Positions filled</span>
                <span className="font-medium text-white">{Math.floor(Math.random() * 5) + 1}</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="font-medium mb-2 text-white">Time to fill positions</h4>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white">18</span>
                <span className="text-sm text-white/70 ml-1">days on average</span>
              </div>
              <div className="flex items-center text-sm text-green-400 mt-1">
                <TrendingUp size={14} className="mr-1" />
                <span>15% faster than industry average</span>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="font-medium mb-3 text-white">Weekly Overview</h4>
              <div className="h-[120px] flex items-end justify-between">
                {[
                  { day: 'M', views: 45 },
                  { day: 'T', views: 75 },
                  { day: 'W', views: 35 },
                  { day: 'T', views: 50 },
                  { day: 'F', views: 60 },
                  { day: 'S', views: 30 },
                  { day: 'S', views: 55 }
                ].map((data, i) => {
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div 
                        style={{ height: data.views + 'px' }}
                        className="w-6 bg-primary/30 rounded-t-md relative group"
                      >
                        <div className="absolute bottom-full mb-1 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {data.views} views
                        </div>
                      </div>
                      <span className="text-xs mt-1 text-white/70">
                        {data.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <FilterDialog
        open={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />

      {selectedJob && (
        <JobEditDialog
          open={isJobEditOpen}
          onClose={() => setIsJobEditOpen(false)}
          jobData={selectedJob}
          onSave={handleJobUpdate}
        />
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
