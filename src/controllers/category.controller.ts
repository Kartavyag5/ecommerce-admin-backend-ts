import { Request, Response } from 'express';
import { Category, Product } from "../models";
import { Op } from "sequelize";

export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await Category.findAll();
  res.json(categories);
};

export const getCategoryById = async (req: Request, res: Response) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const categories = Array.isArray(req.body) ? req.body : [req.body];

    const validCategories = categories
      .filter((cat) => cat.name && typeof cat.name === "string")
      .map((cat) => ({
        name: cat.name.trim(),
        description: cat.description?.trim() || null,
      }));

    if (validCategories.length === 0) {
      return res.status(400).json({ message: "No valid categories provided." });
    }

    // Fetch existing categories (case-insensitive)
    const existing = await Category.findAll({
      where: {
        name: {
          [Op.iLike]: {
            [Op.any]: validCategories.map((cat) => cat.name),
          },
        },
      },
    });

    const existingNames = existing.map((cat) => cat.name.toLowerCase());

    // Filter out duplicates
    const newCategories = validCategories.filter(
      (cat) => !existingNames.includes(cat.name.toLowerCase())
    );

    // Bulk create
    const created = await Category.bulkCreate(newCategories);

    res.status(201).json({
      createdCount: created.length,
      skippedCount: validCategories.length - created.length,
      created,
      skipped: validCategories.filter((cat) =>
        existingNames.includes(cat.name.toLowerCase())
      ),
    });
  } catch (error) {
    console.error("Error creating categories:", error);
    res.status(500).json({ message: "Internal server error." });
  }
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
