import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

import Product from "./product.model";
import Category from "./category.model";
import Order from "./order.model";
import Customer from "./customer.model";
import AdminUser from "./adminuser.model";
import OrderItems from "./orderItems.model";
import CustomerCart from "./CustomerCart.model";

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
OrderItems.initModel(sequelize);
CustomerCart.initModel(sequelize);

// Define model associations

// Product ↔ Category
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });

// Order ↔ Customer
Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
Customer.hasMany(Order, { foreignKey: "customerId", as: "orders" });

OrderItems.belongsTo(Order, { foreignKey: "orderId", as: "order" });
Order.hasMany(OrderItems, { foreignKey: "orderId", as: "orderItems" });

OrderItems.belongsTo(Product, { foreignKey: "productId", as: "product" });
Product.hasMany(OrderItems, { foreignKey: "productId", as: "orderItems" });

CustomerCart.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });
CustomerCart.belongsTo(Product, { foreignKey: "productId", as: "product" });

Customer.hasMany(CustomerCart, { foreignKey: "customerId", as: "cartItems" });
// Product.hasMany(CustomerCart, { foreignKey: "productId", as: "cartItems" });

export { sequelize };
export {
  Product,
  Category,
  Order,
  Customer,
  AdminUser,
  OrderItems,
  CustomerCart,
};
