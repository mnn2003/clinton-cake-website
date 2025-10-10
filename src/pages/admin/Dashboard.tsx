import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiMail, FiTrendingUp, FiUsers } from 'react-icons/fi';
import { getCakes, getEnquiries } from '../../services/firebaseService';
import { Cake, Enquiry } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCakes: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    featuredCakes: 0
  });
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cakes, enquiries] = await Promise.all([
          getCakes(),
          getEnquiries()
        ]);

        setStats({
          totalCakes: cakes.length,
          totalEnquiries: enquiries.length,
          newEnquiries: enquiries.filter(e => e.status === 'new').length,
          featuredCakes: cakes.filter(c => c.featured).length
        });

        setRecentEnquiries(enquiries.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  const statCards = [
    {
      title: 'Total Cakes',
      value: stats.totalCakes,
      icon: FiLayers,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Enquiries',
      value: stats.totalEnquiries,
      icon: FiMail,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'New Enquiries',
      value: stats.newEnquiries,
      icon: FiUsers,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Featured Cakes',
      value: stats.featuredCakes,
      icon: FiTrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your cake shop admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${card.bgColor} rounded-xl p-4 lg:p-6`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs lg:text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} text-white p-2 lg:p-3 rounded-lg`}>
                  <Icon size={20} className="lg:w-6 lg:h-6" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Enquiries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
      >
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-4 lg:mb-6">Recent Enquiries</h2>
        
        {recentEnquiries.length === 0 ? (
          <p className="text-gray-500 text-center py-6 lg:py-8">No enquiries yet</p>
        ) : (
          <div className="space-y-4">
            {recentEnquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 lg:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{enquiry.name}</h3>
                  <p className="text-xs lg:text-sm text-gray-600 truncate">{enquiry.email}</p>
                  {enquiry.cakeName && (
                    <p className="text-xs lg:text-sm text-orange-600">Interested in: {enquiry.cakeName}</p>
                  )}
                </div>
                <div className="text-left sm:text-right">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    enquiry.status === 'new' 
                      ? 'bg-green-100 text-green-800'
                      : enquiry.status === 'contacted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {enquiry.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 sm:mt-1">
                    {enquiry.timestamp.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;