import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiMove, FiEye, FiEyeOff } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useApp } from '../../context/AppContext';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/firebaseService';
import { Category } from '../../types';
import CategoryForm from '../../components/admin/CategoryForm';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CategoryManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const categories = await getCategories();
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const id = await addCategory(categoryData);
      const newCategory = { ...categoryData, id };
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      setShowForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async (categoryData: Omit<Category, 'id'>) => {
    if (!editingCategory) return;
    
    try {
      await updateCategory(editingCategory.id, categoryData);
      const updatedCategory = { ...categoryData, id: editingCategory.id };
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
      setEditingCategory(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    
    try {
      await deleteCategory(category.id);
      dispatch({ type: 'DELETE_CATEGORY', payload: category.id });
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleToggleActive = async (category: Category) => {
    try {
      const updatedCategory = { ...category, active: !category.active };
      await updateCategory(category.id, { active: !category.active });
      dispatch({ type: 'UPDATE_CATEGORY', payload: updatedCategory });
    } catch (error) {
      console.error('Error toggling category status:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(state.categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    dispatch({ type: 'SET_CATEGORIES', payload: updatedItems });

    try {
      await Promise.all(
        updatedItems.map(item => 
          updateCategory(item.id, { order: item.order })
        )
      );
    } catch (error) {
      console.error('Error updating category order:', error);
    }
  };

  const filteredCategories = state.categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Category Management</h1>
          <p className="text-gray-600 mt-2 hidden sm:block">Manage cake categories and their display</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-orange-600 text-white px-3 lg:px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center text-sm lg:text-base"
        >
          <FiPlus className="mr-2" />
          <span className="hidden sm:inline">Add </span>Category
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="relative max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="flex items-center mb-4">
          <FiMove className="mr-2 text-gray-500" />
          <span className="text-xs lg:text-sm text-gray-600">Drag and drop to reorder categories</span>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {filteredCategories
                    .sort((a, b) => a.order - b.order)
                    .map((category, index) => (
                    <Draggable key={category.id} draggableId={category.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-gray-50 rounded-lg p-3 lg:p-4 ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          } ${!category.active ? 'opacity-60' : ''}`}
                        >
                          <div className="flex items-center space-x-2 lg:space-x-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-move text-gray-400 hover:text-gray-600"
                            >
                              <FiMove size={20} />
                            </div>
                            
                            <div className="w-16 lg:w-20 h-12 lg:h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={category.imageUrl}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-sm lg:text-base font-semibold text-gray-900 truncate">
                                  {category.name}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  ({category.key})
                                </span>
                                {!category.active && (
                                  <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <p className="text-xs lg:text-sm text-gray-600 truncate">
                                {category.description}
                              </p>
                              <div className="text-xs text-gray-500 mt-1">
                                Order: {category.order}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-1 lg:space-x-2">
                              <button
                                onClick={() => handleToggleActive(category)}
                                className={`p-1 lg:p-2 rounded-lg transition-colors ${
                                  category.active 
                                    ? 'text-green-600 hover:bg-green-50' 
                                    : 'text-gray-400 hover:bg-gray-100'
                                }`}
                                title={category.active ? 'Deactivate' : 'Activate'}
                              >
                                {category.active ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                              </button>
                              
                              <button
                                onClick={() => {
                                  setEditingCategory(category);
                                  setShowForm(true);
                                }}
                                className="text-blue-600 hover:bg-blue-50 p-1 lg:p-2 rounded-lg transition-colors"
                              >
                                <FiEdit size={16} />
                              </button>
                              
                              <button
                                onClick={() => handleDeleteCategory(category)}
                                className="text-red-600 hover:bg-red-50 p-1 lg:p-2 rounded-lg transition-colors"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCategory(null);
        }}
        size="lg"
      >
        <CategoryForm
          category={editingCategory || undefined}
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default CategoryManagement;