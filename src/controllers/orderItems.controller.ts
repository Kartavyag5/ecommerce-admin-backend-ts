import { Request, Response } from 'express';
import OrderItems from '../models/orderItems.model';
import Product from '../models/product.model';

export const getAllOrderItems = async (req: Request, res: Response) => {
  try {
    const items = await OrderItems.findAll({
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["id", "name"],
      },
    ],
  });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
};

export const getOrderItemById = async (req: Request, res: Response) => {
  try {
    const item = await OrderItems.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Order item not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order item' });
  }
};// adjust import as per your project structure

export const createOrderItem = async (req: Request, res: Response) => {
  try {
    const { orderId, productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const calculatedPrice = product.price * quantity;

    const newItem = await OrderItems.create({
      orderId,
      productId,
      quantity,
      price: calculatedPrice,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order item' });
  }
};

export const updateOrderItem = async (req: Request, res: Response) => {
  try {
    const item = await OrderItems.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Order item not found' });

    const { orderId, productId, quantity } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const calculatedPrice = product.price * quantity;

    await item.update({
      orderId,
      productId,
      quantity,
      price: calculatedPrice,
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order item' });
  }
};


export const deleteOrderItem = async (req: Request, res: Response) => {
  try {
    const item = await OrderItems.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Order item not found' });

    await item.destroy();
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order item' });
  }
};
