import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'reactstrap';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
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
      } catch {
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
    } catch (err: any) {
      console.error('Delete product error:', err);
      const msg = err.response?.data?.message || err.response?.statusText || 'Failed to delete product.';
      setError(msg + (err.response?.status === 403 ? ' (Forbidden: admin only)' : ''));
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

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <Package size={22} />
          </div>
          <div>
            <h2 style={{ marginBottom: 2 }}>Manage Products</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              {products.length} products in inventory
            </p>
          </div>
        </div>
        <button className="btn-primary-modern" onClick={openCreate}>
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center gap-3 py-5">
          <Spinner color="primary" />
        </div>
      ) : error ? (
        <div className="card-modern" style={{ padding: 24, borderLeft: '4px solid var(--danger)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p>
        </div>
      ) : (
        <div className="table-modern-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Variants</th>
                  <th>Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{product.id}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={product.details?.[0]?.imageDetail || 'https://via.placeholder.com/40'}
                          alt=""
                          style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', background: 'var(--bg)' }}
                        />
                        <span style={{ fontWeight: 500 }}>{product.productName}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-modern badge-primary">{product.categoryName}</span>
                    </td>
                    <td>{product.details?.length || 0}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(product.createDate).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button
                          onClick={() => openEdit(product)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: 'none',
                            background: 'var(--info-bg)',
                            color: 'var(--info)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--info)';
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'var(--info-bg)';
                            e.currentTarget.style.color = 'var(--info)';
                          }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
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
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProductForm
        isOpen={modalOpen}
        toggle={() => setModalOpen(false)}
        product={editingProduct}
        onSuccess={refresh}
      />
    </div>
  );
};

export default AdminProducts;
