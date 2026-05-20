import { useApp } from '../context/AppContext';

export default function OrderSuccess() {
  const { state, closeOrderSuccess, setView } = useApp();

  if (!state.isOrderSuccess) return null;

  const lastOrder = state.orders[0];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={closeOrderSuccess}
    >
      <div
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Success icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed">
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ qua số điện thoại{' '}
          <span className="font-semibold text-[#8B5E3C]">{lastOrder?.customer?.phone}</span> để xác nhận đơn hàng sớm nhất.
        </p>

        {lastOrder && (
          <div className="bg-[#FFF8F0] rounded-xl p-3 mb-5 text-left">
            <p className="text-xs text-gray-500 mb-1">Mã đơn hàng: <span className="font-mono font-semibold text-gray-700">#{lastOrder.id}</span></p>
            <p className="text-xs text-gray-500 mb-1">Tổng tiền: <span className="font-semibold text-[#8B5E3C]">{lastOrder.total.toLocaleString('vi-VN')} đ</span></p>
            <p className="text-xs text-gray-500">Địa chỉ: <span className="text-gray-700">{lastOrder.customer?.address}</span></p>
          </div>
        )}

        <button
          onClick={() => { closeOrderSuccess(); setView('home'); }}
          className="w-full bg-[#8B5E3C] text-white py-3 rounded-xl font-semibold hover:bg-[#6B4229] transition-colors text-sm"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}
