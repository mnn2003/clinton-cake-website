import React from 'react';
import HeroSlideshow from '../components/home/HeroSlideshow';
import CategoriesGrid from '../components/home/CategoriesGrid';
import FeaturedCakes from '../components/home/FeaturedCakes';

const HomePage: React.FC = () => {
  return (
    <div>
      <HeroSlideshow />
      <CategoriesGrid />
      <FeaturedCakes />
    </div>
  );
};

export default HomePage;