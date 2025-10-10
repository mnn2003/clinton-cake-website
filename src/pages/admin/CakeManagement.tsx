import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { getCakes, addCake, updateCake, deleteCake } from '../../services/firebaseService';
import { Cake, CakeCategory } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import CakeForm from '../../components/admin/CakeForm';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CakeManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const { getCategoriesAsRecord, getCategoryByKey } = useCategories();

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    setLoading(true);
    try {
      const cakes = await getCakes();
      dispatch({ type: 'SET_CAKES', payload: cakes });
    } catch (error) {
      console.error('Error fetching cakes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCake = async (cakeData: Omit<Cake, 'id'>) => {
    try {
      const id = await addCake(cakeData);
      const newCake = { ...cakeData, id };
      dispatch({ type: 'ADD_CAKE', payload: newCake });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding cake:', error);
    }
  };

  const handleUpdateCake = async (cakeData: Omit<Cake, 'id'>) => {
    if (!editingCake) return;
    
    try {
      await updateCake(editingCake.id, cakeData);
      const updatedCake = { ...cakeData, id: editingCake.id };
      dispatch({ type: 'UPDATE_CAKE', payload: updatedCake });
      setEditingCake(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating cake:', error);
    }
  };

  const handleDeleteCake = async (cake: Cake) => {
    if (!confirm(`Are you sure you want to delete "${cake.name}"?`)) return;
    
    try {
      await deleteCake(cake.id);
      dispatch({ type: 'DELETE_CAKE', payload: cake.id });
    } catch (error) {
      console.error('Error deleting cake:', error);
    }
  };

  const filteredCakes = state.cakes.filter(cake => {
    const matchesSearch = cake.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cake.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || cake.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cake Management</h1>
          <p className="text-gray-600 mt-2 hidden sm:block">Manage your cake collection</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-3 lg:px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center text-sm lg:text-base"
        >
          <FiPlus className="mr-2" />
          <span className="hidden sm:inline">Add New</span> Cake
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {Object.entries(getCategoriesAsRecord()).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Cakes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredCakes.map((cake, index) => (
          <motion.div
            key={cake.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-40 lg:h-48">
              <img
                src={cake.images[0] || 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg'}
                alt={cake.name}
                className="w-full h-full object-cover"
              />
              {cake.featured && (
                <div className="absolute top-2 left-2">
                  <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-3 lg:p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs lg:text-sm text-orange-600 font-medium">
                  {getCategoryByKey(cake.category)?.name || 'Unknown'}
                </span>
                <span className="text-xs lg:text-sm text-gray-500">
                  {cake.priceRange}
                </span>
              </div>
              
              <h3 className="text-base lg:text-lg font-bold text-gray-800 mb-2">
                {cake.name}
              </h3>
              
              <p className="text-gray-600 text-xs lg:text-sm line-clamp-2 mb-3 lg:mb-4">
                {cake.description}
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => {
                    setEditingCake(cake);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                >
                  <FiEdit className="mr-1" size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCake(cake)}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                >
                  <FiTrash2 className="mr-1" size={16} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCakes.length === 0 && (
        <div className="text-center py-8 lg:py-12">
          <p className="text-gray-500 text-lg">No cakes found</p>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCake(null);
        }}
        size="xl"
      >
        <CakeForm
          cake={editingCake || undefined}
          onSubmit={editingCake ? handleUpdateCake : handleAddCake}
          onCancel={() => {
            setShowForm(false);
            setEditingCake(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default CakeManagement;