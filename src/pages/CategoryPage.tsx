import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCakesByCategory, getCakes } from '../services/firebaseService';
import { Cake } from '../types';
import CakeCard from '../components/common/CakeCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sample cakes data for immediate display
  const sampleCakes: Cake[] = [
    {
      id: 'sample-chocolate-1',
      name: 'Rich Chocolate Fudge Cake',
      description: 'Decadent chocolate cake with layers of rich fudge and chocolate ganache.',
      category: 'chocolate',
      priceRange: '₹800 - ₹1200',
      images: ['https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: 'sample-chocolate-2',
      name: 'Dark Chocolate Truffle Cake',
      description: 'Intense dark chocolate cake with truffle filling and cocoa dusting.',
      category: 'chocolate',
      priceRange: '₹900 - ₹1400',
      images: ['https://images.pexels.com/photos/1055272/pexels-photo-1055272.jpeg'],
      featured: false,
      createdAt: new Date()
    },
    {
      id: 'sample-vanilla-1',
      name: 'Classic Vanilla Bean Cake',
      description: 'Light and fluffy vanilla sponge cake with vanilla buttercream frosting.',
      category: 'vanilla',
      priceRange: '₹700 - ₹1000',
      images: ['https://images.pexels.com/photos/1721932/pexels-photo-1721932.jpeg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: 'sample-fruit-1',
      name: 'Fresh Strawberry Delight',
      description: 'Moist vanilla cake layered with fresh strawberries and whipped cream.',
      category: 'fruit',
      priceRange: '₹900 - ₹1300',
      images: ['https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg'],
      featured: true,
      createdAt: new Date()
    },
    {
      id: 'sample-custom-1',
      name: 'Custom Birthday Celebration',
      description: 'Personalized birthday cake with custom decorations and your choice of flavors.',
      category: 'custom',
      priceRange: '₹1200 - ₹2000',
      images: ['https://images.pexels.com/photos/1702373/pexels-photo-1702373.jpeg'],
      featured: false,
      createdAt: new Date()
    }
  ];

  // Category display names
  const categoryNames: Record<string, string> = {
    'all': 'All Cakes',
    'chocolate': 'Chocolate Cakes',
    'vanilla': 'Vanilla Cakes', 
    'fruit': 'Fruit Cakes',
    'custom': 'Custom Cakes',
    'red-velvet': 'Red Velvet Cakes',
    'cheesecakes': 'Cheesecakes'
  };

  useEffect(() => {
    const fetchCakes = async () => {
      console.log('CategoryPage: Starting fetch for category:', category);
      
      if (!category) {
        console.log('CategoryPage: No category provided');
        setError('No category specified');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        let fetchedCakes: Cake[] = [];
        
        if (category === 'all') {
          console.log('CategoryPage: Fetching all cakes');
          // For "all" category, show all sample cakes
          fetchedCakes = sampleCakes;
        } else {
          console.log('CategoryPage: Fetching cakes for specific category:', category);
          // For specific category, filter sample cakes
          fetchedCakes = sampleCakes.filter(cake => cake.category === category);
        }
        
        console.log('CategoryPage: Found cakes:', fetchedCakes.length);
        setCakes(fetchedCakes);
        
      } catch (error) {
        console.error('CategoryPage: Error fetching cakes:', error);
        setError('Failed to load cakes');
      } finally {
        setLoading(false);
      }
    };

    fetchCakes();
  }, [category]); // Only depend on category

  const getCategoryName = () => {
    return categoryNames[category || ''] || 'Unknown Category';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-gray-600 mt-4">Loading {getCategoryName()}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">⚠️</span>
            </div>
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
        {/* Breadcrumb */}
        <div className="flex items-center mb-8 text-sm">
          <Link to="/" className="text-gray-500 hover:text-orange-600">Home</Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{getCategoryName()}</span>
        </div>

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
                ? 'No cakes are currently available. Please check back later.' 
                : `No cakes found in the ${getCategoryName()} category.`}
            </p>
            <Link 
              to="/" 
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Browse All Categories
            </Link>
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

        {/* Debug info - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Debug Info:</h3>
            <p>Category Parameter: {category}</p>
            <p>Category Name: {getCategoryName()}</p>
            <p>Cakes Found: {cakes.length}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Error: {error || 'None'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;