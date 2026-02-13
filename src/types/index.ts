export interface Cake {
  id: string;
  name: string;
  description: string;
  category: CakeCategory;
  priceRange?: string; // Keep for backward compatibility
  sizes?: CakeSize[];
  images: string[];
  featured: boolean;
  createdAt: Date;
}

export interface CakeSize {
  name: string;
  price: number;
  servings?: string;
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

export type CakeCategory = string;

// Legacy categories for backward compatibility
export const LEGACY_CAKE_CATEGORIES = {
  'cheesecakes': 'Cheesecakes',
  'chocolate': 'Chocolate',
  'red-velvet': 'Red Velvet',
  'fruit': 'Fruit',
  'custom': 'Custom'
};

export interface CartItem {
  id: string;
  cakeId: string;
  cakeName: string;
  cakeImage: string;
  price: number;
  quantity: number;
  size: string;
  customizations?: string;
  addedAt: Date;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  profilePicture?: string;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  notes?: string;
  paymentMethod: 'cash' | 'card' | 'online';
}