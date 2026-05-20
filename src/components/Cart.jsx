import { useApp } from '../context/AppContext';

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' đ';
}

function CartItem({ item }) {
  const { removeFromCart, updateCartQty } = useApp();

  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg bg-[#FEF0DC] flex-shrink-0"
        onError={e => { e.target.src = `https://picsum.photos/seed/${item.id}/400/300`; }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 mb-1">
          {item.name}
        </p>
        <p className="text-[#8B5E3C] text-sm font-bold mb-2">
          {formatPrice(item.price)}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => updateCartQty(item.id, item.qty - 1)}
            className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
          >
            −
          </button>
          <span className="text-sm font-semibold w-5 text-center">{item.qty}</span>
          <button
            onClick={() => updateCartQty(item.id, item.qty + 1)}
            className="w-6 h-6 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
          >
            +
          </button>
          <button
            onClick={() => removeFromCart(item.id)}
            className="ml-auto text-red-400 hover:text-red-600 transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  const { state, closeCart, openOrder, clearCart } = useApp();
  const { cart, isCartOpen } = state;

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 transition-opacity"
          onClick={closeCart}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-[#8B5E3C]">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-white font-bold text-base">
              Giỏ hàng
              {totalItems > 0 && (
                <span className="ml-2 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={closeCart}
            className="text-white/80 hover:text-white p-1 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <span className="text-5xl mb-4">🛒</span>
              <p className="text-gray-500 font-medium">Giỏ hàng trống</p>
              <p className="text-gray-400 text-sm mt-1">Thêm sản phẩm yêu thích vào giỏ nhé!</p>
              <button
                onClick={closeCart}
                className="mt-4 text-[#8B5E3C] text-sm font-semibold hover:underline"
              >
                Tiếp tục mua sắm →
              </button>
            </div>
          ) : (
            <div className="pt-2">
              {cart.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4 border-t border-gray-100 bg-[#FFF8F0]">
            <div className="flex justify-between items-center mb-1 text-sm text-gray-500">
              <span>{totalItems} sản phẩm</span>
              <span>Phí vận chuyển: miễn phí</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-gray-800 text-base">Tổng cộng</span>
              <span className="font-bold text-[#8B5E3C] text-xl">{formatPrice(total)}</span>
            </div>
            <button
              onClick={() => { closeCart(); openOrder(); }}
              className="w-full bg-[#8B5E3C] text-white py-3 rounded-xl font-semibold hover:bg-[#6B4229] transition-colors text-sm"
            >
              Đặt hàng ngay
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 text-gray-500 text-xs hover:text-red-500 transition-colors py-1"
            >
              Xóa tất cả
            </button>
          </div>
        )}
      </div>
    </>
  );
}
