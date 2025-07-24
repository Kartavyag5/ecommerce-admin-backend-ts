import express from 'express';
import {
  deleteProduct,
  updateProduct,
  createProduct,
  getProductById,
  getAllProducts,
} from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

// Protect routes with JWT auth
router.use(authMiddleware);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/", deleteProduct);

export default router;
