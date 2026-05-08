import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'reactstrap';
import { Plus, Pencil, Trash2, Folder } from 'lucide-react';
import { CategoryDTO } from '../../types';
import { categoryService } from '../../services/api';

const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);

  const [form, setForm] = useState({
    categoryName: '',
    categoryDescription: '',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAllCategories();
        setCategories(data);
      } catch {
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      console.error('Delete category error:', err);
      const msg = err.response?.data?.message || err.response?.statusText || 'Failed to delete category.';
      setError(msg + (err.response?.status === 403 ? ' (Forbidden: admin only)' : ''));
    }
  };

  const openCreate = () => {
    setEditingCategory(null);
    setForm({
      categoryName: '',
      categoryDescription: '',
    });
    setModalOpen(true);
  };

  const openEdit = (category: CategoryDTO) => {
    setEditingCategory(category);
    setForm({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription || '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingCategory) {
        const updated = await categoryService.updateCategory(editingCategory.id as number, form);
        setCategories((prev) => prev.map((c) => (c.id === editingCategory.id ? updated : c)));
      } else {
        const created = await categoryService.createCategory(form);
        setCategories((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Failed to save category.');
    }
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
            <Folder size={22} />
          </div>
          <div>
            <h2 style={{ marginBottom: 2 }}>Manage Categories</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              {categories.length} categories available
            </p>
          </div>
        </div>
        <button className="btn-primary-modern" onClick={openCreate}>
          <Plus size={18} style={{ marginRight: 8 }} />
          Add Category
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
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{category.id}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{category.categoryName}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {category.categoryDescription || '—'}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => openEdit(category)}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            border: 'none',
                            background: 'var(--primary-light)',
                            color: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id as number)}
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
                            transition: 'all 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--danger)'; e.currentTarget.style.color = 'white'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--danger-bg)'; e.currentTarget.style.color = 'var(--danger)'; }}
                        >
                          <Trash2 size={16} />
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

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h4>
              <button
                onClick={() => setModalOpen(false)}
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
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ padding: 20 }}>
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

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={form.categoryName}
                    onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
                    className="input-modern"
                    required
                  />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: 6, color: 'var(--text-main)' }}>
                    Description
                  </label>
                  <textarea
                    value={form.categoryDescription}
                    onChange={(e) => setForm({ ...form, categoryDescription: e.target.value })}
                    className="input-modern"
                    rows={3}
                  />
                </div>
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
                  onClick={() => setModalOpen(false)}
                  style={{ padding: '10px 20px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-modern"
                  style={{ padding: '10px 24px' }}
                >
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
