import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

export { default as AdminUser } from './adminuser.model';
export { default as Product } from './product.model';
export { default as Category } from './category.model';
export { default as Order } from './order.model';
export { default as Customer } from './customer.model';
