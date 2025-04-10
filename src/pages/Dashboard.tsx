
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on user role
    if (userData?.role === 'candidate') {
      navigate('/candidate/dashboard');
    } else if (userData?.role === 'employer') {
      navigate('/employer/dashboard');
    }
  }, [userData, navigate]);

  const handleCandidateClick = () => {
    navigate('/candidate/dashboard');
  };

  const handleEmployerClick = () => {
    navigate('/employer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome to WorkWise</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Please select the dashboard you'd like to access
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Candidate Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Access your job applications, interviews, and profile settings.</p>
                <Button onClick={handleCandidateClick} className="w-full">
                  Go to Candidate Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Employer Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Manage job listings, review applications, and track hiring metrics.</p>
                <Button onClick={handleEmployerClick} className="w-full">
                  Go to Employer Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
