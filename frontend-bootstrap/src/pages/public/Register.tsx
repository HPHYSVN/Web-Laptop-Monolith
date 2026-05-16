import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { User, Lock, Mail, Phone, UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import PageWrapper from '../../components/PageWrapper';
import { useTranslation } from 'react-i18next';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(username, password, email || undefined, phone || undefined);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
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
                  <UserPlus size={24} />
                </div>
                <h3 style={{ marginBottom: 4 }}>{t('public.createAccount')}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                  {t('public.registerCopy')}
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
              {success && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--success-bg)',
                    color: '#047857',
                    fontSize: '0.875rem',
                    marginBottom: 20,
                    fontWeight: 500,
                  }}
                >
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('public.username')} *
                  </label>
                  <div className="input-modern d-flex align-items-center gap-2">
                    <User size={18} color="var(--text-muted)" />
                    <input
                      type="text"
                      placeholder={t('public.enterUsername')}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '0.9375rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('public.password')} *
                  </label>
                  <div className="input-modern d-flex align-items-center gap-2">
                    <Lock size={18} color="var(--text-muted)" />
                    <input
                      type="password"
                      placeholder={t('public.enterPassword')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '0.9375rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('public.email')}
                  </label>
                  <div className="input-modern d-flex align-items-center gap-2">
                    <Mail size={18} color="var(--text-muted)" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ border: 'none', background: 'transparent', outline: 'none', flex: 1, fontSize: '0.9375rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: 6, color: 'var(--text-main)' }}>
                    {t('public.phone')}
                  </label>
                  <div className="input-modern d-flex align-items-center gap-2">
                    <Phone size={18} color="var(--text-muted)" />
                    <input
                      type="tel"
                      placeholder="+84 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                    <>{t('public.createAccount')} <ArrowRight size={18} /></>
                  )}
                </button>
              </form>

              <p className="text-center" style={{ marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {t('public.alreadyAccount')}{' '}
                <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
                  {t('public.signIn')}
                </Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Register;
