export type WineType = 'Red' | 'White' | 'Rosé' | 'Sparkling' | 'Dessert' | 'Fortified';

export interface Wine {
  id: string;
  name: string;
  producer: string;
  vintage: string;
  type: WineType;
  region: string;
  country: string;
  grapes: string;
  rating: number;
  price: string;
  purchaseDate: string;
  notes: string;
  imageUri: string | null;
  dateAdded: string;
}