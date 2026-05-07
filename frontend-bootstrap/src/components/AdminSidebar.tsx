import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Nav, NavItem, NavLink } from 'reactstrap';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: '📊' },
    { to: '/admin/products', label: 'Products', icon: '💻' },
    { to: '/admin/orders', label: 'Orders', icon: '📦' },
    { to: '/admin/users', label: 'Users', icon: '👤' },
  ];

  return (
    <div className="bg-dark text-light p-3 vh-100" style={{ minWidth: '220px' }}>
      <h5 className="mb-4">Admin Panel</h5>
      <Nav vertical pills>
        {navItems.map((item) => (
          <NavItem key={item.to} className="mb-2">
            <NavLink
              tag={Link}
              to={item.to}
              className={location.pathname === item.to ? 'active' : ''}
              style={{ color: location.pathname === item.to ? '#fff' : '#adb5bd' }}
            >
              <span className="me-2">{item.icon}</span>
              {item.label}
            </NavLink>
          </NavItem>
        ))}
      </Nav>
    </div>
  );
};

export default AdminSidebar;
