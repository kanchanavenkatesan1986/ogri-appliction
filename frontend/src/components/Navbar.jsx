import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { getCartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartCount = getCartCount();

  return (
    <nav
      className="navbar navbar-expand-lg sticky-top"
      style={{
        background: 'rgba(13,35,16,0.97)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        zIndex: 1050,
      }}
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand d-flex align-items-center gap-2"
          to="/"
          style={{ textDecoration: 'none' }}
        >
          <span
            style={{
              background: 'linear-gradient(135deg, #2e7d32, #81c784)',
              borderRadius: '10px',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            🌾
          </span>
          <span
            style={{
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 700,
              fontSize: '1.3rem',
              color: 'white',
              letterSpacing: '-0.02em',
            }}
          >
            Agri<span style={{ color: '#81c784' }}>Market</span>
          </span>
        </Link>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
          style={{ color: 'white' }}
        >
          <i className={`bi ${navOpen ? 'bi-x-lg' : 'bi-list'} fs-4`} style={{ color: 'white' }} />
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${navOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-3 gap-lg-1">
            {[
              { to: '/', label: 'Home', exact: true },
              { to: '/products', label: 'Products' },
            ].map(({ to, label, exact }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  end={exact}
                  className="nav-link fw-medium px-3 py-2 rounded-2"
                  style={({ isActive }) => ({
                    color: isActive ? '#81c784' : 'rgba(255,255,255,0.8)',
                    background: isActive ? 'rgba(129,199,132,0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                  })}
                  onClick={() => setNavOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
            {user && !isAdmin() && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/orders"
                    className="nav-link fw-medium px-3 py-2 rounded-2"
                    style={({ isActive }) => ({
                      color: isActive ? '#81c784' : 'rgba(255,255,255,0.8)',
                      background: isActive ? 'rgba(129,199,132,0.1)' : 'transparent',
                      transition: 'all 0.2s ease',
                    })}
                    onClick={() => setNavOpen(false)}
                  >
                    My Orders
                  </NavLink>
                </li>
              </>
            )}
            {isAdmin() && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className="nav-link fw-medium px-3 py-2 rounded-2"
                  style={({ isActive }) => ({
                    color: isActive ? '#f9a825' : 'rgba(255,255,255,0.8)',
                    background: isActive ? 'rgba(249,168,37,0.1)' : 'transparent',
                    transition: 'all 0.2s ease',
                  })}
                  onClick={() => setNavOpen(false)}
                >
                  <i className="bi bi-shield-check me-1" />
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right side */}
          <div className="d-flex align-items-center gap-2">
            {/* Cart */}
            {!isAdmin() && (
              <Link
                to="/cart"
                className="btn btn-sm position-relative d-flex align-items-center gap-2"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  padding: '0.45rem 1rem',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                }}
                onClick={() => setNavOpen(false)}
              >
                <i className="bi bi-cart3" />
                <span className="d-none d-sm-inline fw-medium">Cart</span>
                {cartCount > 0 && (
                  <span
                    className="badge rounded-pill"
                    style={{
                      background: '#f9a825',
                      color: '#0d2310',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      minWidth: '20px',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Auth */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.45rem 1rem',
                    fontWeight: 500,
                  }}
                  data-bs-toggle="dropdown"
                  id="userDropdown"
                >
                  <i className="bi bi-person-circle" />
                  <span className="d-none d-sm-inline">{user.username}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-1" style={{ minWidth: '200px' }}>
                  <li>
                    <span className="dropdown-item-text text-muted small px-3 pt-2 pb-1">
                      Signed in as <strong>{user.username}</strong>
                    </span>
                  </li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  {!isAdmin() && (
                    <>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2" to="/orders" onClick={() => setNavOpen(false)}>
                          <i className="bi bi-bag-check text-success" /> My Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item d-flex align-items-center gap-2" to="/cart" onClick={() => setNavOpen(false)}>
                          <i className="bi bi-cart3 text-success" /> My Cart
                        </Link>
                      </li>
                    </>
                  )}
                  {isAdmin() && (
                    <li>
                      <Link className="dropdown-item d-flex align-items-center gap-2" to="/admin" onClick={() => setNavOpen(false)}>
                        <i className="bi bi-shield-check text-warning" /> Admin Panel
                      </Link>
                    </li>
                  )}
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 text-danger"
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right" /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link
                  to="/login"
                  className="btn btn-sm fw-medium"
                  style={{
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '10px',
                    padding: '0.45rem 1rem',
                    background: 'rgba(255,255,255,0.05)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setNavOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-sm fw-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #2e7d32, #388e3c)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.45rem 1.1rem',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => setNavOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
