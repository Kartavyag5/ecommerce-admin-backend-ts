import express from 'express';
import {
  deleteProduct,
  updateProduct,
  createProduct,
  getProductById,
  getAllProducts,
  restoreProduct,
} from "../controllers/product.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = express.Router();

// Protect routes with JWT auth
// router.use(authMiddleware);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/", deleteProduct);
router.patch("/restore/:id", restoreProduct);

export default router;
