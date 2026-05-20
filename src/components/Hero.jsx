import { useApp } from '../context/AppContext';

export default function Hero() {
  const { setView, setCategory } = useApp();

  return (
    <section className="relative bg-gradient-to-br from-[#8B5E3C] via-[#6B4229] to-[#4A2D18] text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white" />
        <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-white" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full bg-white" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <span>✨</span>
            <span>Đồ gỗ chất lượng cao - Giao hàng toàn quốc</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-4">
            Không gian sống đẹp
            <br />
            <span className="text-[#F8C48A]">Giá tốt nhất</span>
          </h1>

          <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed">
            Khám phá bộ sưu tập nội thất gỗ cao cấp được thiết kế riêng cho ngôi nhà của bạn.
            Chất lượng bền bỉ, kiểu dáng hiện đại, giá cả phải chăng.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setView('products')}
              className="bg-white text-[#8B5E3C] px-6 py-3 rounded-xl font-semibold hover:bg-[#FEF0DC] transition-colors shadow-lg text-sm sm:text-base"
            >
              Xem sản phẩm
            </button>
            <button
              onClick={() => { setCategory('tu'); }}
              className="bg-white/20 border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors text-sm sm:text-base"
            >
              Khuyến mãi hôm nay
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
          {[
            { num: '500+', label: 'Sản phẩm' },
            { num: '2.000+', label: 'Khách hàng' },
            { num: '5 năm', label: 'Kinh nghiệm' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-[#F8C48A]">{stat.num}</div>
              <div className="text-white/70 text-xs sm:text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" className="w-full" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,40 1440,0 L1440,40 Z" fill="#FFF8F0" />
        </svg>
      </div>
    </section>
  );
}
