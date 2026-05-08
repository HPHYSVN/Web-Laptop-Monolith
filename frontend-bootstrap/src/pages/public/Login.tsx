import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { User, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageWrapper from '../../components/PageWrapper';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Login failed. Please try again.');
    }
  };

  return (
    <PageWrapper>
      <Container style={{ padding: '60px 24px', maxWidth: 'var(--max-width)' }}>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <div className="card-modern animate-scale-in" style={{ padding: 40, opacity: 0 }}>
              <div className="text-center mb-4">
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--primary-gradient)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    marginBottom: 16,
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                  }}
                >
                  <LogIn size={24} />
                </div>
                <h3 style={{ marginBottom: 4 }}>Welcome back</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                  Sign in to your account
                </p>
              </div>

              {error && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--danger-bg)',
                    color: 'var(--danger)',
                    fontSize: '0.875rem',
                    marginBottom: 20,
                    fontWeight: 500,
                  }}
                >
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6, color: 'var(--text-main)' }}>
                    Username
                  </label>
                  <div className="input-modern d-flex align-items-center gap-2">
                    <User size={18} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '0.9375rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6, color: 'var(--text-main)' }}>
                    Password
                  </label>
                  <div className="input-modern d-flex align-items-center gap-2">
                    <Lock size={18} color="var(--text-muted)" />
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '0.9375rem' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary-modern btn-lg-modern"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? <Spinner size="sm" color="light" /> : (
                    <>Sign In <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <p className="text-center" style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                  Register
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Login;
