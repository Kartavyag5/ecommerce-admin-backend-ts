// controllers/paymentController.ts
import { Request, Response } from 'express';
import Payment from '../models/payment.model';
import Order from '../models/order.model'

export const createPayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllPayments = async (req: Request, res: Response) => {
  try {
    const payments = await Payment.findAll({ include: ['order'] });
    res.json(payments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: ['order'],
    });
    if (!payment) return res.status(404).json({ message: 'Not found' });
    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Not found' });

    await payment.update(req.body);
    res.json(payment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Not found' });

    await payment.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
