import { Request, Response } from 'express';
import CustomerCart from '../models/CustomerCart.model';
import  Customer from '../models/customer.model';
import  Product  from '../models/product.model';

export const getCartItems = async (req: Request, res: Response) => {
  try {
    const items = await CustomerCart.findAll({
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: Product,
        as: "product",
        attributes: ["id", "name"],
      },
    ],
  });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
};

export const getCartItemById = async (req: Request, res: Response) => {
  try {
    const item = await CustomerCart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
};

export const createCartItem = async (req: Request, res: Response) => {
  try {
    const { customerId, productId, quantity } = req.body;
    const item = await CustomerCart.create({ customerId, productId, quantity });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create cart item' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { customerId, productId, quantity } = req.body;
    const item = await CustomerCart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.update({ customerId, productId, quantity });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update cart item' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const item = await CustomerCart.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    await item.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete cart item' });
  }
};
