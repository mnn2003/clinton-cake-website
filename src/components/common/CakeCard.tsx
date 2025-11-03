import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiShoppingCart } from 'react-icons/fi';
import { Cake } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../hooks/useCart';

interface CakeCardProps {
  cake: Cake;
}

const CakeCard: React.FC<CakeCardProps> = ({ cake }) => {
  const { getCategoryByKey } = useCategories();
  const { addToCart } = useCart();
  const category = getCategoryByKey(cake.category);

  // Extract price from priceRange with better logic
  const extractPrice = (priceRange: string): number => {
    // Remove currency symbols and extract numbers
    const numbers = priceRange.match(/\d+/g);
    if (numbers && numbers.length > 0) {
      // If there's a range (e.g., "₹500 - ₹800"), take the first (minimum) price
      return parseInt(numbers[0]);
    }
    // Fallback price
    return 500;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const price = extractPrice(cake.priceRange);
    
    addToCart({
      cakeId: cake.id,
      cakeName: cake.name,
      cakeImage: cake.images[0] || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
      price,
      quantity: 1,
      size: 'Medium'
    });
    
    // Show success feedback
    const button = e.currentTarget;
    const originalText = button.innerHTML;
    button.innerHTML = '<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>';
    setTimeout(() => {
      button.innerHTML = originalText;
    }, 1000);
  };

  return (
    <Link to={`/cake/${cake.id}`} className="block group">
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={cake.images[0] || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
            alt={cake.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {cake.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                <FiStar size={12} className="mr-1" />
                Featured
              </span>
            </div>
          )}
          <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all">
            <FiHeart size={16} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-orange-600 font-medium">
              {category?.name || 'Unknown Category'}
            </span>
            <span className="text-sm text-gray-500">
              {cake.priceRange}
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
            {cake.name}
          </h3>
          
          <p className="text-gray-600 text-sm line-clamp-2">
            {cake.description}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} size={14} className="fill-current" />
              ))}
              <span className="text-sm text-gray-500 ml-2">(4.8)</span>
            </div>
            
            <span className="text-orange-600 font-semibold group-hover:text-orange-700 transition-colors">
              View Details →
            </span>
            
            <button
              onClick={handleAddToCart}
              className="bg-orange-600 text-white p-2 rounded-full hover:bg-orange-700 transition-colors opacity-0 group-hover:opacity-100"
            >
              <FiShoppingCart size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CakeCard;