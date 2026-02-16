import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiCalendar, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        const orderDoc = await getDoc(doc(db, 'orders', orderId));
        if (orderDoc.exists()) {
          const orderData = {
            id: orderDoc.id,
            ...orderDoc.data(),
            orderDate: orderDoc.data().orderDate?.toDate() || new Date(),
            deliveryDate: orderDoc.data().deliveryDate?.toDate() || null,
          } as Order;
          setOrder(orderData);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheckCircle className="text-green-600" size={40} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🎉 Order Placed Successfully!</h1>
            <p className="text-gray-600">
              Thank you for choosing Sweet Delights! Your order has been confirmed and we'll start preparing your delicious cakes right away.
            </p>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800 font-semibold">✅ Your cart has been cleared</p>
              <p className="text-green-700 text-sm">You can continue shopping for more delicious cakes!</p>
            </div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
              <span className="text-sm text-gray-500">Order #{order.id.slice(-8).toUpperCase()}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-400" size={16} />
                    <span>{order.customerInfo.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FiMail className="mr-2 text-gray-400" size={16} />
                    <span>{order.customerInfo.email}</span>
                  </div>
                  <div className="flex items-center">
                    <FiPhone className="mr-2 text-gray-400" size={16} />
                    <span>{order.customerInfo.phone}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start">
                    <FiMapPin className="mr-2 text-gray-400 mt-0.5" size={16} />
                    <span>{order.customerInfo.address}</span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className="mr-2 text-gray-400" size={16} />
                    <span>
                      {order.deliveryDate?.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
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

            {/* Order Total */}
            <div className="border-t mt-6 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-semibold ${
                  order.paymentStatus === 'completed' ? 'text-green-600' : 
                  order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {order.paymentStatus === 'completed' ? '✅ Paid' : 
                   order.paymentStatus === 'failed' ? '❌ Failed' : '⏳ Pending'}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-mono text-xs">{order.paymentId}</span>
                </div>
              )}
              <p className="text-sm text-gray-600 mt-1">
                Payment Method: {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 
                                order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Online Payment'}
              </p>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-orange-50 rounded-xl p-6 mb-6"
          >
            <h3 className="font-semibold text-orange-800 mb-3">What happens next?</h3>
            <div className="space-y-2 text-sm text-orange-700">
              <p>• We'll start preparing your order within 2 hours</p>
              <p>• You'll receive updates via email and SMS</p>
              <p>• Our team will contact you before delivery</p>
              <p>• Enjoy your delicious cakes!</p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center space-x-4"
          >
            <Link
              to="/"
              className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/contact"
              className="inline-block border border-orange-600 text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;