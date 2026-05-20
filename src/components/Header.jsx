import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';

export default function Header() {
  const { state, setView, openCart, setCategory } = useApp();

  const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    { label: 'Trang chủ', view: 'home' },
    { label: 'Sản phẩm', view: 'products' },
    { label: 'Admin', view: 'admin' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2 group"
          >
            <span className="text-2xl">🪵</span>
            <div className="text-left">
              <div className="text-base sm:text-lg font-bold text-[#8B5E3C] leading-tight group-hover:text-[#6B4229] transition-colors">
                Nội Thất Cần Thoa
              </div>
              <div className="text-[10px] text-gray-400 leading-tight hidden sm:block">
                Đồ gỗ chất lượng cao
              </div>
            </div>
          </button>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.view}
                onClick={() => setView(link.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  state.currentView === link.view
                    ? 'bg-[#8B5E3C] text-white'
                    : 'text-gray-600 hover:bg-[#FFF8F0] hover:text-[#8B5E3C]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right side: Cart + Mobile Nav */}
          <div className="flex items-center gap-2">
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-[#8B5E3C] text-white px-3 py-2 rounded-lg hover:bg-[#6B4229] transition-colors text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="hidden sm:inline">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <div className="flex md:hidden gap-1">
              {navLinks.map(link => (
                <button
                  key={link.view}
                  onClick={() => setView(link.view)}
                  className={`px-2 py-1.5 rounded text-xs font-medium transition-colors ${
                    state.currentView === link.view
                      ? 'bg-[#8B5E3C] text-white'
                      : 'text-gray-600 hover:bg-[#FFF8F0]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category quick nav (only on non-admin pages) */}
        {state.currentView !== 'admin' && (
          <div className="flex items-center gap-2 pb-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setCategory('all')}
              className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition-colors border ${
                state.selectedCategory === 'all'
                  ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                  : 'text-gray-500 border-gray-200 hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
              }`}
            >
              Tất cả
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition-colors border ${
                  state.selectedCategory === cat.id
                    ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                    : 'text-gray-500 border-gray-200 hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
