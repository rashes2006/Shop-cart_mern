import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Background from '../components/Background';
import WishlistCard from '../components/WishlistCard';
import ProductDetailModal from '../components/ProductDetailModal';

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [notification, setNotification] = useState('');

  const fetchWishlistData = async () => {
    setLoading(true);
    setError(false);
    try {
      // 1. Fetch user profile
      try {
        const userRes = await api.get('/customers/me');
        setUser(userRes.data);
      } catch (authErr) {
        // If not authenticated, redirect to login
        navigate('/login');
        return;
      }

      // 2. Fetch Wishlist items populated with product details
      const res = await api.get('/wishlist');
      if (res.data && Array.isArray(res.data.wishlist)) {
        // Filter out nulls in case a referenced product was deleted
        const validItems = res.data.wishlist.filter((item) => item !== null && typeof item === 'object');
        setWishlist(validItems);
      } else {
        setWishlist([]);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlistData();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      // Optimistic update without full page refresh
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      setNotification('Product removed from wishlist');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setNotification('Failed to remove item. Please try again.');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleModalWishlistToggle = async (product) => {
    await handleRemove(product._id);
    setActiveModalProduct(null);
  };

  return (
    <div className="vertex-app-layout">
      <Background />
      <Navbar showLogout={!!user} user={user} wishlistCount={wishlist.length} />

      <main className="vertex-main-content wishlist-page">
        {notification && (
          <div className="wishlist-toast-notification">
            <span>{notification}</span>
          </div>
        )}

        {/* 10. LOADING STATE */}
        {loading && (
          <div className="state-panel loading-state">
            <div className="vertex-spinner"></div>
            <p className="state-msg">Loading your wishlist...</p>
          </div>
        )}

        {/* 11. ERROR STATE */}
        {!loading && error && (
          <div className="state-panel error-state">
            <div className="state-icon">⚠️</div>
            <h2>Something went wrong.</h2>
            <p className="state-msg">We couldn't load your wishlist.</p>
            <button
              type="button"
              className="btn btn-vertex-primary"
              onClick={fetchWishlistData}
            >
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* 9. EMPTY STATE */}
        {!loading && !error && wishlist.length === 0 && (
          <div className="state-panel empty-state">
            <div className="state-icon heart-bounce">❤️</div>
            <h2>Your wishlist is empty</h2>
            <p className="state-msg">
              Save products you love and
              <br />
              find them here later.
            </p>
            <button
              type="button"
              className="btn btn-vertex-primary"
              onClick={() => navigate('/products')}
            >
              <span>Browse Products</span>
            </button>
          </div>
        )}

        {/* 6 & 7. POPULATED WISHLIST STATE */}
        {!loading && !error && wishlist.length > 0 && (
          <div className="wishlist-container">
            <div className="wishlist-header-row">
              <div className="wishlist-title-group">
                <h1 className="wishlist-heading">My Wishlist</h1>
                <p className="wishlist-subtitle">
                  {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved
                </p>
              </div>

              <button
                type="button"
                className="btn btn-outline-cyan continue-shopping-btn"
                onClick={() => navigate('/products')}
              >
                <span>Continue Shopping &rarr;</span>
              </button>
            </div>

            <div className="wishlist-grid">
              {wishlist.map((product) => (
                <WishlistCard
                  key={product._id}
                  product={product}
                  onRemove={handleRemove}
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
          isInWishlist={true}
          onClose={() => setActiveModalProduct(null)}
          onToggleWishlist={handleModalWishlistToggle}
        />
      )}
    </div>
  );
}

export default Wishlist;
