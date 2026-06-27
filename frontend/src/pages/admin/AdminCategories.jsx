import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminCategories = () => {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await API.get('/categories');
      setCategories(res.data);
    } catch (err) {
      addToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await API.post('/categories', { name: form.name.trim(), description: form.description.trim() });
      addToast('Category created!', 'success');
      setForm({ name: '', description: '' });
      setShowModal(false);
      await fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create category.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/categories/${id}`);
      addToast('Category deleted.', 'info');
      setDeleteConfirm(null);
      await fetchCategories();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete category.', 'error');
    }
  };

  const categoryIcons = ['bi-flower2', 'bi-tree', 'bi-droplet', 'bi-wrench', 'bi-leaf', 'bi-bug', 'bi-water', 'bi-basket'];

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-1" style={{ color: 'white', fontSize: '2rem' }}>
                <i className="bi bi-tags me-3" />
                Categories
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>{categories.length} categories</p>
            </div>
            <button
              className="btn fw-semibold px-4"
              style={{ background: '#f9a825', color: '#0d2310', border: 'none', borderRadius: '12px', height: '46px', fontWeight: 700 }}
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus-circle me-2" />
              Add Category
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-2">
        {loading ? (
          <LoadingSpinner message="Loading categories..." />
        ) : (
          <div className="row g-3 mt-0">
            {categories.length === 0 ? (
              <div className="col-12 text-center py-5">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏷️</div>
                <h5 className="fw-semibold text-muted">No categories yet</h5>
                <p className="text-muted">Click "Add Category" to create the first one.</p>
              </div>
            ) : (
              categories.map((cat, idx) => (
                <div key={cat.id} className="col-sm-6 col-md-4 col-lg-3">
                  <div
                    className="p-4 rounded-4 h-100"
                    style={{
                      background: 'white',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = 'rgba(46,125,50,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = 'transparent'; }}
                  >
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center mb-3"
                      style={{ width: '52px', height: '52px', background: 'rgba(46,125,50,0.08)' }}
                    >
                      <i className={`bi ${categoryIcons[idx % categoryIcons.length]}`} style={{ color: '#2e7d32', fontSize: '1.5rem' }} />
                    </div>

                    <h6 className="fw-bold mb-1" style={{ color: '#0d2310' }}>{cat.name}</h6>
                    <p className="mb-3" style={{ color: '#888', fontSize: '0.8rem', lineHeight: '1.5' }}>
                      {cat.description || 'No description provided.'}
                    </p>

                    <button
                      className="btn btn-sm w-100"
                      style={{ background: 'rgba(198,40,40,0.07)', color: '#c62828', border: '1px solid rgba(198,40,40,0.15)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}
                      onClick={() => setDeleteConfirm(cat)}
                    >
                      <i className="bi bi-trash3 me-1" />
                      Delete Category
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="rounded-4 p-4 p-sm-5"
            style={{ background: 'white', width: '100%', maxWidth: '460px', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', margin: '1rem' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 className="fw-bold mb-0" style={{ color: '#0d2310' }}>Add Category</h4>
              <button className="btn-close" onClick={() => setShowModal(false)} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Category Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Seeds, Fertilizers, Tools..."
                  autoFocus
                  style={{ height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Description</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Brief description of this category..."
                  style={{ borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem', resize: 'vertical' }}
                />
              </div>
              <div className="d-flex gap-3">
                <button type="button" className="btn flex-grow-1 fw-medium" style={{ height: '46px', borderRadius: '12px', border: '1.5px solid #e0e0e0', color: '#555' }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn flex-grow-1 fw-semibold" style={{ height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', border: 'none' }} disabled={saving}>
                  {saving ? <><span className="spinner-border spinner-border-sm me-2" />Creating...</> : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2100, backdropFilter: 'blur(4px)' }}
        >
          <div className="rounded-4 p-4 text-center" style={{ background: 'white', maxWidth: '360px', width: '90%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
            <h5 className="fw-bold mb-2" style={{ color: '#0d2310' }}>Delete Category?</h5>
            <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>
              Delete <strong>"{deleteConfirm.name}"</strong>? This may affect products assigned to it.
            </p>
            <div className="d-flex gap-3">
              <button className="btn flex-grow-1 fw-medium" style={{ height: '44px', borderRadius: '10px', border: '1.5px solid #e0e0e0' }} onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn flex-grow-1 fw-semibold" style={{ height: '44px', borderRadius: '10px', background: '#c62828', color: 'white', border: 'none' }} onClick={() => handleDelete(deleteConfirm.id)}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
