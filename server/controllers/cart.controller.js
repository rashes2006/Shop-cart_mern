const mongoose = require('mongoose');
const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

// Helper: populate cart on a user and return formatted array
const populateCart = async (userId) => {
  const user = await Customer.findById(userId).populate({
    path: 'cart.product',
    select: 'name price category image stock description',
  });
  return (user.cart || []).filter((item) => item.product !== null);
};

// @desc    Add product to cart (or increment quantity)
// @route   POST /cart/:productId
// @access  Protected
const addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await Customer.findById(req.user._id);
    if (!user.cart) user.cart = [];

    const existingItem = user.cart.find(
      (item) => item.product.toString() === productId.toString()
    );

    const newQty = existingItem ? existingItem.quantity + 1 : 1;

    if (newQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available in stock`,
      });
    }

    if (existingItem) {
      existingItem.quantity = newQty;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    const cart = await populateCart(req.user._id);

    return res.status(200).json({ success: true, message: 'Cart updated', cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

// @desc    Get current user's cart (populated)
// @route   GET /cart
// @access  Protected
const getCart = async (req, res) => {
  try {
    const cart = await populateCart(req.user._id);
    return res.status(200).json({ success: true, cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

// @desc    Update quantity of a cart item
// @route   PATCH /cart/:productId
// @access  Protected
const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} unit(s) available in stock`,
      });
    }

    const user = await Customer.findById(req.user._id);
    const item = (user.cart || []).find(
      (item) => item.product.toString() === productId.toString()
    );

    if (!item) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    item.quantity = quantity;
    await user.save();
    const cart = await populateCart(req.user._id);

    return res.status(200).json({ success: true, message: 'Quantity updated', cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

// @desc    Remove product from cart
// @route   DELETE /cart/:productId
// @access  Protected
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const user = await Customer.findById(req.user._id);
    const index = (user.cart || []).findIndex(
      (item) => item.product.toString() === productId.toString()
    );

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not in cart' });
    }

    user.cart.splice(index, 1);
    await user.save();
    const cart = await populateCart(req.user._id);

    return res.status(200).json({ success: true, message: 'Product removed from cart', cart });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error: ' + error.message });
  }
};

module.exports = { addToCart, getCart, updateCartQuantity, removeFromCart };
