const Product = require('../models/product.model');

const sampleProducts = [
  {
    name: 'Noise Cancelling Headphones',
    description: 'Industry-leading noise cancellation with spatial audio and up to 30 hours battery life.',
    price: 4999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    stock: 12,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Hot-swappable RGB mechanical gaming keyboard with tactile brown switches.',
    price: 2999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    stock: 10,
  },
  {
    name: 'Wireless Ergonomic Mouse',
    description: 'Precision wireless mouse designed for all-day comfort and seamless multi-device flow.',
    price: 1599,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80',
    stock: 18,
  },
  {
    name: 'Serum Radiance C',
    description: 'Brightening vitamin C facial serum with pure hyaluronic acid and antioxidant complex.',
    price: 1299,
    category: 'Skincare',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    stock: 25,
  },
  {
    name: 'Minimalist Leather Backpack',
    description: 'Handcrafted water-resistant leather everyday pack with padded 16-inch laptop compartment.',
    price: 3499,
    category: 'Fashion',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80',
    stock: 8,
  },
  {
    name: 'Studio Quality USB Microphone',
    description: 'Condenser microphone with cardioid pickup pattern, zero-latency monitoring, and tap-to-mute.',
    price: 3999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    stock: 15,
  },
];

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log('Sample products seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding products:', error.message);
  }
};

module.exports = seedProducts;
