import { useEffect } from 'react';
import { LineChart, Users, TrendingUp, ArrowUp, ArrowDown, ChevronLeft } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Link } from 'react-router-dom';

const ProfileViews = () => {
  useEffect(() => {
    document.title = 'Profile Views Analytics | WorkWise';
  }, []);

  // Sample data for profile views analytics
  const stats = {
    totalViews: 28,
    weeklyViews: 12,
    weeklyChange: 15, // percentage
    averageViewsPerDay: 4,
    topViewDays: [
      { date: '2025-04-08', views: 8 },
      { date: '2025-04-07', views: 6 },
      { date: '2025-04-06', views: 5 }
    ],
    viewsByCompany: [
      { company: 'TCS', views: 5 },
      { company: 'Infosys', views: 4 },
      { company: 'Wipro', views: 3 },
      { company: 'Accenture', views: 3 },
      { company: 'Others', views: 13 }
    ]
  };

  return (
    <DashboardLayout type="candidate">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/candidate/dashboard" 
              className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-blue-500/20"
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </Link>
            <h2 className="text-2xl font-semibold text-white">Profile Views Analytics</h2>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <LineChart size={16} />
            <span>Last 30 days</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl shadow-sm border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Total Views</h3>
              <div className="p-2 rounded-full bg-blue-900/30 text-blue-400">
                <Users size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.totalViews}</p>
            <p className="text-sm text-white/70">In the last 30 days</p>
          </div>

          <div className="p-6 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl shadow-sm border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Weekly Views</h3>
              <div className="p-2 rounded-full bg-green-900/30 text-green-400">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.weeklyViews}</p>
            <div className="flex items-center mt-1">
              {stats.weeklyChange > 0 ? (
                <ArrowUp size={14} className="text-green-400" />
              ) : (
                <ArrowDown size={14} className="text-red-400" />
              )}
              <span className={`text-sm ${stats.weeklyChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {Math.abs(stats.weeklyChange)}% from last week
              </span>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl shadow-sm border border-blue-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">Daily Average</h3>
              <div className="p-2 rounded-full bg-purple-900/30 text-purple-400">
                <Users size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{stats.averageViewsPerDay}</p>
            <p className="text-sm text-white/70">Views per day</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl shadow-sm border border-blue-500/20 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-4 text-white">Top View Days</h3>
            <div className="space-y-4">
              {stats.topViewDays.map((day, index) => (
                <div key={day.date} className="flex items-center justify-between">
                  <div>
                    <p className="text-white">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-white/70">{day.views} views</p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-500/20 text-gray-400' :
                    'bg-amber-500/20 text-amber-400'
                  }`}>
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-gradient-to-b from-gray-800/80 to-black/90 rounded-xl shadow-sm border border-blue-500/20 backdrop-blur-sm">
            <h3 className="text-lg font-medium mb-4 text-white">Views by Company</h3>
            <div className="space-y-4">
              {stats.viewsByCompany.map((company) => (
                <div key={company.company} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white">{company.company}</span>
                    <span className="text-white/70">{company.views} views</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${(company.views / stats.totalViews) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfileViews;
