
import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobListings, setJobListings] = useState<any[]>([]);
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];
  
  useEffect(() => {
    document.title = 'Analytics | WorkWise';
    loadJobData();
  }, []);
  
  const loadJobData = () => {
    setIsLoading(true);
    // Get job listings from localStorage
    const savedJobs = localStorage.getItem('workwise-job-listings');
    if (savedJobs) {
      try {
        const parsedJobs = JSON.parse(savedJobs);
        setJobListings(parsedJobs);
      } catch (e) {
        console.error('Failed to parse job data:', e);
      }
    }
    setIsLoading(false);
  };

  // Generate mock analytics data based on job listings
  const getApplicantStatusData = () => {
    // Either use real data or generate mock data if none exists
    return [
      { name: 'Pending', value: 45, fill: '#0088FE' },
      { name: 'Reviewed', value: 25, fill: '#00C49F' },
      { name: 'Interview', value: 15, fill: '#FFBB28' },
      { name: 'Hired', value: 8, fill: '#FF8042' },
      { name: 'Rejected', value: 18, fill: '#FF0000' }
    ];
  };
  
  const getJobViewsData = () => {
    return [
      { name: 'Jan', views: 400 },
      { name: 'Feb', views: 300 },
      { name: 'Mar', views: 550 },
      { name: 'Apr', views: 780 },
      { name: 'May', views: 490 },
      { name: 'Jun', views: 600 },
      { name: 'Jul', views: 720 }
    ];
  };
  
  const getApplicationsByMonth = () => {
    return [
      { name: 'Jan', count: 20 },
      { name: 'Feb', count: 15 },
      { name: 'Mar', count: 25 },
      { name: 'Apr', count: 38 },
      { name: 'May', count: 22 },
      { name: 'Jun', count: 30 },
      { name: 'Jul', count: 35 }
    ];
  };
  
  const getHiringConversionRate = () => {
    return [
      { name: 'Applications', value: 120 },
      { name: 'Interviews', value: 45 },
      { name: 'Offers Made', value: 20 },
      { name: 'Hired', value: 15 }
    ];
  };
  
  // Improve chart rendering with CustomLabel
  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.15;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {name} {(percent * 100).toFixed(0)}% ({value})
      </text>
    );
  };

  return (
    <DashboardLayout type="employer">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/employer/dashboard')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-white">Hiring Analytics</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
              <div className="h-6 w-48 bg-gray-700 rounded"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Applicant Status Pie Chart */}
              <div className="bg-black/80 rounded-xl p-6 border border-indigo-500/20 shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-white">Applicant Status Distribution</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getApplicantStatusData()}
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        labelLine={true}
                        label={CustomLabel}
                        dataKey="value"
                      >
                        {getApplicantStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: any) => [value, name]}
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: 'white' }}
                      />
                      <Legend 
                        layout="horizontal" 
                        verticalAlign="bottom" 
                        align="center"
                        wrapperStyle={{ color: 'white', paddingTop: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Job Views Area Chart */}
              <div className="bg-black/80 rounded-xl p-6 border border-indigo-500/20 shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-white">Job Views Over Time</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getJobViewsData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: 'white' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="views" 
                        stroke="#0088FE" 
                        fill="#0088FE" 
                        fillOpacity={0.6} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Applications by Month Bar Chart */}
              <div className="bg-black/80 rounded-xl p-6 border border-indigo-500/20 shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-white">Applications by Month</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getApplicationsByMonth()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="name" stroke="#999" />
                      <YAxis stroke="#999" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: 'white' }}
                      />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Hiring Funnel */}
              <div className="bg-black/80 rounded-xl p-6 border border-indigo-500/20 shadow-lg">
                <h2 className="text-xl font-bold mb-6 text-white">Hiring Conversion Funnel</h2>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={getHiringConversionRate()} 
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                      <XAxis type="number" stroke="#999" />
                      <YAxis dataKey="name" type="category" stroke="#999" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: 'white' }}
                      />
                      <Bar dataKey="value" fill="#FFBB28">
                        {getHiringConversionRate().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-black/80 rounded-xl p-6 border border-indigo-500/20 shadow-lg">
              <h2 className="text-xl font-bold mb-6 text-white">Key Hiring Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-900/80 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white/70 text-sm">Time to Fill</h3>
                  <p className="text-3xl font-bold text-white mt-2">18 days</p>
                  <p className="text-sm text-green-400 mt-1">15% faster than average</p>
                </div>
                <div className="bg-gray-900/80 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white/70 text-sm">Cost per Hire</h3>
                  <p className="text-3xl font-bold text-white mt-2">₹25,000</p>
                  <p className="text-sm text-green-400 mt-1">10% lower than last quarter</p>
                </div>
                <div className="bg-gray-900/80 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white/70 text-sm">Candidate Quality Score</h3>
                  <p className="text-3xl font-bold text-white mt-2">85%</p>
                  <p className="text-sm text-green-400 mt-1">7% increase this quarter</p>
                </div>
                <div className="bg-gray-900/80 rounded-lg p-4 border border-white/10">
                  <h3 className="text-white/70 text-sm">Hiring Success Rate</h3>
                  <p className="text-3xl font-bold text-white mt-2">81%</p>
                  <p className="text-sm text-green-400 mt-1">11% above industry average</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
