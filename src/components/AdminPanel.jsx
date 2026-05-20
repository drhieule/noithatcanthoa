import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';

const ADMIN_PASSWORD = 'admin123';

function formatPrice(price) {
  return Number(price).toLocaleString('vi-VN') + ' đ';
}

// ---- Login ----
function AdminLogin({ onLogin }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError('Mật khẩu không đúng. Thử lại.');
      setPw('');
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#FEF0DC] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Đăng nhập Admin</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý sản phẩm và đơn hàng</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(''); }}
              placeholder="Nhập mật khẩu..."
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${
                error ? 'border-red-400' : 'border-gray-200'
              }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-[#8B5E3C] text-white py-2.5 rounded-xl font-semibold hover:bg-[#6B4229] transition-colors text-sm"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

// ---- Product Form Modal ----
function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(
    product
      ? { ...product, price: String(product.price), stock: String(product.stock) }
      : { name: '', category: 'tu', price: '', description: '', image: '', stock: '' }
  );
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập tên sản phẩm';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      errs.price = 'Giá phải là số dương';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
      errs.stock = 'Số lượng phải là số >= 0';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image.trim() || `https://picsum.photos/seed/${form.name}/400/300`,
    });
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => handleChange('name', e.target.value)}
                className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={e => handleChange('category', e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={e => handleChange('stock', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${errors.stock ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={e => handleChange('price', e.target.value)}
                placeholder="vd: 2500000"
                className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${errors.price ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              {form.price && !isNaN(Number(form.price)) && Number(form.price) > 0 && (
                <p className="text-[#8B5E3C] text-xs mt-1">{formatPrice(form.price)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea
                value={form.description}
                onChange={e => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL hình ảnh <span className="text-gray-400 font-normal">(để trống để dùng ảnh mặc định)</span>
              </label>
              <input
                type="text"
                value={form.image}
                onChange={e => handleChange('image', e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>
          </form>
        </div>
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="product-form"
              className="flex-1 bg-[#8B5E3C] text-white py-2.5 rounded-xl font-semibold hover:bg-[#6B4229] transition-colors text-sm"
            >
              {product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Products Tab ----
function ProductsTab() {
  const { state, addProduct, updateProduct, deleteProduct } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  function startEdit(product) {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
    });
    setEditErrors({});
    setDeleteConfirm(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm({});
    setEditErrors({});
  }

  function saveEdit(product) {
    const errs = {};
    if (!editForm.name.trim()) errs.name = true;
    if (!editForm.price || isNaN(Number(editForm.price)) || Number(editForm.price) <= 0) errs.price = true;
    if (Object.keys(errs).length > 0) { setEditErrors(errs); return; }

    updateProduct({
      ...product,
      name: editForm.name.trim(),
      category: editForm.category,
      price: Number(editForm.price),
      stock: Math.max(0, Number(editForm.stock) || 0),
    });
    setEditingId(null);
    setEditForm({});
  }

  function handleDelete(id) {
    if (deleteConfirm === id) {
      deleteProduct(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setEditingId(null);
    }
  }

  const catLabel = (id) => CATEGORIES.find(c => c.id === id)?.label || id;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{state.products.length} sản phẩm</p>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-[#8B5E3C] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#6B4229] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      {/* Table - desktop */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-[#FCDDB8] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FEF0DC] text-[#6B4229]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-semibold">Danh mục</th>
              <th className="text-right px-4 py-3 font-semibold">Giá (đ)</th>
              <th className="text-center px-4 py-3 font-semibold">Kho</th>
              <th className="text-center px-4 py-3 font-semibold w-32">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {state.products.map((p, i) => (
              editingId === p.id ? (
                /* ---- Inline edit row ---- */
                <tr key={p.id} className="bg-[#FEF0DC]">
                  <td className="px-3 py-2">
                    <input
                      value={editForm.name}
                      onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                      className={`w-full px-2 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${editErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Tên sản phẩm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={editForm.category}
                      onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] bg-white"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={editForm.price}
                      onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                      className={`w-full px-2 py-1.5 border rounded-lg text-sm text-right focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${editErrors.price ? 'border-red-400' : 'border-gray-300'}`}
                      placeholder="Giá"
                    />
                    {editForm.price && !isNaN(Number(editForm.price)) && Number(editForm.price) > 0 && (
                      <p className="text-[#8B5E3C] text-xs mt-0.5 text-right">{formatPrice(editForm.price)}</p>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={editForm.stock}
                      onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
                      className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] mx-auto block"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => saveEdit(p)}
                        className="flex items-center gap-1 bg-[#8B5E3C] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#6B4229] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Lưu
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-2 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors"
                      >
                        Hủy
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                /* ---- Normal display row ---- */
                <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FFF8F0]'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-[#FEF0DC] flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-800 leading-tight">{p.name}</p>
                        <p className="text-gray-400 text-xs line-clamp-1 max-w-xs">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[#FEF0DC] text-[#8B5E3C] text-xs px-2 py-0.5 rounded-full font-medium">
                      {catLabel(p.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#8B5E3C]">
                    {formatPrice(p.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.stock === 0 ? 'bg-red-100 text-red-600' :
                      p.stock <= 5 ? 'bg-orange-100 text-orange-600' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => startEdit(p)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 px-2.5 py-1.5 hover:bg-blue-50 rounded-lg transition-colors text-xs font-medium"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          deleteConfirm === p.id
                            ? 'bg-red-500 text-white'
                            : 'text-red-400 hover:text-red-600 hover:bg-red-50'
                        }`}
                        title={deleteConfirm === p.id ? 'Nhấn lần nữa để xác nhận xóa' : 'Xóa'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {deleteConfirm === p.id && (
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-50 rounded-lg text-xs"
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - mobile */}
      <div className="md:hidden space-y-3">
        {state.products.map(p => (
          editingId === p.id ? (
            /* ---- Inline edit card (mobile) ---- */
            <div key={p.id} className="bg-[#FEF0DC] rounded-xl border border-[#8B5E3C]/30 p-3 space-y-2">
              <p className="text-xs font-semibold text-[#6B4229] mb-1">Đang sửa sản phẩm</p>
              <input
                value={editForm.name}
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${editErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                placeholder="Tên sản phẩm"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editForm.category}
                  onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  value={editForm.stock}
                  onChange={e => setEditForm(f => ({ ...f, stock: e.target.value }))}
                  placeholder="Kho"
                  className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  value={editForm.price}
                  onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="Giá (VND)"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${editErrors.price ? 'border-red-400' : 'border-gray-300'}`}
                />
                {editForm.price && !isNaN(Number(editForm.price)) && Number(editForm.price) > 0 && (
                  <p className="text-[#8B5E3C] text-xs mt-0.5">{formatPrice(editForm.price)}</p>
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => saveEdit(p)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#8B5E3C] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#6B4229] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Lưu
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-white transition-colors"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            /* ---- Normal card (mobile) ---- */
            <div key={p.id} className="bg-white rounded-xl border border-[#FCDDB8] p-3 flex gap-3">
              <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover bg-[#FEF0DC] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 leading-tight mb-0.5">{p.name}</p>
                <p className="text-[#8B5E3C] font-bold text-sm">{formatPrice(p.price)}</p>
                <p className="text-gray-400 text-xs">{catLabel(p.category)} · Kho: {p.stock}</p>
              </div>
              <div className="flex flex-col gap-1 ml-auto">
                <button
                  onClick={() => startEdit(p)}
                  className="flex items-center gap-1 text-blue-600 px-2 py-1.5 hover:bg-blue-50 rounded-lg text-xs font-medium"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className={`p-1.5 rounded-lg ${deleteConfirm === p.id ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-50'}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          )
        ))}
      </div>

      {showAddModal && (
        <ProductFormModal
          product={null}
          onSave={(data) => { addProduct(data); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

// ---- Orders Tab ----
function OrdersTab() {
  const { state } = useApp();

  if (state.orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <span className="text-5xl block mb-4">📦</span>
        <p className="font-medium">Chưa có đơn hàng nào</p>
        <p className="text-sm mt-1">Đơn hàng sẽ xuất hiện ở đây khi khách đặt.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state.orders.map(order => (
        <div key={order.id} className="bg-white rounded-2xl border border-[#FCDDB8] overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-[#FEF0DC]">
            <div>
              <span className="font-mono text-sm font-bold text-[#8B5E3C]">#{order.id}</span>
              <span className="text-gray-500 text-xs ml-3">{order.createdAt}</span>
            </div>
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
              {order.status}
            </span>
          </div>

          <div className="px-5 py-3 border-b border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Khách hàng</p>
                <p className="font-semibold text-gray-800">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Điện thoại</p>
                <p className="font-semibold text-gray-800">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Địa chỉ</p>
                <p className="text-gray-700 text-xs leading-relaxed">{order.customer.address}</p>
              </div>
            </div>
            {order.customer.note && (
              <p className="text-gray-500 text-xs mt-2 italic">Ghi chú: {order.customer.note}</p>
            )}
          </div>

          <div className="px-5 py-3">
            <div className="space-y-1.5 mb-3">
              {order.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 flex-1 truncate pr-4">
                    {item.name} <span className="text-gray-400">×{item.qty}</span>
                  </span>
                  <span className="text-gray-800 font-medium flex-shrink-0">
                    {formatPrice(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-700">Tổng cộng</span>
              <span className="font-bold text-[#8B5E3C] text-base">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---- AdminPanel (main) ----
export default function AdminPanel() {
  const { state, loginAdmin, logoutAdmin } = useApp();
  const [activeTab, setActiveTab] = useState('products');

  if (!state.isAdminLoggedIn) {
    return <AdminLogin onLogin={loginAdmin} />;
  }

  const tabs = [
    { id: 'products', label: 'Sản phẩm', count: state.products.length },
    { id: 'orders', label: 'Đơn hàng', count: state.orders.length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Admin header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Quản trị Admin</h1>
          <p className="text-gray-500 text-sm">Nội Thất Cần Thoa</p>
        </div>
        <button
          onClick={logoutAdmin}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-3 py-2 rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Sản phẩm', value: state.products.length, color: 'text-[#8B5E3C]', bg: 'bg-[#FEF0DC]' },
          { label: 'Đơn hàng', value: state.orders.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          {
            label: 'Doanh thu',
            value: state.orders.reduce((s, o) => s + o.total, 0).toLocaleString('vi-VN') + ' đ',
            color: 'text-green-600', bg: 'bg-green-50'
          },
          {
            label: 'Hết hàng',
            value: state.products.filter(p => p.stock === 0).length,
            color: 'text-red-600', bg: 'bg-red-50'
          },
        ].map(stat => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <p className={`font-bold text-lg ${stat.color} truncate`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#FCDDB8] rounded-xl p-1 mb-6 w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-[#8B5E3C] text-white shadow-sm'
                : 'text-gray-600 hover:bg-[#FFF8F0]'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'products' ? <ProductsTab /> : <OrdersTab />}
    </div>
  );
}
