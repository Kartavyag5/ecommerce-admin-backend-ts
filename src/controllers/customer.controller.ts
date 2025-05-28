import { Request, Response } from 'express';
import { Customer } from '../models';

export const getAllCustomers = async (_req: Request, res: Response) => {
  const customers = await Customer.findAll();
  res.json(customers);
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
