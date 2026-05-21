import { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';

// ── Constants ──────────────────────────────────────────────────────────────
const ACCOUNTS = [
  { role: 'owner', label: 'Chủ cửa hàng', password: 'canthoaOwner2024' },
  { role: 'staff', label: 'Nhân viên bán hàng', password: 'nhanvien2024' },
];
const OWNER_PHONE = '0903302075';

function fmt(n) { return Number(n).toLocaleString('vi-VN') + ' đ'; }
function todayKey() { return new Date().toISOString().split('T')[0]; }
function catLabel(id) { return CATEGORIES.find(c => c.id === id)?.label || id; }

// ── ImageUpload helper ──────────────────────────────────────────────────────
function ImageUpload({ value, onChange, label = 'Ảnh sản phẩm' }) {
  const fileRef = useRef();

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex gap-2">
        <div
          className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#FFF8F0] cursor-pointer hover:border-[#8B5E3C] transition-colors"
          onClick={() => fileRef.current.click()}
        >
          {value ? (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="w-full flex items-center justify-center gap-1.5 border border-[#8B5E3C] text-[#8B5E3C] rounded-lg py-2 text-xs font-medium hover:bg-[#FEF0DC] transition-colors"
          >
            📷 Chụp / Tải ảnh lên
          </button>
          <input
            type="text"
            value={value?.startsWith('data:') ? '' : (value || '')}
            onChange={e => onChange(e.target.value)}
            placeholder="hoặc dán URL ảnh..."
            className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#8B5E3C]"
          />
          {value && (
            <button type="button" onClick={() => onChange('')}
              className="text-xs text-red-400 hover:text-red-600">
              Xóa ảnh
            </button>
          )}
        </div>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

// ── SystemLogin ─────────────────────────────────────────────────────────────
function SystemLogin({ onLogin }) {
  const [role, setRole] = useState('staff');
  const [name, setName] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const account = ACCOUNTS.find(a => a.role === role);
    if (pw !== account.password) { setError('Sai mật khẩu. Thử lại.'); setPw(''); return; }
    if (role === 'staff' && !name.trim()) { setError('Vui lòng nhập tên nhân viên.'); return; }
    onLogin({ role, name: role === 'owner' ? 'Chị Thoa (Chủ)' : name.trim() });
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
          <h2 className="text-xl font-bold text-gray-800">Đăng nhập hệ thống</h2>
          <p className="text-gray-400 text-sm mt-1">Nội Thất Cần Thoa · {OWNER_PHONE}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNTS.map(a => (
                <button
                  key={a.role}
                  type="button"
                  onClick={() => { setRole(a.role); setError(''); }}
                  className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                    role === a.role
                      ? 'border-[#8B5E3C] bg-[#FEF0DC] text-[#8B5E3C]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {a.role === 'owner' ? '👑 ' : '🧑‍💼 '}{a.label}
                </button>
              ))}
            </div>
          </div>

          {role === 'staff' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhân viên</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError(''); }}
                placeholder="Nhập tên của bạn..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={pw}
                onChange={e => { setPw(e.target.value); setError(''); }}
                placeholder="Nhập mật khẩu..."
                className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] pr-10 ${error ? 'border-red-400' : 'border-gray-200'}`}
              />
              <button type="button" onClick={() => setShow(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show ? '🙈' : '👁️'}
              </button>
            </div>
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

// ── DashboardTab (owner only) ────────────────────────────────────────────────
function DashboardTab() {
  const { state } = useApp();
  const today = todayKey();
  const todaySales = state.sales.filter(s => s.dateKey === today);
  const todayOrders = state.orders.filter(o => o.dateKey === today);

  const revenue = todaySales.reduce((s, x) => s + x.total, 0);
  const profit = todaySales.reduce((s, x) => s + x.profit, 0);
  const transferSales = todaySales.filter(s => s.paymentType === 'transfer');
  const cashSales = todaySales.filter(s => s.paymentType === 'cash');
  const onlineRevenue = todayOrders.reduce((s, o) => s + o.total, 0);

  const byStaff = todaySales.reduce((acc, s) => {
    acc[s.soldBy] = acc[s.soldBy] || { revenue: 0, count: 0 };
    acc[s.soldBy].revenue += s.total;
    acc[s.soldBy].count += 1;
    return acc;
  }, {});

  const productSales = {};
  todaySales.forEach(s => {
    s.items.forEach(item => {
      productSales[item.name] = (productSales[item.name] || 0) + item.qty;
    });
  });
  const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Doanh thu hôm nay', value: fmt(revenue), sub: `${todaySales.length} giao dịch`, color: 'text-green-700', bg: 'bg-green-50', icon: '💰' },
          { label: 'Lợi nhuận hôm nay', value: fmt(profit), sub: revenue > 0 ? `Biên lợi: ${Math.round(profit/revenue*100)}%` : '—', color: 'text-blue-700', bg: 'bg-blue-50', icon: '📈' },
          { label: 'Chuyển khoản', value: fmt(transferSales.reduce((s,x)=>s+x.total,0)), sub: `${transferSales.length} lần CK`, color: 'text-purple-700', bg: 'bg-purple-50', icon: '🏦' },
          { label: 'Đơn online', value: fmt(onlineRevenue), sub: `${todayOrders.length} đơn`, color: 'text-[#8B5E3C]', bg: 'bg-[#FEF0DC]', icon: '🛒' },
        ].map(c => (
          <div key={c.label} className={`${c.bg} rounded-2xl p-4`}>
            <div className="text-xl mb-1">{c.icon}</div>
            <p className={`font-bold text-base ${c.color} truncate`}>{c.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
            <p className="text-xs text-gray-400">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Sales by staff */}
        <div className="bg-white rounded-2xl border border-[#FCDDB8] p-4">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">👥 Doanh số theo nhân viên hôm nay</h3>
          {Object.keys(byStaff).length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có doanh số hôm nay</p>
          ) : (
            <div className="space-y-2">
              {Object.entries(byStaff).map(([name, d]) => (
                <div key={name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{name}</p>
                    <p className="text-xs text-gray-400">{d.count} giao dịch</p>
                  </div>
                  <span className="font-bold text-green-700 text-sm">{fmt(d.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transfers today */}
        <div className="bg-white rounded-2xl border border-[#FCDDB8] p-4">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">🏦 Chuyển khoản hôm nay</h3>
          {transferSales.length === 0 ? (
            <p className="text-gray-400 text-sm">Chưa có chuyển khoản</p>
          ) : (
            <div className="space-y-2">
              {transferSales.map(s => (
                <div key={s.id} className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{s.transferBy || 'Không rõ'}</p>
                    <p className="text-xs text-gray-400">{s.createdAt} · {s.soldBy}</p>
                  </div>
                  <span className="font-bold text-purple-700 text-sm flex-shrink-0">{fmt(s.total)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top products */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#FCDDB8] p-4">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">🏆 Sản phẩm bán nhiều nhất hôm nay</h3>
          <div className="space-y-2">
            {topProducts.map(([name, qty], i) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#FEF0DC] text-[#8B5E3C] text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="flex-1 text-sm text-gray-700 truncate">{name}</span>
                <span className="text-sm font-bold text-gray-500">×{qty}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent sales list */}
      <div>
        <h3 className="font-bold text-gray-700 mb-3 text-sm">📋 Giao dịch hôm nay</h3>
        {todaySales.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm">Chưa có giao dịch nào hôm nay</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySales.map(s => (
              <SaleCard key={s.id} sale={s} isOwner={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── SaleCard ─────────────────────────────────────────────────────────────────
function SaleCard({ sale: s, isOwner }) {
  const [showPhoto, setShowPhoto] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-[#FCDDB8] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#FEF0DC]">
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            s.paymentType === 'transfer' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
          }`}>
            {s.paymentType === 'transfer' ? '🏦 CK' : '💵 TM'}
          </span>
          <span className="text-xs text-gray-500">{s.createdAt}</span>
        </div>
        <div className="flex items-center gap-3">
          {isOwner && (
            <span className="text-xs text-blue-600 font-medium">+{fmt(s.profit)} lời</span>
          )}
          <span className="font-bold text-[#8B5E3C]">{fmt(s.total)}</span>
        </div>
      </div>
      <div className="px-4 py-3 space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>👤 NV: <span className="text-gray-700 font-medium">{s.soldBy}</span></span>
          {s.paymentType === 'transfer' && s.transferBy && (
            <span>· 💳 CK bởi: <span className="text-purple-700 font-medium">{s.transferBy}</span></span>
          )}
        </div>
        <div className="space-y-0.5">
          {s.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600 truncate pr-4">{item.name} ×{item.qty}</span>
              <span className="text-gray-700 font-medium flex-shrink-0">{fmt(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        {s.note && <p className="text-xs text-gray-400 italic">📝 {s.note}</p>}
        {s.photo && (
          <>
            <button onClick={() => setShowPhoto(p => !p)}
              className="text-xs text-blue-500 hover:text-blue-700 font-medium">
              📸 {showPhoto ? 'Ẩn ảnh' : 'Xem ảnh chứng từ'}
            </button>
            {showPhoto && (
              <img src={s.photo} alt="chứng từ" className="mt-1 rounded-xl max-h-48 object-cover w-full" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── SaleFormModal ────────────────────────────────────────────────────────────
function SaleFormModal({ onClose, soldBy }) {
  const { state, addSale } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState({}); // { productId: qty }
  const [paymentType, setPaymentType] = useState('cash');
  const [transferBy, setTransferBy] = useState('');
  const [note, setNote] = useState('');
  const [photo, setPhoto] = useState('');
  const [error, setError] = useState('');
  const photoRef = useRef();

  const filtered = state.products.filter(p =>
    p.stock > 0 && p.name.toLowerCase().includes(search.toLowerCase())
  );

  function setQty(id, qty) {
    if (qty <= 0) {
      setSelected(prev => { const n = { ...prev }; delete n[id]; return n; });
    } else {
      setSelected(prev => ({ ...prev, [id]: qty }));
    }
  }

  const selectedProducts = state.products.filter(p => selected[p.id] > 0);
  const total = selectedProducts.reduce((s, p) => s + p.price * selected[p.id], 0);
  const profit = selectedProducts.reduce((s, p) => s + ((p.price - (p.costPrice || 0)) * selected[p.id]), 0);

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (selectedProducts.length === 0) { setError('Chọn ít nhất 1 sản phẩm'); return; }
    if (paymentType === 'transfer' && !transferBy.trim()) { setError('Nhập tên người chuyển khoản'); return; }
    addSale({
      soldBy,
      items: selectedProducts.map(p => ({
        productId: p.id,
        name: p.name,
        qty: selected[p.id],
        price: p.price,
        costPrice: p.costPrice || 0,
      })),
      total,
      profit,
      paymentType,
      transferBy: transferBy.trim(),
      note: note.trim(),
      photo,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">📝 Ghi nhận bán hàng</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Product selector */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-sm font-semibold text-gray-700 mb-2">Chọn sản phẩm bán</p>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] mb-3"
            />
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filtered.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">Không có sản phẩm</p>
              )}
              {filtered.map(p => {
                const qty = selected[p.id] || 0;
                return (
                  <div key={p.id} className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${qty > 0 ? 'border-[#8B5E3C] bg-[#FEF0DC]' : 'border-gray-100 bg-gray-50'}`}>
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-white" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-[#8B5E3C] font-semibold">{fmt(p.price)}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setQty(p.id, qty - 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-100 flex items-center justify-center"
                      >−</button>
                      <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                      <button
                        onClick={() => setQty(p.id, Math.min(p.stock, qty + 1))}
                        className="w-7 h-7 rounded-lg bg-[#8B5E3C] text-white text-sm font-bold hover:bg-[#6B4229] flex items-center justify-center"
                      >+</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          {selectedProducts.length > 0 && (
            <div className="mx-5 mb-2 bg-[#FEF0DC] rounded-xl p-3 text-sm">
              {selectedProducts.map(p => (
                <div key={p.id} className="flex justify-between text-gray-700">
                  <span className="truncate pr-2">{p.name} ×{selected[p.id]}</span>
                  <span className="font-medium flex-shrink-0">{fmt(p.price * selected[p.id])}</span>
                </div>
              ))}
              <div className="border-t border-[#FCDDB8] mt-2 pt-2 flex justify-between font-bold text-[#8B5E3C]">
                <span>Tổng cộng</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="px-5 pb-3 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Hình thức thanh toán</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'cash', label: '💵 Tiền mặt' },
                  { id: 'transfer', label: '🏦 Chuyển khoản' },
                ].map(pt => (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => setPaymentType(pt.id)}
                    className={`py-2.5 rounded-xl text-sm font-medium border-2 transition-colors ${
                      paymentType === pt.id
                        ? 'border-[#8B5E3C] bg-[#FEF0DC] text-[#8B5E3C]'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {paymentType === 'transfer' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người chuyển khoản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transferBy}
                  onChange={e => { setTransferBy(e.target.value); setError(''); }}
                  placeholder="vd: Nguyễn Văn A - 0901234567"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={2}
                placeholder="Ghi chú thêm..."
                className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] resize-none"
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh chứng từ (tuỳ chọn)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => photoRef.current.click()}
                  className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  📷 {photo ? 'Đổi ảnh' : 'Chụp / Tải ảnh'}
                </button>
                {photo && (
                  <>
                    <img src={photo} alt="preview" className="w-12 h-12 rounded-lg object-cover" />
                    <button type="button" onClick={() => setPhoto('')}
                      className="text-xs text-red-400 hover:text-red-600">Xóa</button>
                  </>
                )}
              </div>
              <input ref={photoRef} type="file" accept="image/*" capture="environment"
                className="hidden" onChange={handlePhoto} />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              Hủy
            </button>
            <button onClick={handleSubmit}
              className="flex-1 bg-[#8B5E3C] text-white py-3 rounded-xl font-semibold hover:bg-[#6B4229] transition-colors text-sm">
              Xác nhận bán · {fmt(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SalesTab ──────────────────────────────────────────────────────────────────
function SalesTab({ isOwner, currentUser }) {
  const { state } = useApp();
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [filter, setFilter] = useState('today');
  const today = todayKey();

  let sales = [...state.sales];
  if (!isOwner) sales = sales.filter(s => s.soldBy === currentUser.name);
  if (filter === 'today') sales = sales.filter(s => s.dateKey === today);

  const totalRevenue = sales.reduce((s, x) => s + x.total, 0);
  const totalProfit = sales.reduce((s, x) => s + x.profit, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {[{ id: 'today', label: 'Hôm nay' }, { id: 'all', label: 'Tất cả' }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f.id ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowSaleForm(true)}
          className="flex items-center gap-1.5 bg-[#8B5E3C] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#6B4229] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Bán hàng
        </button>
      </div>

      {/* Summary */}
      {sales.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs text-gray-500">Doanh thu</p>
            <p className="font-bold text-green-700">{fmt(totalRevenue)}</p>
          </div>
          {isOwner && (
            <div className="bg-blue-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Lợi nhuận</p>
              <p className="font-bold text-blue-700">{fmt(totalProfit)}</p>
            </div>
          )}
        </div>
      )}

      {sales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🛍️</p>
          <p className="font-medium text-sm">Chưa có giao dịch nào</p>
          <button onClick={() => setShowSaleForm(true)}
            className="mt-4 bg-[#8B5E3C] text-white px-5 py-2 rounded-xl text-sm font-medium">
            Ghi nhận ngay
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sales.map(s => <SaleCard key={s.id} sale={s} isOwner={isOwner} />)}
        </div>
      )}

      {showSaleForm && (
        <SaleFormModal onClose={() => setShowSaleForm(false)} soldBy={currentUser.name} />
      )}
    </div>
  );
}

// ── ProductFormModal ──────────────────────────────────────────────────────────
function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(
    product
      ? { ...product, price: String(product.price), costPrice: String(product.costPrice || ''), stock: String(product.stock) }
      : { name: '', category: 'tu', price: '', costPrice: '', description: '', image: '', stock: '' }
  );
  const [errors, setErrors] = useState({});

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập tên';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) errs.price = 'Giá phải là số dương';
    if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) errs.stock = 'Số lượng >= 0';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      ...form,
      price: Number(form.price),
      costPrice: form.costPrice ? Number(form.costPrice) : 0,
      stock: Number(form.stock),
      image: form.image.trim() || `https://picsum.photos/seed/${encodeURIComponent(form.name)}/400/300`,
    });
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  const margin = form.price && form.costPrice && Number(form.price) > 0
    ? Math.round((Number(form.price) - Number(form.costPrice)) / Number(form.price) * 100)
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
            {/* Image upload */}
            <ImageUpload
              value={form.image}
              onChange={v => handleChange('image', v)}
              label="Ảnh sản phẩm"
            />

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
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
                  Số lượng kho <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" min="0"
                  value={form.stock}
                  onChange={e => handleChange('stock', e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${errors.stock ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá bán (đ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number" min="0"
                  value={form.price}
                  onChange={e => handleChange('price', e.target.value)}
                  placeholder="vd: 2500000"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${errors.price ? 'border-red-400' : 'border-gray-200'}`}
                />
                {form.price && !isNaN(Number(form.price)) && Number(form.price) > 0 && (
                  <p className="text-[#8B5E3C] text-xs mt-1">{fmt(form.price)}</p>
                )}
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá vốn (đ)
                  <span className="text-gray-400 font-normal text-xs ml-1">(chỉ chủ thấy)</span>
                </label>
                <input
                  type="number" min="0"
                  value={form.costPrice}
                  onChange={e => handleChange('costPrice', e.target.value)}
                  placeholder="vd: 1500000"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
                />
                {margin !== null && (
                  <p className="text-blue-600 text-xs mt-1">Biên lợi nhuận: {margin}%</p>
                )}
              </div>
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
          </form>
        </div>

        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
              Hủy
            </button>
            <button type="submit" form="product-form"
              className="flex-1 bg-[#8B5E3C] text-white py-2.5 rounded-xl font-semibold hover:bg-[#6B4229] transition-colors text-sm">
              {product ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ProductsTab (owner only) ──────────────────────────────────────────────────
function ProductsTab() {
  const { state, addProduct, updateProduct, deleteProduct } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState('');

  const filtered = state.products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Tìm sản phẩm..."
          className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
        />
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-[#8B5E3C] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#6B4229] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Thêm
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-[#FCDDB8] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#FEF0DC] text-[#6B4229]">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-semibold">Danh mục</th>
              <th className="text-right px-4 py-3 font-semibold">Giá bán</th>
              <th className="text-right px-4 py-3 font-semibold">Giá vốn</th>
              <th className="text-right px-4 py-3 font-semibold text-blue-600">Biên LN</th>
              <th className="text-center px-4 py-3 font-semibold">Kho</th>
              <th className="text-center px-4 py-3 font-semibold w-28">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const margin = p.costPrice > 0
                ? Math.round((p.price - p.costPrice) / p.price * 100)
                : null;
              return (
                <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FFF8F0]'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover bg-[#FEF0DC] flex-shrink-0" />
                      <p className="font-medium text-gray-800 leading-tight">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-[#FEF0DC] text-[#8B5E3C] text-xs px-2 py-0.5 rounded-full font-medium">
                      {catLabel(p.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-[#8B5E3C]">{fmt(p.price)}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{p.costPrice ? fmt(p.costPrice) : '—'}</td>
                  <td className="px-4 py-3 text-right">
                    {margin !== null ? (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${margin >= 30 ? 'bg-green-100 text-green-700' : margin >= 15 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                        {margin}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.stock === 0 ? 'bg-red-100 text-red-600' : p.stock <= 5 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setEditProduct(p)}
                        className="text-blue-600 hover:bg-blue-50 px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1">
                        ✏️ Sửa
                      </button>
                      <button
                        onClick={() => deleteConfirm === p.id ? deleteProduct(p.id) : setDeleteConfirm(p.id)}
                        className={`p-1.5 rounded-lg transition-colors ${deleteConfirm === p.id ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-50'}`}
                        title={deleteConfirm === p.id ? 'Nhấn lần nữa để xác nhận' : 'Xóa'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      {deleteConfirm === p.id && (
                        <button onClick={() => setDeleteConfirm(null)}
                          className="text-gray-400 text-xs px-1.5 py-1.5 hover:bg-gray-50 rounded-lg">
                          Hủy
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {filtered.map(p => {
          const margin = p.costPrice > 0
            ? Math.round((p.price - p.costPrice) / p.price * 100)
            : null;
          return (
            <div key={p.id} className="bg-white rounded-xl border border-[#FCDDB8] p-3 flex gap-3">
              <img src={p.image} alt={p.name}
                className="w-16 h-16 rounded-xl object-cover bg-[#FEF0DC] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 leading-tight mb-0.5">{p.name}</p>
                <p className="text-[#8B5E3C] font-bold text-sm">{fmt(p.price)}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-gray-400 text-xs">Vốn: {p.costPrice ? fmt(p.costPrice) : '—'}</p>
                  {margin !== null && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${margin >= 30 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      LN {margin}%
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs">{catLabel(p.category)} · Kho: {p.stock}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => setEditProduct(p)}
                  className="text-blue-600 px-2 py-1.5 hover:bg-blue-50 rounded-lg text-xs font-medium">✏️ Sửa</button>
                <button
                  onClick={() => deleteConfirm === p.id ? deleteProduct(p.id) : setDeleteConfirm(p.id)}
                  className={`p-1.5 rounded-lg ${deleteConfirm === p.id ? 'bg-red-500 text-white' : 'text-red-400 hover:bg-red-50'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <ProductFormModal
          product={null}
          onSave={(data) => { addProduct(data); setShowAddModal(false); }}
          onClose={() => setShowAddModal(false)}
        />
      )}
      {editProduct && (
        <ProductFormModal
          product={editProduct}
          onSave={(data) => { updateProduct(data); setEditProduct(null); }}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
}

// ── OrdersTab ─────────────────────────────────────────────────────────────────
function OrdersTab() {
  const { state } = useApp();

  if (state.orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <span className="text-5xl block mb-4">📦</span>
        <p className="font-medium">Chưa có đơn online nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {state.orders.map(order => (
        <div key={order.id} className="bg-white rounded-2xl border border-[#FCDDB8] overflow-hidden shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 bg-[#FEF0DC]">
            <div>
              <span className="font-mono text-sm font-bold text-[#8B5E3C]">#{String(order.id).slice(-6)}</span>
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
                <p className="font-semibold">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Địa chỉ</p>
                <p className="text-gray-700 text-xs leading-relaxed">{order.customer.address}</p>
              </div>
            </div>
            {order.customer.note && (
              <p className="text-gray-400 text-xs mt-2 italic">Ghi chú: {order.customer.note}</p>
            )}
          </div>
          <div className="px-5 py-3">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 truncate pr-4">{item.name} ×{item.qty}</span>
                <span className="text-gray-800 font-medium">{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
              <span className="text-sm font-bold">Tổng cộng</span>
              <span className="font-bold text-[#8B5E3C]">{fmt(order.total)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AdminPanel (main) ─────────────────────────────────────────────────────────
export default function AdminPanel() {
  const { state, loginUser, logoutUser } = useApp();
  const { currentUser } = state;
  const isOwner = currentUser?.role === 'owner';

  const [activeTab, setActiveTab] = useState(isOwner ? 'dashboard' : 'sales');

  if (!currentUser) {
    return <SystemLogin onLogin={loginUser} />;
  }

  const ownerTabs = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'sales', label: '🛍️ Doanh số' },
    { id: 'products', label: '📦 Sản phẩm' },
    { id: 'orders', label: '🛒 Đơn online' },
  ];
  const staffTabs = [
    { id: 'sales', label: '🛍️ Bán hàng' },
  ];
  const tabs = isOwner ? ownerTabs : staffTabs;

  const todaySales = state.sales.filter(s => s.dateKey === todayKey());
  const todayMySales = todaySales.filter(s => s.soldBy === currentUser?.name);
  const todayRevenue = (isOwner ? todaySales : todayMySales).reduce((s, x) => s + x.total, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            {isOwner ? '👑 Quản trị cửa hàng' : '🧑‍💼 Bán hàng'}
          </h1>
          <p className="text-gray-500 text-sm">
            Nội Thất Cần Thoa · {OWNER_PHONE} · Xin chào, <span className="font-medium text-[#8B5E3C]">{currentUser.name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {todayRevenue > 0 && (
            <span className="hidden sm:block text-xs bg-green-50 text-green-700 px-3 py-1.5 rounded-xl font-medium">
              Hôm nay: {fmt(todayRevenue)}
            </span>
          )}
          <button
            onClick={logoutUser}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 border border-gray-200 hover:border-red-300 px-3 py-2 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </div>
      </div>

      {/* Owner stats overview */}
      {isOwner && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Sản phẩm', value: state.products.length, color: 'text-[#8B5E3C]', bg: 'bg-[#FEF0DC]' },
            { label: 'Đơn online', value: state.orders.length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Doanh thu hôm nay', value: fmt(todayRevenue), color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Hết hàng', value: state.products.filter(p => p.stock === 0).length, color: 'text-red-600', bg: 'bg-red-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-2xl p-4`}>
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={`font-bold text-base ${stat.color} truncate`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-[#FCDDB8] rounded-xl p-1 mb-6 overflow-x-auto scrollbar-hide w-fit max-w-full">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'bg-[#8B5E3C] text-white shadow-sm' : 'text-gray-600 hover:bg-[#FFF8F0]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'dashboard' && isOwner && <DashboardTab />}
      {activeTab === 'sales' && <SalesTab isOwner={isOwner} currentUser={currentUser} />}
      {activeTab === 'products' && isOwner && <ProductsTab />}
      {activeTab === 'orders' && isOwner && <OrdersTab />}
    </div>
  );
}
