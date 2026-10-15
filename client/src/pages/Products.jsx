import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Background from '../components/Background';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalProduct, setActiveModalProduct] = useState(null);

  const fetchCatalogData = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch user & wishlist
      try {
        const userRes = await api.get('/customers/me');
        setUser(userRes.data);

        const wishlistRes = await api.get('/wishlist');
        if (wishlistRes.data && wishlistRes.data.wishlist) {
          const ids = wishlistRes.data.wishlist.map((item) =>
            typeof item === 'object' ? item._id : item
          );
          setWishlistIds(ids);
        }
      } catch (authErr) {
        // If not logged in, user is unauthenticated
        setUser(null);
        setWishlistIds([]);
      }

      // 2. Fetch products
      const prodRes = await api.get('/products');
      if (prodRes.data && prodRes.data.products) {
        setProducts(prodRes.data.products);
      }
    } catch (err) {
      setError('Unable to load products. Please check server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogData();
  }, []);

  const handleWishlistChange = (productId, isAdded) => {
    if (isAdded) {
      setWishlistIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
    } else {
      setWishlistIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleModalWishlistToggle = async (product) => {
    const isSaved = wishlistIds.includes(product._id);
    try {
      if (isSaved) {
        await api.delete(`/wishlist/${product._id}`);
        handleWishlistChange(product._id, false);
      } else {
        await api.post(`/wishlist/${product._id}`);
        handleWishlistChange(product._id, true);
      }
    } catch (err) {
      console.error('Wishlist action failed', err);
    }
  };

  // Extract unique categories
  const categories = ['All', ...new Set(products.map((p) => p.category))];

  // Filter products by search and category
  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="vertex-app-layout">
      <Background />
      <Navbar showLogout={!!user} user={user} wishlistCount={wishlistIds.length} />

      <main className="vertex-main-content catalog-page">
        {/* Header Hero */}
        <div className="catalog-header-section">
          <div className="vertex-badge">
            <i className="badge-icon">🛍️</i>
            <b>Live Product Catalog · Instant Wishlisting</b>
          </div>

          <h1 className="hero-h1">EXPLORE THE CATALOG</h1>
          <p className="hero-sub">
            Discover premium tech, fashion, and lifestyle items. Tap the heart icon on any card to save it to your personal wishlist.
          </p>

          {/* Search & Category Filter Toolbar */}
          <div className="catalog-toolbar">
            <div className="catalog-search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search products by name or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" className="search-clear-btn" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="category-filter-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content States */}
        {loading ? (
          <div className="state-panel loading-state">
            <div className="vertex-spinner"></div>
            <p className="state-msg">Loading product catalog...</p>
          </div>
        ) : error ? (
          <div className="state-panel error-state">
            <div className="state-icon">⚠️</div>
            <h2>Something went wrong</h2>
            <p className="state-msg">{error}</p>
            <button type="button" className="btn btn-vertex-primary" onClick={fetchCatalogData}>
              <span>Try Again</span>
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="state-panel empty-state">
            <div className="state-icon">🔍</div>
            <h2>No products found</h2>
            <p className="state-msg">
              {searchTerm
                ? `No products matched "${searchTerm}". Try another search term.`
                : 'No products in this category.'}
            </p>
            <button
              type="button"
              className="btn btn-outline-cyan"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
            >
              <span>Reset Filters</span>
            </button>
          </div>
        ) : (
          <div className="products-grid-container">
            <div className="products-count-bar">
              <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}</span>
              <button
                type="button"
                className="view-wishlist-inline-btn"
                onClick={() => navigate('/wishlist')}
              >
                ❤️ Go to Wishlist ({wishlistIds.length}) &rarr;
              </button>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isInWishlist={wishlistIds.includes(product._id)}
                  onWishlistChange={handleWishlistChange}
                  onViewDetails={(prod) => setActiveModalProduct(prod)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <ProductDetailModal
          product={activeModalProduct}
          isInWishlist={wishlistIds.includes(activeModalProduct._id)}
          onClose={() => setActiveModalProduct(null)}
          onToggleWishlist={handleModalWishlistToggle}
        />
      )}
    </div>
  );
}

export default Products;
