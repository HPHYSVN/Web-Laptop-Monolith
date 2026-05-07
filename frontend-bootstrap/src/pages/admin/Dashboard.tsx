import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Spinner, Alert } from 'reactstrap';
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
      } catch (err) {
        setError('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner color="primary" size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert color="danger">{error}</Alert>
      </Container>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, color: 'primary' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, color: 'info' },
    { label: 'Total Products', value: stats?.totalProducts || 0, color: 'success' },
    { label: 'Total Revenue', value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats?.totalRevenue || 0), color: 'warning' },
  ];

  return (
    <Container className="py-4">
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        {statCards.map((stat) => (
          <Col key={stat.label} xs={12} sm={6} lg={3} className="mb-4">
            <Card className={`border-${stat.color} h-100`}>
              <CardBody>
                <CardTitle tag="h6" className={`text-${stat.color} text-uppercase`}>
                  {stat.label}
                </CardTitle>
                <h3 className="mb-0">{stat.value}</h3>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
