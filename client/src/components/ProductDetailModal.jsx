function ProductDetailModal({ product, onClose, onToggleWishlist, isInWishlist }) {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="product-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ✕
        </button>

        <div className="product-modal-grid">
          <div className="product-modal-image-box">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-modal-info">
            <span className="product-modal-badge">{product.category}</span>
            <h2>{product.name}</h2>
            <div className="product-modal-price">₹{product.price.toLocaleString('en-IN')}</div>
            <p className="product-modal-desc">{product.description || 'No description available for this product.'}</p>

            <div className="product-modal-specs">
              <div className="spec-item">
                <span className="spec-label">Availability</span>
                <span className={`spec-value ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                  {product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}
                </span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Category</span>
                <span className="spec-value">{product.category}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Shipping</span>
                <span className="spec-value">Free 2-Day Delivery</span>
              </div>
            </div>

            <div className="product-modal-footer">
              <button
                type="button"
                className={`btn btn-vertex-primary ${isInWishlist ? 'btn-danger-outline' : ''}`}
                onClick={() => {
                  if (onToggleWishlist) onToggleWishlist(product);
                  onClose();
                }}
              >
                <span>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist ❤️'}</span>
              </button>
              <button type="button" className="btn btn-outline-cyan" onClick={onClose}>
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailModal;
