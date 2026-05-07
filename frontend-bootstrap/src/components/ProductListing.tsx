import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardBody, CardTitle, CardText, CardImg,
  Button, Spinner, Alert, Input, ListGroup, ListGroupItem,
} from 'reactstrap';
import { ProductDTO, CategoryDTO } from '../types';
import { productService, categoryService } from '../services/api';

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
      } catch (err) {
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
      } catch (err) {
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
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const getFirstImage = (product: ProductDTO): string => {
    if (product.details && product.details.length > 0) {
      return product.details[0].imageDetail || 'https://via.placeholder.com/300x200';
    }
    return 'https://via.placeholder.com/300x200';
  };

  const getLowestPrice = (product: ProductDTO): number => {
    if (product.details && product.details.length > 0) {
      return Math.min(...product.details.map((d) => d.price));
    }
    return 0;
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <Spinner color="primary" size="lg" />
          <p className="mt-3">Loading products...</p>
        </div>
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
      <h2 className="mb-4">Products</h2>
      <Row>
        {/* Sidebar */}
        <Col xs={12} lg={2} className="mb-4">
          <h5>Categories</h5>
          <ListGroup flush>
            <ListGroupItem
              active={selectedCategory === null}
              tag="button"
              action
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </ListGroupItem>
            {categories.map((cat) => (
              <ListGroupItem
                key={cat.id}
                active={selectedCategory === cat.id}
                tag="button"
                action
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.categoryName}
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>

        {/* Products Grid */}
        <Col xs={12} lg={10}>
          <Row className="mb-3">
            <Col xs={12} md={8} lg={6}>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </Col>
            <Col xs={12} md="auto" className="mt-2 mt-md-0">
              <Button color="primary" onClick={handleSearch}>
                Search
              </Button>
            </Col>
          </Row>

          {products.length === 0 ? (
            <Alert color="info">No products found.</Alert>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                  <Card className="h-100 product-card">
                    <CardImg
                      top
                      src={getFirstImage(product)}
                      alt={product.productName}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <CardBody className="d-flex flex-column">
                      <CardTitle style={{ fontSize: '1rem', height: '2.5rem' }}>
                        {product.productName}
                      </CardTitle>
                      <CardText className="text-muted small mb-2">
                        {product.categoryName}
                      </CardText>
                      <CardText className="flex-grow-1" style={{ fontSize: '0.875rem' }}>
                        {product.productDescription?.substring(0, 100)}
                        {product.productDescription?.length > 100 && '...'}
                      </CardText>
                      <div className="mt-auto">
                        <h5 className="text-primary mb-3">
                          {formatPrice(getLowestPrice(product))}
                        </h5>
                        <Button
                          color="primary"
                          size="sm"
                          block
                          tag={Link}
                          to={`/products/${product.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListing;
