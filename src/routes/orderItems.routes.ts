import express from 'express';
import {
  getAllOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem
} from '../controllers/orderItems.controller';

const router = express.Router();

// Base route: /api/order-items
router.get('/', getAllOrderItems);
router.get('/:id', getOrderItemById);
router.post('/', createOrderItem);
router.put('/:id', updateOrderItem);
router.delete('/:id', deleteOrderItem);

export default router;
