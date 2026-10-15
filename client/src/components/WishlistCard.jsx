import { useState } from 'react';

function WishlistCard({ product, onRemove, onViewDetails }) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (removing) return;
    setRemoving(true);
    try {
      await onRemove(product._id);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="wishlist-card">
      <div className="wishlist-card-img-wrap">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="wishlist-card-img"
          loading="lazy"
        />
        <span className="wishlist-card-category">{product.category}</span>
      </div>

      <div className="wishlist-card-body">
        <h3 className="wishlist-card-title">{product.name}</h3>
        <p className="wishlist-card-category-sub">{product.category}</p>

        <div className="wishlist-card-meta">
          <span className="wishlist-card-price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className={`wishlist-card-stock ${product.stock <= 5 ? 'low' : ''}`}>
            {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
          </span>
        </div>

        <div className="wishlist-card-actions">
          <button
            type="button"
            className="btn btn-card-details"
            onClick={() => onViewDetails && onViewDetails(product)}
          >
            View Details
          </button>
          <button
            type="button"
            className="btn btn-card-remove"
            onClick={handleRemove}
            disabled={removing}
          >
            {removing ? 'Removing...' : 'Remove ♥'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistCard;
