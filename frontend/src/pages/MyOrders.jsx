import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const statusConfig = {
  PENDING: { color: '#f9a825', bg: 'rgba(249,168,37,0.1)', border: 'rgba(249,168,37,0.25)', icon: 'bi-clock' },
  SHIPPED: { color: '#1565c0', bg: 'rgba(21,101,192,0.1)', border: 'rgba(21,101,192,0.25)', icon: 'bi-truck' },
  DELIVERED: { color: '#2e7d32', bg: 'rgba(46,125,50,0.1)', border: 'rgba(46,125,50,0.25)', icon: 'bi-check-circle' },
  CANCELLED: { color: '#c62828', bg: 'rgba(198,40,40,0.1)', border: 'rgba(198,40,40,0.25)', icon: 'bi-x-circle' },
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders/my-orders');
        setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container">
          <h1 className="fw-bold mb-1" style={{ color: 'white', fontSize: '2rem' }}>
            <i className="bi bi-bag-check me-3" />
            My Orders
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>
            Track all your purchases
          </p>
        </div>
      </div>

      <div className="container mt-2">
        {loading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : orders.length === 0 ? (
          <div
            className="text-center py-5 px-4 rounded-4 mt-3"
            style={{ background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
            <h4 className="fw-bold mb-2" style={{ color: '#0d2310' }}>No orders yet</h4>
            <p className="text-muted mb-4">Start shopping to see your orders here!</p>
            <a href="/products" className="btn fw-semibold px-5" style={{ background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', border: 'none', borderRadius: '12px', height: '46px', display: 'inline-flex', alignItems: 'center' }}>
              Shop Now
            </a>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3 mt-2">
            {orders.map(order => {
              const cfg = statusConfig[order.status] || statusConfig.PENDING;
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="rounded-4"
                  style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}
                >
                  {/* Order Header */}
                  <div
                    className="p-4 d-flex flex-wrap align-items-center gap-3"
                    style={{ borderBottom: isExpanded ? '1px solid #f0f0f0' : 'none', cursor: 'pointer' }}
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    {/* Order ID + Date */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 flex-wrap">
                        <span className="fw-bold" style={{ color: '#0d2310', fontSize: '1rem' }}>
                          Order #{order.id}
                        </span>
                        <span
                          className="badge d-flex align-items-center gap-1 px-3 py-1"
                          style={{
                            background: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.border}`,
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                          }}
                        >
                          <i className={`bi ${cfg.icon}`} />
                          {order.status}
                        </span>
                      </div>
                      <div style={{ color: '#888', fontSize: '0.8rem', marginTop: '2px' }}>
                        <i className="bi bi-calendar3 me-1" />
                        {formatDate(order.orderDate)}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="text-end">
                      <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Total</div>
                      <div className="fw-bold" style={{ color: '#2e7d32', fontSize: '1.1rem' }}>
                        ₹{parseFloat(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Expand toggle */}
                    <i
                      className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'} fs-5`}
                      style={{ color: '#aaa' }}
                    />
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      {/* Shipping Info */}
                      <div
                        className="d-flex gap-4 flex-wrap p-3 rounded-3 mb-3 mt-3"
                        style={{ background: '#f8faf8' }}
                      >
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Shipping To</div>
                          <div style={{ fontSize: '0.875rem', color: '#333', marginTop: '2px' }}>{order.shippingAddress}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact</div>
                          <div style={{ fontSize: '0.875rem', color: '#333', marginTop: '2px' }}>{order.contactNumber}</div>
                        </div>
                      </div>

                      {/* Items */}
                      <h6 className="fw-semibold mb-3" style={{ color: '#555', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Items ({order.orderItems?.length || 0})
                      </h6>
                      <div className="d-flex flex-column gap-2">
                        {order.orderItems?.map(item => (
                          <div key={item.id} className="d-flex align-items-center gap-3">
                            <img
                              src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=80&auto=format&fit=crop&q=70'}
                              alt={item.product?.name}
                              style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=80&auto=format&fit=crop&q=70'; }}
                            />
                            <div className="flex-grow-1 min-w-0">
                              <div className="fw-medium text-truncate" style={{ fontSize: '0.875rem', color: '#0d2310' }}>
                                {item.product?.name || 'Product'}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>
                                ₹{parseFloat(item.priceAtPurchase || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} × {item.quantity}
                              </div>
                            </div>
                            <div className="fw-bold flex-shrink-0" style={{ color: '#0d2310', fontSize: '0.9rem' }}>
                              ₹{(parseFloat(item.priceAtPurchase || 0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
