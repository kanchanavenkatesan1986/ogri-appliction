import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes, ordRes] = await Promise.all([
          API.get('/products'),
          API.get('/categories'),
          API.get('/orders/all'),
        ]);
        const orders = ordRes.data;
        const revenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0);
        setStats({
          products: prodRes.data.length,
          categories: catRes.data.length,
          orders: orders.length,
          revenue,
        });
        setRecentOrders(orders.slice(0, 5).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Products', value: stats.products, icon: 'bi-box-seam', color: '#2e7d32', bg: 'rgba(46,125,50,0.1)', link: '/admin/products' },
    { label: 'Categories', value: stats.categories, icon: 'bi-tags', color: '#1565c0', bg: 'rgba(21,101,192,0.1)', link: '/admin/categories' },
    { label: 'Total Orders', value: stats.orders, icon: 'bi-bag-check', color: '#6a1b9a', bg: 'rgba(106,27,154,0.1)', link: '/admin/orders' },
    {
      label: 'Revenue',
      value: `₹${stats.revenue.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      icon: 'bi-currency-rupee',
      color: '#f9a825',
      bg: 'rgba(249,168,37,0.1)',
      link: '/admin/orders',
    },
  ];

  const statusColor = { PENDING: '#f9a825', SHIPPED: '#1565c0', DELIVERED: '#2e7d32', CANCELLED: '#c62828' };

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center"
              style={{ width: '48px', height: '48px', background: 'rgba(249,168,37,0.2)', border: '1px solid rgba(249,168,37,0.3)' }}
            >
              <i className="bi bi-shield-check" style={{ color: '#f9a825', fontSize: '1.4rem' }} />
            </div>
            <div>
              <h1 className="fw-bold mb-0" style={{ color: 'white', fontSize: '2rem' }}>Admin Dashboard</h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0, fontSize: '0.9rem' }}>
                Manage your AgriMarket store
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-2">
        {loading ? (
          <LoadingSpinner message="Loading dashboard..." />
        ) : (
          <>
            {/* Stats Grid */}
            <div className="row g-4 mt-0 mb-4">
              {statCards.map(({ label, value, icon, color, bg, link }) => (
                <div key={label} className="col-6 col-md-3">
                  <Link to={link} style={{ textDecoration: 'none' }}>
                    <div
                      className="p-4 rounded-4"
                      style={{
                        background: 'white',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(0,0,0,0.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; }}
                    >
                      <div
                        className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                        style={{ width: '44px', height: '44px', background: bg }}
                      >
                        <i className={`bi ${icon}`} style={{ color, fontSize: '1.3rem' }} />
                      </div>
                      <div className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#0d2310' }}>{value}</div>
                      <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>{label}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <div className="row g-4">
              {/* Quick Actions */}
              <div className="col-lg-4">
                <div className="p-4 rounded-4" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                  <h5 className="fw-bold mb-4" style={{ color: '#0d2310' }}>Quick Actions</h5>
                  <div className="d-flex flex-column gap-2">
                    {[
                      { to: '/admin/products', icon: 'bi-plus-circle', label: 'Add New Product', color: '#2e7d32' },
                      { to: '/admin/categories', icon: 'bi-tag', label: 'Manage Categories', color: '#1565c0' },
                      { to: '/admin/orders', icon: 'bi-list-check', label: 'View All Orders', color: '#6a1b9a' },
                      { to: '/products', icon: 'bi-shop', label: 'Visit Storefront', color: '#f9a825' },
                    ].map(({ to, icon, label, color }) => (
                      <Link
                        key={to}
                        to={to}
                        className="d-flex align-items-center gap-3 p-3 rounded-3"
                        style={{
                          textDecoration: 'none',
                          background: '#f8faf8',
                          color: '#333',
                          transition: 'all 0.2s ease',
                          border: '1px solid transparent',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0f7f0'; e.currentTarget.style.borderColor = 'rgba(46,125,50,0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8faf8'; e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        <div
                          className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '36px', height: '36px', background: `${color}18` }}
                        >
                          <i className={`bi ${icon}`} style={{ color, fontSize: '1rem' }} />
                        </div>
                        <span className="fw-medium" style={{ fontSize: '0.9rem' }}>{label}</span>
                        <i className="bi bi-chevron-right ms-auto" style={{ color: '#bbb', fontSize: '0.8rem' }} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="col-lg-8">
                <div className="p-4 rounded-4" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5 className="fw-bold mb-0" style={{ color: '#0d2310' }}>Recent Orders</h5>
                    <Link to="/admin/orders" style={{ color: '#2e7d32', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none' }}>
                      View All →
                    </Link>
                  </div>

                  {recentOrders.length === 0 ? (
                    <p className="text-muted text-center py-3">No orders yet.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {recentOrders.map(order => (
                        <div
                          key={order.id}
                          className="d-flex align-items-center gap-3 p-3 rounded-3"
                          style={{ background: '#f8faf8' }}
                        >
                          <div
                            className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{ width: '38px', height: '38px', background: 'rgba(46,125,50,0.1)' }}
                          >
                            <i className="bi bi-bag" style={{ color: '#2e7d32' }} />
                          </div>
                          <div className="flex-grow-1 min-w-0">
                            <div className="fw-semibold" style={{ fontSize: '0.875rem', color: '#0d2310' }}>
                              Order #{order.id} — {order.user?.username}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#888' }}>
                              {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                          <span
                            className="badge px-2 py-1"
                            style={{
                              background: `${statusColor[order.status]}18`,
                              color: statusColor[order.status],
                              border: `1px solid ${statusColor[order.status]}30`,
                              borderRadius: '6px',
                              fontSize: '0.7rem',
                              fontWeight: 600,
                            }}
                          >
                            {order.status}
                          </span>
                          <div className="fw-bold flex-shrink-0" style={{ color: '#2e7d32', fontSize: '0.9rem' }}>
                            ₹{parseFloat(order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
