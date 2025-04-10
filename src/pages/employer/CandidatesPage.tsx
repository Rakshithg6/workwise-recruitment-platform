import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CandidatesTable } from '@/components/employer/CandidatesTable';

const initialCandidates = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    jobApplied: 'Senior Frontend Developer',
    experience: '5',
    location: 'Bangalore, India',
    status: 'Interview',
    appliedDate: '4/12/2023'
  },
  {
    id: 2,
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    jobApplied: 'Product Manager',
    experience: '7',
    location: 'Mumbai, India',
    status: 'New',
    appliedDate: '4/15/2023'
  },
  {
    id: 3,
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    jobApplied: 'UX Designer',
    experience: '3',
    location: 'Delhi, India',
    status: 'Reviewed',
    appliedDate: '4/10/2023'
  },
  {
    id: 4,
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    jobApplied: 'DevOps Engineer',
    experience: '4',
    location: 'Hyderabad, India',
    status: 'Hired',
    appliedDate: '3/25/2023'
  },
  {
    id: 5,
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    jobApplied: 'Content Writer',
    experience: '2',
    location: 'Pune, India',
    status: 'Rejected',
    appliedDate: '3/20/2023'
  }
];

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState(initialCandidates);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query) {
      setCandidates(initialCandidates);
      return;
    }

    const filtered = initialCandidates.filter(candidate =>
      candidate.name.toLowerCase().includes(query.toLowerCase()) ||
      candidate.jobApplied.toLowerCase().includes(query.toLowerCase()) ||
      candidate.location.toLowerCase().includes(query.toLowerCase())
    );
    setCandidates(filtered);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-white">Candidates</h1>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-800 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        <CandidatesTable
          candidates={candidates}
          onCandidatesChange={setCandidates}
        />
      </div>
    </DashboardLayout>
  );
};

export default CandidatesPage;
