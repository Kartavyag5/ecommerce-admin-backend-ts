import { Request, Response } from 'express';
import { Product, Category, Order, Customer } from '../models';
import { Op } from 'sequelize';

export const getOverview = async (_req: Request, res: Response) => {
  const [products, categories, orders, customers] = await Promise.all([
    Product.count(),
    Category.count(),
    Order.count(),
    Customer.count()
  ]);

  res.json({ products, categories, orders, customers });
};

export const getSalesSummary = async (_req: Request, res: Response) => {
  const orders = await Order.findAll({ order: [['createdAt', 'DESC']], limit: 5 });

  const totalSales = await Order.sum('totalAmount');

  res.json({ totalSales, recentOrders: orders });
};

export const getOrdersByStatus = async (_req: Request, res: Response) => {
  const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

  const data = await Promise.all(
    statuses.map(async (status) => {
      const count = await Order.count({ where: { status } });
      return { status, count };
    })
  );

  res.json(data);
};

export const getNewCustomers = async (_req: Request, res: Response) => {
  const customers = await Customer.findAll({
    order: [['createdAt', 'DESC']],
    limit: 5
  });

  res.json(customers);
};
