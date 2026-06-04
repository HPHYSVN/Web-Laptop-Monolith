import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import { Users, Package, ShoppingBag, TrendingUp, CalendarDays, Download, RefreshCw, BarChart3 } from 'lucide-react';
import { DashboardQueryParams, DashboardSummaryDTO, LabelValueDTO, RevenuePointDTO } from '../../types';
import { adminService } from '../../services/api';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { useTranslation } from 'react-i18next';

type GroupBy = 'DAY' | 'MONTH';
type PresetKey = 'today' | 'last7Days' | 'thisMonth' | 'thisYear' | 'custom';

const toDateInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const daysBetween = (fromDate: string, toDate: string): number => {
  const from = new Date(`${fromDate}T00:00:00`);
  const to = new Date(`${toDate}T00:00:00`);
  return Math.floor((to.getTime() - from.getTime()) / 86400000) + 1;
};

const getPresetRange = (preset: PresetKey) => {
  const today = new Date();
  const from = new Date(today);

  if (preset === 'today') {
    return { fromDate: toDateInput(today), toDate: toDateInput(today) };
  }

  if (preset === 'last7Days') {
    from.setDate(today.getDate() - 6);
    return { fromDate: toDateInput(from), toDate: toDateInput(today) };
  }

  if (preset === 'thisYear') {
    from.setMonth(0, 1);
    return { fromDate: toDateInput(from), toDate: toDateInput(today) };
  }

  from.setDate(1);
  return { fromDate: toDateInput(from), toDate: toDateInput(today) };
};

const Dashboard: React.FC = () => {
  const initialRange = useMemo(() => getPresetRange('thisYear'), []);
  const [stats, setStats] = useState<DashboardSummaryDTO | null>(null);
  const [revenue, setRevenue] = useState<RevenuePointDTO[]>([]);
  const [orderStatus, setOrderStatus] = useState<LabelValueDTO[]>([]);
  const [monthlyUsers, setMonthlyUsers] = useState<LabelValueDTO[]>([]);
  const [categoryShare, setCategoryShare] = useState<LabelValueDTO[]>([]);
  const [fromDate, setFromDate] = useState(initialRange.fromDate);
  const [toDate, setToDate] = useState(initialRange.toDate);
  const [groupBy, setGroupBy] = useState<GroupBy>('MONTH');
  const [appliedFilters, setAppliedFilters] = useState<DashboardQueryParams>({ ...initialRange, groupBy: 'MONTH' });
  const [activePreset, setActivePreset] = useState<PresetKey>('thisYear');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [statsResult, revenueResult, statusResult, monthlyUsersResult, categoryResult] = await Promise.allSettled([
        adminService.getDashboardStats(appliedFilters),
        adminService.getRevenueSeries(appliedFilters),
        adminService.getOrderStatusStats(appliedFilters),
        adminService.getMonthlyUsers(appliedFilters),
        adminService.getCategoryShare(),
      ]);

      if (statsResult.status === 'fulfilled') setStats(statsResult.value);
      if (revenueResult.status === 'fulfilled') setRevenue(revenueResult.value);
      if (statusResult.status === 'fulfilled') setOrderStatus(statusResult.value);
      if (monthlyUsersResult.status === 'fulfilled') setMonthlyUsers(monthlyUsersResult.value);
      if (categoryResult.status === 'fulfilled') setCategoryShare(categoryResult.value);

      const hasRejected = [statsResult, revenueResult, statusResult, monthlyUsersResult, categoryResult].some((result) => result.status === 'rejected');
      setError(hasRejected ? t('messages.loadError') : '');
    } catch {
      setError(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, t]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0);
  };

  const handlePreset = (preset: PresetKey) => {
    const range = getPresetRange(preset);
    const nextGroupBy: GroupBy = preset === 'thisYear' ? 'MONTH' : 'DAY';
    setActivePreset(preset);
    setFromDate(range.fromDate);
    setToDate(range.toDate);
    setGroupBy(nextGroupBy);
  };

  const handleApplyFilters = () => {
    const nextGroupBy: GroupBy = daysBetween(fromDate, toDate) > 120 ? 'MONTH' : groupBy;
    setGroupBy(nextGroupBy);
    setAppliedFilters({ fromDate, toDate, groupBy: nextGroupBy });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await adminService.exportRevenueReport(appliedFilters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-report-${appliedFilters.fromDate}-${appliedFilters.toDate}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      setError('');
    } catch {
      setError(t('messages.exportError'));
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    { label: t('dashboard.totalRevenue'), value: formatPrice(stats?.totalRevenue || 0), helper: t('dashboard.deliveredRevenue'), icon: TrendingUp, color: '#0F766E', bg: '#CCFBF1' },
    { label: t('dashboard.deliveredOrders'), value: stats?.deliveredOrders || 0, helper: t('dashboard.completedOrders'), icon: ShoppingBag, color: '#2563EB', bg: '#EFF6FF' },
    { label: t('dashboard.averageOrderValue'), value: formatPrice(stats?.averageOrderValue || 0), helper: t('dashboard.perDeliveredOrder'), icon: BarChart3, color: '#7C3AED', bg: '#F3E8FF' },
    { label: t('dashboard.newUsers'), value: stats?.newUsers || 0, helper: t('dashboard.inSelectedRange'), icon: Users, color: '#D97706', bg: '#FEF3C7' },
    { label: t('dashboard.totalProducts'), value: stats?.totalProducts || 0, helper: t('dashboard.catalogSize'), icon: Package, color: '#059669', bg: '#ECFDF5' },
  ];

  const presets: { key: Exclude<PresetKey, 'custom'>; label: string }[] = [
    { key: 'today', label: t('dashboard.today') },
    { key: 'last7Days', label: t('dashboard.last7Days') },
    { key: 'thisMonth', label: t('dashboard.thisMonth') },
    { key: 'thisYear', label: t('dashboard.thisYear') },
  ];

  const colors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  return (
    <div style={{ padding: '28px 32px 60px' }}>
      <div className="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 mb-3">
        <div>
          <h2 style={{ marginBottom: 4 }}>{t('dashboard.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
            {t('dashboard.subtitle')}
          </p>
        </div>
        <button className="btn-primary-modern" onClick={handleExport} disabled={exporting || loading}>
          {exporting ? <Spinner size="sm" /> : <Download size={17} />}
          {t('dashboard.exportRevenue')}
        </button>
      </div>

      <div className="card-modern dashboard-filter-panel mb-4">
        <div className="dashboard-filter-grid">
          <div className="dashboard-quick-range">
            <div className="dashboard-filter-label">
              {t('dashboard.quickRange')}
            </div>
            <div className="dashboard-quick-range-buttons">
              {presets.map((preset) => (
                <button
                  key={preset.key}
                  className={activePreset === preset.key ? 'btn-primary-modern' : 'btn-secondary-modern'}
                  onClick={() => handlePreset(preset.key)}
                  type="button"
                >
                  <CalendarDays size={15} />
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <div className="dashboard-filter-dates">
            <div style={{ flex: 1 }}>
              <label className="dashboard-filter-label">{t('dashboard.fromDate')}</label>
              <input className="input-modern" type="date" value={fromDate} onChange={(e) => { setActivePreset('custom'); setFromDate(e.target.value); }} />
            </div>
            <div style={{ flex: 1 }}>
              <label className="dashboard-filter-label">{t('dashboard.toDate')}</label>
              <input className="input-modern" type="date" value={toDate} onChange={(e) => { setActivePreset('custom'); setToDate(e.target.value); }} />
            </div>
          </div>
          <div className="dashboard-filter-group">
            <div className="dashboard-filter-label">
              {t('dashboard.groupBy')}
            </div>
            <div className="dashboard-group-buttons">
              <button className={groupBy === 'DAY' ? 'btn-primary-modern' : 'btn-secondary-modern'} type="button" onClick={() => setGroupBy('DAY')}>
                {t('dashboard.byDay')}
              </button>
              <button className={groupBy === 'MONTH' ? 'btn-primary-modern' : 'btn-secondary-modern'} type="button" onClick={() => setGroupBy('MONTH')}>
                {t('dashboard.byMonth')}
              </button>
            </div>
          </div>
          <button className="btn-primary-modern" type="button" onClick={handleApplyFilters} style={{ minWidth: 142 }}>
            <RefreshCw size={16} />
            {t('dashboard.applyFilter')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center gap-3 py-5">
          <Spinner color="primary" />
        </div>
      ) : error && !stats ? (
        <div className="card-modern" style={{ padding: 24, borderLeft: '4px solid var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="card-modern mb-3" style={{ padding: 14, borderLeft: '4px solid var(--warning)' }}>
              <p style={{ color: 'var(--warning)', fontWeight: 600, margin: 0 }}>{error}</p>
            </div>
          )}
          <Row className="g-3">
            {statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Col key={stat.label} xs={12} sm={6} xl={i === 0 ? 4 : 2}>
                  <div className="stat-card animate-fade-in-up" style={{ opacity: 0, animationDelay: `${i * 0.06}s`, minHeight: 150 }}>
                    <div className="stat-icon" style={{ background: stat.bg, color: stat.color }}>
                      <Icon size={21} />
                    </div>
                    <div className="stat-value" style={{ fontSize: i === 0 ? '1.45rem' : '1.3rem' }}>{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: 6 }}>{stat.helper}</div>
                  </div>
                </Col>
              );
            })}
          </Row>

          <Row className="g-4 mt-1">
            <Col xs={12} xl={8}>
              <div className="card-modern" style={{ padding: 20, height: 410 }}>
                <div className="d-flex align-items-start justify-content-between gap-3 mb-2">
                  <div>
                    <h5 style={{ marginBottom: 4 }}>{t('dashboard.revenueTrend')}</h5>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                      {appliedFilters.fromDate} - {appliedFilters.toDate}
                    </p>
                  </div>
                  <span className="badge-modern badge-primary">{groupBy === 'DAY' ? t('dashboard.byDay') : t('dashboard.byMonth')}</span>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(value) => `${Math.round(Number(value) / 1000000)}M`} />
                    <Tooltip formatter={(value, _name, props) => props.dataKey === 'revenue' ? formatPrice(Number(value)) : Number(value)} />
                    <Legend />
                    <Line name={t('dashboard.revenue')} type="monotone" dataKey="revenue" stroke="#0F766E" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line name={t('dashboard.orders')} type="monotone" dataKey="orderCount" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} xl={4}>
              <div className="card-modern" style={{ padding: 20, height: 410 }}>
                <h5>{t('dashboard.orderStatus')}</h5>
                <ResponsiveContainer width="100%" height={330}>
                  <PieChart>
                    <Pie data={orderStatus} dataKey="value" nameKey="label" outerRadius={105} label>
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
                <h5>{t('dashboard.usersByPeriod')}</h5>
                <ResponsiveContainer width="100%" height={290}>
                  <BarChart data={monthlyUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="label" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#D97706" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} lg={6}>
              <div className="card-modern" style={{ padding: 20, height: 380 }}>
                <h5>{t('dashboard.categoryShare')}</h5>
                <ResponsiveContainer width="100%" height={310}>
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
