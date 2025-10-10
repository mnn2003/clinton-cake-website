export interface Cake {
  id: string;
  name: string;
  description: string;
  category: CakeCategory;
  priceRange: string;
  images: string[];
  featured: boolean;
  createdAt: Date;
}

export interface Enquiry {
  id: string;
  cakeId?: string;
  cakeName?: string;
  name: string;
  email: string;
  phone: string;
  eventDate: string;
  size: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  timestamp: Date;
}

export interface SlideshowImage {
  id: string;
  imageUrl: string;
  order: number;
  caption?: string;
}

export interface Category {
  id: string;
  key: string;
  name: string;
  description: string;
  imageUrl: string;
  order: number;
  active: boolean;
  createdAt: Date;
}

export type CakeCategory = 
  | 'cheesecakes' 
  | 'chocolate' 
  | 'red-velvet' 
  | 'fruit' 
  | 'custom';

export const CAKE_CATEGORIES: Record<CakeCategory, string> = {
  'cheesecakes': 'Cheesecakes',
  'chocolate': 'Chocolate',
  'red-velvet': 'Red Velvet',
  'fruit': 'Fruit',
  'custom': 'Custom'
};