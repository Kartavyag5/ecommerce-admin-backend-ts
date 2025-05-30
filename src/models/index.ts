import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import Product from "./product.model";
import Category from "./category.model";
import Order from "./order.model";
import Customer from "./customer.model";
import AdminUser from "./adminuser.model";

// Initialize Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || "ecommerce_admin",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "1234",
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  }
);

// Initialize models with sequelize instance
Product.initModel(sequelize);
Category.initModel(sequelize);
Order.initModel(sequelize);
Customer.initModel(sequelize);
AdminUser.initModel(sequelize);

// Define model associations

// Product ↔ Category
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

// Order ↔ Customer
Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
Customer.hasMany(Order, { foreignKey: "customerId", as: "orders" });

export { sequelize };
export { Product, Category, Order, Customer, AdminUser };
