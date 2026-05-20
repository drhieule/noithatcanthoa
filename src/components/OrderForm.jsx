import { useState } from 'react';
import { useApp } from '../context/AppContext';

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' đ';
}

export default function OrderForm() {
  const { state, closeOrder, placeOrder } = useApp();
  const { cart, isOrderOpen } = state;

  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
    note: '',
  });
  const [errors, setErrors] = useState({});

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0[35789]\d{8}|0[1-9]\d{8,9})$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Số điện thoại không hợp lệ';
    if (!form.address.trim()) errs.address = 'Vui lòng nhập địa chỉ giao hàng';
    return errs;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    placeOrder(form);
    setForm({ name: '', phone: '', address: '', note: '' });
    setErrors({});
  }

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  }

  if (!isOrderOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={closeOrder}
      >
        <div
          className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg">Xác nhận đặt hàng</h2>
            <button
              onClick={closeOrder}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Order summary */}
            <div className="px-5 py-3 bg-[#FFF8F0] border-b border-[#FCDDB8]">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Đơn hàng của bạn</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700 flex-1 truncate pr-2">
                      {item.name}
                      <span className="text-gray-400 ml-1">×{item.qty}</span>
                    </span>
                    <span className="text-[#8B5E3C] font-semibold flex-shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-[#FCDDB8]">
                <span className="font-bold text-gray-800 text-sm">Tổng cộng</span>
                <span className="font-bold text-[#8B5E3C] text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Form */}
            <form id="order-form" onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${
                    errors.name ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="0912 345 678"
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] ${
                    errors.phone ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ giao hàng <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  rows={2}
                  className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] resize-none ${
                    errors.address ? 'border-red-400' : 'border-gray-200'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú <span className="text-gray-400 font-normal">(tùy chọn)</span>
                </label>
                <textarea
                  value={form.note}
                  onChange={e => handleChange('note', e.target.value)}
                  placeholder="Ghi chú thêm cho đơn hàng..."
                  rows={2}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] resize-none"
                />
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-gray-100 bg-white">
            <p className="text-xs text-gray-400 mb-3 text-center">
              Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút
            </p>
            <button
              type="submit"
              form="order-form"
              className="w-full bg-[#8B5E3C] text-white py-3 rounded-xl font-semibold hover:bg-[#6B4229] transition-colors text-sm"
            >
              Xác nhận đặt hàng · {formatPrice(total)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
