import { useState } from 'react';
import api from '../services/api';
import { useCart } from '../context/CartContext';

function ProductCard({ product, isInWishlist = false, onWishlistChange, onViewDetails }) {
  const { addToCart } = useCart();
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [saved, setSaved] = useState(isInWishlist);
  const [wishlistError, setWishlistError] = useState('');

  const [cartLoading, setCartLoading] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  // Wishlist toggle
  const handleWishlistClick = async () => {
    if (wishlistLoading) return;
    setWishlistError('');
    setWishlistLoading(true);
    try {
      if (saved) {
        await api.delete(`/wishlist/${product._id}`);
        setSaved(false);
        if (onWishlistChange) onWishlistChange(product._id, false);
      } else {
        await api.post(`/wishlist/${product._id}`);
        setSaved(true);
        if (onWishlistChange) onWishlistChange(product._id, true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to save product. Please try again.';
      setWishlistError(msg);
      setTimeout(() => setWishlistError(''), 3500);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (cartLoading) return;
    setCartMsg('');
    setCartLoading(true);
    try {
      await addToCart(product._id);
      setCartMsg('Added!');
      setTimeout(() => setCartMsg(''), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not add to cart';
      setCartMsg(msg);
      setTimeout(() => setCartMsg(''), 3000);
    } finally {
      setCartLoading(false);
    }
  };

  const getWishlistButtonText = () => {
    if (wishlistLoading) return '⏳ Saving...';
    if (saved) return '♥ Wishlisted';
    return '♡ Wishlist';
  };

  const getCartButtonText = () => {
    if (cartLoading) return '⏳ Adding...';
    if (cartMsg === 'Added!') return '✓ Added!';
    return '🛒 Add to Cart';
  };

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />
        <button
          type="button"
          className={`product-quick-heart ${saved ? 'active' : ''}`}
          onClick={handleWishlistClick}
          disabled={wishlistLoading}
          title={saved ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          {wishlistLoading ? '⏳' : saved ? '❤️' : '🤍'}
        </button>
        <span className="product-card-category">{product.category}</span>
      </div>

      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>
        <p className="product-card-category-sub">{product.category}</p>

        <div className="product-card-meta">
          <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className={`product-card-stock ${product.stock <= 5 ? 'low' : ''}`}>
            {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
          </span>
        </div>

        {wishlistError && (
          <div className="product-card-error">
            <span>{wishlistError}</span>
          </div>
        )}

        {cartMsg && cartMsg !== 'Added!' && (
          <div className="product-card-error">
            <span>{cartMsg}</span>
          </div>
        )}

        <div className="product-card-actions">
          <button
            type="button"
            className="btn btn-card-details"
            onClick={() => onViewDetails && onViewDetails(product)}
          >
            View Details
          </button>
          <button
            type="button"
            className={`btn btn-card-wishlist ${saved ? 'saved' : ''}`}
            onClick={handleWishlistClick}
            disabled={wishlistLoading}
          >
            {getWishlistButtonText()}
          </button>
          <button
            type="button"
            className={`btn btn-card-cart ${cartMsg === 'Added!' ? 'added' : ''}`}
            onClick={handleAddToCart}
            disabled={cartLoading || product.stock === 0}
          >
            {getCartButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
