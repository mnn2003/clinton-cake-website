import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiX } from 'react-icons/fi';

interface SuccessMessageProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  autoClose?: boolean;
  duration?: number;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  isVisible,
  onClose,
  title,
  message,
  autoClose = true,
  duration = 3000
}) => {
  React.useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, duration, onClose]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg border border-green-200 p-4 max-w-sm"
    >
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <FiCheckCircle className="text-green-600" size={20} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <FiX size={16} />
        </button>
      </div>
    </motion.div>
  );
};

export default SuccessMessage;