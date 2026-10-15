import { useState } from 'react';
import { useCart } from '../context/CartContext';

function CartCard({ item }) {
  const { product, quantity } = item;
  const { updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuantity = async (newQty) => {
    if (loading) return;
    if (newQty < 1) return;
    setLoading(true);
    setError('');
    try {
      await updateQuantity(product._id, newQty);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await removeFromCart(product._id);
    } catch {
      setError('Failed to remove item');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-card">
      <div className="cart-card-img-wrap">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="cart-card-img"
          loading="lazy"
        />
        <span className="cart-card-category">{product.category}</span>
      </div>

      <div className="cart-card-body">
        <h3 className="cart-card-title">{product.name}</h3>
        <p className="cart-card-category-sub">{product.category}</p>

        <div className="cart-card-meta">
          <span className="cart-card-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className={`cart-card-stock ${product.stock <= 5 ? 'low' : ''}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        {error && <p className="cart-card-error">{error}</p>}

        <div className="cart-qty-row">
          <button
            type="button"
            className="qty-btn"
            onClick={() => handleQuantity(quantity - 1)}
            disabled={loading || quantity <= 1}
          >
            −
          </button>
          <span className="qty-value">{quantity}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => handleQuantity(quantity + 1)}
            disabled={loading || quantity >= product.stock}
          >
            +
          </button>
        </div>

        <div className="cart-card-subtotal">
          Subtotal: <strong>₹{(product.price * quantity).toLocaleString('en-IN')}</strong>
        </div>

        <button
          type="button"
          className="btn btn-card-remove cart-remove-btn"
          onClick={handleRemove}
          disabled={loading}
        >
          {loading ? 'Removing...' : 'Remove ✕'}
        </button>
      </div>
    </div>
  );
}

export default CartCard;
