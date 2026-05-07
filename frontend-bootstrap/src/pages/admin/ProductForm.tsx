import React, { useState, useEffect } from 'react';
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Button, Spinner, Alert, Row, Col,
} from 'reactstrap';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      setError(err.response?.data || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>{product ? 'Edit Product' : 'Add Product'}</ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Product Name</Label>
                <Input name="productName" value={form.productName} onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Category</Label>
                <Input type="select" name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.categoryName}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Description</Label>
            <Input type="textarea" name="productDescription" value={form.productDescription} onChange={handleChange} />
          </FormGroup>
          <h6 className="mt-3">Variant</h6>
          <Row>
            <Col md={3}>
              <FormGroup>
                <Label>Price (VND)</Label>
                <Input type="number" name="price" value={form.price} onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Quantity</Label>
                <Input type="number" name="quantity" value={form.quantity} onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Color</Label>
                <Input name="color" value={form.color} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={3}>
              <FormGroup>
                <Label>Image URL</Label>
                <Input name="imageDetail" value={form.imageDetail} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <h6 className="mt-3">Specifications</h6>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label>CPU</Label>
                <Input type="select" name="cpuId" value={form.cpuId} onChange={handleChange}>
                  <option value="">Select CPU</option>
                  {cpus.map((c) => (
                    <option key={c.id} value={c.id}>{c.model} ({c.brands})</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>RAM</Label>
                <Input type="select" name="ramId" value={form.ramId} onChange={handleChange}>
                  <option value="">Select RAM</option>
                  {rams.map((r) => (
                    <option key={r.id} value={r.id}>{r.size} {r.type}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Storage</Label>
                <Input type="select" name="storageId" value={form.storageId} onChange={handleChange}>
                  <option value="">Select Storage</option>
                  {storages.map((s) => (
                    <option key={s.id} value={s.id}>{s.capacity} {s.type}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>GPU</Label>
                <Input type="select" name="gpuId" value={form.gpuId} onChange={handleChange}>
                  <option value="">Select GPU</option>
                  {gpus.map((g) => (
                    <option key={g.id} value={g.id}>{g.model}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Screen</Label>
                <Input type="select" name="screenId" value={form.screenId} onChange={handleChange}>
                  <option value="">Select Screen</option>
                  {screens.map((s) => (
                    <option key={s.id} value={s.id}>{s.size} {s.resolution}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Battery</Label>
                <Input name="battery" value={form.battery} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>Weight</Label>
                <Input name="weight" value={form.weight} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label>OS</Label>
                <Input name="os" value={form.os} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle} disabled={loading}>Cancel</Button>
          <Button color="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Save'}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ProductForm;
