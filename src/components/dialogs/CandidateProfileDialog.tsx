
import React from 'react';
import {
  Dialog,
  DialogContent
} from '@/components/ui/dialog';
import CandidateProfile from '@/components/candidate/CandidateProfile';

interface CandidateProfileDialogProps {
  isOpen: boolean;
  candidate: any;
  onScheduleInterview: (candidateId: number) => void;
  onClose: () => void;
}

const CandidateProfileDialog = ({
  isOpen,
  candidate,
  onScheduleInterview,
  onClose
}: CandidateProfileDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-transparent border-0 max-w-4xl p-0">
        <CandidateProfile
          candidate={candidate}
          onScheduleInterview={onScheduleInterview}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CandidateProfileDialog;
