import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const { activeCategories } = useCategories();
  const { getCartItemCount } = useCart();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-orange-600"
            >
              Sweet Delights
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/') 
                  ? 'text-orange-600 font-semibold' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Home
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-orange-600 transition-colors">
                Categories
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {activeCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.key}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  to="/category/all"
                  className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-t first:rounded-t-lg last:rounded-b-lg font-semibold"
                >
                  View All Cakes
                </Link>
              </div>
            </div>

            <Link
              to="/contact"
              className={`transition-colors ${
                isActive('/contact') 
                  ? 'text-orange-600 font-semibold' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              Contact
            </Link>
            
            <Link
              to="/about"
              className={`transition-colors ${
                isActive('/about') 
                  ? 'text-orange-600 font-semibold' 
                  : 'text-gray-700 hover:text-orange-600'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Cart and User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <FiShoppingCart size={20} />
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 font-semibold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 transition-colors"
              >
                <FiUser size={16} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t"
          >
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              <div className="space-y-2">
                <span className="text-gray-500 text-sm font-semibold">Categories</span>
                {activeCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/category/${category.key}`}
                    className="block pl-4 text-gray-700 hover:text-orange-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
                <Link
                  to="/category/all"
                  className="block pl-4 text-gray-700 hover:text-orange-600 font-semibold border-t pt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View All Cakes
                </Link>
              </div>

              <Link
                to="/contact"
                className="text-gray-700 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              <Link
                to="/about"
                className="text-gray-700 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              
              <div className="pt-4 border-t">
                <Link
                  to="/cart"
                  className="flex items-center justify-between text-gray-700 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Cart</span>
                  {getCartItemCount() > 0 && (
                    <span className="bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartItemCount()}
                    </span>
                  )}
                </Link>
                
                {user ? (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-xs">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">{user.email}</span>
                  </div>
                ) : (
                  <Link
                    to="/admin/login"
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FiUser size={16} />
                    <span>Login</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;