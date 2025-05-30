import { Request, Response } from 'express';
import { Product, Category } from "../models";

export const getAllProducts = async (req: any, res: any) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
    });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const newProduct = await Product.create(req.body);
  res.status(201).json(newProduct);
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.update(req.body);
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.destroy();
  res.json({ message: 'Product deleted' });
};

