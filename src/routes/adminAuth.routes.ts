import { Router } from 'express';
import {
  registerAdmin,
  loginAdmin,
  refreshToken,
} from "../controllers/adminAuth.controller";

const router = Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/refresh-token", refreshToken);

export default router;
