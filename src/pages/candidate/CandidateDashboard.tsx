import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, BriefcaseIcon, CalendarClock, TrendingUp, Clock, MapPin, Building, Banknote, ChevronRight } from 'lucide-react';
import ThemeAwareDashboardLayout from '@/components/dashboard/ThemeAwareDashboardLayout';
import ResumeScreening from '@/components/resume/ResumeScreening';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Candidate Dashboard | WorkWise';
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);

  const recentJobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TCS',
      location: 'Bangalore',
      salary: '25-35 LPA',
      posted: '2 days ago',
      description: 'Join TCS as a Senior Frontend Developer and work on cutting-edge projects for global clients.',
      skills: ['React', 'TypeScript', 'HTML/CSS']
    },
    {
      id: 2,
      title: 'Backend Engineer',
      company: 'Infosys',
      location: 'Hyderabad',
      salary: '20-30 LPA',
      posted: '3 days ago',
      description: 'Looking for a Backend Engineer with strong Node.js and database skills.',
      skills: ['Node.js', 'MongoDB', 'Express']
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'Wipro',
      location: 'Pune',
      salary: '18-28 LPA',
      posted: '5 days ago',
      description: 'Wipro is hiring Full Stack Developers with experience in MERN stack development.',
      skills: ['React', 'Node.js', 'MongoDB', 'Express']
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'Accenture',
      location: 'Mumbai',
      salary: '15-25 LPA',
      posted: '1 week ago',
      description: 'Join our design team to create beautiful and intuitive user interfaces.',
      skills: ['Figma', 'Adobe XD', 'UI/UX']
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'HCL',
      location: 'Noida',
      salary: '22-32 LPA',
      posted: '2 weeks ago',
      description: 'Looking for a DevOps Engineer to improve our CI/CD pipeline and infrastructure.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD']
    }
  ];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredJobs(recentJobs.slice(0, 3));
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = recentJobs.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.company.toLowerCase().includes(query) || 
        job.location.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skills.some(skill => skill.toLowerCase().includes(query))
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery]);

  const upcomingInterviews = [
    {
      id: 1,
      company: 'Accenture',
      role: 'DevOps Engineer',
      date: 'May 15, 2023',
      time: '2:00 PM',
    },
    {
      id: 2,
      company: 'Amazon',
      role: 'Software Development Engineer',
      date: 'May 18, 2023',
      time: '11:30 AM',
    },
  ];

  return (
    <ThemeAwareDashboardLayout type="candidate">
      <div className="space-y-6 p-6">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#0D1117] rounded-lg border border-[#2a2f3e]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Applications</h3>
              <div className="p-2 rounded-full bg-[#1B2B4B] text-blue-400">
                <BriefcaseIcon size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">5</p>
            <p className="text-sm font-medium text-gray-400">Total job applications</p>
            <div className="mt-4 pt-4 border-t border-[#2a2f3e]">
              <Link to="/candidate/applications" className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center">
                View all applications <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6 bg-[#0D1117] rounded-lg border border-[#2a2f3e]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Interviews</h3>
              <div className="p-2 rounded-full bg-[#1B2B4B] text-green-400">
                <CalendarClock size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">3</p>
            <p className="text-sm font-medium text-gray-400">Upcoming interviews</p>
            <div className="mt-4 pt-4 border-t border-[#2a2f3e]">
              <Link to="/candidate/interviews" className="text-green-500 hover:text-green-400 text-sm font-bold flex items-center">
                View all interviews <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="p-6 bg-[#0D1117] rounded-lg border border-[#2a2f3e]">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white">Profile Views</h3>
              <div className="p-2 rounded-full bg-[#1B2B4B] text-purple-400">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">28</p>
            <p className="text-sm font-medium text-gray-400">In the last 30 days</p>
            <div className="mt-4 pt-4 border-t border-[#2a2f3e]">
              <Link to="/candidate/profile-views" className="text-purple-500 hover:text-purple-400 text-sm font-bold flex items-center">
                View profile views <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Resume Screening Section */}
        <div className="w-full bg-[#0D1117] rounded-lg border border-[#2a2f3e] p-6">
          <h2 className="text-xl font-bold text-white mb-6">Resume Screening & Job Matching</h2>
          <ResumeScreening />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Recommended Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-[#0D1117] rounded-lg border border-[#2a2f3e] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Recommended Jobs</h3>
                <Link to="/candidate/jobs?focus-search=true" className="text-[#2563EB] hover:text-blue-400 text-sm font-bold">
                  View all
                </Link>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Search for jobs"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 py-2 bg-[#161B22] border border-[#2a2f3e] rounded-lg text-white placeholder:text-gray-500 font-medium"
                />
              </div>
              
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-[#161B22] hover:bg-[#1F2937] rounded-lg transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-white">{job.title}</h4>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mt-1 font-medium">
                          <div className="flex items-center gap-1">
                            <Building size={14} /> {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin size={14} /> {job.location}
                          </div>
                        </div>
                      </div>
                      <span className="text-[#2563EB] text-sm font-bold">{job.salary}</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-sm mt-2 font-medium">
                      <Clock size={14} className="mr-1" />
                      {job.posted}
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/candidate/jobs?focus-search=true')}
                className="w-full text-[#2563EB] hover:text-blue-400 text-center py-3 mt-4 border-t border-[#2a2f3e] text-sm font-bold"
              >
                View More Jobs
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upcoming Interviews */}
            <div className="bg-[#0D1117] rounded-lg border border-[#2a2f3e] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Upcoming Interviews</h3>
                <Link to="/candidate/interviews" className="text-[#2563EB] hover:text-blue-400 text-sm font-bold">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {upcomingInterviews.map((interview) => (
                  <div key={interview.id} className="p-3 bg-[#161B22] hover:bg-[#1F2937] rounded-lg transition-colors">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-white">{interview.company}</h4>
                        <p className="text-gray-400 text-sm font-medium">{interview.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 text-sm font-bold">{interview.date}</p>
                        <p className="text-gray-400 text-sm font-medium">{interview.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete Profile */}
            <div className="bg-[#0D1117] rounded-lg border border-[#2a2f3e] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Complete Your Profile</h3>
              <Progress value={65} className="h-1.5 bg-gray-700" />
              <p className="text-gray-400 text-sm my-4 font-medium">65% complete - complete your profile to improve your job matches</p>
              <Button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold">
                Complete Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ThemeAwareDashboardLayout>
  );
};

export default CandidateDashboard;
