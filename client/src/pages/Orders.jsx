import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Background from '../components/Background';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdating(orderId);
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: res.data.order.status } : o))
      );
    } catch (err) {
      alert('Could not update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'PLACED':
        return 'status-placed';
      case 'CONFIRMED':
        return 'status-confirmed';
      case 'SHIPPED':
        return 'status-shipped';
      case 'DELIVERED':
        return 'status-delivered';
      default:
        return 'status-pending';
    }
  };

  return (
    <div className="cart-page-wrapper">
      <Background />
      <Navbar showLogout={true} />

      <main className="cart-main-container">
        <div className="cart-header-row">
          <div>
            <h1 className="cart-title">My Orders</h1>
            <p className="cart-subtitle">Track and review your past purchases</p>
          </div>
          <Link to="/products" className="btn btn-secondary back-to-cart-btn">
            Continue Shopping →
          </Link>
        </div>

        {loading ? (
          <div className="cart-empty-card">
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <span>⚠️ {error}</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="cart-empty-card">
            <div className="cart-empty-icon">📦</div>
            <h2 className="cart-empty-title">You have not placed any orders yet.</h2>
            <p className="cart-empty-text">Browse our catalog and place your first order!</p>
            <Link to="/products" className="btn btn-vertex-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list-grid">
            {orders.map((order) => (
              <div key={order._id} className="order-history-card">
                {/* Header */}
                <div className="order-card-header">
                  <div className="order-card-header-left">
                    <span className="order-card-id font-mono">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span className="order-card-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <div className="order-card-header-right">
                    <span className={`status-pill ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                    <span
                      className={`status-pill ${
                        order.paymentStatus === 'PAID' ? 'status-paid' : 'status-pending'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="order-card-items">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-card-item-row">
                      <img
                        src={
                          item.image ||
                          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
                        }
                        alt={item.name}
                        className="order-card-item-thumb"
                      />
                      <div className="order-card-item-details">
                        <div className="order-card-item-name">{item.name}</div>
                        <div className="order-card-item-meta">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                        </div>
                      </div>
                      <div className="order-card-item-total">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer with shipping, total and status updater */}
                <div className="order-card-footer">
                  <div className="order-card-shipping-brief">
                    <span>📍 Delivered to: </span>
                    <strong>{order.shippingAddress?.fullName}</strong>, {order.shippingAddress?.city} (
                    {order.shippingAddress?.pincode})
                  </div>

                  <div className="order-card-footer-right">
                    <div className="order-card-total-box">
                      <span className="order-card-total-label">Total: </span>
                      <span className="order-card-total-value">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Bonus: Status advance control for evaluation */}
                    <div className="status-advance-control">
                      <label htmlFor={`status-${order._id}`} className="status-select-label">
                        Status (Bonus):
                      </label>
                      <select
                        id={`status-${order._id}`}
                        value={order.status}
                        disabled={statusUpdating === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="status-select-dropdown"
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
