import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface JobApplication {
  id: number;
  jobId: number;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

interface ApplicationStore {
  applications: JobApplication[];
  addApplication: (job: { id: number; title: string; company: string; }) => void;
  isJobApplied: (jobId: number) => boolean;
  getApplications: () => JobApplication[];
}

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: [],
      addApplication: (job) => {
        const isAlreadyApplied = get().isJobApplied(job.id);
        if (!isAlreadyApplied) {
          set((state) => ({
            applications: [
              ...state.applications,
              {
                id: Date.now(),
                jobId: job.id,
                jobTitle: job.title,
                company: job.company,
                appliedAt: new Date().toISOString(),
                status: 'pending'
              }
            ]
          }));
        }
      },
      isJobApplied: (jobId) => {
        return get().applications.some(app => app.jobId === jobId);
      },
      getApplications: () => get().applications,
    }),
    {
      name: 'job-applications'
    }
  )
);
