const express = require('express');
const router = express.Router();
const {
  createPaymentOrder,
  verifyPayment,
  getOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/order.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

// All order routes require authentication
router.post('/create-payment-order', protectRoute, createPaymentOrder);
router.post('/verify-payment', protectRoute, verifyPayment);
router.get('/', protectRoute, getOrders);
router.get('/:id', protectRoute, getOrderById);
router.patch('/:id/status', protectRoute, updateOrderStatus);

module.exports = router;
