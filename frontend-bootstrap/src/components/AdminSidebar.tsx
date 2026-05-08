import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Laptop, Package, Users, ArrowLeft, Percent, Folder, Layers } from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/categories', label: 'Categories', icon: Folder },
    { to: '/admin/products', label: 'Products', icon: Laptop },
    { to: '/admin/specs', label: 'Specs', icon: Layers },
    { to: '/admin/orders', label: 'Orders', icon: Package },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/discounts', label: 'Discounts', icon: Percent },
  ];

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 260,
        height: '100vh',
        background: 'var(--bg-white)',
        borderRight: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px' }}>
        <Link
          to="/"
          className="d-flex align-items-center gap-2"
          style={{ textDecoration: 'none', color: 'var(--text-main)' }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Laptop size={18} color="white" />
          </div>
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: '1.125rem' }}>
            Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        <p
          style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--text-muted)',
            padding: '16px 8px 8px',
            margin: 0,
          }}
        >
          Management
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 16px',
                margin: '4px 0',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'var(--primary-gradient)' : 'transparent',
                boxShadow: isActive ? 'var(--shadow-md)' : 'none',
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--primary-light)';
                  e.currentTarget.style.color = 'var(--primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Back to store */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-light)' }}>
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'var(--text-secondary)',
            textDecoration: 'none',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--primary-light)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <ArrowLeft size={18} />
          Back to Store
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
