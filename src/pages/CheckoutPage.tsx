import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCreditCard, FiDollarSign, FiMapPin, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { addOrder, getUserProfile } from '../services/firebaseService';
import { Order, UserProfile } from '../types';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SuccessMessage from '../components/ui/SuccessMessage';

interface CheckoutForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  deliveryDate: string;
  paymentMethod: 'cash' | 'card' | 'online';
  notes?: string;
}

const CheckoutPage: React.FC = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderProcessing, setOrderProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<CheckoutForm>({
    defaultValues: {
      email: user?.email || '',
      paymentMethod: 'cash'
    }
  });

  const paymentMethod = watch('paymentMethod');

  // Load user profile and populate form
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) {
        setLoadingProfile(false);
        return;
      }

      try {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
          // Auto-populate form with profile data
          setValue('name', profile.name || '');
          setValue('phone', profile.phone || '');
          setValue('address', profile.address || '');
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadUserProfile();
  }, [user, setValue]);

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    setOrderProcessing(true);
    try {
      const order: Omit<Order, 'id'> = {
        userId: user?.uid,
        customerInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address
        },
        items: cart,
        totalAmount: getCartTotal() + 50, // Including delivery fee
        status: 'pending',
        orderDate: new Date(),
        deliveryDate: new Date(data.deliveryDate),
        notes: data.notes,
        paymentMethod: data.paymentMethod
      };

      const orderId = await addOrder(order);
      
      // Show success message
      setShowSuccess(true);
      
      // Clear the cart
      clearCart();
      
      // Redirect to order confirmation after showing success message
      setTimeout(() => {
        setOrderProcessing(false);
        navigate(`/order-confirmation/${orderId}`);
      }, 2000);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('❌ Failed to place order. Please try again or contact support if the problem persists.');
      setOrderProcessing(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    // Don't show empty cart message if order is being processed
    if (orderProcessing) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Your Order...</h2>
            <p className="text-gray-600">Please wait while we confirm your order</p>
          </div>
        </div>
      );
    }
    
    navigate('/cart');
    return null;
  }

  if (loadingProfile) {
    return <LoadingSpinner size="lg" className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Info Banner */}
                {userProfile && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <FiUser className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Using saved profile information
                        </p>
                        <p className="text-sm text-blue-600">
                          You can edit the details below if needed
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiUser className="mr-2" />
                    Customer Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="+91 9768873133"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Date *
                      </label>
                      <input
                        type="date"
                        {...register('deliveryDate', { required: 'Delivery date is required' })}
                        min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Tomorrow
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {errors.deliveryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Orders require at least 24 hours advance notice
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Address *
                    </label>
                    <textarea
                      {...register('address', { required: 'Address is required' })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                      placeholder="Enter your complete delivery address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <FiCreditCard className="mr-2" />
                    Payment Method
                  </h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value="cash"
                        className="mr-3"
                      />
                      <FiDollarSign className="mr-2 text-green-600" />
                      <div>
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500">Pay when your order is delivered</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value="card"
                        className="mr-3"
                      />
                      <FiCreditCard className="mr-2 text-blue-600" />
                      <div>
                        <span className="font-medium">Credit/Debit Card</span>
                        <p className="text-sm text-gray-500">Pay with your card on delivery</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value="online"
                        className="mr-3"
                      />
                      <FiMapPin className="mr-2 text-purple-600" />
                      <div>
                        <span className="font-medium">Online Payment</span>
                        <p className="text-sm text-gray-500">UPI, Net Banking, or Digital Wallet</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Any special instructions for your order (e.g., cake message, delivery preferences)..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Placing Order...
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 h-fit sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.cakeImage}
                      alt={item.cakeName}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">{item.cakeName}</h4>
                      <p className="text-xs text-gray-600">Size: {item.size} × {item.quantity}</p>
                      {item.customizations && (
                        <p className="text-xs text-gray-500">Custom: {item.customizations}</p>
                      )}
                    </div>
                    <span className="font-semibold text-sm">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">₹50.00</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-orange-600">₹{(getCartTotal() + 50).toFixed(2)}</span>
                </div>
              </div>

              {user && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 font-semibold">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Signed in as</p>
                      <p className="text-sm text-green-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h3 className="font-semibold text-orange-800 mb-2">Order Information</h3>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Orders require 24 hours advance notice</li>
                  <li>• Free delivery within city limits</li>
                  <li>• You'll receive order confirmation via email</li>
                  <li>• We'll call before delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      <SuccessMessage
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Order Placed Successfully! 🎉"
        message="Your order has been confirmed and your cart has been cleared. Redirecting to order details..."
        autoClose={false}
      />
    </div>
  );
};

export default CheckoutPage;