import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiSave } from 'react-icons/fi';
import { Cake, CakeCategory } from '../../types';
import { useCategories } from '../../hooks/useCategories';
import { uploadImage, deleteImage } from '../../services/firebaseService';

interface CakeFormProps {
  cake?: Cake;
  onSubmit: (data: Omit<Cake, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormData {
  name: string;
  description: string;
  category: CakeCategory;
  priceRange: string;
  featured: boolean;
}

const CakeForm: React.FC<CakeFormProps> = ({ 
  cake, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}) => {
  const [images, setImages] = useState<string[]>(cake?.images || []);
  const [uploading, setUploading] = useState(false);
  const { getCategoriesAsRecord } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: cake ? {
      name: cake.name,
      description: cake.description,
      category: cake.category,
      priceRange: cake.priceRange,
      featured: cake.featured
    } : {
      featured: false
    }
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const path = `cakes/${Date.now()}-${file.name}`;
        return uploadImage(file, path);
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (imageUrl: string, index: number) => {
    try {
      if (cake?.images.includes(imageUrl)) {
        await deleteImage(imageUrl);
      }
      setImages(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      images,
      createdAt: cake?.createdAt || new Date()
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-4 lg:p-6"
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900">
          {cake ? 'Edit Cake' : 'Add New Cake'}
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
              Cake Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Cake name is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Enter cake name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category', { required: 'Category is required' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">Select category</option>
              {Object.entries(getCategoriesAsRecord()).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range *
          </label>
          <input
            type="text"
            {...register('priceRange', { required: 'Price range is required' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="e.g., ₹500 - ₹800 or ₹600"
          />
          {errors.priceRange && (
            <p className="text-red-500 text-sm mt-1">{errors.priceRange.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Enter price range (e.g., ₹500 - ₹800) or single price (e.g., ₹600). The first number will be used as base price.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            placeholder="Describe the cake..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('featured')}
            className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
          />
          <label className="ml-2 text-sm text-gray-700">
            Featured cake (show on homepage)
          </label>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6">
            <div className="text-center">
              <FiUpload className="mx-auto h-8 lg:h-12 w-8 lg:w-12 text-gray-400" />
              <div className="mt-4">
                <label className="cursor-pointer">
                  <span className="bg-orange-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm lg:text-base">
                    {uploading ? 'Uploading...' : 'Upload Images'}
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-xs lg:text-sm text-gray-500 mt-2">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 lg:gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-16 lg:h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(image, index)}
                    className="absolute top-0.5 lg:top-1 right-0.5 lg:right-1 bg-red-500 text-white rounded-full p-0.5 lg:p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={10} className="lg:w-3 lg:h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={isLoading || uploading}
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
                {cake ? 'Update Cake' : 'Add Cake'}
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

export default CakeForm;