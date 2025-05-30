import API from './axios';
import type { Product } from '../types/Product';

export const getProducts = async (): Promise<Product[]> => {
  const res = await API.get('/products');
  return res.data;
};

export const createProduct = async (data: Omit<Product, 'id'>) => {
  return API.post('/products', data);
};

export const updateProduct = async (id: number, data: Partial<Product>) => {
  return API.put(`/products/${id}`, data);
};

export const deleteProduct = async (id: number) => {
  return API.delete(`/products/${id}`);
};
