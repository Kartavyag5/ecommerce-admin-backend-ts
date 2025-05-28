import express from 'express';
import * as productController from '../controllers/product.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

// Protect routes with JWT auth
router.use(authMiddleware);

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
