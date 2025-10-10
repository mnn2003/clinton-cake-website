import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';
import { Category } from '../../types';
import { uploadImage } from '../../services/firebaseService';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (data: Omit<Category, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  key: string;
  name: string;
  description: string;
  active: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  category, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [imageUrl, setImageUrl] = useState<string>(category?.imageUrl || '');
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormData>({
    defaultValues: category ? {
      key: category.key,
      name: category.name,
      description: category.description,
      active: category.active
    } : {
      active: true
    }
  });

  const watchKey = watch('key');

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const path = `categories/${Date.now()}-${file.name}`;
      const uploadedUrl = await uploadImage(file, path);
      setImageUrl(uploadedUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  const onFormSubmit = async (data: FormData) => {
    if (!imageUrl) {
      alert('Please upload a category image');
      return;
    }

    await onSubmit({
      ...data,
      imageUrl,
      order: category?.order || 0,
      createdAt: category?.createdAt || new Date()
    });
  };

  // Generate key from name
  const generateKey = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          {category ? 'Edit Category' : 'Add New Category'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <FiX size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Category name is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter category name"
              onChange={(e) => {
                const value = e.target.value;
                // Auto-generate key if not editing
                if (!category) {
                  const keyField = document.querySelector('input[name="key"]') as HTMLInputElement;
                  if (keyField) {
                    keyField.value = generateKey(value);
                  }
                }
              }}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Key *
            </label>
            <input
              type="text"
              {...register('key', { 
                required: 'Category key is required',
                pattern: {
                  value: /^[a-z0-9-]+$/,
                  message: 'Key must contain only lowercase letters, numbers, and hyphens'
                }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="category-key"
              readOnly={!!category}
            />
            {errors.key && (
              <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Used in URLs. {category ? 'Cannot be changed after creation.' : 'Auto-generated from name.'}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Describe this category..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('active')}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Active (visible to customers)
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image *
          </label>
          
          {imageUrl ? (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="Category preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="mt-2 text-red-600 hover:text-red-700 text-sm"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6">
              <div className="text-center">
                <FiUpload className="mx-auto h-8 lg:h-12 w-8 lg:w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="bg-orange-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm lg:text-base">
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <p className="text-xs lg:text-sm text-gray-500 mt-2">
                  PNG, JPG, GIF up to 10MB. Recommended size: 800x600px
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={isLoading || uploading || !imageUrl}
            className="flex-1 bg-orange-600 text-white py-2 lg:py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-sm lg:text-base"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center">
                <FiSave className="mr-2" />
                {category ? 'Update Category' : 'Add Category'}
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 lg:px-6 py-2 lg:py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm lg:text-base"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CategoryForm;