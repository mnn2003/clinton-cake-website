import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiCreditCard, FiDollarSign, FiMapPin, FiUser, FiMail, FiPhone } from 'react-icons/fi';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { addOrder } from '../services/firebaseService';
import { Order } from '../types';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CheckoutForm>({
    defaultValues: {
      email: user?.email || '',
      paymentMethod: 'cash'
    }
  });

  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
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
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
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
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      {errors.deliveryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>
                      )}
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
                      <span>Cash on Delivery</span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value="card"
                        className="mr-3"
                      />
                      <FiCreditCard className="mr-2 text-blue-600" />
                      <span>Credit/Debit Card</span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        {...register('paymentMethod')}
                        value="online"
                        className="mr-3"
                      />
                      <FiMapPin className="mr-2 text-purple-600" />
                      <span>Online Payment (UPI/Net Banking)</span>
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
                    placeholder="Any special instructions for your order..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Placing Order...' : 'Place Order'}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;