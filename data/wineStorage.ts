import AsyncStorage from '@react-native-async-storage/async-storage';
import { Wine } from '@/types/Wine';

const STORAGE_KEY = 'wine_collection';

// Get all wines from storage
export const getWineCollection = async (): Promise<Wine[]> => {
  try {
    const winesJson = await AsyncStorage.getItem(STORAGE_KEY);
    if (winesJson) {
      return JSON.parse(winesJson);
    }
    return [];
  } catch (error) {
    console.error('Error retrieving wine collection:', error);
    return [];
  }
};

// Get a specific wine by ID
export const getWineById = async (id: string): Promise<Wine | null> => {
  try {
    const wines = await getWineCollection();
    return wines.find(wine => wine.id === id) || null;
  } catch (error) {
    console.error('Error retrieving wine:', error);
    return null;
  }
};

// Add a new wine to the collection
export const addWine = async (wine: Wine): Promise<void> => {
  try {
    const wines = await getWineCollection();
    wines.push(wine);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
  } catch (error) {
    console.error('Error adding wine:', error);
    throw error;
  }
};

// Update an existing wine
export const updateWine = async (updatedWine: Wine): Promise<void> => {
  try {
    const wines = await getWineCollection();
    const index = wines.findIndex(wine => wine.id === updatedWine.id);
    
    if (index !== -1) {
      wines[index] = updatedWine;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
    } else {
      throw new Error('Wine not found');
    }
  } catch (error) {
    console.error('Error updating wine:', error);
    throw error;
  }
};

// Delete a wine from the collection
export const deleteWine = async (id: string): Promise<void> => {
  try {
    const wines = await getWineCollection();
    const updatedWines = wines.filter(wine => wine.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWines));
  } catch (error) {
    console.error('Error deleting wine:', error);
    throw error;
  }
};

// Clear the entire wine collection
export const clearWineCollection = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing wine collection:', error);
    throw error;
  }
};