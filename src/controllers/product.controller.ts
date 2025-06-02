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
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// export const createProduct = async (req: Request, res: Response) => {
//   const newProduct = await Product.create(req.body);
//   res.status(201).json(newProduct);
// };

// export const updateProduct = async (req: Request, res: Response) => {
//   const product = await Product.findByPk(req.params.id);
//   if (!product) return res.status(404).json({ message: 'Product not found' });
//   await product.update(req.body);
//   res.json(product);
// };

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, categoryId, image } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      image,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, categoryId, imageUrl } = req.body;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    await product.update({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.destroy();
  res.json({ message: 'Product deleted' });
};

