import React, { useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { Plus, Pencil, Trash2, Percent } from 'lucide-react';
import { DiscountDTO } from '../../types';
import { discountService } from '../../services/api';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;

const statusBg: Record<string, string> = {
  ACTIVE: '#ECFDF5',
  EXPIRED: '#F1F5F9',
  FUTURE: '#FEF3C7',
};

const statusColor: Record<string, string> = {
  ACTIVE: '#047857',
  EXPIRED: '#475569',
  FUTURE: '#B45309',
};

const AdminDiscounts: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountDTO | null>(null);
  const [page, setPage] = useState(0);
  const { t } = useTranslation();

  const [form, setForm] = useState({
    code: '',
    discountPercent: 0,
    maxPercent: 0,
    startDate: '',
    endDate: '',
    description: '',
    quantity: 0,
  });

  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const data = await discountService.getAllDiscounts();
        setDiscounts(data);
      } catch {
        setError(t('messages.loadError'));
      } finally {
        setLoading(false);
      }
    };

    fetchDiscounts();
  }, [t]);

  const totalPages = Math.max(Math.ceil(discounts.length / PAGE_SIZE), 1);
  const paginatedDiscounts = discounts.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this discount?')) return;
    try {
      await discountService.deleteDiscount(id);
      setDiscounts((prev) => prev.filter((d) => d.id !== id));
    } catch (err: any) {
      console.error('Delete discount error:', err);
      const msg = err.response?.data?.message || err.response?.statusText || 'Failed to delete discount.';
      setError(msg + (err.response?.status === 403 ? ' (Forbidden: admin only)' : ''));
    }
  };

  const openCreate = () => {
    setEditingDiscount(null);
    setForm({
      code: '',
      discountPercent: 0,
      maxPercent: 0,
      startDate: '',
      endDate: '',
      description: '',
      quantity: 0,
    });
    setModalOpen(true);
  };

  const openEdit = (discount: DiscountDTO) => {
    setEditingDiscount(discount);
    setForm({
      code: discount.code,
      discountPercent: discount.discountPercent,
      maxPercent: discount.maxPercent,
      startDate: discount.startDate?.split('T')[0] || '',
      endDate: discount.endDate?.split('T')[0] || '',
      description: discount.description || '',
      quantity: discount.quantity || 0,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const dto: DiscountDTO = {
        ...form,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };

      if (editingDiscount) {
        await discountService.updateDiscount(editingDiscount.id as number, dto);
        setDiscounts((prev) => prev.map((d) => (d.id === editingDiscount.id ? dto : d)));
      } else {
        const created = await discountService.createDiscount(dto);
        setDiscounts((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save discount.');
    }
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
            <Percent size={22} />
          </div>
          <div>
            <h2 style={{ marginBottom: 2 }}>{t('adminExtra.manageDiscounts')}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              {t('adminExtra.discountsCount', { count: discounts.length })}
            </p>
          </div>
        </div>
        <button className="btn-primary-modern" onClick={openCreate}>
          <Plus size={18} style={{ marginRight: 8 }} />
          {t('adminExtra.addDiscount')}
        </button>
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
                  <th>{t('forms.code')}</th>
                  <th>{t('adminExtra.discountPercent')}</th>
                  <th>{t('adminExtra.maxPercent')}</th>
                  <th>{t('forms.startDate')}</th>
                  <th>{t('forms.endDate')}</th>
                  <th>{t('forms.quantity')}</th>
                  <th>{t('common.status')}</th>
                  <th>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDiscounts.map((discount) => (
                  <tr key={discount.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{discount.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{discount.code}</td>
                    <td>{discount.discountPercent}%</td>
                    <td>{discount.maxPercent}%</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {discount.startDate ? new Date(discount.startDate).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {discount.endDate ? new Date(discount.endDate).toLocaleDateString() : '—'}
                    </td>
                    <td>{discount.quantity}</td>
                    <td>
                      <span
                        className="badge-modern"
                        style={{
                          background: statusBg[discount.status as string] || '#F1F5F9',
                          color: statusColor[discount.status as string] || '#475569',
                        }}
                      >
                        {discount.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => openEdit(discount)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: 'none',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(discount.id as number)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: 'none',
                            background: 'var(--danger-bg)',
                            color: 'var(--danger)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center justify-content-between p-3">
            <span style={{ color: 'var(--text-secondary)' }}>{discounts.length} {t('admin.discounts')}</span>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn-secondary-modern" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>{t('common.previous')}</button>
              <span>{page + 1} / {totalPages}</span>
              <button className="btn-secondary-modern" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>{t('common.next')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {editingDiscount ? `${t('forms.edit')} ${t('admin.discounts')}` : t('adminExtra.addDiscount')}
              </h4>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  background: 'var(--bg)',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ padding: 20 }}>
                {error && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--danger-bg)',
                      color: 'var(--danger)',
                      fontSize: '0.875rem',
                      marginBottom: 16,
                      fontWeight: 500,
                    }}
                  >
                    {error}
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('forms.code')} *
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    className="input-modern"
                    required
                    style={{ textTransform: 'uppercase' }}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('adminExtra.discountPercent')}
                  </label>
                  <input
                    type="number"
                    value={form.discountPercent}
                    onChange={(e) => setForm({ ...form, discountPercent: parseFloat(e.target.value) })}
                    className="input-modern"
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('adminExtra.maxPercent')}
                  </label>
                  <input
                    type="number"
                    value={form.maxPercent}
                    onChange={(e) => setForm({ ...form, maxPercent: parseFloat(e.target.value) })}
                    className="input-modern"
                    min={0}
                    max={100}
                    step={0.1}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('forms.startDate')} *
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="input-modern"
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('forms.endDate')} *
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="input-modern"
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('forms.quantity')}
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                    className="input-modern"
                    min={0}
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('forms.description')}
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-modern"
                    rows={3}
                  />
                </div>
              </div>

              <div
                style={{
                  padding: '16px 24px 24px',
                  borderTop: '1px solid var(--border-light)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 12,
                }}
              >
                <button
                  type="button"
                  className="btn-secondary-modern"
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '10px 20px' }}
                >
                  {t('forms.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary-modern"
                  style={{ padding: '10px 24px' }}
                >
                  {editingDiscount ? t('forms.update') : t('forms.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDiscounts;
