import React, { useCallback, useState, useEffect } from 'react';
import { Spinner } from 'reactstrap';
import { Plus, Pencil, Trash2, Cpu, HardDrive, Monitor, Zap, Layers } from 'lucide-react';
import { CpuInforDTO, RamInforDTO, GpuInforDTO, ScreenInforDTO, StorageInforDTO } from '../../types';
import { specService } from '../../services/api';
import { useTranslation } from 'react-i18next';

type SpecType = 'cpu' | 'ram' | 'gpu' | 'screen' | 'storage';
const PAGE_SIZE = 10;

const AdminSpecs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SpecType>('cpu');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [pageByTab, setPageByTab] = useState<Record<SpecType, number>>({ cpu: 0, ram: 0, gpu: 0, screen: 0, storage: 0 });
  const { t } = useTranslation();

  const [cpus, setCpus] = useState<CpuInforDTO[]>([]);
  const [rams, setRams] = useState<RamInforDTO[]>([]);
  const [gpus, setGpus] = useState<GpuInforDTO[]>([]);
  const [screens, setScreens] = useState<ScreenInforDTO[]>([]);
  const [storages, setStorages] = useState<StorageInforDTO[]>([]);

  const [form, setForm] = useState<any>({});

  const fetchAllSpecs = useCallback(async () => {
    try {
      setLoading(true);
      const [cpuData, ramData, gpuData, screenData, storageData] = await Promise.all([
        specService.getAllCpus(),
        specService.getAllRams(),
        specService.getAllGpus(),
        specService.getAllScreens(),
        specService.getAllStorages(),
      ]);
      setCpus(cpuData);
      setRams(ramData);
      setGpus(gpuData);
      setScreens(screenData);
      setStorages(storageData);
    } catch {
      setError(t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAllSpecs();
  }, [fetchAllSpecs]);

  const handleDelete = async (type: SpecType, id: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      if (type === 'cpu') await specService.deleteCpu(id);
      else if (type === 'ram') await specService.deleteRam(id);
      else if (type === 'gpu') await specService.deleteGpu(id);
      else if (type === 'screen') await specService.deleteScreen(id);
      else if (type === 'storage') await specService.deleteStorage(id);
      fetchAllSpecs();
    } catch (err: any) {
      setError('Failed to delete item.');
    }
  };

  const openCreate = (type: SpecType) => {
    setEditingItem(null);
    setForm(getEmptyForm(type));
    setActiveTab(type);
    setModalOpen(true);
  };

  const openEdit = (type: SpecType, item: any) => {
    setEditingItem(item);
    setForm({ ...item });
    setActiveTab(type);
    setModalOpen(true);
  };

  const getEmptyForm = (type: SpecType) => {
    switch (type) {
      case 'cpu':
        return { brands: '', speed: '', model: '', cores: 0, threads: 0, baseClock: '', boostClock: '', cache: '' };
      case 'ram':
        return { size: '', type: '', bus: '', slots: 0 };
      case 'gpu':
        return { brand: '', model: '', vram: '' };
      case 'screen':
        return { size: '', resolution: '', panel: '', refreshRate: '', brightness: '' };
      case 'storage':
        return { type: '', capacity: '', interfaceName: '' };
      default:
        return {};
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (activeTab === 'cpu') {
        if (editingItem) await specService.updateCpu(editingItem.id, form);
        else await specService.createCpu(form);
      } else if (activeTab === 'ram') {
        if (editingItem) await specService.updateRam(editingItem.id, form);
        else await specService.createRam(form);
      } else if (activeTab === 'gpu') {
        if (editingItem) await specService.updateGpu(editingItem.id, form);
        else await specService.createGpu(form);
      } else if (activeTab === 'screen') {
        if (editingItem) await specService.updateScreen(editingItem.id, form);
        else await specService.createScreen(form);
      } else if (activeTab === 'storage') {
        if (editingItem) await specService.updateStorage(editingItem.id, form);
        else await specService.createStorage(form);
      }
      setModalOpen(false);
      fetchAllSpecs();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save spec.');
    }
  };

  const renderTable = (type: SpecType, data: any[]) => {
    const page = pageByTab[type] || 0;
    const totalPages = Math.max(Math.ceil(data.length / PAGE_SIZE), 1);
    const pageData = data.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
    const setTabPage = (nextPage: number) => setPageByTab((prev) => ({ ...prev, [type]: nextPage }));

    return (
      <div className="table-modern-container">
        <div style={{ overflowX: 'auto' }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th>ID</th>
                {type === 'cpu' && (
                  <>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Cores</th>
                    <th>Threads</th>
                  </>
                )}
                {type === 'ram' && (
                  <>
                    <th>Size</th>
                    <th>Type</th>
                    <th>Bus</th>
                  </>
                )}
                {type === 'gpu' && (
                  <>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>VRAM</th>
                  </>
                )}
                {type === 'screen' && (
                  <>
                    <th>Size</th>
                    <th>Resolution</th>
                    <th>Panel</th>
                  </>
                )}
                {type === 'storage' && (
                  <>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Interface</th>
                  </>
                )}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', fontWeight: 500 }}>#{item.id}</td>
                  {type === 'cpu' && (
                    <>
                      <td>{item.brands}</td>
                      <td style={{ fontWeight: 500 }}>{item.model}</td>
                      <td>{item.cores}</td>
                      <td>{item.threads}</td>
                    </>
                  )}
                  {type === 'ram' && (
                    <>
                      <td style={{ fontWeight: 500 }}>{item.size}</td>
                      <td>{item.type}</td>
                      <td>{item.bus}</td>
                    </>
                  )}
                  {type === 'gpu' && (
                    <>
                      <td>{item.brand || item.brands}</td>
                      <td style={{ fontWeight: 500 }}>{item.model}</td>
                      <td>{item.vram || item.vRam}</td>
                    </>
                  )}
                  {type === 'screen' && (
                    <>
                      <td style={{ fontWeight: 500 }}>{item.size}</td>
                      <td>{item.resolution}</td>
                      <td>{item.panel}</td>
                    </>
                  )}
                  {type === 'storage' && (
                    <>
                      <td>{item.type}</td>
                      <td style={{ fontWeight: 500 }}>{item.capacity}</td>
                      <td>{item.interfaceName || item.interface}</td>
                    </>
                  )}
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => openEdit(type, item)}
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
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(type, item.id)}
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
                        }}
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
        <div className="d-flex align-items-center justify-content-between p-3">
          <span style={{ color: 'var(--text-secondary)' }}>{data.length} {type.toUpperCase()}</span>
          <div className="d-flex gap-2 align-items-center">
            <button className="btn-secondary-modern" disabled={page === 0} onClick={() => setTabPage(Math.max(0, page - 1))}>{t('common.previous')}</button>
            <span>{page + 1} / {totalPages}</span>
            <button className="btn-secondary-modern" disabled={page + 1 >= totalPages} onClick={() => setTabPage(page + 1)}>{t('common.next')}</button>
          </div>
        </div>
      </div>
    );
  };

  const renderFormFields = () => {
    switch (activeTab) {
      case 'cpu':
        return (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Brand *</label>
              <input name="brands" value={form.brands || ''} onChange={(e) => setForm({ ...form, brands: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Model *</label>
              <input name="model" value={form.model || ''} onChange={(e) => setForm({ ...form, model: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Speed</label>
              <input name="speed" value={form.speed || ''} onChange={(e) => setForm({ ...form, speed: e.target.value })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Cores</label>
              <input name="cores" type="number" value={form.cores || 0} onChange={(e) => setForm({ ...form, cores: parseInt(e.target.value) })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Threads</label>
              <input name="threads" type="number" value={form.threads || 0} onChange={(e) => setForm({ ...form, threads: parseInt(e.target.value) })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Base Clock</label>
              <input name="baseClock" value={form.baseClock || ''} onChange={(e) => setForm({ ...form, baseClock: e.target.value })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Boost Clock</label>
              <input name="boostClock" value={form.boostClock || ''} onChange={(e) => setForm({ ...form, boostClock: e.target.value })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Cache</label>
              <input name="cache" value={form.cache || ''} onChange={(e) => setForm({ ...form, cache: e.target.value })} className="input-modern" />
            </div>
          </>
        );
      case 'ram':
        return (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Size *</label>
              <input name="size" value={form.size || ''} onChange={(e) => setForm({ ...form, size: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Type *</label>
              <input name="type" value={form.type || ''} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Bus</label>
              <input name="bus" value={form.bus || ''} onChange={(e) => setForm({ ...form, bus: e.target.value })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Slots</label>
              <input name="slots" type="number" value={form.slots || 0} onChange={(e) => setForm({ ...form, slots: parseInt(e.target.value) })} className="input-modern" />
            </div>
          </>
        );
      case 'gpu':
        return (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Brand *</label>
              <input name="brand" value={form.brand || form.brands || ''} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Model *</label>
              <input name="model" value={form.model || ''} onChange={(e) => setForm({ ...form, model: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">VRAM</label>
              <input name="vram" value={form.vram || form.vRam || ''} onChange={(e) => setForm({ ...form, vram: e.target.value })} className="input-modern" />
            </div>
          </>
        );
      case 'screen':
        return (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Size *</label>
              <input name="size" value={form.size || ''} onChange={(e) => setForm({ ...form, size: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Resolution *</label>
              <input name="resolution" value={form.resolution || ''} onChange={(e) => setForm({ ...form, resolution: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Panel</label>
              <input name="panel" value={form.panel || ''} onChange={(e) => setForm({ ...form, panel: e.target.value })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Refresh Rate</label>
              <input name="refreshRate" value={form.refreshRate || ''} onChange={(e) => setForm({ ...form, refreshRate: e.target.value })} className="input-modern" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Brightness</label>
              <input name="brightness" value={form.brightness || ''} onChange={(e) => setForm({ ...form, brightness: e.target.value })} className="input-modern" />
            </div>
          </>
        );
      case 'storage':
        return (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Type *</label>
              <input name="type" value={form.type || ''} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Capacity *</label>
              <input name="capacity" value={form.capacity || ''} onChange={(e) => setForm({ ...form, capacity: e.target.value })} className="input-modern" required />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label-modern">Interface</label>
              <input name="interfaceName" value={form.interfaceName || form.interface || ''} onChange={(e) => setForm({ ...form, interfaceName: e.target.value })} className="input-modern" />
            </div>
          </>
        );
      default:
        return null;
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
            <Layers size={22} />
          </div>
          <div>
            <h2 style={{ marginBottom: 2 }}>{t('adminExtra.manageSpecs')}</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.875rem' }}>
              {t('adminExtra.specsSubtitle')}
            </p>
          </div>
        </div>
        <button className="btn-primary-modern" onClick={() => openCreate(activeTab)}>
          <Plus size={18} style={{ marginRight: 8 }} />
          {t('forms.add')} {activeTab.toUpperCase()}
        </button>
      </div>

      {/* Tabs */}
      <div className="d-flex gap-2 mb-4" style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
        {[
          { id: 'cpu' as SpecType, label: 'CPU', icon: Cpu },
          { id: 'ram' as SpecType, label: 'RAM', icon: Zap },
          { id: 'gpu' as SpecType, label: 'GPU', icon: Monitor },
          { id: 'screen' as SpecType, label: 'Screen', icon: Monitor },
          { id: 'storage' as SpecType, label: 'Storage', icon: HardDrive },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: activeTab === tab.id ? 'var(--primary-gradient)' : 'transparent',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab.id ? 600 : 500,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
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
        <>
          {activeTab === 'cpu' && renderTable('cpu', cpus)}
          {activeTab === 'ram' && renderTable('ram', rams)}
          {activeTab === 'gpu' && renderTable('gpu', gpus)}
          {activeTab === 'screen' && renderTable('screen', screens)}
          {activeTab === 'storage' && renderTable('storage', storages)}
        </>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-modern" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '24px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                {editingItem ? `${t('forms.edit')} ${activeTab.toUpperCase()}` : `${t('forms.add')} ${activeTab.toUpperCase()}`}
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
                {renderFormFields()}
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
                  {t('forms.cancel')}
                </button>
                <button
                  type="submit"
                  className="btn-primary-modern"
                  style={{ padding: '10px 24px' }}
                >
                  {editingItem ? t('forms.update') : t('forms.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpecs;
