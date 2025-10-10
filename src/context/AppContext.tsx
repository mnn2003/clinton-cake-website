import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Cake, Enquiry, SlideshowImage, Category } from '../types';

interface AppState {
  cakes: Cake[];
  enquiries: Enquiry[];
  slideshowImages: SlideshowImage[];
  categories: Category[];
  loading: boolean;
  user: any;
}

type AppAction =
  | { type: 'SET_CAKES'; payload: Cake[] }
  | { type: 'ADD_CAKE'; payload: Cake }
  | { type: 'UPDATE_CAKE'; payload: Cake }
  | { type: 'DELETE_CAKE'; payload: string }
  | { type: 'SET_ENQUIRIES'; payload: Enquiry[] }
  | { type: 'ADD_ENQUIRY'; payload: Enquiry }
  | { type: 'UPDATE_ENQUIRY'; payload: Enquiry }
  | { type: 'SET_SLIDESHOW_IMAGES'; payload: SlideshowImage[] }
  | { type: 'SET_CATEGORIES'; payload: Category[] }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: any };

const initialState: AppState = {
  cakes: [],
  enquiries: [],
  slideshowImages: [],
  categories: [],
  loading: false,
  user: null,
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_CAKES':
      return { ...state, cakes: action.payload };
    case 'ADD_CAKE':
      return { ...state, cakes: [...state.cakes, action.payload] };
    case 'UPDATE_CAKE':
      return {
        ...state,
        cakes: state.cakes.map(cake =>
          cake.id === action.payload.id ? action.payload : cake
        ),
      };
    case 'DELETE_CAKE':
      return {
        ...state,
        cakes: state.cakes.filter(cake => cake.id !== action.payload),
      };
    case 'SET_ENQUIRIES':
      return { ...state, enquiries: action.payload };
    case 'ADD_ENQUIRY':
      return { ...state, enquiries: [...state.enquiries, action.payload] };
    case 'UPDATE_ENQUIRY':
      return {
        ...state,
        enquiries: state.enquiries.map(enquiry =>
          enquiry.id === action.payload.id ? action.payload : enquiry
        ),
      };
    case 'SET_SLIDESHOW_IMAGES':
      return { ...state, slideshowImages: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};