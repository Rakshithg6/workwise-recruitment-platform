import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CandidateStatusBadgeProps {
  status: string;
  onStatusChange?: (newStatus: string) => void;
  className?: string;
}

const statusStyles = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  interview: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  reviewed: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  hired: 'bg-green-500/20 text-green-400 border-green-500/30',
  rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
};

const statusOptions = ['New', 'Interview', 'Reviewed', 'Hired', 'Rejected'];

export function CandidateStatusBadge({ status, onStatusChange, className }: CandidateStatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const statusStyle = statusStyles[normalizedStatus as keyof typeof statusStyles] || statusStyles.new;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          <span 
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
              statusStyle,
              className
            )}
          >
            {status}
            <ChevronDown size={12} className="ml-1" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {statusOptions.map((option) => (
          <DropdownMenuItem 
            key={option}
            onClick={() => onStatusChange?.(option)}
            className="flex items-center gap-2"
          >
            <span className={cn(
              "h-2 w-2 rounded-full",
              option.toLowerCase() === 'new' && "bg-blue-500",
              option.toLowerCase() === 'interview' && "bg-yellow-500",
              option.toLowerCase() === 'reviewed' && "bg-purple-500",
              option.toLowerCase() === 'hired' && "bg-green-500",
              option.toLowerCase() === 'rejected' && "bg-red-500"
            )} />
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
