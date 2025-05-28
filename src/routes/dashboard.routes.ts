import express from 'express';
import * as dashboardController from '../controllers/dashboard.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/overview', dashboardController.getOverview);
router.get('/sales-summary', dashboardController.getSalesSummary);
router.get('/orders-by-status', dashboardController.getOrdersByStatus);
router.get('/new-customers', dashboardController.getNewCustomers);

export default router;
