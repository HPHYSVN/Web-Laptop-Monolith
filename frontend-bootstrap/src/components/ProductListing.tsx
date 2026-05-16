import React, { useCallback, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { ProductDTO, CategoryDTO } from '../types';
import { productService, categoryService } from '../services/api';
import ProductCard from './ProductCard';
import PageWrapper from './PageWrapper';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 12;

const ProductListing: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<string>('price');
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const { t } = useTranslation();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getProductsPage({
        page,
        size: PAGE_SIZE,
        keyword: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
        sortBy,
        sortOrder,
      });
      setProducts(data.content);
      setTotal(data.totalElements);
      setTotalPages(Math.max(data.totalPages, 1));
      setError('');
    } catch {
      setError(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm, selectedCategory, minPrice, maxPrice, sortBy, sortOrder, t]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch {
        setError(t('messages.loadError'));
      }
    };

    fetchData();
  }, [t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearch = async () => {
    setPage(0);
    await fetchProducts();
  };

  const handleReset = () => {
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategory(null);
    setSortBy('price');
    setSortOrder('asc');
    setPage(0);
  };

  return (
    <PageWrapper>
      <Container style={{ padding: '40px 24px', maxWidth: 'var(--max-width)' }}>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
          <div>
            <h2>{t('public.products')}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {total} {total === 1 ? t('public.product') : t('public.productsCount')} {t('public.available')}
            </p>
          </div>
          <div className="d-flex align-items-center gap-2" style={{ maxWidth: 400, width: '100%' }}>
            <div className="search-bar-modern" style={{ flex: 1 }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder={t('public.search')}
                value={searchTerm}
                onChange={(e) => { setPage(0); setSearchTerm(e.target.value); }}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input-modern"
                style={{ border: 'none', padding: 0, boxShadow: 'none', background: 'transparent' }}
              />
            </div>
            <button className="btn-primary-modern btn-sm-modern" onClick={handleSearch}>
              <Search size={16} />
            </button>
            <button className="btn-secondary-modern btn-sm-modern" onClick={handleReset}>
              <X size={16} />
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
                <h6 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600 }}>{t('public.filters')}</h6>
              </div>
              
              {/* Price Filter */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-main)' }}>
                  {t('public.priceRange')}
                </label>
                <div className="d-flex gap-2 align-items-center">
                  <input
                    type="number"
                    placeholder={t('public.min')}
                    value={minPrice}
                    onChange={(e) => { setPage(0); setMinPrice(e.target.value); }}
                    className="input-modern"
                    style={{ fontSize: '0.8125rem', padding: '8px 12px' }}
                  />
                  <span style={{ color: 'var(--text-muted)' }}>-</span>
                  <input
                    type="number"
                    placeholder={t('public.max')}
                    value={maxPrice}
                    onChange={(e) => { setPage(0); setMaxPrice(e.target.value); }}
                    className="input-modern"
                    style={{ fontSize: '0.8125rem', padding: '8px 12px' }}
                  />
                </div>
              </div>

              {/* Sort */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-main)' }}>
                  {t('public.sortBy')}
                </label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [sort, order] = e.target.value.split('-');
                    setPage(0);
                    setSortBy(sort);
                    setSortOrder(order);
                  }}
                  className="input-modern select-modern"
                  style={{ fontSize: '0.8125rem', padding: '8px 12px' }}
                >
                  <option value="price-asc">Giá: thấp đến cao</option>
                  <option value="price-desc">Giá: cao đến thấp</option>
                  <option value="discount-asc">Khuyến mãi: thấp đến cao</option>
                  <option value="discount-desc">Khuyến mãi: cao đến thấp</option>
                </select>
              </div>

              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-main)' }}>
                  {t('productsAdmin.category')}
                </label>
                <div className="d-flex flex-column gap-1">
                  <button
                    onClick={() => { setPage(0); setSelectedCategory(null); }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: selectedCategory === null ? 'var(--primary-gradient)' : 'transparent',
                      color: selectedCategory === null ? 'white' : 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      fontWeight: selectedCategory === null ? 600 : 500,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      boxShadow: selectedCategory === null ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    {t('public.allCategories')}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setPage(0); setSelectedCategory(cat.id as number); }}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        background: selectedCategory === cat.id ? 'var(--primary-gradient)' : 'transparent',
                        color: selectedCategory === cat.id ? 'white' : 'var(--text-secondary)',
                        fontSize: '0.8125rem',
                        fontWeight: selectedCategory === cat.id ? 600 : 500,
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)',
                        boxShadow: selectedCategory === cat.id ? 'var(--shadow-sm)' : 'none',
                      }}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Col>

          {/* Products Grid */}
          <Col xs={12} lg={10}>
            {loading ? (
              <div className="d-flex flex-column align-items-center gap-3 py-5">
                <Spinner color="primary" />
                <p style={{ color: 'var(--text-secondary)' }}>{t('public.loadingProducts')}</p>
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
                <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('public.noProducts')}</p>
              </div>
            ) : (
              <>
                <Row className="g-4">
                  {products.map((product, i) => (
                    <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                      <ProductCard product={product} index={i} />
                    </Col>
                  ))}
                </Row>
                <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
                  <button className="btn-secondary-modern" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>{t('common.previous')}</button>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{page + 1} / {totalPages}</span>
                  <button className="btn-secondary-modern" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>{t('common.next')}</button>
                </div>
              </>
            )}
          </Col>
        </Row>
      </Container>
    </PageWrapper>
  );
};

export default ProductListing;
