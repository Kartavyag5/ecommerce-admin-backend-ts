import { Request, Response } from 'express';
import { Customer, Order } from "../models";
import OrderItems from "../models/orderItems.model";
import Product from "../models/product.model";
import { Op, fn, col, where } from "sequelize";

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      customerId,
      search,
      sortBy = "createdAt",
      order = "DESC",
    } = req.query;

    const whereClause: any = {};
    const customerWhereClause: any = {};

    // Filter by customerId
    if (customerId) whereClause.customerId = customerId;

    // Search by customer name
    if (search) {
      customerWhereClause[Op.or] = [
        where(fn("LOWER", col("firstName")), {
          [Op.like]: `%${search.toString().toLowerCase()}%`,
        }),
        where(fn("LOWER", col("lastName")), {
          [Op.like]: `%${search.toString().toLowerCase()}%`,
        }),
      ];
    }

    // Get paginated results
    const offset = (+page - 1) * +limit;

    const { count, rows } = await Order.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Customer,
          as: "customer",
          where: customerWhereClause,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: OrderItems,
          as: "orderItems",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name", "price"],
            },
          ],
        },
      ],
      order: [
        [
          sortBy.toString(),
          order.toString().toUpperCase() === "ASC" ? "ASC" : "DESC",
        ],
      ],
      limit: +limit,
      offset: +offset,
    });

    res.json({
      total: count,
      page: +page,
      limit: +limit,
      data: rows,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId, status, products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Products are required" });
    }

    // Step 1: Prevent duplicates
    const uniqueProducts = new Map();
    for (const item of products) {
      if (uniqueProducts.has(item.productId)) {
        return res
          .status(400)
          .json({ message: `Duplicate product ID: ${item.productId}` });
      }
      uniqueProducts.set(item.productId, item.quantity);
    }

    // Step 2: Fetch product details in batch
    const productIds = Array.from(uniqueProducts.keys());
    const dbProducts: any = await Product.findAll({
      where: { id: { [Op.in]: productIds } },
    });

    if (dbProducts.length !== productIds.length) {
      return res
        .status(400)
        .json({ message: "One or more products are not available" });
    }

    // Optional stock check (if using stock or isAvailable)
    for (const dbProduct of dbProducts) {
      if (dbProduct.stock && dbProduct.stock <= 0) {
        return res
          .status(400)
          .json({ message: `Product out of stock: ${dbProduct.name}` });
      }
    }

    // Step 3: Create order
    const newOrder = await Order.create({ customerId, status, totalAmount: 0 });
    let totalAmount = 0;

    for (const dbProduct of dbProducts) {
      const quantity = uniqueProducts.get(dbProduct.id);
      const price = dbProduct.price * quantity;
      totalAmount += price;

      await OrderItems.create({
        orderId: newOrder.id,
        productId: dbProduct.id,
        quantity,
        price,
      });
    }

    await newOrder.update({ totalAmount });

    const orderWithItems = await Order.findByPk(newOrder.id, {
      include: {
        model: OrderItems,
        as: "orderItems",
        include: [
          {
            model: Product,
            as: "product", // 👈 Also use correct alias from OrderItems → Product association
            attributes: ["id", "name"],
          },
        ],
      },
    });

    res.status(201).json(orderWithItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const { customerId, status, products } = req.body;
    await order.update({ customerId, status });

    if (products && Array.isArray(products)) {
      const uniqueProducts = new Map();
      for (const item of products) {
        if (uniqueProducts.has(item.productId)) {
          return res
            .status(400)
            .json({ message: `Duplicate product ID: ${item.productId}` });
        }
        uniqueProducts.set(item.productId, item.quantity);
      }

      const productIds = Array.from(uniqueProducts.keys());
      const dbProducts: any = await Product.findAll({
        where: { id: { [Op.in]: productIds } },
      });

      if (dbProducts.length !== productIds.length) {
        return res
          .status(400)
          .json({ message: "One or more products are not available" });
      }

      for (const dbProduct of dbProducts) {
        if (dbProduct.stock && dbProduct.stock <= 0) {
          return res
            .status(400)
            .json({ message: `Product out of stock: ${dbProduct.name}` });
        }
      }

      await OrderItems.destroy({ where: { orderId: order.id } });

      let totalAmount = 0;
      for (const dbProduct of dbProducts) {
        const quantity = uniqueProducts.get(dbProduct.id);
        const price = dbProduct.price * quantity;
        totalAmount += price;

        await OrderItems.create({
          orderId: order.id,
          productId: dbProduct.id,
          quantity,
          price,
        });
      }

      await order.update({ totalAmount });
    }

    const updatedOrder = await Order.findByPk(order.id, {
      include: {
        model: OrderItems,
        as: "orderItems",
        include: [
          {
            model: Product,
            as: "product", // 👈 Also use correct alias from OrderItems → Product association
            attributes: ["id", "name"],
          },
        ],
      },
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order" });
  }
};



export const deleteOrder = async (req: Request, res: Response) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  await order.destroy();
  res.json({ message: 'Order deleted' });
};
