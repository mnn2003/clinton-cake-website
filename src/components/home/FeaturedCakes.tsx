import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { getCakes } from '../../services/firebaseService';
import CakeCard from '../common/CakeCard';
import LoadingSpinner from '../ui/LoadingSpinner';

const FeaturedCakes: React.FC = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    const fetchCakes = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const cakes = await getCakes();
        dispatch({ type: 'SET_CAKES', payload: cakes });
      } catch (error) {
        console.error('Error fetching cakes:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    if (state.cakes.length === 0) {
      fetchCakes();
    }
  }, [dispatch, state.cakes.length]);

  const featuredCakes = state.cakes.filter(cake => cake.featured).slice(0, 6);

  if (state.loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <LoadingSpinner size="lg" className="py-12" />
        </div>
      </section>
    );
  }

  if (featuredCakes.length === 0) {
    return null;
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Featured Cakes
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our most popular and recommended cakes, perfect for any celebration
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCakes.map((cake, index) => (
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

        <div className="text-center mt-12">
          <Link
            to="/category/all"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors transform hover:scale-105"
          >
            View All Cakes
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCakes;