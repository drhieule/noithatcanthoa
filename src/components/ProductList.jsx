import { useApp } from '../context/AppContext';
import { PRICE_RANGES } from '../data/products';
import ProductCard from './ProductCard';
import SearchFilter from './SearchFilter';

export default function ProductList() {
  const { state } = useApp();

  const { products, searchQuery, selectedCategory, priceFilter } = state;

  const priceRange = PRICE_RANGES.find(r => r.id === priceFilter) || PRICE_RANGES[0];

  const filtered = products.filter(p => {
    const matchSearch = !searchQuery
      || p.name.toLowerCase().includes(searchQuery.toLowerCase())
      || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchPrice = p.price >= priceRange.min && p.price <= priceRange.max;
    return matchSearch && matchCat && matchPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <SearchFilter />

      {/* Results header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">
          {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : 'Tất cả sản phẩm'}
        </h2>
        <span className="text-sm text-gray-500 bg-white border border-gray-200 px-3 py-1 rounded-full">
          {filtered.length} sản phẩm
        </span>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🔍</span>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
          <p className="text-gray-500 text-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc danh mục.
          </p>
        </div>
      )}
    </div>
  );
}
