import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'reactstrap';
import { Users } from 'lucide-react';
import { UserDTO } from '../../types';
import { userService } from '../../services/api';

const statusBg: Record<string, string> = {
  ACTIVE: '#ECFDF5',
  INACTIVE: '#F1F5F9',
  BANNED: '#FEF2F2',
};

const statusColor: Record<string, string> = {
  ACTIVE: '#047857',
  INACTIVE: '#475569',
  BANNED: '#B91C1C',
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch {
        setError('Failed to load users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await userService.updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
    } catch {
      setError('Failed to update user status.');
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
            <Users size={22} />
          </div>
          <div>
            <h2 style={{ marginBottom: 2 }}>Manage Users</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              {users.length} registered users
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
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{user.id}</td>
                    <td style={{ fontWeight: 500 }}>{user.username}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.email || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{user.phone || '—'}</td>
                    <td>
                      <span
                        className="badge-modern"
                        style={{
                          background: user.role === 'ADMIN' ? '#FEF2F2' : '#EFF6FF',
                          color: user.role === 'ADMIN' ? '#B91C1C' : '#1E40AF',
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className="badge-modern"
                        style={{
                          background: statusBg[user.status] || '#F1F5F9',
                          color: statusColor[user.status] || '#475569',
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {user.createDate ? new Date(user.createDate).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        disabled={user.role === 'ADMIN'}
                        className="input-modern select-modern"
                        style={{
                          paddingRight: 36,
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          cursor: user.role === 'ADMIN' ? 'not-allowed' : 'pointer',
                          opacity: user.role === 'ADMIN' ? 0.5 : 1,
                          minWidth: 120,
                        }}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="BANNED">BANNED</option>
                      </select>
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

export default AdminUsers;
