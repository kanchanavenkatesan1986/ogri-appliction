import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import API from '../services/api';

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shippingAddress: '',
    contactNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const total = getCartTotal();
  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;

  const validate = () => {
    const errs = {};
    if (!form.shippingAddress.trim()) errs.shippingAddress = 'Shipping address is required.';
    if (!form.contactNumber.trim()) errs.contactNumber = 'Contact number is required.';
    else if (!/^\+?[\d\s\-]{7,20}$/.test(form.contactNumber.trim())) errs.contactNumber = 'Enter a valid phone number.';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      const orderRequest = {
        shippingAddress: form.shippingAddress.trim(),
        contactNumber: form.contactNumber.trim(),
      };
      const res = await API.post('/orders/place', orderRequest);
      await clearCart();
      addToast('Order placed successfully! 🎉', 'success');
      navigate('/orders');
    } catch (err) {
      console.error('Failed to place order:', err);
      addToast(err.response?.data?.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container">
          <h1 className="fw-bold mb-1" style={{ color: 'white', fontSize: '2rem' }}>
            <i className="bi bi-bag-check me-3" />
            Checkout
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>
            Complete your order below
          </p>
        </div>
      </div>

      <div className="container mt-2">
        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-7">
            {/* Customer Info */}
            <div className="p-4 rounded-4 mb-4" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#0d2310' }}>
                <span className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '28px', height: '28px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 800 }}>1</span>
                Customer Information
              </h5>
              <div
                className="p-3 rounded-3 d-flex align-items-center gap-3"
                style={{ background: '#f0f7f0', border: '1px solid rgba(46,125,50,0.15)' }}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                  style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', fontSize: '1.1rem' }}
                >
                  {user?.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div className="fw-semibold" style={{ color: '#0d2310' }}>{user?.username}</div>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>{user?.email}</div>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <form onSubmit={handleSubmit}>
              <div className="p-4 rounded-4 mb-4" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#0d2310' }}>
                  <span className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '28px', height: '28px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 800 }}>2</span>
                  Shipping Details
                </h5>

                <div className="mb-4">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>
                    <i className="bi bi-geo-alt me-2 text-success" />
                    Shipping Address *
                  </label>
                  <textarea
                    className={`form-control ${errors.shippingAddress ? 'is-invalid' : ''}`}
                    name="shippingAddress"
                    id="checkout-address"
                    rows={3}
                    placeholder="Enter your full delivery address (house no, street, city, state, pincode)"
                    value={form.shippingAddress}
                    onChange={handleChange}
                    style={{ borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem', resize: 'vertical' }}
                  />
                  {errors.shippingAddress && <div className="invalid-feedback">{errors.shippingAddress}</div>}
                </div>

                <div className="mb-2">
                  <label className="form-label fw-semibold" style={{ color: '#333', fontSize: '0.875rem' }}>
                    <i className="bi bi-telephone me-2 text-success" />
                    Contact Number *
                  </label>
                  <div className="position-relative">
                    <input
                      type="tel"
                      className={`form-control ${errors.contactNumber ? 'is-invalid' : ''}`}
                      name="contactNumber"
                      id="checkout-phone"
                      placeholder="+91 98765 43210"
                      value={form.contactNumber}
                      onChange={handleChange}
                      style={{ height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
                    />
                    {errors.contactNumber && <div className="invalid-feedback">{errors.contactNumber}</div>}
                  </div>
                </div>
              </div>

              {/* Payment (Display only) */}
              <div className="p-4 rounded-4 mb-4" style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#0d2310' }}>
                  <span className="d-flex align-items-center justify-content-center rounded-2" style={{ width: '28px', height: '28px', background: 'rgba(46,125,50,0.1)', color: '#2e7d32', fontSize: '0.8rem', fontWeight: 800 }}>3</span>
                  Payment Method
                </h5>
                <div
                  className="d-flex align-items-center gap-3 p-3 rounded-3"
                  style={{ background: '#f0f7f0', border: '2px solid #2e7d32' }}
                >
                  <i className="bi bi-cash-coin fs-4" style={{ color: '#2e7d32' }} />
                  <div>
                    <div className="fw-semibold" style={{ color: '#0d2310' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>Pay when your order arrives</div>
                  </div>
                  <i className="bi bi-check-circle-fill ms-auto" style={{ color: '#2e7d32' }} />
                </div>
              </div>

              <button
                type="submit"
                className="btn w-100 fw-bold"
                style={{
                  background: loading ? '#ccc' : 'linear-gradient(135deg, #2e7d32, #388e3c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '14px',
                  height: '56px',
                  fontSize: '1.1rem',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(46,125,50,0.35)',
                }}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Placing Order...</>
                ) : (
                  <><i className="bi bi-bag-check me-2" />Place Order · ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="col-lg-5">
            <div
              className="p-4 rounded-4"
              style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'sticky', top: '90px' }}
            >
              <h5 className="fw-bold mb-4" style={{ color: '#0d2310' }}>Order Summary</h5>

              <div className="d-flex flex-column gap-3 mb-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {cartItems.map(item => (
                  <div key={item.id} className="d-flex align-items-center gap-3">
                    <img
                      src={item.product.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=80&auto=format&fit=crop&q=70'}
                      alt={item.product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                      onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=80&auto=format&fit=crop&q=70'; }}
                    />
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-medium text-truncate" style={{ fontSize: '0.85rem', color: '#0d2310' }}>{item.product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>Qty: {item.quantity}</div>
                    </div>
                    <div className="fw-bold flex-shrink-0" style={{ color: '#2e7d32', fontSize: '0.9rem' }}>
                      ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1.5px solid #f0f0f0', paddingTop: '1rem' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span style={{ color: '#666', fontSize: '0.875rem' }}>Subtotal</span>
                  <span className="fw-semibold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ color: '#666', fontSize: '0.875rem' }}>Shipping</span>
                  <span className="fw-semibold" style={{ color: shipping === 0 ? '#2e7d32' : '#0d2310' }}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div
                  className="d-flex justify-content-between py-3"
                  style={{ borderTop: '2px solid #f0f0f0' }}
                >
                  <span className="fw-bold" style={{ color: '#0d2310' }}>Total</span>
                  <span className="fw-bold" style={{ fontSize: '1.3rem', color: '#2e7d32' }}>
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              <div className="mt-3 d-flex flex-column gap-1">
                {[
                  { icon: 'bi-shield-check', text: 'Secure checkout' },
                  { icon: 'bi-truck', text: '3–5 business days delivery' },
                  { icon: 'bi-arrow-counterclockwise', text: '7-day easy returns' },
                ].map(({ icon, text }) => (
                  <div key={text} className="d-flex align-items-center gap-2" style={{ fontSize: '0.78rem', color: '#888' }}>
                    <i className={`bi ${icon}`} style={{ color: '#2e7d32' }} />
                    {text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
