
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import ScheduleInterview from '@/components/interview/ScheduleInterview';

interface ScheduleInterviewDialogProps {
  isOpen: boolean;
  candidateId?: number;
  candidateName: string;
  onSchedule: (interviewData: any) => void;
  onClose: () => void;
}

const ScheduleInterviewDialog = ({
  isOpen,
  candidateId,
  candidateName,
  onSchedule,
  onClose
}: ScheduleInterviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl text-white">Schedule Interview</DialogTitle>
          <DialogDescription className="text-gray-400">
            Set up an interview with {candidateName}
          </DialogDescription>
        </DialogHeader>
        <ScheduleInterview
          candidateId={candidateId}
          candidateName={candidateName}
          onSchedule={onSchedule}
          onClose={onClose}
          isDialog={true}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleInterviewDialog;
