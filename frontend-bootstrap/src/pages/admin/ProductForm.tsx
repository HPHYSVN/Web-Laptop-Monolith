import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'reactstrap';
import { X } from 'lucide-react';
import { CategoryDTO, ProductDTO } from '../../types';
import { categoryService, specService, productService } from '../../services/api';

interface ProductFormProps {
  isOpen: boolean;
  toggle: () => void;
  product?: ProductDTO | null;
  onSuccess: () => void;
}

const emptyForm = {
  productName: '',
  productDescription: '',
  categoryId: '',
  quantity: 0,
  price: 0,
  color: '',
  imageDetail: '',
  cpuId: '',
  ramId: '',
  storageId: '',
  gpuId: '',
  screenId: '',
  battery: '',
  weight: '',
  os: '',
};

const ProductForm: React.FC<ProductFormProps> = ({ isOpen, toggle, product, onSuccess }) => {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [cpus, setCpus] = useState([] as any[]);
  const [rams, setRams] = useState([] as any[]);
  const [gpus, setGpus] = useState([] as any[]);
  const [screens, setScreens] = useState([] as any[]);
  const [storages, setStorages] = useState([] as any[]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const fetchData = async () => {
      try {
        const [catData, cpuData, ramData, gpuData, scrData, stoData] = await Promise.all([
          categoryService.getAllCategories(),
          specService.getAllCpus(),
          specService.getAllRams(),
          specService.getAllGpus(),
          specService.getAllScreens(),
          specService.getAllStorages(),
        ]);
        setCategories(catData);
        setCpus(cpuData);
        setRams(ramData);
        setGpus(gpuData);
        setScreens(scrData);
        setStorages(stoData);
      } catch {
        setError('Failed to load form data');
      }
    };
    fetchData();
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      const d = product.details?.[0];
      const s = d?.specs;
      const matchedCat = categories.find((c) => c.categoryName === product.categoryName);
      setForm({
        productName: product.productName,
        productDescription: product.productDescription || '',
        categoryId: matchedCat ? String(matchedCat.id) : '',
        quantity: d?.quantity ?? 0,
        price: d?.price ?? 0,
        color: d?.color ?? '',
        imageDetail: d?.imageDetail ?? '',
        cpuId: s?.cpu?.id ? String(s.cpu.id) : '',
        ramId: s?.ram?.id ? String(s.ram.id) : '',
        storageId: s?.storage?.id ? String(s.storage.id) : '',
        gpuId: s?.gpu?.id ? String(s.gpu.id) : '',
        screenId: s?.screen?.id ? String(s.screen.id) : '',
        battery: s?.battery ?? '',
        weight: s?.weight ?? '',
        os: s?.os ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setError('');
  }, [product, isOpen, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'quantity' || name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      productName: form.productName,
      productDescription: form.productDescription,
      categoryId: Number(form.categoryId),
      details: [
        {
          quantity: form.quantity,
          price: form.price,
          color: form.color,
          imageDetail: form.imageDetail,
          specs: {
            cpuId: form.cpuId ? Number(form.cpuId) : null,
            ramId: form.ramId ? Number(form.ramId) : null,
            storageId: form.storageId ? Number(form.storageId) : null,
            gpuId: form.gpuId ? Number(form.gpuId) : null,
            screenId: form.screenId ? Number(form.screenId) : null,
            battery: form.battery,
            weight: form.weight,
            os: form.os,
          },
        },
      ],
    };

    try {
      if (product) {
        await productService.updateProduct(product.id, payload);
      } else {
        await productService.createProduct(payload);
      }
      onSuccess();
      toggle();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formField = (label: string, name: string, type: string = 'text', required: boolean = false) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      <input
        name={name}
        type={type}
        value={form[name as keyof typeof form]}
        onChange={handleChange}
        required={required}
        className="input-modern"
      />
    </div>
  );

  const selectField = (label: string, name: string, options: any[], optionLabel: (o: any) => string, required: boolean = false) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
        {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
      </label>
      <select
        name={name}
        value={form[name as keyof typeof form]}
        onChange={handleChange}
        required={required}
        className="input-modern select-modern"
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{optionLabel(o)}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={toggle}>
      <div className="modal-modern" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
            {product ? 'Edit Product' : 'Add Product'}
          </h4>
          <button
            onClick={toggle}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: 'none',
              background: 'var(--bg)',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-light)'; e.currentTarget.style.color = 'var(--text-main)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ padding: 20, maxHeight: 'calc(90vh - 140px)', overflowY: 'auto' }}>
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--danger-bg)',
                  color: 'var(--danger)',
                  fontSize: '0.875rem',
                  marginBottom: 16,
                  fontWeight: 500,
                }}
              >
                {error}
              </div>
            )}

            <Row>
              <Col md={6}>{formField('Product Name', 'productName', 'text', true)}</Col>
              <Col md={6}>{selectField('Category', 'categoryId', categories, (c) => c.categoryName, true)}</Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                Description
              </label>
              <textarea
                name="productDescription"
                value={form.productDescription}
                onChange={handleChange}
                className="input-modern"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <h6 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '24px 0 12px', color: 'var(--text-main)' }}>
              Variant
            </h6>
            <Row>
              <Col md={3}>{formField('Price (VND)', 'price', 'number', true)}</Col>
              <Col md={3}>{formField('Quantity', 'quantity', 'number', true)}</Col>
              <Col md={3}>{formField('Color', 'color')}</Col>
              <Col md={3}>{formField('Image URL', 'imageDetail')}</Col>
            </Row>

            <h6 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: '24px 0 12px', color: 'var(--text-main)' }}>
              Specifications
            </h6>
            <Row>
              <Col md={4}>{selectField('CPU', 'cpuId', cpus, (c) => `${c.model} (${c.brands})`)}</Col>
              <Col md={4}>{selectField('RAM', 'ramId', rams, (r) => `${r.size} ${r.type}`)}</Col>
              <Col md={4}>{selectField('Storage', 'storageId', storages, (s) => `${s.capacity} ${s.type}`)}</Col>
              <Col md={4}>{selectField('GPU', 'gpuId', gpus, (g) => g.model)}</Col>
              <Col md={4}>{selectField('Screen', 'screenId', screens, (s) => `${s.size} ${s.resolution}`)}</Col>
              <Col md={4}>{formField('Battery', 'battery')}</Col>
              <Col md={4}>{formField('Weight', 'weight')}</Col>
              <Col md={4}>{formField('OS', 'os')}</Col>
            </Row>
          </div>

          <div
            style={{
              padding: '16px 24px 24px',
              borderTop: '1px solid var(--border-light)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 12,
            }}
          >
            <button
              type="button"
              className="btn-secondary-modern"
              onClick={toggle}
              disabled={loading}
              style={{ padding: '10px 20px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary-modern"
              disabled={loading}
              style={{ padding: '10px 24px' }}
            >
              {loading ? <Spinner size="sm" color="light" /> : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
