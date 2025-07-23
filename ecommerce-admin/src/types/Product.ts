import type { Category } from './Category';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  category?: Category;
  createdAt?: string;
  updatedAt?: string;
  stock?: number;
  imageUrl: string;
}
