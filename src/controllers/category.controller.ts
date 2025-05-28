import { Request, Response } from 'express';
import { Category } from '../models';

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await Category.findAll();
  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  const newCategory = await Category.create(req.body);
  res.status(201).json(newCategory);
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  await category.update(req.body);
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: 'Category not found' });
  await category.destroy();
  res.json({ message: 'Category deleted' });
};
