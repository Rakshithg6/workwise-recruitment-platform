import React, { useState } from 'react';
import { Calendar, Filter, ArrowUpDown } from 'lucide-react';
import { CandidateStatusBadge } from '@/components/ui/CandidateStatusBadge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { FilterDialog } from '@/components/dialogs/FilterDialog';
import { InterviewScheduleDialog } from '@/components/dialogs/InterviewScheduleDialog';

interface Candidate {
  id: number;
  name: string;
  email: string;
  jobApplied: string;
  experience: string;
  location: string;
  status: string;
  appliedDate: string;
  interview?: {
    date: string;
    time: string;
    type: 'remote' | 'offline';
    location: string;
  };
}

interface CandidatesTableProps {
  candidates: Candidate[];
  onCandidatesChange: (candidates: Candidate[]) => void;
}

export const CandidatesTable: React.FC<CandidatesTableProps> = ({
  candidates,
  onCandidatesChange
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInterviewDialogOpen, setIsInterviewDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Candidate;
    direction: 'asc' | 'desc';
  }>({ key: 'appliedDate', direction: 'desc' });

  const handleSort = (key: keyof Candidate) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));

    const sortedCandidates = [...candidates].sort((a, b) => {
      if (a[key] < b[key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    onCandidatesChange(sortedCandidates);
  };

  const handleFilter = (filters: any) => {
    let filtered = [...candidates];

    if (filters.experience) {
      filtered = filtered.filter(candidate => {
        const years = parseInt(candidate.experience);
        const [min, max] = filters.experience.split('-').map(Number);
        return years >= min && years <= max;
      });
    }

    if (filters.status) {
      filtered = filtered.filter(candidate => 
        candidate.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    onCandidatesChange(filtered);
    setIsFilterOpen(false);
  };

  const handleScheduleInterview = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsInterviewDialogOpen(true);
  };

  const handleStatusChange = (candidateId: number, newStatus: string) => {
    const updatedCandidates = candidates.map(candidate =>
      candidate.id === candidateId
        ? { ...candidate, status: newStatus }
        : candidate
    );
    onCandidatesChange(updatedCandidates);
  };

  const handleInterviewScheduled = (interviewDetails: any) => {
    if (!selectedCandidate) return;

    const updatedCandidates = candidates.map(candidate =>
      candidate.id === selectedCandidate.id
        ? { ...candidate, interview: interviewDetails, status: 'Interview' }
        : candidate
    );

    onCandidatesChange(updatedCandidates);
    setIsInterviewDialogOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <>
      <div className="flex justify-end gap-2 mb-4">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter size={16} />
          Filter
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpDown size={16} />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSort('name')}>
              Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('experience')}>
              Experience {sortConfig.key === 'experience' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('appliedDate')}>
              Applied Date {sortConfig.key === 'appliedDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-900/50">
              <th className="p-3 text-left">Candidate</th>
              <th className="p-3 text-left">Job Applied</th>
              <th className="p-3 text-left">Experience</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Applied Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map(candidate => (
              <tr key={candidate.id} className="border-b">
                <td className="p-3">{candidate.name}</td>
                <td className="p-3">{candidate.jobApplied}</td>
                <td className="p-3">{candidate.experience}</td>
                <td className="p-3">{candidate.location}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    candidate.status === 'New' ? 'bg-blue-500/20 text-blue-500' :
                    candidate.status === 'Interview' ? 'bg-amber-500/20 text-amber-500' :
                    candidate.status === 'Hired' ? 'bg-green-500/20 text-green-500' :
                    candidate.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="p-3">{candidate.appliedDate}</td>
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleScheduleInterview(candidate)}
                  >
                    <Calendar size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
          candidate={selectedCandidate}
          existingInterview={selectedCandidate.interview}
          onSchedule={handleInterviewScheduled}
        />
      )}
    </>
  );
};
