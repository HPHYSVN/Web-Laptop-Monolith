import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { ArrowRight, Zap, Shield, Truck } from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import PageWrapper from '../../components/PageWrapper';
import { ProductDTO } from '../../types';
import { productService } from '../../services/api';

const Home: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data.slice(0, 8));
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <PageWrapper>
      {/* Hero */}
      <section
        style={{
          position: 'relative',
          background: 'var(--dark)',
          color: 'white',
          overflow: 'hidden',
          padding: '80px 0 100px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--primary-gradient)',
            opacity: 0.06,
          }}
        />
        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="align-items-center">
            <Col lg={6} className="animate-fade-in-up" style={{ opacity: 0 }}>
              <span
                className="badge-modern badge-primary"
                style={{ marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Zap size={14} />
                Premium Collection 2025
              </span>
              <h1 style={{ fontSize: '3rem', color: 'white', marginBottom: 20, lineHeight: 1.15 }}>
                Find Your Perfect
                <br />
                <span style={{ background: 'var(--primary-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Laptop
                </span>
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: 32, maxWidth: 480 }}>
                Discover top-tier laptops with cutting-edge specs, unbeatable prices, and exceptional customer service.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="btn-primary-modern btn-lg-modern"
                  style={{ textDecoration: 'none', display: 'inline-flex' }}
                >
                  Browse Products
                  <ArrowRight size={20} />
                </Link>
              </div>
            </Col>
            <Col lg={6} className="d-none d-lg-block animate-fade-in" style={{ opacity: 0, animationDelay: '0.2s' }}>
              <div
                style={{
                  width: '100%',
                  height: 380,
                  borderRadius: 'var(--radius-xl)',
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(79,70,229,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop"
                  alt="Laptop showcase"
                  style={{
                    maxWidth: '90%',
                    maxHeight: '90%',
                    objectFit: 'contain',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 0', background: 'var(--bg-white)' }}>
        <Container>
          <Row className="g-4">
            {[
              { icon: Zap, title: 'Latest Technology', desc: 'Cutting-edge processors and GPUs for maximum performance.' },
              { icon: Shield, title: '2-Year Warranty', desc: 'Every laptop comes with comprehensive warranty coverage.' },
              { icon: Truck, title: 'Fast Delivery', desc: 'Free shipping nationwide with real-time tracking.' },
            ].map((f, i) => (
              <Col key={f.title} md={4}>
                <div
                  className="card-modern animate-fade-in-up"
                  style={{ padding: 32, opacity: 0, animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      marginBottom: 16,
                    }}
                  >
                    <f.icon size={22} />
                  </div>
                  <h5 style={{ fontSize: '1.0625rem', marginBottom: 8 }}>{f.title}</h5>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '60px 0' }}>
        <Container>
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h2>Featured Products</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Handpicked selection of our best laptops</p>
            </div>
            <Link
              to="/products"
              className="btn-secondary-modern btn-sm-modern"
              style={{ textDecoration: 'none', display: 'inline-flex' }}
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner color="primary" />
            </div>
          ) : (
            <Row className="g-4">
              {products.map((product, i) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} index={i} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </PageWrapper>
  );
};

export default Home;
