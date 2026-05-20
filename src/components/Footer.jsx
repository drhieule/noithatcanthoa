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
                <span>📞</span> 0912 345 678
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span> noithatcanthoa@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span> 123 Đường Gỗ, Q.1, TP.HCM
              </li>
              <li className="flex items-center gap-2">
                <span>🕐</span> 8:00 - 21:00 (Thứ 2 - CN)
              </li>
            </ul>
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
