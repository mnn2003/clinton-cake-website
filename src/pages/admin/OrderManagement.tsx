import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiFilter, 
  FiDownload, 
  FiEye, 
  FiPhone, 
  FiMail,
  FiMapPin,
  FiCalendar,
  FiPackage,
  FiClock,
  FiDollarSign
} from 'react-icons/fi';
import { getOrders, updateOrder } from '../../services/firebaseService';
import { Order } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Modal from '../../components/ui/Modal';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const fetchedOrders = await getOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (order: Order, status: Order['status']) => {
    try {
      await updateOrder(order.id, { status });
      const updatedOrders = orders.map(o =>
        o.id === order.id ? { ...o, status } : o
      );
      setOrders(updatedOrders);
      
      // Update selected order if it's the same one
      if (selectedOrder?.id === order.id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'Order ID', 'Customer', 'Email', 'Phone', 'Total', 'Status', 
      'Order Date', 'Delivery Date', 'Payment Method', 'Items'
    ];
    
    const csvData = filteredOrders.map(order => [
      order.id.slice(-8).toUpperCase(),
      order.customerInfo.name,
      order.customerInfo.email,
      order.customerInfo.phone,
      `₹${order.totalAmount.toFixed(2)}`,
      order.status,
      order.orderDate.toLocaleDateString(),
      order.deliveryDate?.toLocaleDateString() || 'Not specified',
      order.paymentMethod,
      order.items.map(item => `${item.cakeName} (${item.quantity})`).join('; ')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    const matchesDate = !dateFilter || (() => {
      const orderDate = order.orderDate;
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'preparing':
        return 'bg-orange-100 text-orange-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'delivered':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'ready':
        return 'Ready';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2 hidden sm:block">Manage customer orders and deliveries</p>
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
              placeholder="Search orders..."
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
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
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
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 lg:gap-4">
        {[
          { label: 'Total', count: orders.length, color: 'bg-blue-50 text-blue-800' },
          { label: 'Pending', count: orders.filter(o => o.status === 'pending').length, color: 'bg-yellow-50 text-yellow-800' },
          { label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length, color: 'bg-blue-50 text-blue-800' },
          { label: 'Preparing', count: orders.filter(o => o.status === 'preparing').length, color: 'bg-orange-50 text-orange-800' },
          { label: 'Ready', count: orders.filter(o => o.status === 'ready').length, color: 'bg-green-50 text-green-800' },
          { label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length, color: 'bg-gray-50 text-gray-800' }
        ].map((stat, index) => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-3 lg:p-4`}>
            <div className="text-xl lg:text-2xl font-bold">{stat.count}</div>
            <div className="text-xs lg:text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <FiPackage className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">No orders match your current filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Items
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Delivery Date
                  </th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order, index) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs lg:text-sm font-medium text-gray-900">
                          #{order.id.slice(-8).toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.orderDate.toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-xs lg:text-sm font-medium text-gray-900">
                          {order.customerInfo.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <FiMail className="mr-1" size={12} />
                          <span className="truncate max-w-[120px] lg:max-w-none">
                            {order.customerInfo.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <div className="text-xs lg:text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items[0]?.cakeName}
                        {order.items.length > 1 && ` +${order.items.length - 1} more`}
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="text-xs lg:text-sm font-semibold text-gray-900">
                        ₹{order.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentMethod === 'cash' ? 'COD' : 
                         order.paymentMethod === 'card' ? 'Card' : 'Online'}
                      </div>
                      {order.paymentStatus && (
                        <div className={`text-xs font-semibold ${
                          order.paymentStatus === 'completed' ? 'text-green-600' : 
                          order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          {order.paymentStatus === 'completed' ? '✅ Paid' : 
                           order.paymentStatus === 'failed' ? '❌ Failed' : '⏳ Pending'}
                        </div>
                      )}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order, e.target.value as Order['status'])}
                        className={`text-xs font-semibold px-1 lg:px-2 py-1 rounded-full border-0 ${getStatusColor(order.status)} w-full lg:w-auto`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm text-gray-500 hidden lg:table-cell">
                      {order.deliveryDate?.toLocaleDateString() || 'Not specified'}
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-xs lg:text-sm font-medium">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-orange-600 hover:text-orange-900 flex items-center text-xs lg:text-sm"
                      >
                        <FiEye className="mr-1" size={14} />
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

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order #${selectedOrder?.id.slice(-8).toUpperCase()}`}
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusText(selectedOrder.status)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                Ordered on {selectedOrder.orderDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiMail className="mr-3 text-gray-400" size={16} />
                    <div>
                      <p className="font-medium">{selectedOrder.customerInfo.name}</p>
                      <p className="text-sm text-gray-600">{selectedOrder.customerInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="mr-3 text-gray-400" size={16} />
                    <p className="text-sm">{selectedOrder.customerInfo.phone}</p>
                  </div>
                  <div className="flex items-start">
                    <FiMapPin className="mr-3 text-gray-400 mt-0.5" size={16} />
                    <p className="text-sm">{selectedOrder.customerInfo.address}</p>
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FiCalendar className="mr-3 text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium">Delivery Date</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.deliveryDate?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) || 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiDollarSign className="mr-3 text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium">Payment Method</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.paymentMethod === 'cash' ? 'Cash on Delivery' : 
                         selectedOrder.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Online Payment'}
                      </p>
                      {selectedOrder.paymentStatus && (
                        <p className={`text-sm font-semibold ${
                          selectedOrder.paymentStatus === 'completed' ? 'text-green-600' : 
                          selectedOrder.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          Status: {selectedOrder.paymentStatus === 'completed' ? 'Paid' : 
                                  selectedOrder.paymentStatus === 'failed' ? 'Failed' : 'Pending'}
                        </p>
                      )}
                      {selectedOrder.paymentId && (
                        <p className="text-xs text-gray-500 font-mono">
                          Payment ID: {selectedOrder.paymentId}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-3 text-gray-400" size={16} />
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold text-orange-600">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.cakeImage}
                      alt={item.cakeName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.cakeName}</h4>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      {item.customizations && (
                        <p className="text-sm text-gray-600">Customizations: {item.customizations}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{item.price} × {item.quantity}</p>
                      <p className="text-sm text-gray-600">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Instructions */}
            {selectedOrder.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Special Instructions</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedOrder.notes}</p>
                </div>
              </div>
            )}

            {/* Status Update Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleStatusUpdate(selectedOrder, 'confirmed')}
                disabled={selectedOrder.status === 'confirmed'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Mark as Confirmed
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedOrder, 'preparing')}
                disabled={selectedOrder.status === 'preparing'}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Mark as Preparing
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedOrder, 'ready')}
                disabled={selectedOrder.status === 'ready'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Mark as Ready
              </button>
              <button
                onClick={() => handleStatusUpdate(selectedOrder, 'delivered')}
                disabled={selectedOrder.status === 'delivered'}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Mark as Delivered
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement;