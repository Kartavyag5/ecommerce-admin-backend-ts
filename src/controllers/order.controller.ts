import { Request, Response } from 'express';
import { Customer, Order } from "../models";

export const getAllOrders = async (_req: Request, res: Response) => {
  const orders = await Order.findAll({
    include: [
      {
        model: Customer,
        as: "customer",
        attributes: ["id", "firstName", "LastName"],
      },
    ],
  });
  res.json(orders);
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  const newOrder = await Order.create(req.body);
  res.status(201).json(newOrder);
};

export const updateOrder = async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  await order.update(req.body);
  res.json(order);
};

export const deleteOrder = async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  await order.destroy();
  res.json({ message: 'Order deleted' });
};
