const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartQuantity, removeFromCart } = require('../controllers/cart.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

// All cart routes are protected
router.get('/', protectRoute, getCart);
router.post('/:productId', protectRoute, addToCart);
router.patch('/:productId', protectRoute, updateCartQuantity);
router.delete('/:productId', protectRoute, removeFromCart);

module.exports = router;
