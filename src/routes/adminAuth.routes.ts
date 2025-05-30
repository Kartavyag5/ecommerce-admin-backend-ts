import { Router } from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminAuth.controller';

const router = Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

export default router;
