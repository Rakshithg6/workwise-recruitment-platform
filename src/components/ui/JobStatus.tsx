import { cn } from '@/lib/utils';

interface JobStatusProps {
  status: string;
  className?: string;
}

const statusStyles = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  closed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  archived: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
};

export function JobStatus({ status, className }: JobStatusProps) {
  const normalizedStatus = status.toLowerCase();
  const statusStyle = statusStyles[normalizedStatus as keyof typeof statusStyles] || statusStyles.draft;

  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        statusStyle,
        className
      )}
    >
      {status}
    </span>
  );
}
