import express from 'express';
import * as orderController from '../controllers/order.controller';
import authMiddleware from '../middlewares/auth.middleware';
import {
  createCheckoutSession,
  getCheckoutSession,
} from "../controllers/stripePayment.controller";

const router = express.Router();

router.use(authMiddleware);

//stripe payment routes
router.get("/get-checkout-session", getCheckoutSession);
router.post("/create-checkout-session", createCheckoutSession);

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);

export default router;
