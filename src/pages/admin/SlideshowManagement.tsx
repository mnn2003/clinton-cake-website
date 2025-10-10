import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTrash2, FiUpload, FiMove } from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useApp } from '../../context/AppContext';
import { 
  getSlideshowImages, 
  addSlideshowImage, 
  updateSlideshowImage, 
  deleteSlideshowImage,
  uploadImage 
} from '../../services/firebaseService';
import { SlideshowImage } from '../../types';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const SlideshowManagement: React.FC = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSlideshowImages();
  }, []);

  const fetchSlideshowImages = async () => {
    setLoading(true);
    try {
      const images = await getSlideshowImages();
      dispatch({ type: 'SET_SLIDESHOW_IMAGES', payload: images });
    } catch (error) {
      console.error('Error fetching slideshow images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const path = `slideshow/${Date.now()}-${file.name}`;
        const imageUrl = await uploadImage(file, path);
        
        const newImage: Omit<SlideshowImage, 'id'> = {
          imageUrl,
          order: state.slideshowImages.length + index,
          caption: `Slide ${state.slideshowImages.length + index + 1}`
        };

        const id = await addSlideshowImage(newImage);
        return { ...newImage, id };
      });

      const newImages = await Promise.all(uploadPromises);
      newImages.forEach(image => {
        dispatch({ type: 'SET_SLIDESHOW_IMAGES', payload: [...state.slideshowImages, image] });
      });
      
      // Refresh to get updated order
      fetchSlideshowImages();
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (image: SlideshowImage) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    
    try {
      await deleteSlideshowImage(image.id);
      const updatedImages = state.slideshowImages.filter(img => img.id !== image.id);
      dispatch({ type: 'SET_SLIDESHOW_IMAGES', payload: updatedImages });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const handleCaptionUpdate = async (image: SlideshowImage, caption: string) => {
    try {
      await updateSlideshowImage(image.id, { caption });
      const updatedImages = state.slideshowImages.map(img =>
        img.id === image.id ? { ...img, caption } : img
      );
      dispatch({ type: 'SET_SLIDESHOW_IMAGES', payload: updatedImages });
    } catch (error) {
      console.error('Error updating caption:', error);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(state.slideshowImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order values
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    dispatch({ type: 'SET_SLIDESHOW_IMAGES', payload: updatedItems });

    // Update in Firebase
    try {
      await Promise.all(
        updatedItems.map(item => 
          updateSlideshowImage(item.id, { order: item.order })
        )
      );
    } catch (error) {
      console.error('Error updating slide order:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="py-32" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slideshow Management</h1>
          <p className="text-gray-600 mt-2 hidden sm:block">Manage homepage slideshow images</p>
        </div>
        <label className="bg-orange-600 text-white px-3 lg:px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center cursor-pointer text-sm lg:text-base">
          <FiPlus className="mr-2" />
          {uploading ? 'Uploading...' : <><span className="hidden sm:inline">Add </span>Images</>}
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

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 lg:p-8">
          <div className="text-center">
            <FiUpload className="mx-auto h-8 lg:h-12 w-8 lg:w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="bg-orange-600 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-lg hover:bg-orange-700 transition-colors text-sm lg:text-base">
                  {uploading ? 'Uploading...' : 'Upload Slideshow Images'}
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
              PNG, JPG, GIF up to 10MB each. Recommended size: 1920x600px
            </p>
          </div>
        </div>
      </div>

      {/* Slideshow Images */}
      {state.slideshowImages.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
          <div className="flex items-center mb-4">
            <FiMove className="mr-2 text-gray-500" />
            <span className="text-xs lg:text-sm text-gray-600">Drag and drop to reorder slides</span>
          </div>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="slideshow">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {state.slideshowImages
                    .sort((a, b) => a.order - b.order)
                    .map((image, index) => (
                    <Draggable key={image.id} draggableId={image.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`bg-gray-50 rounded-lg p-3 lg:p-4 ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-2 lg:space-x-4">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-move text-gray-400 hover:text-gray-600"
                            >
                              <FiMove size={20} />
                            </div>
                            
                            <div className="w-16 lg:w-24 h-10 lg:h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={image.imageUrl}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1 lg:mb-2">
                                <span className="text-xs lg:text-sm font-medium text-gray-700">
                                  Slide {index + 1}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Order: {image.order}
                                </span>
                              </div>
                              <input
                                type="text"
                                value={image.caption || ''}
                                onChange={(e) => handleCaptionUpdate(image, e.target.value)}
                                placeholder="Enter slide caption..."
                                className="w-full px-2 lg:px-3 py-1 lg:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-xs lg:text-sm"
                              />
                            </div>
                            
                            <button
                              onClick={() => handleDeleteImage(image)}
                              className="text-red-500 hover:text-red-700 p-1 lg:p-2"
                            >
                              <FiTrash2 size={16} className="lg:w-[18px] lg:h-[18px]" />
                            </button>
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
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12 text-center">
          <FiUpload className="mx-auto h-12 lg:h-16 w-12 lg:w-16 text-gray-300 mb-4" />
          <h3 className="text-base lg:text-lg font-medium text-gray-900 mb-2">No slideshow images</h3>
          <p className="text-gray-500">Upload your first slideshow image to get started</p>
        </div>
      )}
    </div>
  );
};

export default SlideshowManagement;