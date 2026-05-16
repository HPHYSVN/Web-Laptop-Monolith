import React, { useCallback, useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { Package, Search, Trash2 } from 'lucide-react';
import { OrderDTO } from '../../types';
import { orderService } from '../../services/api';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;
const statuses = ['', 'PENDING', 'PROCESSING', 'DELIVERED', 'CANCELLED'];
const statusBg: Record<string, string> = { PENDING: '#FFFBEB', PROCESSING: '#EFF6FF', DELIVERED: '#ECFDF5', CANCELLED: '#FEF2F2' };
const statusColor: Record<string, string> = { PENDING: '#92400E', PROCESSING: '#1E40AF', DELIVERED: '#047857', CANCELLED: '#B91C1C' };

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrdersPage({ page, size: PAGE_SIZE, keyword: keyword || undefined, status: status || undefined });
      setOrders(data.content);
      setTotal(data.totalElements);
      setTotalPages(Math.max(data.totalPages, 1));
      setSelected([]);
      setError('');
    } catch {
      setError(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, keyword, status, t]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await orderService.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch {
      setError(t('messages.updateError'));
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !window.confirm(t('messages.deleteConfirm'))) return;
    await orderService.bulkDeleteOrders(selected);
    fetchOrders();
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  const allSelected = orders.length > 0 && orders.every((order) => selected.includes(order.id));

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Package size={22} /></div>
          <div>
            <h2 style={{ marginBottom: 2 }}>{t('ordersAdmin.title')}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>{t('ordersAdmin.count', { count: total })}</p>
          </div>
        </div>
      </div>

      <div className="card-modern mb-3" style={{ padding: 16 }}>
        <div className="d-flex flex-column flex-lg-row gap-2">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input className="input-modern" value={keyword} onChange={(e) => { setPage(0); setKeyword(e.target.value); }} placeholder={t('ordersAdmin.keyword')} style={{ paddingLeft: 36 }} />
          </div>
          <select className="input-modern select-modern" value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }} style={{ maxWidth: 180 }}>
            {statuses.map((item) => <option key={item || 'all'} value={item}>{item || t('common.all')}</option>)}
          </select>
          <button className="btn-secondary-modern" disabled={!selected.length} onClick={handleBulkDelete}><Trash2 size={16} />{t('common.deleteSelected')} ({selected.length})</button>
        </div>
      </div>

      {loading ? <div className="d-flex flex-column align-items-center gap-3 py-5"><Spinner color="primary" /></div> : error ? (
        <div className="card-modern" style={{ padding: 24, borderLeft: '4px solid var(--danger)' }}><p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p></div>
      ) : (
        <div className="table-modern-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead><tr><th><input type="checkbox" checked={allSelected} onChange={(e) => setSelected(e.target.checked ? orders.map((o) => o.id) : [])} /></th><th>ID</th><th>{t('ordersAdmin.customer')}</th><th>{t('ordersAdmin.receiver')}</th><th>{t('ordersAdmin.address')}</th><th>{t('common.total')}</th><th>{t('common.status')}</th><th>{t('common.date')}</th><th>{t('common.actions')}</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td><input type="checkbox" checked={selected.includes(order.id)} onChange={() => setSelected((prev) => prev.includes(order.id) ? prev.filter((id) => id !== order.id) : [...prev, order.id])} /></td>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{order.id}</td>
                    <td style={{ fontWeight: 500 }}>{order.username}</td>
                    <td><div>{order.receiverName}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.receiverPhone}</div></td>
                    <td style={{ maxWidth: 240, whiteSpace: 'normal' }}>{order.receiverAddress}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{formatPrice(order.totalPrice)}</td>
                    <td><span className="badge-modern" style={{ background: statusBg[order.status] || '#F1F5F9', color: statusColor[order.status] || '#475569' }}>{order.status}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td><select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="input-modern select-modern" style={{ minWidth: 140 }}>{statuses.filter(Boolean).map((item) => <option key={item} value={item}>{item}</option>)}</select></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center justify-content-between p-3"><span>{total} {t('admin.orders')}</span><div className="d-flex gap-2 align-items-center"><button className="btn-secondary-modern" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>{t('common.previous')}</button><span>{page + 1} / {totalPages}</span><button className="btn-secondary-modern" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>{t('common.next')}</button></div></div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
