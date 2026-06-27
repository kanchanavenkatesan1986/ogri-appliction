import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ORDER_STATUSES = ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const statusConfig = {
  PENDING: { color: '#f9a825', bg: 'rgba(249,168,37,0.1)', border: 'rgba(249,168,37,0.25)', icon: 'bi-clock' },
  SHIPPED: { color: '#1565c0', bg: 'rgba(21,101,192,0.1)', border: 'rgba(21,101,192,0.25)', icon: 'bi-truck' },
  DELIVERED: { color: '#2e7d32', bg: 'rgba(46,125,50,0.1)', border: 'rgba(46,125,50,0.25)', icon: 'bi-check-circle' },
  CANCELLED: { color: '#c62828', bg: 'rgba(198,40,40,0.1)', border: 'rgba(198,40,40,0.25)', icon: 'bi-x-circle' },
};

const AdminOrders = () => {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get('/orders/all');
      setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
    } catch (err) {
      addToast('Failed to load orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await API.put(`/orders/${orderId}/status?status=${newStatus}`);
      addToast(`Order #${orderId} status updated to ${newStatus}.`, 'success');
      await fetchOrders();
    } catch (err) {
      addToast('Failed to update order status.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'ALL' || o.status === filterStatus;
    const matchSearch = !search ||
      String(o.id).includes(search) ||
      o.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container">
          <h1 className="fw-bold mb-2" style={{ color: 'white', fontSize: '2rem' }}>
            <i className="bi bi-bag-check me-3" />
            All Orders
          </h1>

          {/* Status summary bar */}
          <div className="d-flex flex-wrap gap-3 mt-3">
            {[{ label: 'All', value: 'ALL', count: orders.length, color: 'rgba(255,255,255,0.7)' },
              ...ORDER_STATUSES.map(s => ({ label: s, value: s, count: statusCounts[s] || 0, color: statusConfig[s].color }))
            ].map(({ label, value, count, color }) => (
              <button
                key={value}
                className="btn btn-sm fw-medium px-3"
                style={{
                  borderRadius: '20px',
                  height: '34px',
                  border: filterStatus === value ? `2px solid ${color}` : '2px solid rgba(255,255,255,0.2)',
                  background: filterStatus === value ? `${color}22` : 'rgba(255,255,255,0.07)',
                  color: filterStatus === value ? color : 'rgba(255,255,255,0.7)',
                  fontSize: '0.8rem',
                }}
                onClick={() => setFilterStatus(value)}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mt-2">
        {/* Search */}
        <div className="p-4 rounded-4 mb-4" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div className="position-relative" style={{ maxWidth: '400px' }}>
            <i className="bi bi-search position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', zIndex: 2 }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by order ID, username, or address..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '40px', height: '44px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading orders..." />
        ) : filtered.length === 0 ? (
          <div className="text-center py-5 rounded-4" style={{ background: 'white' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h5 className="text-muted">No orders found</h5>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {filtered.map(order => {
              const cfg = statusConfig[order.status] || statusConfig.PENDING;
              const isExpanded = expandedOrder === order.id;
              const isUpdating = updatingId === order.id;

              return (
                <div
                  key={order.id}
                  className="rounded-4"
                  style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}
                >
                  {/* Order Row */}
                  <div className="p-4">
                    <div className="d-flex flex-wrap align-items-start gap-3">
                      {/* Left info */}
                      <div
                        className="flex-grow-1"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                          <span className="fw-bold" style={{ color: '#0d2310', fontSize: '1rem' }}>
                            Order #{order.id}
                          </span>
                          <span
                            className="badge d-flex align-items-center gap-1 px-2 py-1"
                            style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, borderRadius: '8px', fontSize: '0.72rem', fontWeight: 600 }}
                          >
                            <i className={`bi ${cfg.icon}`} />
                            {order.status}
                          </span>
                        </div>
                        <div className="d-flex flex-wrap gap-3" style={{ fontSize: '0.8rem', color: '#888' }}>
                          <span><i className="bi bi-person me-1" />{order.user?.username || 'Unknown'}</span>
                          <span><i className="bi bi-calendar3 me-1" />{formatDate(order.orderDate)}</span>
                          <span><i className="bi bi-box me-1" />{order.orderItems?.length || 0} items</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-end flex-shrink-0">
                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>Total</div>
                        <div className="fw-bold" style={{ color: '#2e7d32', fontSize: '1.1rem' }}>
                          ₹{parseFloat(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex-shrink-0">
                        <select
                          className="form-select form-select-sm fw-semibold"
                          value={order.status}
                          onChange={e => handleStatusUpdate(order.id, e.target.value)}
                          disabled={isUpdating}
                          style={{
                            borderRadius: '10px',
                            border: `2px solid ${cfg.border}`,
                            color: cfg.color,
                            background: cfg.bg,
                            fontSize: '0.78rem',
                            height: '36px',
                            minWidth: '130px',
                            fontWeight: 600,
                          }}
                        >
                          {ORDER_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* Expand toggle */}
                      <button
                        className="btn btn-sm"
                        style={{ background: '#f8f8f8', border: '1px solid #e0e0e0', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      >
                        <i className={`bi ${isExpanded ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ color: '#888', fontSize: '0.85rem' }} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                      <div className="row g-3 mt-2">
                        <div className="col-md-6">
                          <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Customer</div>
                          <div style={{ fontSize: '0.875rem', color: '#333' }}>{order.user?.username}</div>
                          <div style={{ fontSize: '0.8rem', color: '#888' }}>{order.user?.email}</div>
                        </div>
                        <div className="col-md-6">
                          <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Shipping</div>
                          <div style={{ fontSize: '0.875rem', color: '#333' }}>{order.shippingAddress}</div>
                          <div style={{ fontSize: '0.8rem', color: '#888' }}>{order.contactNumber}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                          Items ({order.orderItems?.length || 0})
                        </div>
                        <div className="d-flex flex-column gap-2">
                          {order.orderItems?.map(item => (
                            <div key={item.id} className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ background: '#f8faf8' }}>
                              <img
                                src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=60&auto=format&fit=crop&q=70'}
                                alt={item.product?.name}
                                style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }}
                                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=60&auto=format&fit=crop&q=70'; }}
                              />
                              <div className="flex-grow-1 min-w-0">
                                <div className="fw-medium text-truncate" style={{ fontSize: '0.85rem', color: '#0d2310' }}>{item.product?.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#888' }}>Qty: {item.quantity} × ₹{parseFloat(item.priceAtPurchase || 0).toLocaleString('en-IN')}</div>
                              </div>
                              <div className="fw-bold flex-shrink-0" style={{ color: '#0d2310', fontSize: '0.875rem' }}>
                                ₹{(parseFloat(item.priceAtPurchase || 0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </div>
                            </div>
                          ))}
                        </div>
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

export default AdminOrders;
