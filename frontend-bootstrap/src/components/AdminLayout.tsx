import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  return (
    <div className="d-flex min-vh-100">
      <AdminSidebar />
      <div className="flex-grow-1" style={{ overflow: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
