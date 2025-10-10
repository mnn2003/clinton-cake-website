import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCakesByCategory, getCakes } from '../services/firebaseService';
import { Cake, CakeCategory } from '../types';
import { useCategories } from '../hooks/useCategories';
import CakeCard from '../components/common/CakeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const { getCategoryByKey, getCategoriesAsRecord } = useCategories();

  useEffect(() => {
    const fetchCakes = async () => {
      setLoading(true);
      try {
        if (category === 'all') {
          const allCakes = await getCakes();
          setCakes(allCakes);
        } else if (category && getCategoryByKey(category)) {
          const categoryCakes = await getCakesByCategory(category as CakeCategory);
          setCakes(categoryCakes);
        }
      } catch (error) {
        console.error('Error fetching cakes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, [category, getCategoryByKey]);

  const categoryName = category === 'all' 
    ? 'All Cakes' 
    : getCategoryByKey(category || '')?.name || 'Unknown Category';

  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingSpinner size="lg" className="py-32" />
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
            {categoryName}
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
            <p className="text-gray-500 text-lg">No cakes found in this category.</p>
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