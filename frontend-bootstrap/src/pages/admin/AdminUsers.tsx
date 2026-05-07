import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge, Input } from 'reactstrap';
import { UserDTO } from '../../types';
import { userService } from '../../services/api';

const statusColors: Record<string, string> = {
  ACTIVE: 'success',
  INACTIVE: 'secondary',
  BANNED: 'danger',
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
      } catch (err) {
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
    } catch (err) {
      setError('Failed to update user status.');
    }
  };

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

  return (
    <Container className="py-4">
      <h2 className="mb-4">Manage Users</h2>

      <div className="table-responsive">
        <Table striped bordered hover size="sm">
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
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email || '-'}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <Badge color={user.role === 'ADMIN' ? 'danger' : 'primary'}>
                    {user.role}
                  </Badge>
                </td>
                <td>
                  <Badge color={statusColors[user.status] || 'secondary'}>
                    {user.status}
                  </Badge>
                </td>
                <td>{new Date(user.createDate).toLocaleDateString()}</td>
                <td>
                  <Input
                    type="select"
                    bsSize="sm"
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    disabled={user.role === 'ADMIN'}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="BANNED">BANNED</option>
                  </Input>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Container>
  );
};

export default AdminUsers;
