
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BriefcaseIcon, Banknote, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { JobStatus } from './JobStatus';

export interface JobCardProps {
  id: string;
  title: string;
  company: string;
  location: string;
  salaryRange: string;
  jobType: string;
  postedAt: string;
  description: string;
  companyLogo?: string;
  isNew?: boolean;
  skills?: string[];
  status: string;
  className?: string;
}

const JobCard = ({
  id,
  title,
  company,
  location,
  salaryRange,
  jobType,
  postedAt,
  description,
  companyLogo,
  isNew = false,
  skills = [],
  status,
  className
}: JobCardProps) => {
  return (
    <Link
      to={`/job/${id}`}
      className={cn(
        "block bg-white dark:bg-gray-800 border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-shrink-0">
          <div className="w-14 h-14 bg-secondary rounded-lg flex items-center justify-center text-xl font-bold text-primary overflow-hidden">
            {companyLogo ? (
              <img src={companyLogo} alt={company} className="w-full h-full object-cover" />
            ) : (
              company.substring(0, 2).toUpperCase()
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-muted-foreground">{company}</p>
            </div>
            {isNew && (
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                New
              </span>
            )}
          </div>

          <div className="mt-3 text-sm text-muted-foreground">
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Banknote size={14} />
                <span>{salaryRange}</span>
              </div>
              <div className="flex items-center gap-1">
                <BriefcaseIcon size={14} />
                <span>{jobType}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{postedAt}</span>
              </div>
              <JobStatus status={status} />
            </div>
          </div>

          <p className="mt-3 text-sm line-clamp-2">{description}</p>

          {skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill} 
                  className="inline-flex items-center rounded-full bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
