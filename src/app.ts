import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import customerRoutes from './routes/customer.routes';
import dashboardRoutes from './routes/dashboard.routes';
import adminAuthRoutes from "./routes/adminAuth.routes";
import uploadRoute from "./routes/uploadRoute";
import orderItemsRoutes from "./routes/orderItems.routes";
import path from "path";
import customerCartRoutes from "./routes/customerCart.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/order-items", orderItemsRoutes);
app.use("/api/customer-cart", customerCartRoutes);
app.use("/api/upload", uploadRoute);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

export default app;
