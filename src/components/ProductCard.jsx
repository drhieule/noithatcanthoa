import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/products';

function formatPrice(price) {
  return price.toLocaleString('vi-VN') + ' đ';
}

export default function ProductCard({ product }) {
  const { addToCart } = useApp();

  const categoryLabel = CATEGORIES.find(c => c.id === product.category)?.label || product.category;

  const categoryColors = {
    'tu': 'bg-amber-100 text-amber-700',
    'ban': 'bg-blue-100 text-blue-700',
    'ghe': 'bg-green-100 text-green-700',
    'ban-hoc': 'bg-purple-100 text-purple-700',
  };
  const badgeClass = categoryColors[product.category] || 'bg-gray-100 text-gray-700';

  function handleAdd() {
    addToCart(product);
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#FCDDB8] flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden bg-[#FEF0DC] aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={e => {
            e.target.src = `https://picsum.photos/seed/${product.id}/400/300`;
          }}
        />
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Còn {product.stock}
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}>
            {categoryLabel}
          </span>
        </div>

        <h3 className="font-semibold text-gray-800 text-sm sm:text-base leading-snug mb-1 line-clamp-2">
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <span className="text-[#8B5E3C] font-bold text-base sm:text-lg">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
              product.stock === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#8B5E3C] text-white hover:bg-[#6B4229] active:scale-95'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M12 4v16m8-8H4" />
            </svg>
            Thêm giỏ
          </button>
        </div>
      </div>
    </div>
  );
}
