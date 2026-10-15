import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function Navbar({ showLogout, user, wishlistCount }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [liveWishlistCount, setLiveWishlistCount] = useState(wishlistCount ?? 0);
  const { cartCount, clearCart, fetchCart, cartLoaded } = useCart();

  // Sync wishlist count
  useEffect(() => {
    if (typeof wishlistCount === 'number') {
      setLiveWishlistCount(wishlistCount);
    } else if (showLogout) {
      api.get('/wishlist')
        .then((res) => {
          if (res.data && typeof res.data.count === 'number') {
            setLiveWishlistCount(res.data.count);
          }
        })
        .catch(() => {});
    }
  }, [wishlistCount, showLogout]);

  // Fetch cart count when logged in and not yet loaded
  useEffect(() => {
    if (showLogout && !cartLoaded) {
      fetchCart();
    }
  }, [showLogout, cartLoaded, fetchCart]);

  const handleLogout = async () => {
    try {
      await api.post('/customers/logout');
      clearCart();
      navigate('/login');
    } catch {
      clearCart();
      navigate('/login');
    }
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="vertex-header">
      <nav className={`vertex-nav-pill ${menuOpen ? 'open' : ''}`}>
        {/* Brand Lockup */}
        <Link to="/home" className="nav-brand-lockup" onClick={closeMenu}>
          <svg className="nav-mark" viewBox="0 0 48 48" aria-hidden="true">
            <defs>
              <linearGradient id="nav-sw" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8ef4ff" />
                <stop offset="50%" stopColor="#35d8ff" />
                <stop offset="100%" stopColor="#0a86d8" />
              </linearGradient>
              <linearGradient id="nav-sw2" x1="40" y1="10" x2="10" y2="40" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a6f7ff" />
                <stop offset="100%" stopColor="#0f9ae0" stopOpacity="0.25" />
              </linearGradient>
            </defs>
            <g transform="rotate(-32 24 24)">
              <ellipse
                cx="24" cy="24" rx="18.5" ry="9.6"
                stroke="url(#nav-sw2)" strokeWidth="3.1" strokeLinecap="round"
                strokeDasharray="58 30" strokeDashoffset="14" fill="none"
              />
              <circle cx="41.4" cy="20.6" r="3.1" fill="#bff6ff" />
            </g>
            <circle cx="24" cy="24" r="6.6" fill="url(#nav-sw)" />
            <circle cx="24" cy="24" r="2.6" fill="#fff" />
          </svg>
          <div className="nav-wm">
            <span className="nav-kick">SHOPKART</span>
            <span className="nav-name">STORE</span>
          </div>
        </Link>

        {/* Mobile Burger */}
        <button
          type="button"
          className="nav-burger"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="vertex-nav-menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links & Actions */}
        <div className="vertex-nav-menu" id="vertex-nav-menu">
          <div className="nav-links">
            <Link to="/home" className={`nav-link ${location.pathname === '/home' ? 'active' : ''}`} onClick={closeMenu}>
              Home
            </Link>
            <Link to="/products" className={`nav-link ${location.pathname === '/products' ? 'active' : ''}`} onClick={closeMenu}>
              Products
            </Link>
            <Link to="/wishlist" className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`} onClick={closeMenu}>
              Wishlist {liveWishlistCount > 0 && <span className="nav-badge-pill">{liveWishlistCount}</span>}
            </Link>
            <Link to="/cart" className={`nav-link ${location.pathname === '/cart' ? 'active' : ''}`} onClick={closeMenu}>
              Cart {cartCount > 0 && <span className="nav-badge-pill">{cartCount}</span>}
            </Link>
            <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`} onClick={closeMenu}>
              Orders
            </Link>
          </div>

          <div className="nav-actions">
            {showLogout ? (
              <div className="user-action-group">
                {user && (
                  <span className="nav-user-chip" title={user.email}>
                    <span className="user-dot"></span>
                    {user.fullName ? user.fullName.split(' ')[0] : 'User'}
                  </span>
                )}
                <button type="button" onClick={handleLogout} className="btn btn-nav-cta btn-logout-styled">
                  <span>Logout</span>
                </button>
              </div>
            ) : location.pathname === '/login' ? (
              <Link to="/register" className="btn btn-nav-cta" onClick={closeMenu}>
                <span>Register</span>
              </Link>
            ) : (
              <Link to="/login" className="btn btn-nav-cta" onClick={closeMenu}>
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
