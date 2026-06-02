'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top 
        });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return (
    <div ref={containerRef} className="space-y-20 md:space-y-32 pb-20 md:pb-32 overflow-x-hidden relative">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cat-secondary/40 via-cat-primary to-white py-20 md:py-32 px-4 overflow-hidden min-h-[80vh] md:min-h-[90vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-4 text-4xl md:text-6xl opacity-20 animate-float">🐱</div>
        <div className="absolute bottom-10 right-4 text-4xl md:text-6xl opacity-20 animate-float [animation-delay:2s]">🐾</div>
        <div className="absolute top-1/2 right-2 text-2xl md:text-4xl opacity-10 animate-float [animation-delay:4s]">🧶</div>
        
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cat-accent/10 rounded-full -mr-40 md:-mr-64 -mt-40 md:-mt-64 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cat-secondary/30 rounded-full -ml-40 md:-ml-64 -mb-40 md:-mb-64 blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 md:px-6 py-2 mb-6 md:mb-8 text-xs md:text-sm font-black uppercase tracking-widest text-cat-accent bg-white rounded-full shadow-xl border border-cat-secondary/50 animate-pulse-soft">
            <span className="flex h-2 w-2 rounded-full bg-cat-accent animate-ping"></span>
            Rumah Kucing Pilihan No. 1 Maran
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-9xl font-black mb-6 md:mb-8 text-cat-dark leading-none tracking-tighter">
            Bukan Sekadar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cat-accent to-pink-500">Tempat Tinggal</span>
          </h1>
          <p className="max-w-xl md:max-w-2xl mx-auto text-base md:text-xl text-gray-500 mb-8 md:mb-12 leading-relaxed font-medium">
            Berikan si bulu anda penjagaan dan layanan yang baik. Keselesaan, kebersihan, dan kasih sayang dijamin 100%.
          </p>

          <div className="flex flex-col gap-4 md:gap-6 justify-center items-center">
            <Link href="/book" className="group relative w-full sm:w-auto px-8 md:px-12 py-5 md:py-6 bg-cat-accent text-white rounded-[2rem] font-black text-xl md:text-2xl shadow-2xl shadow-cat-accent/40 hover:scale-105 active:scale-95 transition-all">
              <span className="relative z-10">Tempah Sekarang</span>
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-[2rem]"></div>
            </Link>
            <a href="#services" className="px-6 md:px-10 py-4 md:py-5 text-cat-dark font-bold text-lg md:text-xl hover:text-cat-accent transition-all hover:translate-x-2">
              Lihat Pakej <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-10 md:-mt-16 relative z-20">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          {[
            { label: "Kucing Gembira", val: "500+", icon: "😺" },
            { label: "Penjagaan 24/7", val: "Sentiasa", icon: "⏰" },
            { label: "Kebersihan", val: "Tiada Bau", icon: "✨" },
            { label: "Update Harian", val: "Video/Foto", icon: "📱" }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-center hover:-translate-y-2 transition-all duration-500 group">
              <div className="text-2xl md:text-3xl mb-2 md:mb-3 transform group-hover:scale-125 transition-transform">{stat.icon}</div>
              <div className="text-2xl md:text-3xl font-black text-cat-dark mb-1">{stat.val}</div>
              <div className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-4 max-w-6xl mx-auto pt-10 md:pt-20">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-cat-accent font-black text-xs uppercase tracking-[0.3em] mb-3 md:mb-4 block">Our Suites</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-cat-dark mb-3 md:mb-4">Pilihan Pakej Penginapan</h2>
          <div className="w-16 md:w-24 h-2 bg-cat-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-stretch">
          {[
            {
              id: "A",
              title: "Package A",
              subtitle: "Simple & Cozy",
              price: "RM15",
              extra: null,
              features: ["Saiz sangkar: 2x2x2.5", "Makanan sendiri", "Pasir kucing disediakan"],
              icon: "🏡",
              buttonText: "Pilih Basic",
              rotate: 12
            },
            {
              id: "B",
              title: "Package B",
              subtitle: "The Comfort Choice",
              price: "RM20",
              extra: "+ RM10 seekor (tambahan)",
              features: ["Saiz sangkar: 2.5x2x2.5", "Makanan sendiri", "Pasir kucing disediakan"],
              icon: "🏘️",
              buttonText: "Tempah Sekarang",
              rotate: 0
            },
            {
              id: "C",
              title: "Package C",
              subtitle: "Exclusive Mansion",
              price: "RM25",
              extra: "+ RM10 seekor (tambahan)",
              features: ["Saiz sangkar: 3x2x2.5", "Makanan sendiri", "Pasir kucing disediakan"],
              icon: "🏰",
              buttonText: "Pilih Royal",
              rotate: -12
            },
            {
              id: "D",
              title: "Package D",
              subtitle: "VIP Penthouse",
              price: "RM30",
              extra: "+ RM10 seekor (tambahan)",
              features: ["Saiz bilik: 4x3x2.5", "Makanan sendiri", "Pasir kucing disediakan"],
              icon: "👑",
              buttonText: "Pilih VIP",
              rotate: 12
            }
          ].map((pkg) => {
            const isHovered = hoveredPackage === pkg.id;
            return (
              <div 
                key={pkg.id}
                className={`rounded-[2.5rem] shadow-xl p-6 md:p-8 text-center border transition-all duration-500 relative overflow-hidden group ${
                  isHovered 
                    ? "bg-cat-dark border-cat-accent md:scale-105 z-10" 
                    : "bg-white border-cat-primary hover:shadow-2xl"
                }`}
                onMouseEnter={() => setHoveredPackage(pkg.id)}
                onMouseLeave={() => setHoveredPackage(null)}
              >
                {isHovered && (
                  <div 
                    className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                    style={{
                      background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 114, 182, 0.3) 0%, transparent 50%)`,
                    }}
                  />
                )}
                

                
                <div 
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-2xl md:text-3xl mb-4 md:mb-6 mx-auto shadow-inner relative z-10 transition-transform ${
                    isHovered ? "bg-cat-accent shadow-lg" : "bg-cat-primary"
                  }`}
                  style={{ 
                    transform: isHovered ? `rotate(${pkg.rotate}deg)` : 'rotate(0deg)' 
                  }}
                >
                  {pkg.icon}
                </div>
                
                <h3 className={`text-lg md:text-xl font-black mb-1 relative z-10 ${isHovered ? "text-white" : "text-cat-dark"}`}>
                  {pkg.title}
                </h3>
                
                <p className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 relative z-10 ${isHovered ? "text-white/40" : "text-gray-400"}`}>
                  {pkg.subtitle}
                </p>
                
                <div className={`font-black text-4xl md:text-6xl mb-1 relative z-10 ${isHovered ? "text-cat-accent" : "text-cat-accent"}`}>
                  {pkg.price} <span className={`text-xs font-medium tracking-normal ${isHovered ? "text-white/30" : "text-gray-400"}`}>/ day</span>
                </div>
                
                {pkg.extra && (
                  <p className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-6 md:mb-8 relative z-10 ${isHovered ? "text-white/40" : "text-gray-400"}`}>
                    {pkg.extra}
                  </p>
                )}
                
                <ul className={`text-left text-xs space-y-3 md:space-y-4 mb-6 md:mb-8 border-t pt-4 md:pt-6 font-medium relative z-10 ${
                  isHovered ? "border-white/10" : "border-cat-primary"
                }`}>
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className={`flex items-center gap-3 ${isHovered ? "text-white/80" : "text-gray-600"}`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isHovered 
                          ? "bg-cat-accent text-white" 
                          : "bg-green-100 text-green-600"
                      }`}>✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href="/book" 
                  className={`block w-full py-3 md:py-4 rounded-xl font-black transition-all tracking-wide text-sm relative z-10 ${
                    isHovered 
                      ? "bg-cat-accent text-white hover:bg-white hover:text-cat-accent shadow-xl shadow-cat-accent/30" 
                      : "border-2 border-cat-primary text-cat-dark hover:bg-cat-primary"
                  }`}
                >
                  {pkg.buttonText}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="px-4 max-w-6xl mx-auto py-16 md:py-24">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-cat-accent font-black text-xs uppercase tracking-[0.3em] mb-3 md:mb-4 block">Visual Tour</span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-cat-dark mb-3 md:mb-4">Galeri Kami</h2>
          <div className="w-16 md:w-20 h-1.5 bg-cat-accent/20 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[250px]">
          <div className="col-span-2 row-span-2 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] group shadow-2xl">
            <img 
              src="/gallery/cat1.jpg" 
              alt="Cat 1" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat2.jpg" 
              alt="Cat 2" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat3.jpg" 
              alt="Cat 3" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="col-span-2 relative overflow-hidden rounded-[1.75rem] md:rounded-[2.5rem] group shadow-xl">
            <img 
              src="/gallery/cat4.jpg" 
              alt="Cat 4" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat5.jpg" 
              alt="Cat 5" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat6.jpg" 
              alt="Cat 6" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="col-span-2 relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat7.jpg" 
              alt="Cat 7" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="col-span-2 relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat8.jpeg" 
              alt="Cat 8" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cat-dark py-20 md:py-32 text-white relative overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-5 left-2 text-5xl md:text-9xl">🐾</div>
          <div className="absolute bottom-5 right-2 text-5xl md:text-9xl">🐾</div>
        </div>
        <div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-5"
          style={{
            background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 114, 182, 0.3) 0%, transparent 50%)`,
          }}
        />
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-3 md:mb-4">Mudahnya Guna RumahKucing</h2>
            <p className="text-white/40 font-medium text-sm md:text-base">Langkah demi langkah untuk keselesaan si bulu anda.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            {[
              { step: "01", title: "Tempah Online", desc: "Pilih tarikh dan pakej yang sesuai melalui portal kami." },
              { step: "02", title: "Pengesahan", desc: "Kami akan hantar pengesahan slot dalam masa singkat." },
              { step: "03", title: "Hantar Kucing", desc: "Bawa kucing anda ke lokasi kami yang selesa." },
              { step: "04", title: "Update Harian", desc: "Dapatkan video dan foto kucing anda setiap hari." }
            ].map((step, i) => (
              <div key={i} className="group p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="text-4xl md:text-5xl font-black text-cat-accent/30 mb-4 md:mb-6 group-hover:text-cat-accent transition-colors">{step.step}</div>
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-cat-accent">{step.title}</h3>
                <p className="text-xs md:text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

