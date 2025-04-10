import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  showDropdownIndicator?: boolean;
  className?: string;
}

const statusStyles = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  closed: 'bg-red-500/20 text-red-400 border-red-500/30',
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  archived: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
};

export function StatusBadge({ status, showDropdownIndicator = false, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  const statusStyle = statusStyles[normalizedStatus as keyof typeof statusStyles] || statusStyles.draft;

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
        statusStyle,
        className
      )}
    >
      {status}
      {showDropdownIndicator && (
        <ChevronDown size={12} className="ml-1" />
      )}
    </span>
  );
}
