import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  customerLogin,
  deleteCustomer,
  updateCustomer,
  refreshAccessToken,
} from "../controllers/customer.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAllCustomers);
router.get("/:id", getCustomerById);
router.post("/", createCustomer);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);
router.post("/login", customerLogin);
router.post("/refresh-token", refreshAccessToken);

export default router;
