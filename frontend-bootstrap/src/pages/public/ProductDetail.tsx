import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  Button,
  Spinner,
  Alert,
  Table,
  Badge,
  Input,
} from 'reactstrap';
import { ProductDTO, ProductDetailDTO } from '../../types';
import { productService } from '../../services/api';
import { useCart } from '../../contexts/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<ProductDetailDTO | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(Number(id));
        setProduct(data);
        if (data.details && data.details.length > 0) {
          setSelectedDetail(data.details[0]);
        }
      } catch (err) {
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

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner color="primary" size="lg" />
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert color="danger">{error || 'Product not found.'}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button color="secondary" outline size="sm" className="mb-3" onClick={() => navigate(-1)}>
        Back
      </Button>
      <Row>
        <Col md={5}>
          <Card>
            <img
              src={selectedDetail?.imageDetail || 'https://via.placeholder.com/400'}
              alt={product.productName}
              className="card-img-top"
              style={{ height: '350px', objectFit: 'cover' }}
            />
          </Card>
        </Col>
        <Col md={7}>
          <h2>{product.productName}</h2>
          <p className="text-muted">{product.categoryName}</p>
          <h4 className="text-primary">
            {selectedDetail ? formatPrice(selectedDetail.price) : 'Contact us'}
          </h4>
          <p>{product.productDescription}</p>

          <h5 className="mt-4">Select Variant</h5>
          <div className="d-flex flex-wrap gap-2 mb-4">
            {product.details.map((detail) => (
              <Button
                key={detail.id}
                color={selectedDetail?.id === detail.id ? 'primary' : 'outline-primary'}
                size="sm"
                onClick={() => setSelectedDetail(detail)}
              >
                {detail.color} - {formatPrice(detail.price)}
              </Button>
            ))}
          </div>

          <div className="d-flex align-items-center gap-3 mb-3">
            <Input
              type="number"
              min={1}
              max={selectedDetail?.quantity || 10}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              style={{ width: '80px' }}
            />
            <Button
              color="success"
              size="lg"
              disabled={!selectedDetail}
              onClick={() => {
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
                }
              }}
            >
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>

      {selectedDetail?.specs && (
        <Row className="mt-4">
          <Col>
            <h5>Specifications</h5>
            <Table bordered size="sm">
              <tbody>
                {selectedDetail.specs.cpu && (
                  <tr>
                    <td width="30%"><strong>CPU</strong></td>
                    <td>{selectedDetail.specs.cpu.model} ({selectedDetail.specs.cpu.brands})</td>
                  </tr>
                )}
                {selectedDetail.specs.ram && (
                  <tr>
                    <td><strong>RAM</strong></td>
                    <td>{selectedDetail.specs.ram.size} {selectedDetail.specs.ram.type}</td>
                  </tr>
                )}
                {selectedDetail.specs.storage && (
                  <tr>
                    <td><strong>Storage</strong></td>
                    <td>{selectedDetail.specs.storage.capacity} {selectedDetail.specs.storage.type}</td>
                  </tr>
                )}
                {selectedDetail.specs.gpu && (
                  <tr>
                    <td><strong>GPU</strong></td>
                    <td>{selectedDetail.specs.gpu.model}</td>
                  </tr>
                )}
                {selectedDetail.specs.screen && (
                  <tr>
                    <td><strong>Screen</strong></td>
                    <td>{selectedDetail.specs.screen.size} {selectedDetail.specs.screen.resolution}</td>
                  </tr>
                )}
                {selectedDetail.specs.battery && (
                  <tr>
                    <td><strong>Battery</strong></td>
                    <td>{selectedDetail.specs.battery}</td>
                  </tr>
                )}
                {selectedDetail.specs.weight && (
                  <tr>
                    <td><strong>Weight</strong></td>
                    <td>{selectedDetail.specs.weight}</td>
                  </tr>
                )}
                {selectedDetail.specs.os && (
                  <tr>
                    <td><strong>OS</strong></td>
                    <td>{selectedDetail.specs.os}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetail;
