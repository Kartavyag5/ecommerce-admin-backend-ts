import express from 'express';
import * as customerController from '../controllers/customer.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerById);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

export default router;
