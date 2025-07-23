import { Request, Response } from 'express';
import { Category, Product } from "../models";

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await Category.findAll();
  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
};

import { Op } from "sequelize";

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;

  // Check if category with same name exists (case-insensitive)
  const existing = await Category.findOne({
    where: {
      name: { [Op.iLike]: name.trim() },
    },
  });

  if (existing) {
    return res
      .status(400)
      .json({ message: "Category with this name already exists." });
  }

  const newCategory = await Category.create({ name: name.trim() });
  res.status(201).json(newCategory);
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Category not found" });
  }

  const { name } = req.body;

  // Check if another category with same name exists
  const existing = await Category.findOne({
    where: {
      name: { [Op.iLike]: name.trim() },
      id: { [Op.ne]: req.params.id }, // Exclude current category
    },
  });

  if (existing) {
    return res
      .status(400)
      .json({ message: "Another category with this name already exists." });
  }

  await category.update({ name: name.trim() });
  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findByPk(req.params.id);
  const hasProducts = await Product.findOne({
    where: { categoryId: req.params.id },
  });
  if (hasProducts) {
    return res
      .status(400)
      .json({ error: "Cannot delete category with associated products." });
  }
  if (!category) return res.status(404).json({ message: "Category not found" });
  await category.destroy();
  res.json({ message: "Category deleted" });
};
