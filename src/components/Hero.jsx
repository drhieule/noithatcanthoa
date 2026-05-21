import { useApp } from '../context/AppContext';
import { useEffect, useState, useRef } from 'react';

const TYPEWRITER_PHRASES = [
  'Không gian sống đẹp',
  'Nội thất cao cấp',
  'Phong cách hiện đại',
];

function TypewriterText() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const current = TYPEWRITER_PHRASES[phraseIdx];

    if (!deleting && displayed.length < current.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 70);
    } else if (!deleting && displayed.length === current.length) {
      timeoutRef.current = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeoutRef.current = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx(i => (i + 1) % TYPEWRITER_PHRASES.length);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [displayed, deleting, phraseIdx]);

  return (
    <span className="inline-block min-h-[1.2em]">
      {displayed}
      <span
        className="inline-block w-[3px] h-[0.85em] bg-[#F8C48A] ml-1 align-middle"
        style={{ animation: 'blink 0.8s step-end infinite' }}
      />
    </span>
  );
}

function WaveHand() {
  const [key, setKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setKey(k => k + 1), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <span key={key} className="animate-wave inline-block">👋</span>
  );
}

export default function Hero() {
  const { setView, setCategory } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(id);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-[#8B5E3C] via-[#6B4229] to-[#4A2D18] text-white overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-[#F8C48A]/10 blur-2xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Greeting badge */}
        <div
          className={`animate-float-badge inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 text-sm mb-6 shadow-lg transition-all duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}
        >
          <WaveHand />
          <span className="font-medium tracking-wide">
            Xin chào quý khách — Chào mừng đến với Nội Thất Cẩn Thoa
          </span>
          <span>✨</span>
        </div>

        <div className="max-w-2xl">
          {/* Main heading with typewriter */}
          <h1
            className={`text-3xl sm:text-5xl font-bold leading-tight mb-4 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.2s' }}
          >
            <TypewriterText />
            <br />
            <span className="animate-shimmer text-3xl sm:text-5xl font-bold">
              Giá tốt nhất
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`text-white/80 text-base sm:text-lg mb-4 leading-relaxed transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.45s' }}
          >
            Khám phá bộ sưu tập nội thất gỗ cao cấp được thiết kế riêng cho ngôi nhà của bạn.
          </p>

          {/* Highlighted line */}
          <div
            className={`flex items-center gap-2 mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            style={{ transitionDelay: '0.6s' }}
          >
            <div className="w-8 h-0.5 bg-[#F8C48A] rounded-full" />
            <p className="animate-glow-pulse text-[#F8C48A] font-semibold text-sm sm:text-base">
              Chất lượng bền bỉ · Kiểu dáng hiện đại · Giá cả phải chăng
            </p>
          </div>

          {/* CTA buttons */}
          <div
            className={`flex flex-wrap gap-3 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '0.75s' }}
          >
            <button
              onClick={() => setView('products')}
              className="bg-white text-[#8B5E3C] px-6 py-3 rounded-xl font-semibold hover:bg-[#FEF0DC] hover:scale-105 active:scale-95 transition-all shadow-lg text-sm sm:text-base"
            >
              Xem sản phẩm →
            </button>
            <button
              onClick={() => setCategory('tu')}
              className="bg-white/20 border border-white/40 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 hover:scale-105 active:scale-95 transition-all text-sm sm:text-base"
            >
              Khuyến mãi hôm nay 🔥
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg">
          {[
            { num: '500+', label: 'Sản phẩm', delay: '0.85s' },
            { num: '2.000+', label: 'Khách hàng', delay: '0.95s' },
            { num: '5 năm', label: 'Kinh nghiệm', delay: '1.05s' },
          ].map(stat => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
              style={{ transitionDelay: stat.delay }}
            >
              <div className="text-2xl sm:text-3xl font-bold text-[#F8C48A] animate-glow-pulse">
                {stat.num}
              </div>
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
