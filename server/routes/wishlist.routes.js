const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, removeFromWishlist, toggleWishlist } = require('../controllers/wishlist.controller');
const { protectRoute } = require('../middlewares/auth.middleware');

// All wishlist routes are protected
router.get('/', protectRoute, getWishlist);
router.post('/:productId', protectRoute, addToWishlist);
router.delete('/:productId', protectRoute, removeFromWishlist);
router.patch('/:productId/toggle', protectRoute, toggleWishlist);

module.exports = router;
