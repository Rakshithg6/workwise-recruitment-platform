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
  {
    id: 1,
    candidateId: 101,
    candidateName: "John Doe",
    company: "Accenture",
    position: "DevOps Engineer",
    date: "2025-04-15",
    time: "2:00 PM",
    duration: 60,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    notes: "Technical interview for DevOps position",
    status: "Scheduled",
    createdAt: "2025-04-02",
    interviewer: {
      id: 201,
      name: "Michael Brown",
      position: "Senior DevOps Engineer",
      email: "michael.brown@accenture.com"
    }
  },
  {
    id: 2,
    candidateId: 101,
    candidateName: "John Doe",
    company: "Amazon",
    position: "Software Development Engineer",
    date: "2025-04-18",
    time: "11:30 AM",
    duration: 60,
    meetingLink: "https://meet.google.com/pqr-stuv-wxy",
    notes: "Technical interview with the development team",
    status: "Scheduled",
    createdAt: "2025-04-03",
    interviewer: {
      id: 202,
      name: "Sarah Chen",
      position: "Senior SDE",
      email: "sarah.chen@amazon.com"
    }
  },
  {
    id: 3,
    candidateId: 101,
    candidateName: "John Doe",
    company: "TechCorp India",
    position: "Senior Software Engineer",
    date: "2025-04-10",
    time: "10:00 AM",
    duration: 60,
    meetingLink: "https://meet.google.com/xyz-abcd-efg",
    notes: "Technical round with the development team",
    status: "Scheduled",
    createdAt: "2025-04-01",
    interviewer: {
      id: 201,
      name: "Rajesh Kumar",
      position: "Engineering Manager",
      email: "rajesh.kumar@techcorp.in"
    }
  },
  {
    id: 4,
    candidateId: 101,
    candidateName: "John Doe",
    company: "Innovate Solutions",
    position: "Frontend Developer",
    date: "2025-04-12",
    time: "2:00 PM",
    duration: 45,
    meetingLink: "https://meet.google.com/xyz-uvwx-yz",
    notes: "Technical interview with the development team",
    status: "Scheduled",
    createdAt: "2025-04-02",
    interviewer: {
      id: 202,
      name: "Rahul Verma",
      position: "Senior Developer",
      email: "rahul.verma@innovatesolutions.com"
    }
  },
  {
    id: 5,
    candidateId: 101,
    candidateName: "John Doe",
    company: "Digital Dynamics",
    position: "Full Stack Developer",
    date: "2025-04-05",
    time: "10:00",
    duration: 60,
    meetingLink: "https://meet.google.com/pqr-stu-vwx",
    notes: "Interview completed successfully. Follow-up expected within a week.",
    status: "Completed",
    createdAt: "2025-04-01",
    interviewer: {
      id: 203,
      name: "Anita Kumar",
      position: "Engineering Manager",
      email: "anita.kumar@digitaldynamics.com"
    }
  },
  {
    id: 6,
    candidateId: 101,
    candidateName: "John Doe",
    company: "CloudTech Solutions",
    position: "DevOps Engineer",
    date: "2025-04-07",
    time: "15:30",
    duration: 45,
    meetingLink: "https://meet.google.com/lmn-opq-rst",
    notes: "Cancelled due to scheduling conflict. To be rescheduled.",
    status: "Cancelled",
    createdAt: "2025-03-30",
    interviewer: {
      id: 204,
      name: "Vikram Singh",
      position: "DevOps Lead",
      email: "vikram.singh@cloudtech.com"
    }
  },
  {
    id: 7,
    candidateId: 101,
    candidateName: "John Doe",
    company: "WebSphere Technologies",
    position: "Backend Developer",
    date: "2025-04-15",
    time: "13:00",
    duration: 60,
    meetingLink: "https://meet.google.com/def-ghi-jkl",
    notes: "System design round with the backend team",
    status: "Scheduled",
    createdAt: "2025-04-03",
    interviewer: {
      id: 205,
      name: "Neha Patel",
      position: "Backend Team Lead",
      email: "neha.patel@websphere.com"
    }
  }
];
