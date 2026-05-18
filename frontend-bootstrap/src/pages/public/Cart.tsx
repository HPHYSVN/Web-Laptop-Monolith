import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { ShoppingBag, Trash2, Minus, Plus, ArrowRight, PackageOpen } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import PageWrapper from '../../components/PageWrapper';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/api';
import { toast } from 'react-toastify';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [receiverName, setReceiverName] = useState(user?.username || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleCartAction = async (action: Promise<void>) => {
    try {
      await action;
    } catch (err: any) {
      toast.error(err.response?.data || 'Không thể cập nhật giỏ hàng');
    }
  };

  const handleCheckout = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAuthenticated || !user) {
      toast.info('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    setCheckingOut(true);
    try {
      const order = await orderService.checkout({
        userId: user.id,
        receiverName: receiverName.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });
      await clearCart();
      toast.success(`Đặt hàng thành công #${order.id}`);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data || 'Không thể đặt hàng');
    } finally {
      setCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <PageWrapper>
        <Container style={{ padding: '60px 24px', maxWidth: 'var(--max-width)' }}>
          <div className="d-flex flex-column align-items-center text-center py-5">
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 'var(--radius-xl)',
                background: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                marginBottom: 24,
              }}
            >
              <PackageOpen size={36} />
            </div>
            <h2 style={{ marginBottom: 8 }}>{t('public.cartEmpty')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
              {t('public.cartEmptyDesc')}
            </p>
            <Link
              to="/products"
              className="btn-primary-modern"
              style={{ textDecoration: 'none', display: 'inline-flex' }}
            >
              <ShoppingBag size={18} />
              {t('public.continueShopping')}
            </Link>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container style={{ padding: '40px 24px', maxWidth: 'var(--max-width)' }}>
        <h2 style={{ marginBottom: 4 }}>{t('public.shoppingCart')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32 }}>
          {totalItems} {t('public.productsCount')}
        </p>

        <Row className="g-4">
          <Col lg={8}>
            <div className="d-flex flex-column gap-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="card-modern animate-fade-in-up"
                  style={{ padding: 20, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', opacity: 0 }}
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/80?text=Laptop'}
                    alt={item.productName}
                    style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 'var(--radius-md)', background: 'var(--bg)' }}
                  />
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h6 style={{ fontWeight: 600, marginBottom: 4, fontSize: '1rem' }}>{item.productName}</h6>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                      {t('public.color')}: <span style={{ fontWeight: 500, color: 'var(--text-main)' }}>{item.color}</span>
                    </p>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: 12, flexWrap: 'wrap' }}>
                    <div
                      className="d-flex align-items-center"
                      style={{
                        border: '1.5px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                      }}
                    >
                      <button
                        onClick={() => handleCartAction(updateQuantity(item.id, item.quantity - 1))}
                        style={{
                          width: 36,
                          height: 36,
                          border: 'none',
                          background: 'var(--bg-white)',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span
                        style={{
                          width: 40,
                          textAlign: 'center',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          color: 'var(--text-main)',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleCartAction(updateQuantity(item.id, item.quantity + 1))}
                        style={{
                          width: 36,
                          height: 36,
                          border: 'none',
                          background: 'var(--bg-white)',
                          color: 'var(--text-secondary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 100 }}>
                      <p style={{ fontWeight: 700, color: 'var(--primary)', margin: 0, fontSize: '1rem' }}>
                        {formatPrice(item.price * item.quantity)}
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>
                        {formatPrice(item.price)} {t('public.each')}
                      </p>
                    </div>
                    <button
                      onClick={() => handleCartAction(removeItem(item.id))}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: 'var(--danger-bg)',
                        color: 'var(--danger)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--danger)';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'var(--danger-bg)';
                        e.currentTarget.style.color = 'var(--danger)';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleCartAction(clearCart())}
              style={{
                marginTop: 16,
                background: 'transparent',
                border: 'none',
                color: 'var(--danger)',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Trash2 size={16} />
              {t('public.clearCart')}
            </button>
          </Col>

          <Col lg={4}>
            <div className="card-modern" style={{ padding: 24, position: 'sticky', top: 'calc(var(--navbar-height) + 24px)' }}>
              <h5 style={{ marginBottom: 20 }}>{t('public.orderSummary')}</h5>
              <div className="d-flex flex-column gap-3" style={{ marginBottom: 20 }}>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{t('public.subtotal')}</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatPrice(totalPrice)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{t('public.shipping')}</span>
                  <span className="badge-modern badge-success">{t('public.free')}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }} className="d-flex justify-content-between">
                  <span style={{ fontWeight: 600, fontSize: '1.0625rem' }}>{t('common.total')}</span>
                  <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)', fontFamily: "'Poppins', sans-serif" }}>
                    {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
              <form onSubmit={handleCheckout} className="d-flex flex-column gap-3">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                    {t('ordersAdmin.receiver')}
                  </label>
                  <input
                    className="input-modern"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    required
                    placeholder="Nguyen Van A"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                    {t('usersAdmin.phone')}
                  </label>
                  <input
                    className="input-modern"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9+\-\s]{8,15}"
                    placeholder="0900000000"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6 }}>
                    {t('ordersAdmin.address')}
                  </label>
                  <textarea
                    className="input-modern"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="So nha, duong, quan/huyen, tinh/thanh"
                    style={{ resize: 'vertical' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary-modern btn-lg-modern"
                  disabled={checkingOut}
                  style={{ width: '100%' }}
                >
                  {checkingOut ? t('common.loading') : t('public.checkout')}
                  <ArrowRight size={18} />
                </button>
              </form>
              <Link
                to="/products"
                className="btn-secondary-modern"
                style={{ width: '100%', marginTop: 12, textDecoration: 'none', display: 'inline-flex' }}
              >
                {t('public.continueShopping')}
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default Cart;
