import express from 'express';
import * as categoryController from '../controllers/category.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

// Protect routes with JWT
router.use(authMiddleware);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

export default router;
