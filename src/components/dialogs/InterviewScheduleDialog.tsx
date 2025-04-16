import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';

interface InterviewScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  candidate: {
    id: number;
    name: string;
    email: string;
  };
  existingInterview?: {
    date: string;
    time: string;
    type: 'remote' | 'offline';
    location: string;
  } | null;
  onSchedule?: (interviewDetails: {
    candidateId: number;
    date: string;
    time: string;
    type: 'remote' | 'offline';
    location: string;
  }) => void;
}

export const InterviewScheduleDialog: React.FC<InterviewScheduleDialogProps> = ({
  open,
  onClose,
  candidate,
  existingInterview,
  onSchedule
}) => {
  const [interviewType, setInterviewType] = useState<'remote' | 'offline'>(existingInterview?.type || 'remote');
  const [date, setDate] = useState(existingInterview?.date || format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(existingInterview?.time || '10:00');
  const [location, setLocation] = useState(existingInterview?.location || '');

  const handleSchedule = async () => {
    if (!date || !time) return;

    const interviewDetails = {
      candidateId: candidate.id,
      date,
      time,
      type: interviewType,
      location: interviewType === 'remote' 
        ? location || `https://teams.microsoft.com/l/meetup-join/${Math.random().toString(36).substring(7)}`
        : location
    };

    // Send email notification
    try {
      await fetch('/api/send-interview-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: candidate.email,
          subject: 'Interview Scheduled',
          candidateName: candidate.name,
          ...interviewDetails
        })
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }

    onSchedule?.(interviewDetails);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle>{existingInterview ? 'Interview Details' : 'Schedule Interview'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label>Candidate</Label>
            <Input value={candidate.name} disabled className="bg-gray-800" />
          </div>

          <div>
            <Label>Interview Type</Label>
            <RadioGroup
              value={interviewType}
              onValueChange={(value: 'remote' | 'offline') => setInterviewType(value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="remote" id="remote" />
                <Label htmlFor="remote">Remote</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline">Offline</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="bg-gray-800"
            />
          </div>

          <div>
            <Label>Time</Label>
            <Input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-gray-800"
            />
          </div>

          <div>
            <Label>{interviewType === 'remote' ? 'Meeting Link' : 'Location'}</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder={interviewType === 'remote' ? 'Meeting link will be generated' : 'Enter office location'}
              className="bg-gray-800"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {!existingInterview && (
            <Button onClick={handleSchedule}>Schedule Interview</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
