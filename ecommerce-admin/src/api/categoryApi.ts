import API from './axios';
import type { Category } from '../types/Category';

export const getCategories = async (): Promise<Category[]> => {
  const res = await API.get('/categories');
  return res.data;
};

export const createCategory = async (data: Omit<Category, 'id'>) => {
  return API.post('/categories', data);
};

export const updateCategory = async (id: number, data: Partial<Category>) => {
  return API.put(`/categories/${id}`, data);
};

export const deleteCategory = async (id: number) => {
  return API.delete(`/categories/${id}`);
};
