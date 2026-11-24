import { Router } from 'express';
import {
  getPlans,
  getUserSubscription,
  createCheckoutOrder,
  verifyPayment,
  cancelSubscription,
  getUserInvoices,
} from '../controllers/billingController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Publicly viewable pricing plans
router.get('/plans', getPlans);

// Authenticated billing actions
router.get('/subscription', protect, getUserSubscription);
router.post('/orders', protect, createCheckoutOrder);
router.post('/verify', protect, verifyPayment);
router.post('/cancel', protect, cancelSubscription);
router.get('/invoices', protect, getUserInvoices);

export default router;
