import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { DashboardDTO } from '../../types';
import { adminService } from '../../services/api';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: '#2563EB', bg: '#EFF6FF' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Total Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: TrendingUp, color: '#F59E0B', bg: '#FFFBEB' },
  ];

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 style={{ marginBottom: 4 }}>Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
            Overview of your store performance
          </p>
        </div>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center gap-3 py-5">
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <div
          className="card-modern"
          style={{ padding: 24, borderLeft: '4px solid var(--danger)' }}
        >
          <p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p>
        </div>
      ) : (
        <Row className="g-4">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Col key={stat.label} xs={12} sm={6} lg={3}>
                <div
                  className="stat-card animate-fade-in-up"
                  style={{ opacity: 0, animationDelay: `${i * 0.08}s` }}
                >
                  <div
                    className="stat-icon"
                    style={{ background: stat.bg, color: stat.color }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
