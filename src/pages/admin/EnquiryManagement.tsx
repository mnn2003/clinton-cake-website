import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiMail, 
  FiPhone, 
  FiCalendar,
  FiUser,
  FiMessageSquare
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { getEnquiries, updateEnquiry } from '../../services/firebaseService';
import { Enquiry } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const EnquiryManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const enquiries = await getEnquiries();
      dispatch({ type: 'SET_ENQUIRIES', payload: enquiries });
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enquiry: Enquiry, status: 'new' | 'contacted' | 'resolved') => {
    try {
      await updateEnquiry(enquiry.id, { status });
      const updatedEnquiry = { ...enquiry, status };
      dispatch({ type: 'UPDATE_ENQUIRY', payload: updatedEnquiry });
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Event Date', 'Cake', 'Size', 'Status', 'Date', 'Message'];
    const csvData = filteredEnquiries.map(enquiry => [
      enquiry.name,
      enquiry.email,
      enquiry.phone,
      enquiry.eventDate || 'Not specified',
      enquiry.cakeName || 'General enquiry',
      enquiry.size || 'Not specified',
      enquiry.status,
      enquiry.timestamp.toLocaleDateString(),
      enquiry.message.replace(/,/g, ';') // Replace commas to avoid CSV issues
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enquiries-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredEnquiries = state.enquiries.filter(enquiry => {
    const matchesSearch = 
      enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (enquiry.cakeName && enquiry.cakeName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !statusFilter || enquiry.status === statusFilter;
    
    const matchesDate = !dateFilter || (() => {
      const enquiryDate = enquiry.timestamp.toISOString().split('T')[0];
      const filterDate = new Date(dateFilter);
      const enquiryDateObj = new Date(enquiryDate);
      
      switch (dateFilter) {
        case 'today':
          return enquiryDateObj.toDateString() === new Date().toDateString();
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return enquiryDateObj >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return enquiryDateObj >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enquiry Management</h1>
          <p className="text-gray-600 mt-2 hidden sm:block">Manage customer enquiries and leads</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center text-sm lg:text-base"
        >
          <FiDownload className="mr-2" />
          <span className="hidden sm:inline">Export </span>CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search enquiries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        {[
          { label: 'Total', count: state.enquiries.length, color: 'bg-blue-50 text-blue-800' },
          { label: 'New', count: state.enquiries.filter(e => e.status === 'new').length, color: 'bg-green-50 text-green-800' },
          { label: 'Contacted', count: state.enquiries.filter(e => e.status === 'contacted').length, color: 'bg-yellow-50 text-yellow-800' },
          { label: 'Resolved', count: state.enquiries.filter(e => e.status === 'resolved').length, color: 'bg-gray-50 text-gray-800' }
        ].map((stat, index) => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-3 lg:p-4`}>
            <div className="text-xl lg:text-2xl font-bold">{stat.count}</div>
            <div className="text-xs lg:text-sm font-medium">{stat.label} <span className="hidden sm:inline">Enquiries</span></div>
          </div>
        ))}
      </div>

      {/* Enquiries List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredEnquiries.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <FiMail className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No enquiries found</h3>
            <p className="text-gray-500">No enquiries match your current filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 lg:mx-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Contact
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cake Interest
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Event Date
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Date
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnquiries.map((enquiry, index) => (
                  <motion.tr
                    key={enquiry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-orange-600" size={16} />
                        </div>
                        <div className="ml-3">
                          <div className="text-xs lg:text-sm font-medium text-gray-900">
                            {enquiry.name}
                          </div>
                          <div className="text-xs text-gray-500 sm:hidden">
                            {enquiry.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="text-xs lg:text-sm text-gray-900 flex items-center">
                        <FiMail className="mr-1" size={14} />
                        <span className="truncate max-w-[120px] lg:max-w-none">{enquiry.email}</span>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-500 flex items-center">
                        <FiPhone className="mr-1" size={14} />
                        {enquiry.phone}
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm text-gray-900 truncate max-w-[100px] lg:max-w-none">
                        {enquiry.cakeName || 'General enquiry'}
                      </div>
                      {enquiry.size && (
                        <div className="text-xs text-gray-500 hidden lg:block">Size: {enquiry.size}</div>
                      )}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-900 hidden md:table-cell">
                      {enquiry.eventDate || 'Not specified'}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <select
                        value={enquiry.status}
                        onChange={(e) => handleStatusUpdate(enquiry, e.target.value as any)}
                        className={`text-xs font-semibold px-1 lg:px-2 py-1 rounded-full border-0 ${getStatusColor(enquiry.status)} w-full lg:w-auto`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden lg:table-cell">
                      {enquiry.timestamp.toLocaleDateString()}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                      <button
                        onClick={() => setSelectedEnquiry(enquiry)}
                        className="text-orange-600 hover:text-orange-900 flex items-center text-xs lg:text-sm"
                      >
                        <FiMessageSquare className="mr-1" size={14} />
                        <span className="hidden lg:inline">View</span>
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Enquiry Detail Modal */}
      <Modal
        isOpen={!!selectedEnquiry}
        onClose={() => setSelectedEnquiry(null)}
        title="Enquiry Details"
        size="lg"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FiUser className="mr-2 text-gray-400" size={16} />
                    <span className="text-sm">{selectedEnquiry.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-400" size={16} />
                    <span className="text-sm">{selectedEnquiry.email}</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="mr-2 text-gray-400" size={16} />
                    <span className="text-sm">{selectedEnquiry.phone}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Event Details</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Cake Interest: </span>
                    <span className="text-sm font-medium">
                      {selectedEnquiry.cakeName || 'General enquiry'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Event Date: </span>
                    <span className="text-sm font-medium">
                      {selectedEnquiry.eventDate || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Size: </span>
                    <span className="text-sm font-medium">
                      {selectedEnquiry.size || 'Not specified'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Status: </span>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(selectedEnquiry.status)}`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-800 whitespace-pre-wrap">
                  {selectedEnquiry.message || 'No message provided'}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleStatusUpdate(selectedEnquiry, 'contacted')}
                className="flex-1 bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                Mark as Contacted
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedEnquiry, 'resolved')}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Mark as Resolved
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default EnquiryManagement;