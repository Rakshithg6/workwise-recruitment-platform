import { useEffect, useState } from 'react';
import { Search, Filter, ArrowUpDown, Mail, Calendar, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FilterDialog, FilterOptions } from '@/components/dialogs/FilterDialog';
import { InterviewScheduleDialog } from '@/components/dialogs/InterviewScheduleDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  jobApplied: string;
  experience: string;
  location: string;
  status: 'New' | 'Reviewed' | 'Interview' | 'Hired' | 'Rejected';
  appliedDate: string;
  interview?: {
    date: string;
    time: string;
    type: 'remote' | 'offline';
    location: string;
  };
  percentage: string;
}

const Candidates = () => {
  const { toast } = useToast();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: keyof Candidate; direction: 'asc' | 'desc'}>({
    key: 'appliedDate',
    direction: 'desc'
  });

  useEffect(() => {
    document.title = 'Candidates | WorkWise';
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setCandidates(initialCandidates);
      return;
    }

    const filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(query.toLowerCase()) ||
      candidate.role.toLowerCase().includes(query.toLowerCase()) ||
      candidate.location.toLowerCase().includes(query.toLowerCase())
    );
    setCandidates(filtered);
  };

  const handleSort = (key: keyof Candidate) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));

    const sorted = [...candidates].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];

      if (key === 'experience') {
        aValue = parseInt(a.experience);
        bValue = parseInt(b.experience);
      } else if (key === 'appliedDate') {
        aValue = new Date(a.appliedDate).getTime();
        bValue = new Date(b.appliedDate).getTime();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    setCandidates(sorted);
  };

  const handleFilter = (filters: FilterOptions) => {
    // Start with all candidates
    let filtered = [...initialCandidates];

    // Apply experience filter
    if (filters.experience) {
      filtered = filtered.filter(candidate => {
        const years = parseInt(candidate.experience);
        if (!years) return false; // Invalid experience data

        if (filters.experience === '8+') {
          return years >= 8;
        }

        const [min, max] = filters.experience.split('-').map(Number);
        return years >= min && years <= max;
      });
    }

    // Apply role filter
    if (filters.role) {
      const roleMap: { [key: string]: RegExp } = {
        'senior-frontend': /senior.*frontend|frontend.*senior/i,
        'product-manager': /product.*manager/i,
        'ux-designer': /ux.*designer|user.*experience/i,
        'devops': /devops|dev.*ops/i,
        'content-writer': /content.*writer/i
      };

      filtered = filtered.filter(candidate => 
        roleMap[filters.role]?.test(candidate.role)
      );
    }

    // Apply percentage filter
    if (filters.percentage) {
      filtered = filtered.filter(candidate => {
        const percent = parseFloat(candidate.percentage);
        if (isNaN(percent)) return false; // Invalid percentage data

        const [min, max] = filters.percentage.split('-').map(Number);
        return percent >= min && percent <= max;
      });
    }

    // Update the state
    setCandidates(filtered);
    setIsFilterOpen(false);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsInterviewDialogOpen(true);
  };

  const handleStatusChange = (candidateId: number, newStatus: Candidate['status']) => {
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, status: newStatus }
        : candidate
    ) as Candidate[];
    setCandidates(updatedCandidates);

    // Save to localStorage
    const savedCandidates = localStorage.getItem('workwise-candidates');
    let allCandidates = savedCandidates ? JSON.parse(savedCandidates) : initialCandidates;
    allCandidates = allCandidates.map((c: Candidate) =>
      c.id === candidateId ? { ...c, status: newStatus } : c
    ) as Candidate[];
    localStorage.setItem('workwise-candidates', JSON.stringify(allCandidates));

    toast({
      title: "Status Updated",
      description: `Candidate status has been updated to ${newStatus}.`
    });
  };

  const handleInterviewScheduled = (interviewDetails: {
    date: string;
    time: string;
    type: 'remote' | 'offline';
    location: string;
  }) => {
    if (!selectedCandidate) return;

    handleStatusChange(selectedCandidate.id, 'Interview');
    
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === selectedCandidate.id
        ? { ...candidate, interview: interviewDetails }
        : candidate
    );
    setCandidates(updatedCandidates);
    setIsInterviewDialogOpen(false);
    setSelectedCandidate(null);

    // Send email notification
    fetch('/api/send-interview-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: selectedCandidate.email,
        subject: 'Interview Scheduled',
        candidateName: selectedCandidate.name,
        interviewDetails
      })
    }).catch((error) => {
      console.error('Failed to send email notification:', error);
    });
  };

  const initialCandidates: Candidate[] = [
    {
      id: 1,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      role: 'Senior Frontend Developer',
      jobApplied: 'Senior Frontend Developer',
      experience: '5 years',
      location: 'Bangalore, India',
      status: 'Interview',
      appliedDate: '2023-04-12',
      percentage: '80'
    },
    {
      id: 2,
      name: 'Rahul Kumar',
      email: 'rahul.kumar@example.com',
      role: 'Product Manager',
      jobApplied: 'Product Manager',
      experience: '7 years',
      location: 'Mumbai, India',
      status: 'New',
      appliedDate: '2023-04-15',
      percentage: '70'
    },
    {
      id: 3,
      name: 'Sneha Patel',
      email: 'sneha.patel@example.com',
      role: 'UX Designer',
      jobApplied: 'UX Designer',
      experience: '3 years',
      location: 'Delhi, India',
      status: 'Reviewed',
      appliedDate: '2023-04-10',
      percentage: '90'
    },
    {
      id: 4,
      name: 'Arjun Singh',
      email: 'arjun.singh@example.com',
      role: 'DevOps Engineer',
      jobApplied: 'DevOps Engineer',
      experience: '4 years',
      location: 'Hyderabad, India',
      status: 'Hired',
      appliedDate: '2023-03-25',
      percentage: '85'
    },
    {
      id: 5,
      name: 'Neha Gupta',
      email: 'neha.gupta@example.com',
      role: 'Content Writer',
      jobApplied: 'Content Writer',
      experience: '2 years',
      location: 'Pune, India',
      status: 'Rejected',
      appliedDate: '2023-03-20',
      percentage: '60'
    },
  ];

  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  function getStatusColor(status: Candidate['status']) {
    switch (status) {
      case 'New': return 'bg-blue-900/30 text-blue-400';
      case 'Reviewed': return 'bg-purple-900/30 text-purple-400';
      case 'Interview': return 'bg-yellow-900/30 text-yellow-400';
      case 'Hired': return 'bg-green-900/30 text-green-400';
      case 'Rejected': return 'bg-red-900/30 text-red-400';
    }
  }

  return (
    <DashboardLayout type="employer">
      <div className="flex flex-col gap-6">
        {/* Header with search and filter */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Recent Applicants</h2>
          <Link to="/employer/all-candidates" className="text-blue-500 hover:text-blue-400">
            View all
          </Link>
        </div>

        {/* Search and filter controls */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute left-3 top-0 bottom-0 flex items-center">
              <Search className="h-4 w-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search candidates"
              className="block w-full rounded-lg border border-gray-700/50 bg-gray-800/40 py-2.5 pl-10 pr-3 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 border-gray-700/50 text-white hover:bg-gray-700/50"
          >
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Table section */}
        <div className="bg-black/60 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Candidate</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Job Applied</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Experience</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-white/70">Applied Date</th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-white/70">Actions</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Avatar className="mr-3 h-8 w-8 bg-primary/20 text-primary">
                          <AvatarFallback>{getInitials(candidate.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link to={`/employer/candidates/${candidate.id}`} className="text-sm font-medium text-white hover:text-primary">
                            {candidate.name}
                          </Link>
                          <p className="text-xs text-white/70">{candidate.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">{candidate.jobApplied}</td>
                    <td className="px-6 py-4 text-sm text-white">{candidate.experience}</td>
                    <td className="px-6 py-4 text-sm text-white">{candidate.location}</td>
                    <td className="px-6 py-4 text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="focus:outline-none">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(candidate.status)}`}>
                              {candidate.status}
                              <ChevronDown className="h-3 w-3" />
                            </span>
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-[140px]">
                          {['New', 'Interview', 'Reviewed', 'Hired', 'Rejected'].map((status) => (
                            <DropdownMenuItem 
                              key={status} 
                              onClick={() => handleStatusChange(candidate.id, status as Candidate['status'])}
                              className="flex items-center gap-2"
                            >
                              <span className={`h-2 w-2 rounded-full ${
                                status === 'New' ? 'bg-blue-500' :
                                status === 'Interview' ? 'bg-yellow-500' :
                                status === 'Reviewed' ? 'bg-purple-500' :
                                status === 'Hired' ? 'bg-green-500' :
                                'bg-red-500'
                              }`} />
                              {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {new Date(candidate.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/10"
                          asChild
                        >
                          <Link to={`/employer/messages?candidate=${candidate.id}`}>
                            <Mail size={16} />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-white hover:bg-white/10"
                          asChild
                        >
                          <button onClick={() => handleScheduleInterview(candidate)}>
                            <Calendar size={16} />
                          </button>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <FilterDialog
          open={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={handleFilter}
        />

        {selectedCandidate && (
          <InterviewScheduleDialog
            open={isInterviewDialogOpen}
            onClose={() => {
              setIsInterviewDialogOpen(false);
              setSelectedCandidate(null);
            }}
            candidate={{
              id: selectedCandidate.id,
              name: selectedCandidate.name,
              email: selectedCandidate.email
            }}
            existingInterview={selectedCandidate.interview}
            onSchedule={handleInterviewScheduled}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Candidates;
