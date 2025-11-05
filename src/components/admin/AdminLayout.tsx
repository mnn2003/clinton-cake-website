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
    <div className="min-h-screen bg-gray-50">
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 xl:w-72 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 lg:px-6 xl:px-8 border-b">
          <span className="text-lg lg:text-xl xl:text-2xl font-bold text-orange-600">Admin Panel</span>
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
                className={`flex items-center px-4 lg:px-6 xl:px-8 py-3 lg:py-4 text-sm lg:text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-50 text-orange-600 border-r-2 border-orange-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="mr-2 lg:mr-3 xl:mr-4" size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto w-full p-4 lg:p-6 xl:p-8 border-t">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-semibold text-sm lg:text-base">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm lg:text-base font-medium text-gray-900">Admin</p>
              <p className="text-xs lg:text-sm text-gray-500 truncate max-w-[120px] lg:max-w-[180px]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 lg:py-3 text-sm lg:text-base text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut className="mr-2 lg:mr-3" size={16} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 xl:ml-72">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b h-14 flex items-center justify-between px-4 lg:px-6 xl:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden"
          >
            <FiMenu size={24} />
          </button>
          <div className="flex-1" />
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;