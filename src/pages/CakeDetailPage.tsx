import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiHeart, FiShare2, FiShoppingCart } from 'react-icons/fi';
import { getCake, getCakesByCategory } from '../services/firebaseService';
import { Cake } from '../types';
import { useCategories } from '../hooks/useCategories';
import { useCart } from '../hooks/useCart';
import CakeCard from '../components/common/CakeCard';
import EnquiryForm from '../components/forms/EnquiryForm';
import Modal from '../components/ui/Modal';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const CakeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cake, setCake] = useState<Cake | null>(null);
  const [relatedCakes, setRelatedCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEnquiry, setShowEnquiry] = useState(false);
  const { getCategoryByKey } = useCategories();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState('Medium');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchCake = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const cakeData = await getCake(id);
        setCake(cakeData);
        
        if (cakeData) {
          const related = await getCakesByCategory(cakeData.category);
          setRelatedCakes(related.filter(c => c.id !== id).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching cake:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCake();
  }, [id]);

  const nextImage = () => {
    if (cake && cake.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === cake.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (cake && cake.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? cake.images.length - 1 : prev - 1
      );
    }
  };

  const handleAddToCart = () => {
    if (!cake) return;
    
    // Extract price from priceRange
    const priceMatch = cake.priceRange.match(/₹(\d+)/);
    const basePrice = priceMatch ? parseInt(priceMatch[1]) : 500;
    
    // Adjust price based on size
    const sizeMultiplier = selectedSize === 'Small' ? 0.8 : selectedSize === 'Large' ? 1.3 : selectedSize === 'Extra Large' ? 1.6 : 1;
    const price = Math.round(basePrice * sizeMultiplier);
    
    addToCart({
      cakeId: cake.id,
      cakeName: cake.name,
      cakeImage: cake.images[currentImageIndex] || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg',
      price,
      quantity,
      size: selectedSize
    });
    
    // Show success message or redirect to cart
    alert('Added to cart successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <LoadingSpinner size="lg" className="py-32" />
      </div>
    );
  }

  if (!cake) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Cake Not Found</h1>
          <p className="text-gray-600">The cake you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <img
                src={cake.images[currentImageIndex] || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                alt={cake.name}
                className="w-full h-full object-cover"
              />
              
              {cake.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            
            {cake.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {cake.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index ? 'border-orange-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${cake.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cake Details */}
          <div className="space-y-6">
            <div>
              <span className="text-orange-600 font-medium">
                {getCategoryByKey(cake.category)?.name || 'Unknown Category'}
              </span>
              <h1 className="text-4xl font-bold text-gray-800 mt-2 mb-4">
                {cake.name}
              </h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-2xl font-bold text-orange-600">
                  {cake.priceRange}
                </span>
                {cake.featured && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FiHeart size={20} />
                <span>Save</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <FiShare2 size={20} />
                <span>Share</span>
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {cake.description}
              </p>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Select Size</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  -
                </button>
                <span className="text-xl font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full bg-orange-600 text-white py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                <FiShoppingCart className="mr-2" />
                Add to Cart
              </motion.button>
              
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEnquiry(true)}
              className="w-full border-2 border-orange-600 text-orange-600 py-4 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              Enquire About This Cake
            </motion.button>
            </div>
          </div>
        </div>

        {/* Related Cakes */}
        {relatedCakes.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Related Cakes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedCakes.map((relatedCake) => (
                <CakeCard key={relatedCake.id} cake={relatedCake} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enquiry Modal */}
      <Modal
        isOpen={showEnquiry}
        onClose={() => setShowEnquiry(false)}
        title="Cake Enquiry"
        size="lg"
      >
        <EnquiryForm
          cakeId={cake.id}
          cakeName={cake.name}
          onSuccess={() => setShowEnquiry(false)}
        />
      </Modal>
    </div>
  );
};

export default CakeDetailPage;