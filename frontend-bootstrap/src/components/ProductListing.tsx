import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Container, Row, Col, Spinner, Alert,
} from 'reactstrap';
import { ProductDTO, CategoryDTO } from '../types';
import { productService, categoryService } from '../services/api';
import ProductCard from './ProductCard';
import PageWrapper from './PageWrapper';

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch {
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchByCategory = async () => {
      if (!selectedCategory) {
        const data = await productService.getAllProducts();
        setProducts(data);
        return;
      }
      try {
        setLoading(true);
        const data = await productService.getProductsByCategory(selectedCategory);
        setProducts(data);
      } catch {
        setError('Failed to fetch products.');
      } finally {
        setLoading(false);
      }
    };

    fetchByCategory();
  }, [selectedCategory]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      const data = await productService.getAllProducts();
      setProducts(data);
      return;
    }
    try {
      setLoading(true);
      const data = await productService.searchProducts(searchTerm);
      setProducts(data);
    } catch {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container style={{ padding: '40px 24px', maxWidth: 'var(--max-width)' }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2>Products</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {products.length} {products.length === 1 ? 'product' : 'products'} available
            </p>
          </div>
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: 400, width: '100%' }}>
            <div className="search-bar-modern" style={{ flex: 1 }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search laptops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input-modern"
                style={{ border: 'none', padding: 0, boxShadow: 'none', background: 'transparent' }}
              />
            </div>
            <button className="btn-primary-modern btn-sm-modern" onClick={handleSearch}>
              <Search size={16} />
            </button>
          </div>
        </div>

        <Row>
          {/* Sidebar */}
          <Col xs={12} lg={2} className="mb-4">
            <div
              className="card-modern"
              style={{ padding: 20, position: 'sticky', top: 'calc(var(--navbar-height) + 24px)' }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <SlidersHorizontal size={18} color="var(--primary)" />
                <h6 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>Categories</h6>
              </div>
              <div className="d-flex flex-column gap-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    background: selectedCategory === null ? 'var(--primary-gradient)' : 'transparent',
                    color: selectedCategory === null ? 'white' : 'var(--text-secondary)',
                    fontSize: '0.875rem',
                    fontWeight: selectedCategory === null ? 600 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: selectedCategory === null ? 'var(--shadow-md)' : 'none',
                  }}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: selectedCategory === cat.id ? 'var(--primary-gradient)' : 'transparent',
                      color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      fontWeight: selectedCategory === cat.id ? 600 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      boxShadow: selectedCategory === cat.id ? 'var(--shadow-md)' : 'none',
                    }}
                  >
                    {cat.categoryName}
                  </button>
                ))}
              </div>
            </div>
          </Col>

          {/* Products Grid */}
          <Col xs={12} lg={10}>
            {loading ? (
              <div className="d-flex flex-column align-items-center gap-3 py-5">
                <Spinner color="primary" />
                <p style={{ color: 'var(--text-secondary)' }}>Loading products...</p>
              </div>
            ) : error ? (
              <div
                className="card-modern"
                style={{ padding: 32, textAlign: 'center', borderLeft: '4px solid var(--danger)' }}
              >
                <p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="card-modern" style={{ padding: 48, textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>No products found.</p>
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
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default ProductListing;
