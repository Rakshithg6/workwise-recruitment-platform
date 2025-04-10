
import { useEffect, useState } from 'react';
import { Plus, Search, Filter, ArrowUpDown, Briefcase, ChevronDown, Eye, ArrowLeft, Edit } from 'lucide-react';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  applicants: number;
  status: 'Active' | 'Paused' | 'Closed';
  postedDate: string;
}

const JobListings = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Job Listings | WorkWise';
  }, []);

  const [jobs, setJobs] = useState<Job[]>(() => {
    // Try to load jobs from localStorage first
    const savedJobs = localStorage.getItem('workwise-job-listings');
    if (savedJobs) {
      try {
        return JSON.parse(savedJobs);
      } catch (e) {
        console.error('Failed to parse saved jobs:', e);
      }
    }
    
    // Default jobs if nothing in localStorage
    return [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'Remote, India',
        applicants: 24,
        status: 'Active',
        postedDate: '2023-04-15',
      },
      {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        location: 'Bangalore, India',
        applicants: 18,
        status: 'Active',
        postedDate: '2023-04-10',
      },
      {
        id: 3,
        title: 'UX Designer',
        department: 'Design',
        location: 'Remote, India',
        applicants: 32,
        status: 'Active',
        postedDate: '2023-04-05',
      },
      {
        id: 4,
        title: 'DevOps Engineer',
        department: 'Engineering',
        location: 'Hyderabad, India',
        applicants: 12,
        status: 'Paused',
        postedDate: '2023-03-28',
      },
      {
        id: 5,
        title: 'Content Writer',
        department: 'Marketing',
        location: 'Remote, India',
        applicants: 45,
        status: 'Closed',
        postedDate: '2023-03-15',
      },
    ];
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'All' | 'Active' | 'Paused' | 'Closed'>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'applicants' | 'title'>('newest');
  
  // Save jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('workwise-job-listings', JSON.stringify(jobs));
  }, [jobs]);
  
  // Handle adding a new job
  const handleAddJob = () => {
    navigate('/post-job');
  };
  
  // Handle status change for a job
  const handleStatusChange = (id: number, newStatus: 'Active' | 'Paused' | 'Closed') => {
    const updatedJobs = jobs.map(job => 
      job.id === id ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);
    
    toast({
      title: "Status Updated",
      description: `Job status has been updated to ${newStatus}.`
    });
  };
  
  // Filter and sort jobs
  const filteredAndSortedJobs = jobs
    .filter(job => {
      // Apply search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        return (
          job.title.toLowerCase().includes(search) ||
          job.department.toLowerCase().includes(search) ||
          job.location.toLowerCase().includes(search)
        );
      }
      return true;
    })
    .filter(job => {
      // Apply status filter
      if (filter !== 'All') {
        return job.status === filter;
      }
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortBy) {
        case 'newest':
          return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime();
        case 'oldest':
          return new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime();
        case 'applicants':
          return b.applicants - a.applicants;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

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
            <h1 className="text-2xl font-bold text-white">Job Listings</h1>
          </div>
          <Button 
            onClick={handleAddJob}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-5 py-2.5 shadow-xl shadow-blue-500/20 border-2 border-blue-400/50 h-auto text-base"
          >
            <Plus size={20} className="mr-2" />
            Post New Job
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={18} />
            <input
              type="text"
              placeholder="Search job listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 py-2 bg-black/30 border border-indigo-500/30 rounded-lg focus:ring-1 focus:ring-indigo-500/50 focus:outline-none text-white placeholder:text-white/50"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-indigo-500/30 text-white hover:bg-indigo-600/20">
                  <Filter size={16} className="mr-2" />
                  Filter: {filter}
                  <ChevronDown size={14} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setFilter('All')}>
                    All Statuses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Active')}>
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Paused')}>
                    Paused Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter('Closed')}>
                    Closed Only
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-indigo-500/30 text-white hover:bg-indigo-600/20">
                  <ArrowUpDown size={16} className="mr-2" />
                  Sort
                  <ChevronDown size={14} className="ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSortBy('newest')}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('applicants')}>
                    Most Applicants
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('title')}>
                    Alphabetical (A-Z)
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-800/90 to-black/90 border border-indigo-500/20 rounded-xl overflow-hidden backdrop-blur-sm shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-indigo-500/20 bg-black/30">
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Job Title</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Department</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Applicants</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Posted Date</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedJobs.length > 0 ? (
                  filteredAndSortedJobs.map((job) => (
                    <tr key={job.id} className="border-b border-indigo-500/20 hover:bg-indigo-900/10 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">
                        <Link to={`/employer/job/${job.id}`} className="hover:text-indigo-400">
                          {job.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{job.department}</td>
                      <td className="px-6 py-4 text-sm text-white">{job.location}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        <Link to={`/employer/job/${job.id}/candidates`} className="hover:text-indigo-400">
                          {job.applicants} applicants
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button>
                              <StatusBadge status={job.status} showDropdownIndicator={true} />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-40">
                            <DropdownMenuGroup>
                              <DropdownMenuItem onClick={() => handleStatusChange(job.id, 'Active')}>
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                Active
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(job.id, 'Paused')}>
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                                Paused
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(job.id, 'Closed')}>
                                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                                Closed
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {new Date(job.postedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-white hover:bg-indigo-600/20"
                            onClick={() => navigate(`/employer/job/${job.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-white hover:bg-indigo-600/20"
                            onClick={() => navigate(`/employer/job/${job.id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-white/60">
                      {searchTerm || filter !== 'All' ? 
                        "No jobs match your current filters." : 
                        "No jobs posted yet. Click 'Post New Job' to create your first job listing."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Floating Post Job Button */}
        <div className="fixed bottom-24 right-6 z-30">
          <Button 
            onClick={() => navigate('/post-job')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-lg text-base shadow-xl shadow-blue-500/30 border-2 border-blue-400/50"
          >
            <Briefcase size={20} className="mr-2" />
            Post New Job
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default JobListings;
