import React, { useCallback, useEffect, useState } from 'react';
import { Spinner } from 'reactstrap';
import { Search, Trash2, Users } from 'lucide-react';
import { UserDTO } from '../../types';
import { userService } from '../../services/api';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;
const statuses = ['', 'ACTIVE', 'INACTIVE', 'BANNED'];
const roles = ['', 'ROLE_USER', 'ROLE_ADMIN'];
const statusBg: Record<string, string> = { ACTIVE: '#ECFDF5', INACTIVE: '#F1F5F9', BANNED: '#FEF2F2' };
const statusColor: Record<string, string> = { ACTIVE: '#047857', INACTIVE: '#475569', BANNED: '#B91C1C' };

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsersPage({ page, size: PAGE_SIZE, keyword: keyword || undefined, status: status || undefined, role: role || undefined });
      setUsers(data.content);
      setTotal(data.totalElements);
      setTotalPages(Math.max(data.totalPages, 1));
      setSelected([]);
      setError('');
    } catch {
      setError(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, keyword, status, role, t]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await userService.updateUserStatus(id, newStatus);
      fetchUsers();
    } catch {
      setError(t('messages.updateError'));
    }
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !window.confirm(t('messages.deleteConfirm'))) return;
    await userService.bulkDeleteUsers(selected);
    fetchUsers();
  };

  const selectableUsers = users.filter((user) => user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN');
  const allSelected = selectableUsers.length > 0 && selectableUsers.every((user) => selected.includes(user.id));

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Users size={22} /></div>
          <div><h2 style={{ marginBottom: 2 }}>{t('usersAdmin.title')}</h2><p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>{t('usersAdmin.count', { count: total })}</p></div>
        </div>
      </div>

      <div className="card-modern mb-3" style={{ padding: 16 }}>
        <div className="d-flex flex-column flex-lg-row gap-2">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input className="input-modern" value={keyword} onChange={(e) => { setPage(0); setKeyword(e.target.value); }} placeholder={t('usersAdmin.keyword')} style={{ paddingLeft: 36 }} />
          </div>
          <select className="input-modern select-modern" value={status} onChange={(e) => { setPage(0); setStatus(e.target.value); }} style={{ maxWidth: 160 }}>{statuses.map((item) => <option key={item || 'all'} value={item}>{item || t('common.all')}</option>)}</select>
          <select className="input-modern select-modern" value={role} onChange={(e) => { setPage(0); setRole(e.target.value); }} style={{ maxWidth: 180 }}>{roles.map((item) => <option key={item || 'all'} value={item}>{item || t('common.all')}</option>)}</select>
          <button className="btn-secondary-modern" disabled={!selected.length} onClick={handleBulkDelete}><Trash2 size={16} />{t('common.deleteSelected')} ({selected.length})</button>
        </div>
      </div>

      {loading ? <div className="d-flex flex-column align-items-center gap-3 py-5"><Spinner color="primary" /></div> : error ? (
        <div className="card-modern" style={{ padding: 24, borderLeft: '4px solid var(--danger)' }}><p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p></div>
      ) : (
        <div className="table-modern-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead><tr><th><input type="checkbox" checked={allSelected} onChange={(e) => setSelected(e.target.checked ? selectableUsers.map((u) => u.id) : [])} /></th><th>ID</th><th>{t('usersAdmin.username')}</th><th>{t('usersAdmin.email')}</th><th>{t('usersAdmin.phone')}</th><th>{t('common.role')}</th><th>{t('common.status')}</th><th>{t('usersAdmin.created')}</th><th>{t('common.actions')}</th></tr></thead>
              <tbody>
                {users.map((user) => {
                  const isAdmin = user.role === 'ROLE_ADMIN' || user.role === 'ADMIN';
                  return (
                    <tr key={user.id}>
                      <td><input type="checkbox" disabled={isAdmin} checked={selected.includes(user.id)} onChange={() => setSelected((prev) => prev.includes(user.id) ? prev.filter((id) => id !== user.id) : [...prev, user.id])} /></td>
                      <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{user.id}</td>
                      <td style={{ fontWeight: 500 }}>{user.username}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.email || '-'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.phone || '-'}</td>
                      <td><span className="badge-modern" style={{ background: isAdmin ? '#FEF2F2' : '#EFF6FF', color: isAdmin ? '#B91C1C' : '#1E40AF' }}>{user.role}</span></td>
                      <td><span className="badge-modern" style={{ background: statusBg[user.status] || '#F1F5F9', color: statusColor[user.status] || '#475569' }}>{user.status}</span></td>
                      <td style={{ color: 'var(--text-secondary)' }}>{user.createDate ? new Date(user.createDate).toLocaleDateString() : '-'}</td>
                      <td><select value={user.status} onChange={(e) => handleStatusChange(user.id, e.target.value)} disabled={isAdmin} className="input-modern select-modern" style={{ minWidth: 120, opacity: isAdmin ? 0.5 : 1 }}>{statuses.filter(Boolean).map((item) => <option key={item} value={item}>{item}</option>)}</select></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center justify-content-between p-3"><span>{total} {t('admin.users')}</span><div className="d-flex gap-2 align-items-center"><button className="btn-secondary-modern" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>{t('common.previous')}</button><span>{page + 1} / {totalPages}</span><button className="btn-secondary-modern" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>{t('common.next')}</button></div></div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
