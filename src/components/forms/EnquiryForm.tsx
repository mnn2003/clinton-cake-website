import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiSend, FiCheck } from 'react-icons/fi';
import { addEnquiry } from '../../services/firebaseService';
import { sendEnquiryEmail, EmailData } from '../../lib/emailService';
import { Enquiry } from '../../types';

interface EnquiryFormProps {
  cakeId?: string;
  cakeName?: string;
  onSuccess?: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  size: string;
  message: string;
}

const EnquiryForm: React.FC<EnquiryFormProps> = ({ 
  cakeId, 
  cakeName, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Save enquiry to database
      const enquiry: Omit<Enquiry, 'id'> = {
        ...data,
        cakeId,
        cakeName,
        status: 'new',
        timestamp: new Date(),
      };

      await addEnquiry(enquiry);

      // Send email notification
      const emailData: EmailData = {
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        cakeName,
        eventDate: data.eventDate,
        cakeSize: data.size,
        message: data.message,
        enquiryDate: new Date().toLocaleString(),
      };

      // Try to send email (don't fail the form if email fails)
      const emailSent = await sendEnquiryEmail(emailData);
      if (!emailSent) {
        console.warn('Email notification failed, but enquiry was saved successfully');
      }

      setIsSubmitted(true);
      reset();
      setTimeout(() => {
        setIsSubmitted(false);
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiCheck className="text-green-600" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Thank You!
        </h3>
        <p className="text-gray-600">
          Your enquiry has been submitted successfully. We'll get back to you within 24 hours!
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {cakeName && (
        <div className="bg-orange-50 p-4 rounded-lg">
          <h3 className="font-semibold text-orange-800">
            Enquiring about: {cakeName}
          </h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            Event Date
          </label>
          <input
            type="date"
            {...register('eventDate')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cake Size Preference
        </label>
        <select
          {...register('size')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="">Select size (optional)</option>
          <option value="small">Small (6-8 servings)</option>
          <option value="medium">Medium (10-12 servings)</option>
          <option value="large">Large (15-20 servings)</option>
          <option value="extra-large">Extra Large (25+ servings)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        <textarea
          {...register('message')}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          placeholder="Tell us about your event, any special requirements, or questions you have..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Submitting...
          </div>
        ) : (
          <div className="flex items-center">
            <FiSend className="mr-2" />
            Submit Enquiry
          </div>
        )}
      </button>
    </form>
  );
};

export default EnquiryForm;