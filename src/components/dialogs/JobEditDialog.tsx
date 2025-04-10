import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobEditDialogProps {
  open: boolean;
  onClose: () => void;
  jobData: JobListing;
  onSave: (updatedJob: JobListing) => void;
}

export interface JobListing {
  id: number;
  title: string;
  location: string;
  type: string;
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  postedDate: string;
  views: number;
  applicants: number;
  status: string;
}

export function JobEditDialog({ open, onClose, jobData, onSave }: JobEditDialogProps) {
  const [job, setJob] = useState<JobListing>(jobData);

  const handleSave = () => {
    onSave(job);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border border-gray-800 max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Job Listing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Job Title</Label>
            <Input
              value={job.title}
              onChange={(e) => setJob({ ...job, title: e.target.value })}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={job.location}
              onChange={(e) => setJob({ ...job, location: e.target.value })}
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label>Job Type</Label>
            <Select
              value={job.type}
              onValueChange={(value) => setJob({ ...job, type: value })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={job.salary.currency}
                onValueChange={(value) => setJob({ 
                  ...job, 
                  salary: { ...job.salary, currency: value }
                })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="INR">INR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Min Salary</Label>
              <Input
                type="number"
                value={job.salary.min}
                onChange={(e) => setJob({ 
                  ...job, 
                  salary: { ...job.salary, min: parseInt(e.target.value) }
                })}
                className="bg-gray-800 border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Label>Max Salary</Label>
              <Input
                type="number"
                value={job.salary.max}
                onChange={(e) => setJob({ 
                  ...job, 
                  salary: { ...job.salary, max: parseInt(e.target.value) }
                })}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Job Description</Label>
            <Textarea
              value={job.description}
              onChange={(e) => setJob({ ...job, description: e.target.value })}
              className="bg-gray-800 border-gray-700 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Requirements (one per line)</Label>
            <Textarea
              value={job.requirements.join('\n')}
              onChange={(e) => setJob({ 
                ...job, 
                requirements: e.target.value.split('\n').filter(r => r.trim())
              })}
              className="bg-gray-800 border-gray-700 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={job.status}
              onValueChange={(value) => setJob({ ...job, status: value })}
            >
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="bg-transparent text-white border-gray-600 hover:bg-gray-800">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
