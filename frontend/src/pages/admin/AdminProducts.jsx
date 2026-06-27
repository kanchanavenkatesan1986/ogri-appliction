import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const emptyForm = { name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' };

const AdminProducts = () => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([API.get('/products'), API.get('/categories')]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      addToast('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      imageUrl: product.imageUrl || '',
      categoryId: product.category ? String(product.category.id) : '',
    });
    setShowModal(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity),
      imageUrl: form.imageUrl.trim() || null,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
    };
    try {
      if (editingProduct) {
        await API.put(`/products/${editingProduct.id}`, payload);
        addToast('Product updated successfully!', 'success');
      } else {
        await API.post('/products', payload);
        addToast('Product created successfully!', 'success');
      }
      setShowModal(false);
      await fetchData();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      addToast('Product deleted.', 'info');
      setDeleteConfirm(null);
      await fetchData();
    } catch (err) {
      addToast('Failed to delete product.', 'error');
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#f8faf8', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d2310 0%, #1b5e20 100%)', padding: '2.5rem 0 3rem' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h1 className="fw-bold mb-1" style={{ color: 'white', fontSize: '2rem' }}>
                <i className="bi bi-box-seam me-3" />
                Products
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 0 }}>{products.length} total products</p>
            </div>
            <button
              className="btn fw-semibold px-4"
              style={{ background: '#f9a825', color: '#0d2310', border: 'none', borderRadius: '12px', height: '46px', fontWeight: 700 }}
              onClick={openCreate}
            >
              <i className="bi bi-plus-circle me-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="container mt-2">
        {/* Search */}
        <div className="p-4 rounded-4 mb-4" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
          <div className="position-relative" style={{ maxWidth: '400px' }}>
            <i className="bi bi-search position-absolute" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#aaa', zIndex: 2 }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: '40px', height: '44px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : (
          <div className="rounded-4 overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <div className="table-responsive">
              <table className="table mb-0" style={{ fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: '#f8faf8', borderBottom: '1.5px solid #f0f0f0' }}>
                    {['Image', 'Name', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '1rem 1.25rem', color: '#888', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap', border: 'none' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">No products found.</td>
                    </tr>
                  ) : (
                    filtered.map(product => (
                      <tr key={product.id} style={{ borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafffe'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                          <img
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=80&auto=format&fit=crop&q=70'}
                            alt={product.name}
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px' }}
                            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=80&auto=format&fit=crop&q=70'; }}
                          />
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle', maxWidth: '220px' }}>
                          <div className="fw-semibold text-truncate" style={{ color: '#0d2310' }}>{product.name}</div>
                          <div className="text-truncate" style={{ color: '#aaa', fontSize: '0.75rem' }}>{product.description}</div>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                          {product.category ? (
                            <span className="agri-badge">{product.category.name}</span>
                          ) : (
                            <span style={{ color: '#ccc', fontSize: '0.8rem' }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                          <span className="fw-bold" style={{ color: '#2e7d32' }}>
                            ₹{parseFloat(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                          <span
                            className="badge px-2 py-1"
                            style={{
                              background: product.stockQuantity === 0 ? 'rgba(198,40,40,0.1)' : 'rgba(46,125,50,0.1)',
                              color: product.stockQuantity === 0 ? '#c62828' : '#2e7d32',
                              border: `1px solid ${product.stockQuantity === 0 ? 'rgba(198,40,40,0.2)' : 'rgba(46,125,50,0.2)'}`,
                              borderRadius: '6px',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            }}
                          >
                            {product.stockQuantity === 0 ? 'Out of stock' : `${product.stockQuantity} units`}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', verticalAlign: 'middle' }}>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(21,101,192,0.1)', color: '#1565c0', border: 'none', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => openEdit(product)}
                            >
                              <i className="bi bi-pencil" />
                            </button>
                            <button
                              className="btn btn-sm"
                              style={{ background: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'none', borderRadius: '8px', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              onClick={() => setDeleteConfirm(product)}
                            >
                              <i className="bi bi-trash3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, backdropFilter: 'blur(4px)' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}
        >
          <div
            className="rounded-4 p-4 p-sm-5"
            style={{ background: 'white', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.25)', margin: '1rem' }}
          >
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 className="fw-bold mb-0" style={{ color: '#0d2310' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h4>
              <button className="btn-close" onClick={() => setShowModal(false)} />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Product Name *</label>
                  <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Hybrid Tomato Seeds" style={{ height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0' }} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Description</label>
                  <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe the product..." style={{ borderRadius: '10px', border: '1.5px solid #e0e0e0', resize: 'vertical' }} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Price (₹) *</label>
                  <input type="number" className="form-control" name="price" value={form.price} onChange={handleChange} required min="0" step="0.01" placeholder="0.00" style={{ height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0' }} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Stock Quantity *</label>
                  <input type="number" className="form-control" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} required min="0" placeholder="0" style={{ height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0' }} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Category</label>
                  <select className="form-select" name="categoryId" value={form.categoryId} onChange={handleChange} style={{ height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0', fontSize: '0.9rem' }}>
                    <option value="">— Select category —</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={String(cat.id)}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.875rem', color: '#333' }}>Image URL</label>
                  <input type="url" className="form-control" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." style={{ height: '46px', borderRadius: '10px', border: '1.5px solid #e0e0e0' }} />
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Preview" style={{ marginTop: '0.5rem', height: '80px', width: '80px', objectFit: 'cover', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                  )}
                </div>
                <div className="col-12 d-flex gap-3 mt-2">
                  <button type="button" className="btn flex-grow-1 fw-medium" style={{ height: '46px', borderRadius: '12px', border: '1.5px solid #e0e0e0', color: '#555' }} onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn flex-grow-1 fw-semibold" style={{ height: '46px', borderRadius: '12px', background: 'linear-gradient(135deg, #2e7d32, #388e3c)', color: 'white', border: 'none' }} disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />{editingProduct ? 'Saving...' : 'Creating...'}</> : (editingProduct ? 'Save Changes' : 'Create Product')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2100, backdropFilter: 'blur(4px)' }}
        >
          <div className="rounded-4 p-4 text-center" style={{ background: 'white', maxWidth: '360px', width: '90%', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
            <h5 className="fw-bold mb-2" style={{ color: '#0d2310' }}>Delete Product?</h5>
            <p className="text-muted mb-4" style={{ fontSize: '0.875rem' }}>
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This cannot be undone.
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

export default AdminProducts;
