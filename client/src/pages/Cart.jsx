import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Background from '../components/Background';
import CartCard from '../components/CartCard';
import { useCart } from '../context/CartContext';

function Cart() {
  const navigate = useNavigate();
  const { cart, cartCount, cartSubtotal, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  const loadCart = async () => {
    setLoading(true);
    setError(false);
    try {
      const userRes = await api.get('/customers/me');
      setUser(userRes.data);
      await fetchCart();
    } catch {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <div className="vertex-app-layout">
      <Background />
      <Navbar showLogout={!!user} user={user} />

      <main className="vertex-main-content wishlist-page">
        {loading && (
          <div className="state-panel loading-state">
            <div className="vertex-spinner"></div>
            <p className="state-msg">Loading your cart...</p>
          </div>
        )}

        {!loading && error && (
          <div className="state-panel error-state">
            <div className="state-icon">⚠️</div>
            <h2>Something went wrong.</h2>
            <p className="state-msg">We couldn't load your cart.</p>
            <button type="button" className="btn btn-vertex-primary" onClick={loadCart}>
              <span>Try Again</span>
            </button>
          </div>
        )}

        {!loading && !error && cart.length === 0 && (
          <div className="state-panel empty-state">
            <div className="state-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p className="state-msg">Add products from the catalog to get started.</p>
            <button
              type="button"
              className="btn btn-vertex-primary"
              onClick={() => navigate('/products')}
            >
              <span>Browse Products</span>
            </button>
          </div>
        )}

        {!loading && !error && cart.length > 0 && (
          <div className="wishlist-container">
            <div className="wishlist-header-row">
              <div className="wishlist-title-group">
                <h1 className="wishlist-heading">My Cart</h1>
                <p className="wishlist-subtitle">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-cyan continue-shopping-btn"
                onClick={() => navigate('/products')}
              >
                <span>Continue Shopping →</span>
              </button>
            </div>

            <div className="cart-layout">
              {/* Cart Items */}
              <div className="wishlist-grid">
                {cart.map((item) => (
                  <CartCard key={item.product._id} item={item} />
                ))}
              </div>

              {/* Order Summary */}
              <div className="cart-order-summary">
                <h2 className="summary-heading">Order Summary</h2>

                <div className="summary-rows">
                  {cart.map((item) => (
                    <div className="summary-row" key={item.product._id}>
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <span>Total</span>
                  <span className="summary-total-amount">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn btn-vertex-primary checkout-btn"
                  onClick={() => navigate('/checkout')}
                >
                  <span>Proceed to Checkout →</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;
