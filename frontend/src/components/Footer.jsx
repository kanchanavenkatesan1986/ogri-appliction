import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-dark mt-auto">
      <div className="container">
        <div className="row g-5 pb-4">
          {/* Brand */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                style={{
                  background: 'linear-gradient(135deg, #2e7d32, #81c784)',
                  borderRadius: '10px',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                }}
              >
                🌾
              </span>
              <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'white' }}>
                Agri<span style={{ color: '#81c784' }}>Market</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.55)', lineHeight: '1.7', fontSize: '0.9rem' }}>
              Your trusted partner for premium agricultural products. From seed to harvest, we support every farmer's journey.
            </p>
            <div className="d-flex gap-2 mt-3">
              {[
                { icon: 'bi-facebook', href: '#' },
                { icon: 'bi-twitter-x', href: '#' },
                { icon: 'bi-instagram', href: '#' },
                { icon: 'bi-youtube', href: '#' },
              ].map(({ icon, href }) => (
                <a
                  key={icon}
                  href={href}
                  className="d-flex align-items-center justify-content-center rounded-2"
                  style={{
                    width: '36px',
                    height: '36px',
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    fontSize: '0.95rem',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(129,199,132,0.2)';
                    e.currentTarget.style.color = '#81c784';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                  }}
                >
                  <i className={`bi ${icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="fw-semibold mb-3" style={{ color: 'white', fontSize: '1rem' }}>
              Shop
            </h5>
            <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Seeds', label: 'Seeds' },
                { to: '/products?category=Fertilizers', label: 'Fertilizers' },
                { to: '/products?category=Tools', label: 'Tools' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#81c784')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div className="col-lg-2 col-md-6 col-6">
            <h5 className="fw-semibold mb-3" style={{ color: 'white', fontSize: '1rem' }}>
              Account
            </h5>
            <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/login', label: 'Login' },
                { to: '/register', label: 'Register' },
                { to: '/cart', label: 'My Cart' },
                { to: '/orders', label: 'My Orders' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#81c784')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-semibold mb-3" style={{ color: 'white', fontSize: '1rem' }}>
              Contact
            </h5>
            <ul className="list-unstyled" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: 'bi-geo-alt-fill', text: '123 Farm Road, Agri Valley, India' },
                { icon: 'bi-telephone-fill', text: '+91 98765 43210' },
                { icon: 'bi-envelope-fill', text: 'support@agrimarket.in' },
                { icon: 'bi-clock-fill', text: 'Mon–Sat: 9 AM – 6 PM' },
              ].map(({ icon, text }) => (
                <li key={icon} className="d-flex align-items-start gap-2">
                  <i className={`bi ${icon} mt-1`} style={{ color: '#81c784', fontSize: '0.85rem', flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="d-flex flex-column flex-sm-row align-items-center justify-content-between py-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="mb-0" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
            © {currentYear} AgriMarket. All rights reserved.
          </p>
          <div className="d-flex gap-3 mt-2 mt-sm-0">
            {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map(item => (
              <a
                key={item}
                href="#"
                style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
