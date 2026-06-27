import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('search') || '';
  const selectedCategoryId = searchParams.get('categoryId') || '';

  const [localSearch, setLocalSearch] = useState(searchQuery);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedCategoryId) params.categoryId = selectedCategoryId;
      const res = await API.get('/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategoryId]);

  useEffect(() => {
    API.get('/categories').then(res => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (localSearch.trim()) {
      next.set('search', localSearch.trim());
    } else {
      next.delete('search');
    }
    setSearchParams(next);
  };

  const handleCategory = (catId) => {
    const next = new URLSearchParams(searchParams);
    if (catId) {
      next.set('categoryId', catId);
    } else {
      next.delete('categoryId');
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setSearchParams({});
  };

  const hasFilters = searchQuery || selectedCategoryId;

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh' }}>
      {/* Page header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)',
          padding: '3rem 0 4rem',
        }}
      >
        <div className="container">
          <h1 className="fw-bold mb-2" style={{ color: 'white', fontSize: '2.2rem' }}>
            All Products
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '2rem' }}>
            {products.length} products found
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="d-flex gap-2" style={{ maxWidth: '540px' }}>
            <div className="position-relative flex-grow-1">
              <i
                className="bi bi-search position-absolute"
                style={{
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#888',
                  fontSize: '1rem',
                  zIndex: 2,
                }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search products..."
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                style={{
                  paddingLeft: '40px',
                  height: '48px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              />
            </div>
            <button
              type="submit"
              className="btn fw-semibold px-4"
              style={{
                background: '#2e7d32',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                height: '48px',
              }}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-1.5rem', paddingBottom: '4rem' }}>
        <div className="row g-4">
          {/* Sidebar / Filters */}
          <div className="col-lg-3">
            <div
              className="p-4 rounded-4"
              style={{
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                position: 'sticky',
                top: '90px',
              }}
            >
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h6 className="fw-bold mb-0" style={{ color: '#0d2310' }}>Filters</h6>
                {hasFilters && (
                  <button
                    className="btn btn-sm p-0 text-danger fw-medium"
                    style={{ fontSize: '0.8rem', background: 'none', border: 'none' }}
                    onClick={clearFilters}
                  >
                    Clear All
                  </button>
                )}
              </div>

              <h6 className="fw-semibold mb-2" style={{ fontSize: '0.85rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Category
              </h6>
              <div className="d-flex flex-column gap-1">
                <button
                  className="btn text-start rounded-2 fw-medium"
                  style={{
                    background: !selectedCategoryId ? 'rgba(46,125,50,0.1)' : 'transparent',
                    color: !selectedCategoryId ? '#2e7d32' : '#555',
                    border: 'none',
                    fontSize: '0.875rem',
                    padding: '0.45rem 0.75rem',
                  }}
                  onClick={() => handleCategory('')}
                >
                  <i className="bi bi-grid me-2" />
                  All Categories
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className="btn text-start rounded-2 fw-medium"
                    style={{
                      background: selectedCategoryId === String(cat.id) ? 'rgba(46,125,50,0.1)' : 'transparent',
                      color: selectedCategoryId === String(cat.id) ? '#2e7d32' : '#555',
                      border: 'none',
                      fontSize: '0.875rem',
                      padding: '0.45rem 0.75rem',
                    }}
                    onClick={() => handleCategory(String(cat.id))}
                  >
                    <i className="bi bi-tag me-2" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="col-lg-9">
            {/* Active filters */}
            {hasFilters && (
              <div className="d-flex flex-wrap gap-2 mb-4">
                {searchQuery && (
                  <span className="badge d-flex align-items-center gap-1 px-3 py-2" style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '20px', fontSize: '0.8rem' }}>
                    Search: "{searchQuery}"
                    <button className="btn p-0 ms-1" style={{ background: 'none', border: 'none', color: '#2e7d32', lineHeight: 1 }} onClick={() => { setLocalSearch(''); const n = new URLSearchParams(searchParams); n.delete('search'); setSearchParams(n); }}>
                      <i className="bi bi-x" />
                    </button>
                  </span>
                )}
                {selectedCategoryId && categories.find(c => String(c.id) === selectedCategoryId) && (
                  <span className="badge d-flex align-items-center gap-1 px-3 py-2" style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', borderRadius: '20px', fontSize: '0.8rem' }}>
                    Category: {categories.find(c => String(c.id) === selectedCategoryId)?.name}
                    <button className="btn p-0 ms-1" style={{ background: 'none', border: 'none', color: '#2e7d32', lineHeight: 1 }} onClick={() => handleCategory('')}>
                      <i className="bi bi-x" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading ? (
              <LoadingSpinner message="Loading products..." />
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
                <h5 className="fw-semibold" style={{ color: '#555' }}>No products found</h5>
                <p className="text-muted">Try adjusting your search or filters</p>
                <button className="btn btn-primary-green mt-2" onClick={clearFilters}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {products.map(product => (
                  <div key={product.id} className="col-6 col-md-4 col-xl-4">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
