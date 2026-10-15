import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Background from '../components/Background';

function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load order details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  return (
    <div className="cart-page-wrapper">
      <Background />
      <Navbar showLogout={true} />

      <main className="cart-main-container" style={{ maxWidth: '780px' }}>
        {loading ? (
          <div className="cart-empty-card">
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading confirmation...</p>
          </div>
        ) : error ? (
          <div className="cart-empty-card">
            <div className="cart-empty-icon">⚠️</div>
            <h2 className="cart-empty-title">Order Not Found</h2>
            <p className="cart-empty-text">{error}</p>
            <Link to="/orders" className="btn btn-vertex-primary">
              View All Orders
            </Link>
          </div>
        ) : (
          <div className="order-success-card">
            <div className="order-success-badge">✓</div>
            <h1 className="order-success-title">Order Placed Successfully!</h1>
            <p className="order-success-subtitle">
              Thank you for your purchase. Your payment was verified and your order is confirmed.
            </p>

            <div className="order-success-details-box">
              <div className="order-meta-grid">
                <div>
                  <span className="order-meta-label">Order ID</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="order-meta-val font-mono" style={{ fontSize: '0.85rem' }}>{order._id}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(order._id);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="btn-copy-id"
                      title="Copy full Order ID"
                    >
                      {copied ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="order-meta-label">Order Status</span>
                  <span className="status-pill status-placed">{order.status}</span>
                </div>
                <div>
                  <span className="order-meta-label">Payment Status</span>
                  <span className="status-pill status-paid">{order.paymentStatus}</span>
                </div>
                <div>
                  <span className="order-meta-label">Total Amount</span>
                  <span className="order-meta-val order-meta-price">
                    ₹{order.totalAmount?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {order.shippingAddress && (
                <div className="order-shipping-summary">
                  <h3 className="order-section-title">Delivery Address</h3>
                  <p className="order-address-text">
                    <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone})<br />
                    {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              )}

              <div className="order-items-recap">
                <h3 className="order-section-title">Purchased Items ({order.items?.length})</h3>
                <div className="order-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-recap-row">
                      <div className="order-item-recap-left">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="order-recap-thumb" />
                        )}
                        <div>
                          <div className="order-recap-name">{item.name}</div>
                          <div className="order-recap-qty">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="order-recap-price">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-success-actions">
              <Link to="/orders" className="btn btn-vertex-primary">
                View My Orders →
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OrderSuccess;
