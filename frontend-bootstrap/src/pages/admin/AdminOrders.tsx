import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'reactstrap';
import { Package, ChevronDown } from 'lucide-react';
import { OrderDTO } from '../../types';
import { orderService } from '../../services/api';

const statusBadge: Record<string, string> = {
  PENDING: 'badge-warning',
  PROCESSING: 'badge-info',
  DELIVERED: 'badge-success',
  CANCELLED: 'badge-danger',
};

const statusBg: Record<string, string> = {
  PENDING: '#FFFBEB',
  PROCESSING: '#EFF6FF',
  DELIVERED: '#ECFDF5',
  CANCELLED: '#FEF2F2',
};

const statusColor: Record<string, string> = {
  PENDING: '#92400E',
  PROCESSING: '#1E40AF',
  DELIVERED: '#047857',
  CANCELLED: '#B91C1C',
};

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders();
        setOrders(data);
      } catch {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch {
      setError('Failed to update order status.');
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Package size={22} />
          </div>
          <div>
            <h2 style={{ marginBottom: 2 }}>Manage Orders</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              {orders.length} orders total
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center gap-3 py-5">
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <div className="card-modern" style={{ padding: 24, borderLeft: '4px solid var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p>
        </div>
      ) : (
        <div className="table-modern-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Receiver</th>
                  <th>Address</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{order.id}</td>
                    <td style={{ fontWeight: 500 }}>{order.username}</td>
                    <td>
                      <div>{order.receiverName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.receiverPhone}</div>
                    </td>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {order.receiverAddress}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span
                        className="badge-modern"
                        style={{
                          background: statusBg[order.status] || '#F1F5F9',
                          color: statusColor[order.status] || '#475569',
                        }}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="select-wrapper" style={{ position: 'relative', minWidth: 140 }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="input-modern select-modern"
                          style={{ paddingRight: 36, fontSize: '0.8125rem', fontWeight: 500, cursor: 'pointer' }}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
