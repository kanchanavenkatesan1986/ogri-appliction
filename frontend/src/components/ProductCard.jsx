import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useToast } from './Toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const { addToast } = useToast();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const result = await addToCart(product, 1);
    if (result.success) {
      addToast(`"${product.name}" added to cart!`, 'success');
    } else {
      addToast(result.error || 'Could not add to cart.', 'error');
    }
  };

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div className="agri-card h-100 d-flex flex-column" style={{ borderRadius: '18px', overflow: 'hidden' }}>
      <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Image */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '200px', background: '#f0f4f0' }}>
          <img
            src={product.imageUrl || `https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&auto=format&fit=crop&q=70`}
            alt={product.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s ease',
            }}
            className="product-card-img"
            onError={e => {
              e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&auto=format&fit=crop&q=70';
            }}
          />
          {/* Category badge */}
          {product.category && (
            <span
              className="position-absolute top-0 start-0 m-2 badge"
              style={{
                background: 'rgba(13,35,16,0.75)',
                color: '#81c784',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.3em 0.65em',
                borderRadius: '6px',
                backdropFilter: 'blur(4px)',
              }}
            >
              {product.category.name}
            </span>
          )}
          {isOutOfStock && (
            <div
              className="position-absolute top-0 end-0 bottom-0 start-0 d-flex align-items-center justify-content-center"
              style={{ background: 'rgba(0,0,0,0.45)' }}
            >
              <span className="badge bg-danger px-3 py-2 fs-6">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-3 d-flex flex-column flex-grow-1">
          <h6
            className="fw-semibold mb-1"
            style={{
              color: '#1a2e1a',
              fontSize: '0.95rem',
              lineHeight: '1.35',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.name}
          </h6>
          <p
            className="mb-2"
            style={{
              color: '#666',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {product.description || 'Premium quality agricultural product.'}
          </p>

          {/* Stock indicator */}
          <div className="d-flex align-items-center gap-1 mb-2">
            <i
              className={`bi ${isOutOfStock ? 'bi-x-circle-fill' : 'bi-check-circle-fill'}`}
              style={{ color: isOutOfStock ? '#c62828' : '#2e7d32', fontSize: '0.75rem' }}
            />
            <span style={{ color: isOutOfStock ? '#c62828' : '#2e7d32', fontSize: '0.75rem', fontWeight: 500 }}>
              {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} in stock`}
            </span>
          </div>

          {/* Price + CTA */}
          <div className="d-flex align-items-center justify-content-between mt-auto">
            <span
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#2e7d32',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              ₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </Link>

      {/* Add to Cart - outside link */}
      <div className="px-3 pb-3">
        <button
          className="btn w-100 fw-semibold"
          style={{
            background: isOutOfStock ? '#e0e0e0' : 'linear-gradient(135deg, #2e7d32, #388e3c)',
            color: isOutOfStock ? '#9e9e9e' : 'white',
            border: 'none',
            borderRadius: '10px',
            padding: '0.5rem',
            fontSize: '0.85rem',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
          }}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          <i className="bi bi-cart-plus me-2" />
          {isOutOfStock ? 'Unavailable' : 'Add to Cart'}
        </button>
      </div>

      <style>{`
        .agri-card:hover .product-card-img {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
