
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Clock, User } from 'lucide-react';

interface CandidateProfileProps {
  candidate: {
    id: number;
    name: string;
    photo?: string | null;
    role: string;
    experience: string;
    email: string;
    phone: string;
    applied?: string;
    status?: string;
    match?: string;
    skills?: string[];
    education?: string[];
    location?: string;
  };
  onScheduleInterview: (candidateId: number) => void;
  onClose?: () => void;
}

const CandidateProfile = ({ candidate, onScheduleInterview, onClose }: CandidateProfileProps) => {
  const mockSkills = candidate.skills || [
    'JavaScript', 'React', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'UI/UX Design', 'Responsive Design'
  ];
  
  const mockEducation = candidate.education || [
    'B.Tech in Computer Science, Indian Institute of Technology, 2019',
    'Higher Secondary Education, DPS School, 2015'
  ];
  
  const mockLocation = candidate.location || 'Bangalore, India';

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg max-w-3xl w-full border border-gray-700 shadow-lg mx-auto">
      {onClose && (
        <div className="flex justify-end">
          <Button 
            variant="ghost"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-24 w-24 bg-indigo-800/40 border border-indigo-500/30">
            {candidate.photo ? (
              <img src={candidate.photo} alt={candidate.name} className="object-cover" />
            ) : (
              <AvatarFallback className="text-3xl text-indigo-300 bg-indigo-900">
                <User size={32} />
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="flex-grow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            {candidate.match && (
              <span className="bg-indigo-900/60 text-indigo-300 px-3 py-1 rounded-full text-sm">
                {candidate.match} match
              </span>
            )}
          </div>
          
          <h2 className="text-xl text-gray-300 mt-1">{candidate.role}</h2>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Briefcase size={16} />
              <span>{candidate.experience}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={16} />
              <span>{mockLocation}</span>
            </div>
            {candidate.applied && (
              <div className="flex items-center gap-2 text-gray-400">
                <Clock size={16} />
                <span>Applied {candidate.applied}</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <span>{candidate.phone}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <Award size={18} className="text-indigo-400" />
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {mockSkills.map((skill, index) => (
              <span 
                key={index}
                className="bg-gray-800 text-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
            <GraduationCap size={18} className="text-indigo-400" />
            Education
          </h3>
          <ul className="space-y-2">
            {mockEducation.map((edu, index) => (
              <li key={index} className="text-gray-300">{edu}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Candidate Summary</h3>
        <p className="text-gray-300">
          A highly skilled {candidate.role} with {candidate.experience} of professional experience. 
          Strong background in developing modern applications with a focus on user experience and performance. 
          Excellent communication skills and experience working in agile teams.
        </p>
      </div>
      
      <div className="mt-8 flex flex-wrap gap-4">
        <Button onClick={() => onScheduleInterview(candidate.id)} className="bg-indigo-600 hover:bg-indigo-700">
          <Calendar size={16} className="mr-2" />
          Schedule Interview
        </Button>
        <Button variant="outline" className="border-indigo-500/30 text-white hover:bg-indigo-900/30">
          Download Resume
        </Button>
      </div>
    </div>
  );
};

export default CandidateProfile;
