import express from 'express';
import { requireAuth, validateRequest } from '@good_zone/common';
import {
  createOrder,
  deleteOrder,
  getOrder,
  getOrders,
} from '../controllers/order';

const router = express.Router();

router.get('/api/orders', requireAuth, getOrders);
router.delete('/api/orders/:orderId', requireAuth, deleteOrder);
router.post('/api/orders', requireAuth, validateRequest, createOrder);
router.get('/api/orders/:orderId', requireAuth, getOrder);

export { router as orderRouter };
