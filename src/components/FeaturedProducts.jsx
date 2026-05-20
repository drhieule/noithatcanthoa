import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';

export default function FeaturedProducts() {
  const { state, setView, setCategory } = useApp();

  // Show up to 8 products on homepage
  const featured = state.products.slice(0, 8);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Sản phẩm nổi bật</h2>
          <p className="text-gray-500 text-sm mt-1">Được yêu thích nhất tháng này</p>
        </div>
        <button
          onClick={() => setView('products')}
          className="text-[#8B5E3C] text-sm font-semibold hover:underline flex items-center gap-1"
        >
          Xem tất cả
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Category quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map(cat => {
          const icons = { 'tu': '🚪', 'ban': '🍽️', 'ghe': '🪑', 'ban-hoc': '📚' };
          const count = state.products.filter(p => p.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => { setCategory(cat.id); setView('products'); }}
              className="bg-white border border-[#FCDDB8] rounded-2xl p-4 text-center hover:border-[#8B5E3C] hover:shadow-md transition-all group"
            >
              <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">{icons[cat.id]}</span>
              <p className="font-semibold text-gray-800 text-sm">{cat.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{count} sản phẩm</p>
            </button>
          );
        })}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {featured.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => setView('products')}
          className="bg-white border-2 border-[#8B5E3C] text-[#8B5E3C] px-8 py-3 rounded-xl font-semibold hover:bg-[#8B5E3C] hover:text-white transition-colors text-sm"
        >
          Xem thêm sản phẩm
        </button>
      </div>
    </section>
  );
}
