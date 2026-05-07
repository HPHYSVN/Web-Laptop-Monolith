import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Navbar as BSNavbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  NavbarToggler,
  Collapse,
} from 'reactstrap';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BSNavbar color="dark" dark expand="md" className="mb-0">
      <NavbarBrand tag={Link} to="/">
        Laptop Store
      </NavbarBrand>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="me-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/products">Products</NavLink>
          </NavItem>
          {isAdmin && (
            <NavItem>
              <NavLink tag={Link} to="/admin">Admin</NavLink>
            </NavItem>
          )}
        </Nav>
        <Nav navbar>
          <NavItem>
            <NavLink tag={Link} to="/cart" className="position-relative">
              Cart
              {totalItems > 0 && (
                <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '0.65rem' }}>
                  {totalItems}
                </span>
              )}
            </NavLink>
          </NavItem>
          {isAuthenticated ? (
            <>
              <NavItem className="d-flex align-items-center ms-3">
                <span className="text-light">Hi, {user?.username}</span>
              </NavItem>
              <NavItem className="ms-2">
                <Button color="danger" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem className="ms-2">
                <NavLink tag={Link} to="/login">Login</NavLink>
              </NavItem>
              <NavItem className="ms-2">
                <NavLink tag={Link} to="/register">Register</NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </BSNavbar>
  );
};

export default Navbar;
