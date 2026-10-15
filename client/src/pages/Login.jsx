import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import Background from '../components/Background';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Please provide both merchant email and password');
      return;
    }

    setLoading(true);
    try {
      await api.post('/customers/login', form);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid merchant credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vertex-app-layout">
      <Background />
      <Navbar />

      <main className="vertex-main-content">
        {/* Top Badge */}
        <div className="vertex-badge">
          <i className="badge-icon">
            <svg
              viewBox="5 1 14 22"
              preserveAspectRatio="none"
              fill="rgba(16,112,152,.72)"
              stroke="rgba(190,236,255,.6)"
              strokeWidth="1.6"
              strokeLinejoin="round"
            >
              <path d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z" />
            </svg>
          </i>
          <b>Secure Merchant Authentication</b>
        </div>

        {/* Hero Title */}
        <div className="vertex-hero-titles">
          <h1 className="hero-h1">STREAMLINE THE SHOP</h1>
          <p className="hero-sub">
            <b>Restructuring store systems / <span className="nb">E-commerce</span></b> orchestrated with checkouts, performance, a sustainable expansion.
          </p>
        </div>

        {/* Auth Glass Card */}
        <div className="vertex-card-wrapper">
          <div className="vertex-glass-card">
            <div className="card-header">
              <h2>Merchant Console</h2>
              <p className="card-subtitle">Authenticate to manage virtual storefronts & transactions</p>
            </div>

            {error && (
              <div className="vertex-alert-error" role="alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="vertex-form">
              <div className="vertex-field">
                <label htmlFor="email">Merchant Email</label>
                <div className="input-box">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="merchant@vertexshops.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="vertex-field">
                <label htmlFor="password">Access Secret / Password</label>
                <div className="input-box">
                  <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-pwd-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Signature Vertex Glow Button */}
              <button
                type="submit"
                className="btn btn-vertex-primary"
                disabled={loading}
              >
                <span>{loading ? 'Authenticating...' : 'Enter Store Console'}</span>
              </button>
            </form>

            <div className="card-footer">
              <p>
                New merchant?{' '}
                <Link to="/register" className="vertex-link">
                  Build new shop &rarr;
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Feature Badges Strip */}
        <div className="vertex-feature-strip">
          <div className="strip-item">
            <span className="strip-dot"></span>
            <span>ACH & 12X nil rates</span>
          </div>
          <div className="strip-item">
            <span className="strip-dot"></span>
            <span>Sub-millisecond inventory sync</span>
          </div>
          <div className="strip-item">
            <span className="strip-dot"></span>
            <span>End-to-end encrypted checkout</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
