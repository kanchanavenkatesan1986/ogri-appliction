import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { useToast } from '../components/Toast';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const categoryImages = {
  Seeds: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&auto=format&fit=crop&q=75',
  Fertilizers: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=600&auto=format&fit=crop&q=75',
  Tools: 'https://images.unsplash.com/photo-1416169607655-0c2b3ce2e1cc?w=600&auto=format&fit=crop&q=75',
  Pesticides: 'https://images.unsplash.com/photo-1574942374104-67c66e63d8d2?w=600&auto=format&fit=crop&q=75',
  'Organic Products': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&auto=format&fit=crop&q=75',
  Irrigation: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=600&auto=format&fit=crop&q=75',
};

const defaultCategoryImg = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=600&auto=format&fit=crop&q=75';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          API.get('/categories'),
          API.get('/products'),
        ]);
        setCategories(catRes.data.slice(0, 6));
        setFeaturedProducts(prodRes.data.slice(0, 8));
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="hero-banner position-relative"
        style={{ minHeight: '580px', display: 'flex', alignItems: 'center' }}
      >
        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            <div className="col-lg-7">
              <span
                className="badge mb-3 px-3 py-2"
                style={{ background: 'rgba(249,168,37,0.2)', color: '#f9a825', border: '1px solid rgba(249,168,37,0.3)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}
              >
                🌱 India's Trusted AgriMarket
              </span>
              <h1
                className="display-4 fw-bold mb-4"
                style={{ color: 'white', lineHeight: 1.15, letterSpacing: '-0.02em' }}
              >
                Grow Smarter.<br />
                <span style={{ color: '#81c784' }}>Farm Better.</span>
              </h1>
              <p
                className="lead mb-5"
                style={{ color: 'rgba(255,255,255,0.78)', maxWidth: '520px', lineHeight: '1.7' }}
              >
                Discover premium seeds, organic fertilizers, modern tools, and everything your farm needs — delivered right to your door.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link
                  to="/products"
                  className="btn btn-lg fw-semibold px-5"
                  style={{
                    background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(46,125,50,0.4)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  Shop Now <i className="bi bi-arrow-right ms-2" />
                </Link>
                <a
                  href="#categories"
                  className="btn btn-lg fw-medium px-5"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1.5px solid rgba(255,255,255,0.25)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  Browse Categories
                </a>
              </div>

              {/* Stats */}
              <div className="d-flex gap-4 mt-5 flex-wrap">
                {[
                  { value: '500+', label: 'Products' },
                  { value: '10K+', label: 'Farmers Served' },
                  { value: '50+', label: 'Brands' },
                  { value: '4.9★', label: 'Avg Rating' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div style={{ color: '#81c784', fontWeight: 700, fontSize: '1.35rem' }}>{value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.78rem', fontWeight: 500 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(13,35,16,0.9) 40%, transparent 100%)',
            zIndex: 1,
          }}
        />
      </section>

      {/* ── Trust Bar ── */}
      <section style={{ background: 'white', borderBottom: '1px solid #f0f0f0', padding: '1rem 0' }}>
        <div className="container">
          <div className="row g-3 text-center">
            {[
              { icon: 'bi-truck', label: 'Free Delivery', sub: 'On orders above ₹999' },
              { icon: 'bi-shield-check', label: '100% Genuine', sub: 'Certified products' },
              { icon: 'bi-arrow-counterclockwise', label: 'Easy Returns', sub: '7-day return policy' },
              { icon: 'bi-headset', label: '24/7 Support', sub: 'Agri experts available' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="col-6 col-md-3">
                <div className="d-flex align-items-center gap-2 justify-content-center justify-content-md-start">
                  <div
                    className="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '40px', height: '40px', background: '#f0f7f0' }}
                  >
                    <i className={`bi ${icon}`} style={{ color: '#2e7d32', fontSize: '1.1rem' }} />
                  </div>
                  <div className="text-start">
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#1a2e1a' }}>{label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" style={{ padding: '5rem 0', background: '#f8faf8' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="agri-badge mb-2 d-inline-block">All Categories</span>
            <h2 className="fw-bold mt-2" style={{ color: '#0d2310', fontSize: '2rem' }}>
              Browse By Category
            </h2>
            <p className="text-muted" style={{ maxWidth: '480px', margin: '0 auto' }}>
              Find everything you need for a successful harvest
            </p>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading categories..." />
          ) : (
            <div className="row g-4">
              {categories.map(cat => (
                <div key={cat.id} className="col-6 col-md-4 col-lg-4">
                  <div
                    className="category-card"
                    onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={categoryImages[cat.name] || defaultCategoryImg}
                      alt={cat.name}
                      className="card-img-hover"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.src = defaultCategoryImg; }}
                    />
                    <div className="category-card-overlay">
                      <h5 className="fw-bold mb-1" style={{ fontSize: '1.1rem' }}>{cat.name}</h5>
                      <p className="mb-0" style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>
                        {cat.description || 'Explore products'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
          <div className="d-flex align-items-end justify-content-between mb-5 flex-wrap gap-3">
            <div>
              <span className="agri-badge mb-2 d-inline-block">Featured</span>
              <h2 className="fw-bold mt-2 mb-1" style={{ color: '#0d2310', fontSize: '2rem' }}>
                Top Products
              </h2>
              <p className="text-muted mb-0">Hand-picked for the best quality</p>
            </div>
            <Link
              to="/products"
              className="btn fw-semibold px-4"
              style={{
                background: 'transparent',
                color: '#2e7d32',
                border: '2px solid #2e7d32',
                borderRadius: '10px',
              }}
            >
              View All <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading products..." />
          ) : (
            <div className="row g-4">
              {featuredProducts.map(product => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        style={{
          padding: '5rem 0',
          background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 50%, #2e7d32 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(129,199,132,0.06)',
          }}
        />
        <div className="container text-center position-relative">
          <h2 className="fw-bold mb-3" style={{ color: 'white', fontSize: '2.2rem' }}>
            Ready to Grow Your Farm? 🌾
          </h2>
          <p className="mb-4" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Join thousands of farmers who trust AgriMarket for their agricultural needs.
          </p>
          <Link
            to="/products"
            className="btn btn-lg fw-semibold px-5"
            style={{
              background: '#f9a825',
              color: '#0d2310',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(249,168,37,0.35)',
            }}
          >
            Start Shopping <i className="bi bi-bag-fill ms-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
