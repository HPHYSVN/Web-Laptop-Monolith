import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import { Users, Package, ShoppingBag, TrendingUp } from 'lucide-react';
import { DashboardDTO, LabelValueDTO, MonthlyRevenueDTO } from '../../types';
import { adminService } from '../../services/api';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { useTranslation } from 'react-i18next';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardDTO | null>(null);
  const [revenue, setRevenue] = useState<MonthlyRevenueDTO[]>([]);
  const [orderStatus, setOrderStatus] = useState<LabelValueDTO[]>([]);
  const [monthlyUsers, setMonthlyUsers] = useState<LabelValueDTO[]>([]);
  const [categoryShare, setCategoryShare] = useState<LabelValueDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsData, revenueData, statusData, monthlyUsersData, categoryData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getMonthlyRevenue(),
          adminService.getOrderStatusStats(),
          adminService.getMonthlyUsers(),
          adminService.getCategoryShare(),
        ]);
        setStats(statsData);
        setRevenue(revenueData);
        setOrderStatus(statusData);
        setMonthlyUsers(monthlyUsersData);
        setCategoryShare(categoryData);
      } catch {
        setError(t('messages.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const statCards = [
    { label: t('dashboard.totalUsers'), value: stats?.totalUsers || 0, icon: Users, color: '#2563EB', bg: '#EFF6FF' },
    { label: t('dashboard.totalOrders'), value: stats?.totalOrders || 0, icon: ShoppingBag, color: '#3B82F6', bg: '#EFF6FF' },
    { label: t('dashboard.totalProducts'), value: stats?.totalProducts || 0, icon: Package, color: '#10B981', bg: '#ECFDF5' },
    { label: t('dashboard.totalRevenue'), value: formatPrice(stats?.totalRevenue || 0), icon: TrendingUp, color: '#F59E0B', bg: '#FFFBEB' },
  ];
  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 style={{ marginBottom: 4 }}>{t('dashboard.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
            {t('dashboard.subtitle')}
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
        <>
          <Row className="g-4">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Col key={stat.label} xs={12} sm={6} lg={3}>
                  <div className="stat-card animate-fade-in-up" style={{ opacity: 0, animationDelay: `${i * 0.08}s` }}>
                    <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                      <Icon size={22} />
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                </Col>
              );
            })}
          </Row>
          <Row className="g-4 mt-1">
            <Col xs={12} lg={7}>
              <div className="card-modern" style={{ padding: 20, height: 360 }}>
                <h5>{t('dashboard.revenueByMonth')}</h5>
                <ResponsiveContainer width="100%" height={285}>
                  <LineChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}M`} />
                    <Tooltip formatter={(value) => formatPrice(Number(value))} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} lg={5}>
              <div className="card-modern" style={{ padding: 20, height: 360 }}>
                <h5>{t('dashboard.orderStatus')}</h5>
                <ResponsiveContainer width="100%" height={285}>
                  <PieChart>
                    <Pie data={orderStatus} dataKey="value" nameKey="label" outerRadius={96} label>
                      {orderStatus.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} lg={6}>
              <div className="card-modern" style={{ padding: 20, height: 380 }}>
                <h5>{t('dashboard.usersByMonth')}</h5>
                <ResponsiveContainer width="100%" height={265}>
                  <BarChart data={monthlyUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} lg={6}>
              <div className="card-modern" style={{ padding: 20, height: 380 }}>
                <h5>{t('dashboard.categoryShare')}</h5>
                <ResponsiveContainer width="100%" height={340}>
                  <PieChart>
                    <Pie data={categoryShare} dataKey="value" nameKey="label" innerRadius={56} outerRadius={88} paddingAngle={2} cy="45%" label>
                      {categoryShare.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={84} wrapperStyle={{ paddingTop: 28 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard;
