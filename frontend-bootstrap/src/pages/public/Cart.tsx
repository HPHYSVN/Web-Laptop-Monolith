import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, CardBody, Button, Alert,
  Table, Input, InputGroup, InputGroupText,
} from 'reactstrap';
import { useCart } from '../../contexts/CartContext';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <h2 className="mb-4">Shopping Cart</h2>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Card>
              <CardBody>
                <p className="text-muted">Your cart is currently empty.</p>
                <Button color="primary" tag={Link} to="/products">
                  Continue Shopping
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Shopping Cart ({totalItems} items)</h2>
      <Row>
        <Col lg={8}>
          <Table responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Color</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={item.image || 'https://via.placeholder.com/60'}
                        alt={item.productName}
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                        className="me-3 rounded"
                      />
                      <span>{item.productName}</span>
                    </div>
                  </td>
                  <td>{item.color}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <InputGroup size="sm" style={{ width: 120 }}>
                      <Button
                        color="outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        readOnly
                        className="text-center"
                      />
                      <Button
                        color="outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </InputGroup>
                  </td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                  <td>
                    <Button color="danger" size="sm" onClick={() => removeItem(item.id)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button color="link" className="text-danger" onClick={clearCart}>
            Clear Cart
          </Button>
        </Col>
        <Col lg={4}>
          <Card>
            <CardBody>
              <h5>Order Summary</h5>
              <hr />
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
              <Button color="success" block>
                Proceed to Checkout
              </Button>
              <Button color="secondary" outline block className="mt-2" tag={Link} to="/products">
                Continue Shopping
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
