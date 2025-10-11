import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { getSlideshowImages } from '../../services/firebaseService';

const HeroSlideshow: React.FC = () => {
  const { state, dispatch } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchSlideshow = async () => {
      try {
        const images = await getSlideshowImages();
        dispatch({ type: 'SET_SLIDESHOW_IMAGES', payload: images });
      } catch (error) {
        console.error('Error fetching slideshow:', error);
      }
    };

    fetchSlideshow();
  }, [dispatch]);

  useEffect(() => {
    if (state.slideshowImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => 
          prev === state.slideshowImages.length - 1 ? 0 : prev + 1
        );
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [state.slideshowImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === state.slideshowImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? state.slideshowImages.length - 1 : prev - 1
    );
  };

  if (state.slideshowImages.length === 0) {
    return (
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-r from-orange-100 to-orange-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-800 mb-4">
              Sweet Delights
            </h1>
            <p className="text-lg sm:text-xl text-orange-600 mb-6 sm:mb-8 px-4">
              Handcrafted cakes made with love
            </p>
            <button className="bg-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm sm:text-base">
              Explore Our Cakes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <img
            src={state.slideshowImages[currentSlide]?.imageUrl || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
            alt={state.slideshowImages[currentSlide]?.caption || 'Cake'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
          >
            Sweet Delights
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8"
          >
            {state.slideshowImages[currentSlide]?.caption || 'Handcrafted cakes made with love'}
          </motion.p>
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            onClick={() => window.location.href = '/category/all'}
            className="bg-orange-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors transform hover:scale-105 text-sm sm:text-base cursor-pointer"
          >
            Explore Our Cakes
          </motion.button>
        </div>
      </div>

      {/* Navigation */}
      {state.slideshowImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 sm:p-2 rounded-full transition-all"
          >
            <FiChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 sm:p-2 rounded-full transition-all"
          >
            <FiChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {state.slideshowImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                  currentSlide === index ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlideshow;