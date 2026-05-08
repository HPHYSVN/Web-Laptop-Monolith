import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{ background: 'var(--dark)', color: 'var(--text-light)', padding: '40px 0 24px' }}>
      <div className="container" style={{ maxWidth: 'var(--max-width)', margin: '0 auto', padding: '0 24px' }}>
        <div className="row g-4">
          <div className="col-md-4">
            <h5 style={{ color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 700, marginBottom: 16 }}>
              Laptop Store
            </h5>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7 }}>
              Your trusted destination for premium laptops. Quality products, competitive prices, exceptional service.
            </p>
          </div>
          <div className="col-md-4">
            <h6 style={{ color: 'white', fontWeight: 600, marginBottom: 16, fontSize: '0.9375rem' }}>Quick Links</h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Home', 'Products', 'Cart', 'Login'].map((item) => (
                <a key={item} href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
                   style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'color 0.2s' }}
                   onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                   onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>
                  {item}
                </a>
              ))}
            </div>
          </div>
          <div className="col-md-4">
            <h6 style={{ color: 'white', fontWeight: 600, marginBottom: 16, fontSize: '0.9375rem' }}>Contact</h6>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>
              support@laptopstore.com
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 8 }}>
              +84 123 456 789
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--dark-700)', marginTop: 32, paddingTop: 20, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', margin: 0 }}>
            &copy; {new Date().getFullYear()} Laptop Store. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
