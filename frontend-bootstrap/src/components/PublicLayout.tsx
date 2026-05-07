import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'reactstrap';
import Navbar from './Navbar';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <footer className="bg-light py-4 mt-auto">
        <Container className="text-center">
          <p className="text-muted mb-0">© 2024 Laptop Store. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default PublicLayout;
