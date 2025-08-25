import { Request, Response } from 'express';
import { Product, Category } from "../models";
import { Op } from "sequelize";

export const getAllProducts = async (req: any, res: any) => {
  try {
    let {
      page,
      limit,
      search = "",
      sortBy = "createdAt",
      order = "DESC",
      categoryId,
      minPrice,
      maxPrice,
      stock,
      includeDeleted = "true",
    } = req.query;

    const where: any = {};

    if (search) {
      where.name = { [Op.iLike]: `%${search}%` };
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price[Op.gte] = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.price[Op.lte] = parseFloat(maxPrice);
      }
    }

    if (stock) {
      where.stock = { [Op.gte]: parseInt(stock) };
    }

    const queryOptions: any = {
      where,
      include: [
        { model: Category, as: "category", attributes: ["id", "name"] },
      ],
      order: [[sortBy, order]],
      paranoid: includeDeleted != "true",
    };

    // 👉 Only apply pagination if both page & limit are provided
    if (page && limit) {
      page = Number(page);
      limit = Number(limit);
      const offset = (page - 1) * limit;

      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    const { rows: products, count: total } = await Product.findAndCountAll(
      queryOptions
    );

    res.json({
      data: products,
      total,
      page: page ? Number(page) : undefined,
      pageSize: limit ? Number(limit) : undefined,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Case 1: Bulk Create (array of products)
    if (Array.isArray(body)) {
      if (body.length === 0) {
        return res.status(400).json({ error: "No products provided" });
      }

      const products = await Product.bulkCreate(body, { validate: true });
      return res
        .status(201)
        .json({ message: "Products created", data: products });
    }

    // Case 2: Single Product
    const { name, description, price, stock, categoryId, imageUrl } = body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      imageUrl,
    });

    return res.status(201).json({ message: "Product created", data: product });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create product" });
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
  try {
    const { ids, range, all } = req.query;
    const paramId = req.params.id;

    // 1. DELETE /products/:id → Single Product
    if (paramId) {
      const product = await Product.findByPk(paramId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      await product.destroy(); // Soft delete
      return res.json({ message: `Product with id ${paramId} soft deleted` });
    }

    // 2. DELETE /products?ids=1,2,3 → Multiple by ID
    if (ids) {
      const idArray = (ids as string).split(",").map(Number);
      const products = await Product.findAll({
        where: { id: { [Op.in]: idArray } },
      });

      for (const product of products) {
        await product.destroy(); // Soft delete
      }

      return res.json({ message: `${products.length} products soft deleted` });
    }

    // 3. DELETE /products?range=3-10 → Range of IDs
    if (range) {
      const [start, end] = (range as string).split("-").map(Number);
      if (isNaN(start) || isNaN(end)) {
        return res
          .status(400)
          .json({ message: "Invalid range format. Use start-end." });
      }

      const products = await Product.findAll({
        where: { id: { [Op.between]: [start, end] } },
      });

      for (const product of products) {
        await product.destroy(); // Soft delete
      }

      return res.json({
        message: `${products.length} products soft deleted from range ${start}-${end}`,
      });
    }

    // 4. DELETE /products?all=true → Delete All Products
    if (all === "true") {
      const products = await Product.findAll();
      for (const product of products) {
        await product.destroy(); // Soft delete
      }
      return res.json({
        message: `All (${products.length}) products soft deleted`,
      });
    }

    return res.status(400).json({
      message: "Provide a valid delete target (id, ids, range, or all)",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error soft deleting product(s)", error: err });
  }
};

export const restoreProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const restored: any = await Product.restore({ where: { id } });
    if (restored) {
      res.status(200).json({ message: "Product restored successfully" });
    } else {
      res.status(404).json({ message: "Product not found or not deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};



