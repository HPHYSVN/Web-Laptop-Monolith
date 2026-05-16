import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Spinner } from 'reactstrap';
import { Plus, Pencil, Trash2, Package, Upload, Download, Search } from 'lucide-react';
import { ProductDTO } from '../../types';
import { productService } from '../../services/api';
import ProductForm from './ProductForm';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDTO | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProductsPage({
        page,
        size: PAGE_SIZE,
        keyword: keyword || undefined,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        sortBy: 'createDate',
        sortOrder: 'desc',
      });
      setProducts(data.content);
      setTotal(data.totalElements);
      setTotalPages(Math.max(data.totalPages, 1));
      setSelected([]);
      setError('');
    } catch {
      setError(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [page, keyword, minPrice, maxPrice, t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('messages.deleteConfirm'))) return;
    await productService.deleteProduct(id);
    fetchProducts();
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !window.confirm(t('messages.deleteConfirm'))) return;
    await productService.bulkDeleteProducts(selected);
    fetchProducts();
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    await productService.importProducts(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
    fetchProducts();
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    const blob = await productService.exportProducts(format);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const toggleSelected = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
  };

  const allSelected = products.length > 0 && products.every((product) => selected.includes(product.id));

  return (
    <div style={{ padding: '32px 32px 60px' }}>
      <div className="d-flex flex-column flex-xl-row align-items-xl-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Package size={22} />
          </div>
          <div>
            <h2 style={{ marginBottom: 2 }}>{t('productsAdmin.title')}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              {t('productsAdmin.count', { count: total })}
            </p>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn-secondary-modern" onClick={() => fileInputRef.current?.click()}><Upload size={16} />{t('common.import')}</button>
          <button className="btn-secondary-modern" onClick={() => handleExport('csv')}><Download size={16} />{t('common.exportCsv')}</button>
          <button className="btn-secondary-modern" onClick={() => handleExport('xlsx')}><Download size={16} />{t('common.exportXlsx')}</button>
          <button className="btn-primary-modern" onClick={() => { setEditingProduct(null); setModalOpen(true); }}><Plus size={18} />{t('productsAdmin.add')}</button>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx" hidden onChange={(e) => handleImport(e.target.files?.[0])} />
        </div>
      </div>

      <div className="card-modern mb-3" style={{ padding: 16 }}>
        <div className="d-flex flex-column flex-lg-row gap-2">
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: 'var(--text-muted)' }} />
            <input className="input-modern" value={keyword} onChange={(e) => { setPage(0); setKeyword(e.target.value); }} placeholder={t('productsAdmin.keyword')} style={{ paddingLeft: 36 }} />
          </div>
          <input className="input-modern" type="number" value={minPrice} onChange={(e) => { setPage(0); setMinPrice(e.target.value); }} placeholder={t('productsAdmin.minPrice')} style={{ maxWidth: 180 }} />
          <input className="input-modern" type="number" value={maxPrice} onChange={(e) => { setPage(0); setMaxPrice(e.target.value); }} placeholder={t('productsAdmin.maxPrice')} style={{ maxWidth: 180 }} />
          <button className="btn-secondary-modern" disabled={!selected.length} onClick={handleBulkDelete}><Trash2 size={16} />{t('common.deleteSelected')} ({selected.length})</button>
        </div>
      </div>

      {loading ? (
        <div className="d-flex flex-column align-items-center gap-3 py-5"><Spinner color="primary" /></div>
      ) : error ? (
        <div className="card-modern" style={{ padding: 24, borderLeft: '4px solid var(--danger)' }}><p style={{ color: 'var(--danger)', fontWeight: 500, margin: 0 }}>{error}</p></div>
      ) : (
        <div className="table-modern-container">
          <div style={{ overflowX: 'auto' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th><input type="checkbox" checked={allSelected} onChange={(e) => setSelected(e.target.checked ? products.map((p) => p.id) : [])} /></th>
                  <th>ID</th>
                  <th>{t('productsAdmin.product')}</th>
                  <th>{t('productsAdmin.category')}</th>
                  <th>{t('productsAdmin.variants')}</th>
                  <th>{t('productsAdmin.created')}</th>
                  <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td><input type="checkbox" checked={selected.includes(product.id)} onChange={() => toggleSelected(product.id)} /></td>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{product.id}</td>
                    <td><div className="d-flex align-items-center gap-3"><img src={product.details?.[0]?.imageDetail || 'https://via.placeholder.com/40'} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'contain', background: 'var(--bg)' }} /><span style={{ fontWeight: 500, whiteSpace: 'normal' }}>{product.productName}</span></div></td>
                    <td><span className="badge-modern badge-primary">{product.categoryName}</span></td>
                    <td>{product.details?.length || 0}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{new Date(product.createDate).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="d-flex align-items-center justify-content-end gap-2">
                        <button className="btn-secondary-modern" onClick={() => { setEditingProduct(product); setModalOpen(true); }} style={{ width: 36, padding: 0 }}><Pencil size={14} /></button>
                        <button className="btn-secondary-modern" onClick={() => handleDelete(product.id)} style={{ width: 36, padding: 0, color: 'var(--danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center justify-content-between p-3">
            <span style={{ color: 'var(--text-secondary)' }}>{total} {t('admin.products')}</span>
            <div className="d-flex gap-2 align-items-center">
              <button className="btn-secondary-modern" disabled={page === 0} onClick={() => setPage((p) => Math.max(0, p - 1))}>{t('common.previous')}</button>
              <span>{page + 1} / {totalPages}</span>
              <button className="btn-secondary-modern" disabled={page + 1 >= totalPages} onClick={() => setPage((p) => p + 1)}>{t('common.next')}</button>
            </div>
          </div>
        </div>
      )}

      <ProductForm isOpen={modalOpen} toggle={() => setModalOpen(false)} product={editingProduct} onSuccess={fetchProducts} />
    </div>
  );
};

export default AdminProducts;
