import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Cart = () => {
  const { cartItems, cartLoading, updateQuantity, removeFromCart, getCartTotal, clearCart } = useContext(CartContext);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleUpdateQty = async (itemId, quantity, maxStock) => {
    if (quantity < 1) return;
    if (quantity > maxStock) {
      addToast(`Only ${maxStock} items available.`, 'warning');
      return;
    }
    await updateQuantity(itemId, quantity);
  };

  const handleRemove = async (itemId, name) => {
    await removeFromCart(itemId);
    addToast(`"${name}" removed from cart.`, 'info');
  };

  const handleClear = async () => {
    await clearCart();
    addToast('Cart cleared.', 'info');
  };

  const total = getCartTotal();
  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;

  if (cartLoading) return <LoadingSpinner message="Loading cart..." />;

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container">
          <h1 className="fw-bold mb-1" style={{ color: 'white', fontSize: '2rem' }}>
            <i className="bi bi-cart3 me-3" />
            My Cart
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-1rem' }}>
        {cartItems.length === 0 ? (
          <div
            className="text-center py-5 px-4 rounded-4 mt-3"
            style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h4 className="fw-bold mb-2" style={{ color: '#0d2310' }}>Your cart is empty</h4>
            <p className="text-muted mb-4">Add some products to get started!</p>
            <Link
              to="/products"
              className="btn fw-semibold px-5"
              style={{ background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', border: 'none', borderRadius: '12px', height: '46px' }}
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="row g-4 mt-0">
            {/* Cart Items */}
            <div className="col-lg-8">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#0d2310' }}>Cart Items</h5>
                <button
                  className="btn btn-sm text-danger fw-medium"
                  style={{ background: 'rgba(198,40,40,0.06)', border: '1px solid rgba(198,40,40,0.15)', borderRadius: '8px', fontSize: '0.8rem' }}
                  onClick={handleClear}
                >
                  <i className="bi bi-trash me-1" /> Clear All
                </button>
              </div>

              <div className="d-flex flex-column gap-3">
                {cartItems.map(item => (
                  <div
                    key={item.id}
                    className="d-flex gap-3 p-3 rounded-4"
                    style={{ background: 'white', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', alignItems: 'center' }}
                  >
                    {/* Image */}
                    <Link to={`/products/${item.product.id}`} style={{ flexShrink: 0 }}>
                      <img
                        src={item.product.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&auto=format&fit=crop&q=70'}
                        alt={item.product.name}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&auto=format&fit=crop&q=70'; }}
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex-grow-1 min-w-0">
                      <Link to={`/products/${item.product.id}`} style={{ textDecoration: 'none' }}>
                        <h6 className="fw-semibold mb-1 text-truncate" style={{ color: '#0d2310', fontSize: '0.95rem' }}>
                          {item.product.name}
                        </h6>
                      </Link>
                      {item.product.category && (
                        <span style={{ fontSize: '0.75rem', color: '#888' }}>{item.product.category.name}</span>
                      )}
                      <div className="fw-bold mt-1" style={{ color: '#2e7d32', fontSize: '1rem' }}>
                        ₹{parseFloat(item.product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="d-flex align-items-center gap-2 flex-shrink-0">
                      <div
                        className="d-flex align-items-center"
                        style={{ border: '1.5px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden' }}
                      >
                        <button
                          className="btn"
                          style={{ width: '32px', height: '32px', background: 'transparent', border: 'none', color: '#2e7d32', fontWeight: 700, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => handleUpdateQty(item.id, item.quantity - 1, item.product.stockQuantity)}
                        >
                          −
                        </button>
                        <span style={{ width: '36px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', color: '#0d2310' }}>
                          {item.quantity}
                        </span>
                        <button
                          className="btn"
                          style={{ width: '32px', height: '32px', background: 'transparent', border: 'none', color: '#2e7d32', fontWeight: 700, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => handleUpdateQty(item.id, item.quantity + 1, item.product.stockQuantity)}
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div style={{ minWidth: '80px', textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Subtotal</div>
                        <div style={{ fontWeight: 700, color: '#0d2310', fontSize: '0.95rem' }}>
                          ₹{(parseFloat(item.product.price) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* Remove */}
                      <button
                        className="btn btn-sm"
                        style={{ background: 'rgba(198,40,40,0.07)', color: '#c62828', border: 'none', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        onClick={() => handleRemove(item.id, item.product.name)}
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div
                className="p-4 rounded-4"
                style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', position: 'sticky', top: '90px' }}
              >
                <h5 className="fw-bold mb-4" style={{ color: '#0d2310' }}>Order Summary</h5>

                <div className="d-flex flex-column gap-2 mb-3">
                  <div className="d-flex justify-content-between">
                    <span style={{ color: '#666', fontSize: '0.875rem' }}>Subtotal</span>
                    <span style={{ fontWeight: 600, color: '#0d2310' }}>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span style={{ color: '#666', fontSize: '0.875rem' }}>Shipping</span>
                    <span style={{ fontWeight: 600, color: shipping === 0 ? '#2e7d32' : '#0d2310' }}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: 0 }}>
                      Add ₹{(999 - total).toLocaleString('en-IN', { minimumFractionDigits: 2 })} more for free shipping
                    </p>
                  )}
                </div>

                <div
                  className="d-flex justify-content-between py-3 mb-4"
                  style={{ borderTop: '2px solid #f0f0f0', borderBottom: '2px solid #f0f0f0' }}
                >
                  <span className="fw-bold" style={{ color: '#0d2310' }}>Total</span>
                  <span className="fw-bold" style={{ fontSize: '1.25rem', color: '#2e7d32' }}>
                    ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <button
                  className="btn w-100 fw-semibold"
                  style={{ background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', border: 'none', borderRadius: '12px', height: '50px', fontSize: '1rem', boxShadow: '0 4px 14px rgba(46,125,50,0.3)' }}
                  onClick={() => navigate('/checkout')}
                >
                  <i className="bi bi-bag-check me-2" />
                  Proceed to Checkout
                </button>

                <Link
                  to="/products"
                  className="btn w-100 mt-2 fw-medium"
                  style={{ background: 'transparent', color: '#2e7d32', border: '1.5px solid #2e7d32', borderRadius: '12px', height: '44px' }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
