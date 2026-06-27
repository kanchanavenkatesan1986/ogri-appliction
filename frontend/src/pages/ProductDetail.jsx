import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAdding(true);
    const result = await addToCart(product, quantity);
    setAdding(false);
    if (result.success) {
      addToast(`${quantity}x "${product.name}" added to cart!`, 'success');
    } else {
      addToast(result.error || 'Could not add to cart.', 'error');
    }
  };

  if (loading) return <LoadingSpinner message="Loading product..." />;
  if (!product) return null;

  const isOutOfStock = product.stockQuantity === 0;
  const imgSrc = (!imgError && product.imageUrl)
    ? product.imageUrl
    : 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=700&auto=format&fit=crop&q=75';

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb" style={{ fontSize: '0.85rem' }}>
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: '#2e7d32', textDecoration: 'none' }}>Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" style={{ color: '#2e7d32', textDecoration: 'none' }}>Products</Link>
            </li>
            {product.category && (
              <li className="breadcrumb-item">
                <Link to={`/products?categoryId=${product.category.id}`} style={{ color: '#2e7d32', textDecoration: 'none' }}>
                  {product.category.name}
                </Link>
              </li>
            )}
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }}>
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="row g-5">
          {/* Image */}
          <div className="col-lg-5">
            <div
              className="rounded-4 overflow-hidden"
              style={{
                background: 'white',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: '90px',
              }}
            >
              <img
                src={imgSrc}
                alt={product.name}
                onError={() => setImgError(true)}
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Details */}
          <div className="col-lg-7">
            <div
              className="p-4 p-lg-5 rounded-4"
              style={{ background: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}
            >
              {/* Category + Stock */}
              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                {product.category && (
                  <span className="agri-badge">{product.category.name}</span>
                )}
                <span
                  className="badge"
                  style={{
                    background: isOutOfStock ? 'rgba(198,40,40,0.1)' : 'rgba(46,125,50,0.1)',
                    color: isOutOfStock ? '#c62828' : '#2e7d32',
                    border: `1px solid ${isOutOfStock ? 'rgba(198,40,40,0.2)' : 'rgba(46,125,50,0.2)'}`,
                    borderRadius: '20px',
                    padding: '0.35em 0.8em',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                  }}
                >
                  {isOutOfStock ? '✗ Out of Stock' : `✓ ${product.stockQuantity} in stock`}
                </span>
              </div>

              <h1 className="fw-bold mb-2" style={{ color: '#0d2310', fontSize: '1.75rem', lineHeight: 1.25 }}>
                {product.name}
              </h1>

              <p className="mb-4" style={{ color: '#555', lineHeight: '1.75', fontSize: '0.95rem' }}>
                {product.description || 'No description available for this product.'}
              </p>

              {/* Price */}
              <div
                className="d-flex align-items-center gap-3 mb-4 p-4 rounded-3"
                style={{ background: '#f0f7f0', border: '1px solid rgba(46,125,50,0.15)' }}
              >
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>Price</div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#2e7d32', lineHeight: 1.1 }}>
                    ₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                {!isOutOfStock && (
                  <div className="ms-auto">
                    <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500, marginBottom: '4px' }}>
                      Subtotal
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0d2310' }}>
                      ₹{(parseFloat(product.price) * quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                )}
              </div>

              {/* Quantity + Add to Cart */}
              {!isOutOfStock && (
                <div className="d-flex align-items-center gap-3 mb-4 flex-wrap">
                  <div className="d-flex align-items-center" style={{ border: '2px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden' }}>
                    <button
                      className="btn"
                      style={{ width: '44px', height: '44px', background: 'transparent', border: 'none', fontSize: '1.25rem', color: '#2e7d32', fontWeight: 700 }}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    >
                      −
                    </button>
                    <span style={{ width: '48px', textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: '#0d2310' }}>
                      {quantity}
                    </span>
                    <button
                      className="btn"
                      style={{ width: '44px', height: '44px', background: 'transparent', border: 'none', fontSize: '1.25rem', color: '#2e7d32', fontWeight: 700 }}
                      onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn fw-semibold px-4 flex-grow-1"
                    style={{
                      background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      height: '48px',
                      fontSize: '1rem',
                      boxShadow: '0 4px 14px rgba(46,125,50,0.3)',
                    }}
                    onClick={handleAddToCart}
                    disabled={adding}
                  >
                    {adding ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-cart-plus me-2" />
                        Add to Cart
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="d-flex flex-column gap-2">
                <Link
                  to="/cart"
                  className="btn fw-medium"
                  style={{
                    background: 'transparent',
                    color: '#2e7d32',
                    border: '2px solid #2e7d32',
                    borderRadius: '12px',
                    height: '46px',
                  }}
                >
                  <i className="bi bi-cart me-2" />
                  View Cart
                </Link>
              </div>

              {/* Info chips */}
              <div className="d-flex gap-3 mt-4 flex-wrap">
                {[
                  { icon: 'bi-truck', text: 'Free Delivery over ₹999' },
                  { icon: 'bi-shield-check', text: '100% Authentic' },
                  { icon: 'bi-arrow-counterclockwise', text: '7-Day Returns' },
                ].map(({ icon, text }) => (
                  <div key={text} className="d-flex align-items-center gap-1" style={{ fontSize: '0.78rem', color: '#666' }}>
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

export default ProductDetail;
