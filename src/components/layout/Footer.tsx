import React from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-orange-400">Sweet Delights</h3>
            <p className="text-gray-300 mb-4">
              Creating memorable moments with our handcrafted cakes. Made with love, served with passion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-orange-400 transition-colors">Home</a></li>
              <li><a href="/category/cheesecakes" className="text-gray-300 hover:text-orange-400 transition-colors">Cheesecakes</a></li>
              <li><a href="/category/chocolate" className="text-gray-300 hover:text-orange-400 transition-colors">Chocolate</a></li>
              <li><a href="/category/custom" className="text-gray-300 hover:text-orange-400 transition-colors">Custom Cakes</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Wedding Cakes</li>
              <li className="text-gray-300">Birthday Cakes</li>
              <li className="text-gray-300">Corporate Events</li>
              <li className="text-gray-300">Special Occasions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMapPin className="text-orange-400" />
                <span className="text-gray-300">123 Baker Street, Mumbai, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="text-orange-400" />
                <span className="text-gray-300">+91 9768873133</span>
              </div>
              <div className="flex items-center space-x-3">
                <FiMail className="text-orange-400" />
                <span className="text-gray-300">ClintonDanielFerrao@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Sweet Delights. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;