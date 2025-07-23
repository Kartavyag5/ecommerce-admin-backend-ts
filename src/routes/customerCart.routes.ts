import express from 'express';
import {
  getCartItems,
  getCartItemById,
  createCartItem,
  updateCartItem,
  deleteCartItem
} from '../controllers/customerCart.controller';

const router = express.Router();

router.get('/', getCartItems);
router.get('/:id', getCartItemById);
router.post('/', createCartItem);
router.put('/:id', updateCartItem);
router.delete('/:id', deleteCartItem);

export default router;
