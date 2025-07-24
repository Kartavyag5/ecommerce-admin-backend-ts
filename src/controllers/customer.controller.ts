import { Request, Response } from 'express';
import { Customer } from '../models';
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
  if (!customer) return res.status(404).json({ message: "Customer not found" });
  res.json(customer);
};

export const createCustomer = async (req: Request, res: Response) => {
  const { email } = req.body;
  const exists = await Customer.findOne({ where: { email } });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const newCustomer = await Customer.create(req.body);
  res.status(201).json(newCustomer);
};

export const updateCustomer = async (req: Request, res: Response) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  await customer.update(req.body);
  res.json(customer);
};

export const deleteCustomer = async (req: Request, res: Response) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ message: "Customer not found" });

  await customer.destroy();
  res.json({ message: "Customer deleted" });
};

// Replace with your secure secret key in production

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export const customerLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ where: { email } });
    if (!customer)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Tokens
    const accessToken = jwt.sign({ customerId: customer.id }, JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { customerId: customer.id },
      JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Optional: Save refresh token in DB for logout/blacklist (not shown here)

    res.json({
      accessToken,
      refreshToken,
      customer: {
        id: customer.id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
      customerId: number;
    };

    const newAccessToken = jwt.sign(
      { customerId: decoded.customerId },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
};


