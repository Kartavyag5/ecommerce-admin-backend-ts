import { Request, Response } from 'express';
import { Customer } from '../models';
import { Op } from "sequelize";

export const getAllCustomers = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "DESC",
      search = "",
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const whereClause = search
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${search}%` } },
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows, count } = await Customer.findAndCountAll({
      where: whereClause,
      order: [[String(sortBy), String(order).toUpperCase()]],
      offset,
      limit: Number(limit),
    });

    res.json({
      data: rows,
      total: count,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


export const getCustomerById = async (req: Request, res: Response) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

export const createCustomer = async (req: Request, res: Response) => {
  const { email } = req.body;
  const exists = await Customer.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: 'Email already exists' });

  const newCustomer = await Customer.create(req.body);
  res.status(201).json(newCustomer);
};

export const updateCustomer = async (req: Request, res: Response) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  await customer.update(req.body);
  res.json(customer);
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });

  await customer.destroy();
  res.json({ message: 'Customer deleted' });
};
