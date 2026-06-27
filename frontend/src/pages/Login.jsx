import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Login = () => {
  const { login } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      addToast('Welcome back! 🌾', 'success');
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 60%, #2e7d32 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '2rem 1rem',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(129,199,132,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(249,168,37,0.05)', pointerEvents: 'none' }} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            {/* Brand */}
            <div className="text-center mb-4">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                  <span style={{ fontSize: '2rem' }}>🌾</span>
                  <span style={{ fontWeight: 800, fontSize: '1.6rem', color: 'white' }}>
                    Agri<span style={{ color: '#81c784' }}>Market</span>
                  </span>
                </div>
              </Link>
              <h2 className="fw-bold mt-3 mb-1" style={{ color: 'white', fontSize: '1.6rem' }}>
                Welcome back
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Sign in to your account
              </p>
            </div>

            {/* Card */}
            <div
              className="p-4 p-sm-5 rounded-4"
              style={{
                background: 'rgba(255,255,255,0.97)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {error && (
                <div
                  className="alert d-flex align-items-center gap-2 mb-4"
                  style={{
                    background: 'rgba(198,40,40,0.08)',
                    border: '1px solid rgba(198,40,40,0.2)',
                    borderRadius: '10px',
                    color: '#c62828',
                    fontSize: '0.875rem',
                    padding: '0.75rem 1rem',
                  }}
                >
                  <i className="bi bi-exclamation-circle-fill" />
                  {error}
                </div>
              )}

              <form id="login-form-submit" onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>
                    Username
                  </label>
                  <div className="position-relative">
                    <i
                      className="bi bi-person position-absolute"
                      style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '1rem', zIndex: 2 }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      id="login-username"
                      placeholder="Enter username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      autoFocus
                      style={{
                        paddingLeft: '40px',
                        height: '48px',
                        borderRadius: '10px',
                        border: '1.5px solid #e0e0e0',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>
                    Password
                  </label>
                  <div className="position-relative">
                    <i
                      className="bi bi-lock position-absolute"
                      style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: '1rem', zIndex: 2 }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      id="login-password"
                      placeholder="Enter password"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={{
                        paddingLeft: '40px',
                        paddingRight: '44px',
                        height: '48px',
                        borderRadius: '10px',
                        border: '1.5px solid #e0e0e0',
                        fontSize: '0.9rem',
                      }}
                    />
                    <button
                      type="button"
                      className="btn p-0 position-absolute"
                      style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', zIndex: 2 }}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-semibold mb-3"
                  style={{
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #2e7d32, #388e3c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    height: '50px',
                    fontSize: '1rem',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(46,125,50,0.35)',
                    transition: 'all 0.2s ease',
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Quick Admin Sign In Option */}
              <button
                type="button"
                className="btn w-100 fw-semibold"
                style={{
                  background: 'rgba(249,168,37,0.1)',
                  color: '#f9a825',
                  border: '1px solid rgba(249,168,37,0.3)',
                  borderRadius: '12px',
                  height: '50px',
                  fontSize: '0.9rem',
                }}
                disabled={loading}
                onClick={() => {
                  setForm({ username: 'admin', password: 'adminpassword' });
                  setTimeout(() => {
                    document.getElementById('login-form-submit').requestSubmit();
                  }, 100);
                }}
              >
                <i className="bi bi-shield-lock me-2" />
                Quick Admin Login
              </button>

              <div className="text-center mt-4">
                <span style={{ color: '#888', fontSize: '0.875rem' }}>
                  Don't have an account?{' '}
                </span>
                <Link to="/register" style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                  Create account →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
