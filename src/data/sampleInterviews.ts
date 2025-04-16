interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  company: string;
  position: string;
  date: string;
  time: string;
  duration: number;
  meetingLink: string;
  notes: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
  interviewer: {
    id: number;
    name: string;
    position: string;
    email: string;
  };
}

export const sampleInterviews: Interview[] = [
  // Teams interview 1
  {
    id: 101,
    candidateId: 101,
    candidateName: "Rakshith",
    company: "AzureSoft",
    position: "software Engineer",
    date: "2025-04-17",
    time: "09:00",
    duration: 45,
    meetingLink: "https://teams.microsoft.com/l/meetup-join/azure-cloud-101",
    notes: "Cloud fundamentals and Azure services.",
    status: "Scheduled",
    createdAt: "2025-04-15",
    interviewer: {
      id: 301,
      name: "Priya Menon",
      position: "Cloud Architect",
      email: "priya.menon@azuresoft.com"
    }
  },
  // Teams interview 2
  {
    id: 102,
    candidateId: 101,
    candidateName: "Rakshith",
    company: "Teams4U",
    position: "Deveops Engineer",
    date: "2025-04-18",
    time: "14:00",
    duration: 30,
    meetingLink: "https://teams.microsoft.com/l/meetup-join/teams4u-support-102",
    notes: "Technical support scenario interview.",
    status: "Scheduled",
    createdAt: "2025-04-16",
    interviewer: {
      id: 302,
      name: "Alex Lee",
      position: "Support Lead",
      email: "alex.lee@teams4u.com"
    }
  },
  // Teams interview 3
  {
    id: 103,
    candidateId: 101,
    candidateName: "Rakshth G",
    company: "Contoso",
    position: "Frontend Developer",
    date: "2025-04-19",
    time: "11:15",
    duration: 60,
    meetingLink: "https://teams.microsoft.com/l/meetup-join/contoso-frontend-103",
    notes: "Live coding and UI design discussion.",
    status: "Scheduled",
    createdAt: "2025-04-16",
    interviewer: {
      id: 303,
      name: "Sara Williams",
      position: "UI Lead",
      email: "sara.williams@contoso.com"
    }
  }
];
