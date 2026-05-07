import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'reactstrap';
import { ProductDTO } from '../../types';
import { productService } from '../../services/api';
import ProductForm from './ProductForm';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEdit = (product: ProductDTO) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const refresh = async () => {
    const data = await productService.getAllProducts();
    setProducts(data);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner color="primary" size="lg" />
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Products</h2>
        <Button color="primary" onClick={openCreate}>Add Product</Button>
      </div>

      <div className="table-responsive">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Variants</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>
                  <Badge color="secondary">{product.categoryName}</Badge>
                </td>
                <td>{product.details?.length || 0}</td>
                <td>{new Date(product.createDate).toLocaleDateString()}</td>
                <td>
                  <Button color="warning" size="sm" className="me-2" onClick={() => openEdit(product)}>
                    Edit
                  </Button>
                  <Button color="danger" size="sm" onClick={() => handleDelete(product.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <ProductForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        product={editingProduct}
        onSuccess={refresh}
      />
    </Container>
  );
};

export default AdminProducts;
