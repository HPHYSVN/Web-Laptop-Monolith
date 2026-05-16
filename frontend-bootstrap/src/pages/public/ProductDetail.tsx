import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { ArrowLeft, ShoppingCart, Check, Cpu, HardDrive, Monitor, Battery, Weight, Smartphone, ChevronRight } from 'lucide-react';
import { ProductDTO, ProductDetailDTO } from '../../types';
import { productService } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import PageWrapper from '../../components/PageWrapper';
import { useTranslation } from 'react-i18next';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ProductDetailDTO | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data);
        if (data.details && data.details.length > 0) {
          setSelectedDetail(data.details[0]);
        }
      } catch {
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (selectedDetail && product) {
      addItem({
        id: Date.now(),
        productDetailId: selectedDetail.id,
        productName: product.productName,
        quantity,
        price: selectedDetail.price,
        color: selectedDetail.color,
        image: selectedDetail.imageDetail,
      });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex flex-column align-items-center gap-3 py-5">
        <Spinner color="primary" />
        <p style={{ color: 'var(--text-secondary)' }}>{t('public.loadingProducts')}</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <div className="card-modern" style={{ padding: 32, borderLeft: '4px solid var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error || 'Product not found.'}</p>
        </div>
      </Container>
    );
  }

  const specs = selectedDetail?.specs;
  const specItems = [
    specs?.cpu && { icon: Cpu, label: 'CPU', value: `${specs.cpu.model} (${specs.cpu.brands})` },
    specs?.ram && { icon: Smartphone, label: 'RAM', value: `${specs.ram.size} ${specs.ram.type}` },
    specs?.storage && { icon: HardDrive, label: 'Storage', value: `${specs.storage.capacity} ${specs.storage.type}` },
    specs?.gpu && { icon: Monitor, label: 'GPU', value: specs.gpu.model },
    specs?.screen && { icon: Monitor, label: 'Screen', value: `${specs.screen.size} ${specs.screen.resolution}` },
    specs?.battery && { icon: Battery, label: 'Battery', value: specs.battery },
    specs?.weight && { icon: Weight, label: 'Weight', value: specs.weight },
    specs?.os && { icon: Smartphone, label: 'OS', value: specs.os },
  ].filter(Boolean) as { icon: any; label: string; value: string }[];

  return (
    <PageWrapper>
      <Container style={{ padding: '32px 24px', maxWidth: 'var(--max-width)' }}>
        {/* Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-4" style={{ fontSize: '0.875rem' }}>
          <Link to="/products" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{t('public.products')}</Link>
          <ChevronRight size={14} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{product.productName}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="btn-secondary-modern btn-sm-modern"
          style={{ marginBottom: 24, display: 'inline-flex' }}
        >
          <ArrowLeft size={16} />
          {t('nav.back')}
        </button>

        <Row className="g-4">
          {/* Image */}
          <Col md={5} className="animate-fade-in" style={{ opacity: 0 }}>
            <div
              className="card-modern"
              style={{
                padding: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 400,
              }}
            >
              <img
                src={selectedDetail?.imageDetail || 'https://via.placeholder.com/400?text=Laptop'}
                alt={product.productName}
                style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain' }}
              />
            </div>
            {/* Variant thumbnails */}
            {product.details.length > 1 && (
              <div className="d-flex gap-2 mt-3 flex-wrap">
                {product.details.map((detail) => (
                  <button
                    key={detail.id}
                    onClick={() => setSelectedDetail(detail)}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 'var(--radius-md)',
                      border: selectedDetail?.id === detail.id ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: 0,
                      background: 'var(--bg-white)',
                      transition: 'all var(--transition-fast)',
                      opacity: selectedDetail?.id === detail.id ? 1 : 0.7,
                    }}
                  >
                    <img
                      src={detail.imageDetail || 'https://via.placeholder.com/64'}
                      alt={detail.color}
                      style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }}
                    />
                  </button>
                ))}
              </div>
            )}
          </Col>

          {/* Info */}
          <Col md={7} className="animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge-modern badge-primary">{product.categoryName}</span>
              {selectedDetail && (
                <span className="badge-modern badge-success">{selectedDetail.quantity} in stock</span>
              )}
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>{product.productName}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
              {product.productDescription || t('public.noProducts')}
            </p>

            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--primary)', fontFamily: "'Poppins', sans-serif" }}>
                {selectedDetail ? formatPrice(selectedDetail.price) : 'Contact us'}
              </span>
            </div>

            {/* Variant selector */}
            <div style={{ marginBottom: 24 }}>
              <h6 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: 10 }}>Select Variant</h6>
              <div className="d-flex flex-wrap gap-2">
                {product.details.map((detail) => (
                  <button
                    key={detail.id}
                    onClick={() => setSelectedDetail(detail)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: selectedDetail?.id === detail.id
                        ? '2px solid var(--primary)'
                        : '1.5px solid var(--border)',
                      background: selectedDetail?.id === detail.id ? 'var(--primary-light)' : 'var(--bg-white)',
                      color: selectedDetail?.id === detail.id ? 'var(--primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      fontWeight: selectedDetail?.id === detail.id ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {detail.color} — {formatPrice(detail.price)}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to cart */}
            <div className="d-flex align-items-center gap-3">
              <div
                className="d-flex align-items-center"
                style={{
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: 40,
                    height: 44,
                    border: 'none',
                    background: 'var(--bg-white)',
                    color: 'var(--text-secondary)',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                  }}
                >-</button>
                <input
                  type="number"
                  min={1}
                  max={selectedDetail?.quantity || 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  style={{
                    width: 50,
                    height: 44,
                    border: 'none',
                    textAlign: 'center',
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    background: 'var(--bg-white)',
                    color: 'var(--text-main)',
                  }}
                />
                <button
                  onClick={() => setQuantity(Math.min(selectedDetail?.quantity || 10, quantity + 1))}
                  style={{
                    width: 40,
                    height: 44,
                    border: 'none',
                    background: 'var(--bg-white)',
                    color: 'var(--text-secondary)',
                    fontSize: '1.25rem',
                    cursor: 'pointer',
                  }}
                >+</button>
              </div>
              <button
                className="btn-primary-modern btn-lg-modern"
                disabled={!selectedDetail}
                onClick={handleAddToCart}
                style={{ flex: 1, maxWidth: 280 }}
              >
                {added ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          </Col>
        </Row>

        {/* Specifications */}
        {specItems.length > 0 && (
          <div className="animate-fade-in-up" style={{ marginTop: 48, opacity: 0, animationDelay: '0.2s' }}>
            <h3 style={{ marginBottom: 20 }}>Specifications</h3>
            <Row className="g-3">
              {specItems.map((spec) => (
                <Col key={spec.label} xs={12} sm={6} lg={3}>
                  <div className="card-modern" style={{ padding: 20 }}>
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          background: 'var(--primary-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)',
                          flexShrink: 0,
                        }}
                      >
                        <spec.icon size={18} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {spec.label}
                        </p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)', margin: 0 }}>
                          {spec.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </PageWrapper>
  );
};

export default ProductDetail;
