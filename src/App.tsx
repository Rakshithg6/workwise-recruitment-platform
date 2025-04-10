import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider } from './contexts/UserContext';
import { Toaster } from './components/ui/toaster';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import JobListings from './pages/employer/JobListings';
import JobDetail from './pages/employer/JobDetail';
import PostJob from './pages/employer/PostJob';
import CandidateAuth from './pages/auth/CandidateAuth';
import EmployerAuth from './pages/auth/EmployerAuth';
import Candidates from './pages/employer/Candidates';
import Interviews from './pages/employer/Interviews';
import Messages from './pages/employer/Messages';
import Settings from './pages/employer/Settings';
import CandidateApplications from './pages/candidate/Applications';
import CandidateInterviews from './pages/candidate/Interviews';
import CandidateMessages from './pages/candidate/Messages';
import CandidateSettings from './pages/candidate/Settings';
import Analytics from './pages/employer/Analytics';
import CandidateDetails from './pages/employer/CandidateDetails';
import ProfileViews from './pages/candidate/ProfileViews';
import Jobs from './pages/candidate/Jobs';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <div className="app min-h-screen">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Candidate Routes */}
            <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
            <Route path="/candidate/settings" element={<CandidateSettings />} />
            <Route path="/candidate/applications" element={<CandidateApplications />} />
            <Route path="/candidate/interviews" element={<CandidateInterviews />} />
            <Route path="/candidate/messages" element={<CandidateMessages />} />
            <Route path="/candidate/messages/:interviewerId" element={<CandidateMessages />} />
            <Route path="/candidate/profile-views" element={<ProfileViews />} />
            <Route path="/candidate/jobs" element={<Jobs />} />
            
            {/* Employer Routes */}
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/employer/jobs" element={<JobListings />} />
            <Route path="/employer/job/:id" element={<JobDetail />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/employer/settings" element={<Settings />} />
            <Route path="/employer/candidates" element={<Candidates />} />
            <Route path="/employer/candidates/:id" element={<CandidateDetails />} />
            <Route path="/employer/interviews" element={<Interviews />} />
            <Route path="/employer/messages" element={<Messages />} />
            <Route path="/employer/analytics" element={<Analytics />} />
            
            {/* Job Routes */}
            <Route path="/job/:id" element={<div>Public Job Details</div>} />
            <Route path="/jobs" element={<div>Job Listings</div>} />

            {/* Auth routes - updated to use separate components */}
            <Route path="/auth/candidate/login" element={<CandidateAuth />} />
            <Route path="/auth/candidate/signup" element={<CandidateAuth isSignup={true} />} />
            <Route path="/auth/candidate" element={<CandidateAuth />} />
            <Route path="/auth/employer/login" element={<EmployerAuth />} />
            <Route path="/auth/employer/signup" element={<EmployerAuth isSignup={true} />} />
            <Route path="/auth/employer" element={<EmployerAuth />} />
          </Routes>
          <Toaster />
        </div>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
