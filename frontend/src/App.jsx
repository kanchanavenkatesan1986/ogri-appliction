import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './components/Toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Auth Pages
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';

const Layout = ({ children, hideFooter = false }) => (
  <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
    <Navbar />
    <main className="flex-grow-1">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

const AuthLayout = ({ children }) => (
  <div style={{ minHeight: '100vh' }}>{children}</div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <Routes>
              {/* Auth pages — no navbar/footer */}
              <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><Register /></AuthLayout>} />

              {/* Public pages */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />

              {/* Protected user pages */}
              <Route
                path="/cart"
                element={
                  <Layout>
                    <Cart />
                  </Layout>
                }
              />
              <Route
                path="/checkout"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  </Layout>
                }
              />
              <Route
                path="/orders"
                element={
                  <Layout>
                    <ProtectedRoute>
                      <MyOrders />
                    </ProtectedRoute>
                  </Layout>
                }
              />

              {/* Admin pages */}
              <Route
                path="/admin"
                element={
                  <Layout hideFooter>
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  </Layout>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <Layout hideFooter>
                    <AdminRoute>
                      <AdminProducts />
                    </AdminRoute>
                  </Layout>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <Layout hideFooter>
                    <AdminRoute>
                      <AdminCategories />
                    </AdminRoute>
                  </Layout>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <Layout hideFooter>
                    <AdminRoute>
                      <AdminOrders />
                    </AdminRoute>
                  </Layout>
                }
              />

              {/* 404 fallback */}
              <Route
                path="*"
                element={
                  <Layout>
                    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center" style={{ minHeight: '60vh' }}>
                      <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🌾</div>
                      <h1 className="fw-bold" style={{ color: '#0d2310', fontSize: '3rem' }}>404</h1>
                      <p className="text-muted mb-4 fs-5">Page not found.</p>
                      <a
                        href="/"
                        className="btn fw-semibold px-5"
                        style={{ background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', border: 'none', borderRadius: '12px', height: '48px', display: 'inline-flex', alignItems: 'center' }}
                      >
                        Go Home
                      </a>
                    </div>
                  </Layout>
                }
              />
            </Routes>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
