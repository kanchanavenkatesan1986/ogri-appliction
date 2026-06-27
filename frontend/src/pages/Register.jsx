import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';

const Register = () => {
  const { register } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await register(form.username, form.email, form.password, form.role);
    setLoading(false);
    if (result.success) {
      addToast('Account created! Please sign in. 🌾', 'success');
      navigate('/login');
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
      <div style={{ position: 'fixed', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(129,199,132,0.06)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(249,168,37,0.05)', pointerEvents: 'none' }} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
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
                Create Account
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
                Join thousands of farmers today
              </p>
            </div>

            {/* Card */}
            <div
              className="p-4 p-sm-5 rounded-4"
              style={{
                background: 'rgba(255,255,255,0.97)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
              }}
            >
              {error && (
                <div
                  className="alert d-flex align-items-center gap-2 mb-4"
                  style={{ background: 'rgba(198,40,40,0.08)', border: '1px solid rgba(198,40,40,0.2)', borderRadius: '10px', color: '#c62828', fontSize: '0.875rem', padding: '0.75rem 1rem' }}
                >
                  <i className="bi bi-exclamation-circle-fill" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Username */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>Username</label>
                  <div className="position-relative">
                    <i className="bi bi-person position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', zIndex: 2 }} />
                    <input
                      type="text"
                      className="form-control"
                      name="username"
                      id="reg-username"
                      placeholder="Choose a username"
                      value={form.username}
                      onChange={handleChange}
                      required
                      style={{ paddingLeft: '40px', height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>Email</label>
                  <div className="position-relative">
                    <i className="bi bi-envelope position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', zIndex: 2 }} />
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      id="reg-email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      required
                      style={{ paddingLeft: '40px', height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>Password</label>
                  <div className="position-relative">
                    <i className="bi bi-lock position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', zIndex: 2 }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="password"
                      id="reg-password"
                      placeholder="Min. 6 characters"
                      value={form.password}
                      onChange={handleChange}
                      required
                      style={{ paddingLeft: '40px', paddingRight: '44px', height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
                    />
                    <button type="button" className="btn p-0 position-absolute" style={{ right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#aaa', zIndex: 2 }} onClick={() => setShowPassword(!showPassword)}>
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>Confirm Password</label>
                  <div className="position-relative">
                    <i className="bi bi-lock-fill position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', zIndex: 2 }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      name="confirmPassword"
                      id="reg-confirm-password"
                      placeholder="Repeat password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ paddingLeft: '40px', height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>Account Type</label>
                  <div className="d-flex gap-3">
                    {[{ value: 'USER', label: '🛒 Customer' }, { value: 'ADMIN', label: '⚙️ Admin' }].map(({ value, label }) => (
                      <label
                        key={value}
                        className="flex-grow-1 d-flex align-items-center justify-content-center gap-2 rounded-2 fw-medium"
                        style={{
                          cursor: 'pointer',
                          padding: '0.6rem',
                          border: `2px solid ${form.role === value ? '#2e7d32' : '#e0e0e0'}`,
                          background: form.role === value ? 'rgba(46,125,50,0.06)' : 'transparent',
                          color: form.role === value ? '#2e7d32' : '#666',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s',
                        }}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={value}
                          checked={form.role === value}
                          onChange={handleChange}
                          style={{ display: 'none' }}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn w-100 fw-semibold"
                  style={{
                    background: loading ? '#ccc' : 'linear-gradient(135deg, #2e7d32, #388e3c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    height: '50px',
                    fontSize: '1rem',
                    boxShadow: loading ? 'none' : '0 4px 14px rgba(46,125,50,0.35)',
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2" />Creating account...</>
                  ) : (
                    <><i className="bi bi-person-plus me-2" />Create Account</>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <span style={{ color: '#888', fontSize: '0.875rem' }}>Already have an account? </span>
                <Link to="/login" style={{ color: '#2e7d32', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none' }}>
                  Sign in →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
