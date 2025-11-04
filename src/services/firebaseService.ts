import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  setDoc,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Cake, Enquiry, SlideshowImage, CakeCategory, Category, UserProfile, Order } from '../types';

// Cake services
export const getCakes = async (): Promise<Cake[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cakes'));
    const cakes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Cake[];
    return cakes;
  } catch (error) {
    console.error('Error fetching all cakes:', error);
    return [];
  }
};

export const getCakesByCategory = async (category: CakeCategory): Promise<Cake[]> => {
  if (!category) {
    return [];
  }
  
  try {
    const q = query(
      collection(db, 'cakes'),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    const cakes = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Cake[];
    return cakes;
  } catch (error) {
    console.error('Error fetching cakes by category:', error);
    return [];
  }
};

export const getCake = async (id: string): Promise<Cake | null> => {
  const docSnap = await getDoc(doc(db, 'cakes', id));
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    } as Cake;
  }
  return null;
};

export const addCake = async (cake: Omit<Cake, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'cakes'), {
    ...cake,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const updateCake = async (id: string, cake: Partial<Cake>): Promise<void> => {
  await updateDoc(doc(db, 'cakes', id), cake);
};

export const deleteCake = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'cakes', id));
};

// Enquiry services
export const getEnquiries = async (): Promise<Enquiry[]> => {
  const q = query(collection(db, 'enquiries'), orderBy('timestamp', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() || new Date(),
  })) as Enquiry[];
};

export const addEnquiry = async (enquiry: Omit<Enquiry, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'enquiries'), {
    ...enquiry,
    timestamp: new Date(),
  });
  return docRef.id;
};

export const updateEnquiry = async (id: string, enquiry: Partial<Enquiry>): Promise<void> => {
  await updateDoc(doc(db, 'enquiries', id), enquiry);
};

// Slideshow services
export const getSlideshowImages = async (): Promise<SlideshowImage[]> => {
  const q = query(collection(db, 'slideshow'), orderBy('order'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as SlideshowImage[];
};

export const addSlideshowImage = async (image: Omit<SlideshowImage, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'slideshow'), image);
  return docRef.id;
};

export const updateSlideshowImage = async (id: string, image: Partial<SlideshowImage>): Promise<void> => {
  await updateDoc(doc(db, 'slideshow', id), image);
};

export const deleteSlideshowImage = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'slideshow', id));
};

// Storage services
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

export const deleteImage = async (url: string): Promise<void> => {
  const imageRef = ref(storage, url);
  await deleteObject(imageRef);
};

// Category services
export const getCategories = async (): Promise<Category[]> => {
  const q = query(collection(db, 'categories'), orderBy('order'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date(),
  })) as Category[];
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'categories'), {
    ...category,
    createdAt: new Date(),
  });
  return docRef.id;
};

export const updateCategory = async (id: string, category: Partial<Category>): Promise<void> => {
  await updateDoc(doc(db, 'categories', id), category);
};

export const deleteCategory = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'categories', id));
};

// User Profile services
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const docSnap = await getDoc(doc(db, 'userProfiles', userId));
  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...docSnap.data(),
      createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    } as UserProfile;
  }
  return null;
};

export const createUserProfile = async (userId: string, profile: Omit<UserProfile, 'id'>): Promise<void> => {
  await setDoc(doc(db, 'userProfiles', userId), {
    ...profile,
    createdAt: new Date(),
  }, { merge: true });
};

export const updateUserProfile = async (userId: string, profile: Partial<UserProfile>): Promise<void> => {
  await setDoc(doc(db, 'userProfiles', userId), profile, { merge: true });
};

// Order services
export const getOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    orderDate: doc.data().orderDate?.toDate() || new Date(),
    deliveryDate: doc.data().deliveryDate?.toDate() || null,
  })) as Order[];
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const q = query(
    collection(db, 'orders'),
    where('userId', '==', userId),
    orderBy('orderDate', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    orderDate: doc.data().orderDate?.toDate() || new Date(),
    deliveryDate: doc.data().deliveryDate?.toDate() || null,
  })) as Order[];
};

export const addOrder = async (order: Omit<Order, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    orderDate: new Date(),
  });
  return docRef.id;
};

export const updateOrder = async (id: string, order: Partial<Order>): Promise<void> => {
  await updateDoc(doc(db, 'orders', id), order);
}