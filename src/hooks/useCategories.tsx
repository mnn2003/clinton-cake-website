import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getCategories } from '../services/firebaseService';
import { Category } from '../types';

export const useCategories = () => {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state.categories.length === 0) {
      fetchCategories();
    }
  }, [state.categories.length]);

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

  const getActiveCategories = (): Category[] => {
    return state.categories
      .filter(category => category.active)
      .sort((a, b) => a.order - b.order);
  };

  const getCategoryByKey = (key: string): Category | undefined => {
    const category = state.categories.find(category => 
      category.key === key && category.active
    );
    console.log('Looking for category with key:', key, 'Found:', category);
    console.log('Available categories:', state.categories.map(c => ({ key: c.key, name: c.name, active: c.active })));
    return category;
  };

  const getCategoriesAsRecord = (): Record<string, string> => {
    const record: Record<string, string> = {};
    getActiveCategories().forEach(category => {
      record[category.key] = category.name;
    });
    return record;
  };

  return {
    categories: state.categories,
    activeCategories: getActiveCategories(),
    loading,
    getCategoryByKey,
    getCategoriesAsRecord,
    refetch: fetchCategories
  };
};