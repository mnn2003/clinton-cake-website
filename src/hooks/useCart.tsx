import { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from './useAuth';
import { CartItem } from '../types';
import { getUserProfile, updateUserProfile } from '../services/firebaseService';

export const useCart = () => {
  const { state, dispatch } = useApp();
  const { user } = useAuth();

  // Load cart from localStorage or Firebase on mount
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        // Load cart from user profile
        try {
          const profile = await getUserProfile(user.uid);
          if (profile?.cart) {
            dispatch({ type: 'SET_CART', payload: profile.cart });
          }
        } catch (error) {
          console.error('Error loading cart from profile:', error);
        }
      } else {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('guestCart');
        if (savedCart) {
          try {
            const cart = JSON.parse(savedCart);
            dispatch({ type: 'SET_CART', payload: cart });
          } catch (error) {
            console.error('Error loading cart from localStorage:', error);
          }
        }
      }
    };

    loadCart();
  }, [user, dispatch]);

  // Save cart whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        // Save to Firebase
        try {
          await updateUserProfile(user.uid, { cart: state.cart });
        } catch (error) {
          console.error('Error saving cart to profile:', error);
        }
      } else {
        // Save to localStorage
        localStorage.setItem('guestCart', JSON.stringify(state.cart));
      }
    };

    if (state.cart.length > 0) {
      saveCart();
    } else if (!user) {
      localStorage.removeItem('guestCart');
    }
  }, [state.cart, user]);

  const addToCart = (item: Omit<CartItem, 'id' | 'addedAt'>) => {
    const existingItem = state.cart.find(
      cartItem => cartItem.cakeId === item.cakeId && cartItem.size === item.size
    );

    if (existingItem) {
      dispatch({
        type: 'UPDATE_CART_ITEM',
        payload: { id: existingItem.id, quantity: existingItem.quantity + item.quantity }
      });
    } else {
      const newItem: CartItem = {
        ...item,
        id: `${item.cakeId}-${item.size}-${Date.now()}`,
        addedAt: new Date()
      };
      dispatch({ type: 'ADD_TO_CART', payload: newItem });
    }
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_CART_ITEM', payload: { id, quantity } });
    }
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    if (!user) {
      localStorage.removeItem('guestCart');
    }
  };

  const getCartTotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
  };

  return {
    cart: state.cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount
  };
};