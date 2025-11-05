import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiLayers, 
  FiImage, 
  FiMail, 
  FiShoppingBag,
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Manage Cakes', href: '/admin/cakes', icon: FiLayers },
    { name: 'Categories', href: '/admin/categories', icon: FiLayers },
    { name: 'Slideshow', href: '/admin/slideshow', icon: FiImage },
    { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
    { name: 'Enquiries', href: '/admin/enquiries', icon: FiMail },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-gray-600 opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <span className="text-xl font-bold text-orange-600">Admin Panel</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
          >
            <FiX size={24} />
          </button>
        </div>

        <nav className="mt-8 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-6 py-4 text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-4" size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto w-full p-6 border-t">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-semibold">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-base font-medium text-gray-900">Admin</p>
              <p className="text-sm text-gray-500 truncate max-w-[180px]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-base text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut className="mr-3" size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar for mobile */}
        <div className="lg:hidden bg-white shadow-sm border-b h-16 flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600"
          >
            <FiMenu size={24} />
          </button>
          <span className="ml-4 text-lg font-semibold text-gray-800">Admin Panel</span>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;