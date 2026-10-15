const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);
    // Allow localhost origins
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    // Allow Vercel deployed frontend
    if (/\.vercel\.app$/.test(origin)) return callback(null, true);
    // Allow custom client URL from env
    if (process.env.CLIENT_URL && origin === process.env.CLIENT_URL) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
const seedProducts = require('./utils/seedProducts');
let isConnecting = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (isConnecting) {
    return isConnecting;
  }

  isConnecting = mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  }).then(async () => {
    console.log('MongoDB connected successfully');
    try {
      await seedProducts();
    } catch (e) {
      console.warn('Seeding failed or skipped:', e.message);
    }
  }).catch((err) => {
    isConnecting = null;
    console.error('MongoDB connection error:', err.message);
    throw err;
  });

  return isConnecting;
};

// Connect DB on every request (for serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure Atlas IP whitelist allows 0.0.0.0/0.',
      error: error.message,
    });
  }
});

app.get('/', (req, res) => {
  res.send({
    message: 'Welcome to ShopKart Customer Authentication Service API',
    status: 'Running',
  });
});

// Mount Routes (support both /api/* and direct paths)
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);

// Start server only in non-serverless environment
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
