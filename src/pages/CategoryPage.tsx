import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCakesByCategory, getCakes } from '../services/firebaseService';
import { Cake } from '../types';
import { useCategories } from '../hooks/useCategories';
import CakeCard from '../components/common/CakeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getCategoryByKey, activeCategories } = useCategories();

  useEffect(() => {
    const fetchCakes = async () => {
      if (!category) {
        setError('No category specified');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        let fetchedCakes: Cake[] = [];
        
        if (category === 'all') {
          // Fetch all cakes
          fetchedCakes = await getCakes();
        } else {
          // Find the category in our active categories
          const categoryData = getCategoryByKey(category);
          
          if (!categoryData) {
            // If category not found, still try to fetch cakes with the category key
            console.warn(`Category "${category}" not found in active categories, trying direct fetch`);
            fetchedCakes = await getCakesByCategory(category as any);
          } else {
            // Use the category key to fetch cakes
            fetchedCakes = await getCakesByCategory(categoryData.key as any);
          }
        }
        
        setCakes(fetchedCakes);
      } catch (error) {
        console.error('Error fetching cakes:', error);
        setError('Failed to load cakes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, [category, getCategoryByKey]);

  const getCategoryName = () => {
    if (category === 'all') {
      return 'All Cakes';
    }
    
    const categoryData = getCategoryByKey(category || '');
    return categoryData?.name || category?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown Category';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner size="lg" className="py-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Cakes</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            {getCategoryName()}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            {cakes.length} cake{cakes.length !== 1 ? 's' : ''} available
          </motion.p>
        </div>

        {cakes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-4xl">🍰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Cakes Found</h3>
            <p className="text-gray-500 mb-8">
              {category === 'all' 
                ? 'No cakes are currently available.' 
                : `No cakes found in the ${getCategoryName()} category.`}
            </p>
            <a 
              href="/" 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Browse All Categories
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {cakes.map((cake, index) => (
              <motion.div
                key={cake.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CakeCard cake={cake} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;