import { useApp } from '../context/AppContext';

export default function Footer() {
  const { setView } = useApp();

  return (
    <footer className="bg-[#4A2D18] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🪵</span>
              <div>
                <p className="font-bold text-lg">Nội Thất Cần Thoa</p>
                <p className="text-white/60 text-xs">Đồ gỗ chất lượng cao</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Chuyên cung cấp nội thất gỗ cao cấp, thiết kế hiện đại, phù hợp với mọi không gian sống.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-semibold mb-3">Danh mục</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              {['Tủ quần áo', 'Bàn ăn', 'Ghế sofa', 'Bàn học'].map(item => (
                <li key={item}>
                  <button
                    onClick={() => setView('products')}
                    className="hover:text-white transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3">Liên hệ</h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-center gap-2">
                <span>📞</span>
                <a href="tel:0903302075" className="hover:text-white transition-colors">
                  0903302075 (Chị Thoa)
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span> noithatcanthoa@gmail.com
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">📍</span>
                <a
                  href="https://maps.google.com/?q=431A+Bạch+Đằng,+Phường+Gia+Định,+Bình+Thạnh,+Hồ+Chí+Minh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors leading-relaxed"
                >
                  431A Bạch Đằng, P. Gia Định,<br />
                  Bình Thạnh, TP. Hồ Chí Minh
                  <span className="ml-1 text-xs text-[#F8C48A]">↗ Xem bản đồ</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span> 8:00 - 21:00 (Thứ 2 - CN)
              </li>
            </ul>

            {/* Google Maps embed */}
            <a
              href="https://maps.google.com/?q=431A+Bạch+Đằng,+Phường+Gia+Định,+Bình+Thạnh,+Hồ+Chí+Minh"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors rounded-xl px-3 py-2.5 text-sm font-medium text-white w-fit"
            >
              <svg className="w-4 h-4 text-[#F8C48A] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Mở Google Maps
            </a>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-white/50">
          <p>© 2025 Nội Thất Cần Thoa. Bảo lưu mọi quyền.</p>
          <p>Thiết kế với ❤️ tại Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
