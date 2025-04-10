import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Banknote, Clock, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApplicationStore } from '@/store/applications';

interface JobDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    posted: string;
    description: string;
    skills: string[];
    type: string;
    experience: string;
    workMode: string;
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
  };
}

export function JobDetailsDialog({ isOpen, onClose, job }: JobDetailsDialogProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { addApplication, isJobApplied } = useApplicationStore();
  const hasApplied = isJobApplied(job.id);
  const { toast } = useToast();

  const handleApply = async () => {
    setIsApplying(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    addApplication(job);
    setIsApplying(false);
    toast({
      title: "Application Submitted!",
      description: "Your application has been successfully submitted. We'll notify you of any updates.",
      variant: "default",
    });
  };

  const ApplyButton = () => (
    hasApplied ? (
      <Button disabled className="bg-green-500/20 text-green-400 hover:bg-green-500/20">
        <CheckCircle2 size={16} className="mr-2" />
        Applied
      </Button>
    ) : (
      <Button 
        onClick={handleApply} 
        disabled={isApplying}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isApplying ? "Applying..." : "Apply Now"}
      </Button>
    )
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 bg-gradient-to-b from-gray-800/95 to-black/95 border-blue-500/20 text-white overflow-hidden">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-gray-800/95 to-gray-800/90 backdrop-blur-sm px-6 py-4 border-b border-blue-500/20">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <DialogTitle className="text-2xl font-semibold text-white truncate pr-4">{job.title}</DialogTitle>
              <div className="shrink-0">
                <ApplyButton />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-white/70">
              <div className="flex items-center gap-1">
                <Building size={14} className="shrink-0" />
                <span className="truncate">{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Banknote size={14} className="shrink-0" />
                <span className="truncate">{job.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="shrink-0" />
                <span className="truncate">{job.posted}</span>
              </div>
            </div>
          </DialogHeader>
        </div>

        <ScrollArea className="px-6 py-4" style={{ height: 'calc(85vh - 120px)' }}>
          <div className="space-y-6">
            {/* Job Overview */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Job Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Briefcase size={14} className="shrink-0 text-blue-400" />
                  <span>Job Type: {job.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <GraduationCap size={14} className="shrink-0 text-blue-400" />
                  <span>Experience: {job.experience}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Description</h3>
              <p className="text-sm text-white/70 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Roles & Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((responsibility, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 size={14} className="shrink-0 mt-1 text-blue-400" />
                    <span>{responsibility}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 size={14} className="shrink-0 mt-1 text-blue-400" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 text-sm rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Benefits</h3>
              <ul className="space-y-2">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-white/70">
                    <CheckCircle2 size={14} className="shrink-0 mt-1 text-blue-400" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Apply Section */}
            <div className="pt-6 mt-8 border-t border-blue-500/20">
              <div className="flex flex-col items-center text-center space-y-4">
                <p className="text-sm text-white/70">
                  {!hasApplied 
                    ? "Ready to take the next step in your career? Apply now and join our team!" 
                    : "Thank you for your application! We'll review it and get back to you soon."}
                </p>
                <div className="w-full max-w-sm">
                  <ApplyButton />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
