import { useApp } from '../context/AppContext';
import { CATEGORIES, PRICE_RANGES } from '../data/products';

export default function SearchFilter() {
  const { state, setSearch, setCategory, setPriceFilter } = useApp();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#FCDDB8] p-4 sm:p-5 mb-6">
      {/* Search */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={state.searchQuery}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C] focus:border-transparent placeholder-gray-400"
        />
        {state.searchQuery && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Danh mục</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              state.selectedCategory === 'all'
                ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
            }`}
          >
            Tất cả
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                state.selectedCategory === cat.id
                  ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price filter */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Khoảng giá</p>
        <div className="flex flex-wrap gap-2">
          {PRICE_RANGES.map(range => (
            <button
              key={range.id}
              onClick={() => setPriceFilter(range.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                state.priceFilter === range.id
                  ? 'bg-[#8B5E3C] text-white border-[#8B5E3C]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#8B5E3C] hover:text-[#8B5E3C]'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
