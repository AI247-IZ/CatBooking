import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-32 pb-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cat-secondary/40 via-cat-primary to-white py-32 px-4 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🐱</div>
        <div className="absolute bottom-20 right-20 text-6xl opacity-20 animate-float [animation-delay:2s]">🐾</div>
        <div className="absolute top-1/2 right-10 text-4xl opacity-10 animate-float [animation-delay:4s]">🧶</div>
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cat-accent/10 rounded-full -mr-64 -mt-64 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cat-secondary/30 rounded-full -ml-64 -mb-64 blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-2 mb-8 text-sm font-black uppercase tracking-widest text-cat-accent bg-white rounded-full shadow-xl border border-cat-secondary/50 animate-pulse-soft">
            <span className="flex h-2 w-2 rounded-full bg-cat-accent animate-ping"></span>
            Rumah Kucing Pilihan No. 1 Maran
          </div>
          <h1 className="text-6xl md:text-9xl font-black mb-8 text-cat-dark leading-none tracking-tighter">
            Bukan Sekadar <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cat-accent to-pink-500">Tempat Tinggal</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12 leading-relaxed font-medium">
            Berikan si bulu anda penjagaan dan layanan yang baik. Keselesaan, kebersihan, dan kasih sayang dijamin 100%.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/book" className="group relative px-12 py-6 bg-cat-accent text-white rounded-[2rem] font-black text-2xl shadow-2xl shadow-cat-accent/40 hover:scale-105 active:scale-95 transition-all">
              <span className="relative z-10">Tempah Sekarang</span>
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-[2rem]"></div>
            </Link>
            <a href="#services" className="px-10 py-5 text-cat-dark font-bold text-xl hover:text-cat-accent transition-all hover:translate-x-2">
              Lihat Pakej <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-4 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Kucing Gembira", val: "500+", icon: "😺" },
            { label: "Penjagaan 24/7", val: "Sentiasa", icon: "⏰" },
            { label: "Kebersihan", val: "Tiada Bau", icon: "✨" },
            { label: "Update Harian", val: "Video/Foto", icon: "📱" }
          ].map((stat, i) => (
            <div key={i} className="glass-card p-8 rounded-[2.5rem] shadow-xl text-center hover:-translate-y-2 transition-all duration-500 group">
              <div className="text-3xl mb-3 transform group-hover:scale-125 transition-transform">{stat.icon}</div>
              <div className="text-3xl font-black text-cat-dark mb-1">{stat.val}</div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="px-4 max-w-6xl mx-auto pt-20">
        <div className="text-center mb-20">
          <span className="text-cat-accent font-black text-xs uppercase tracking-[0.3em] mb-4 block">Our Suites</span>
          <h2 className="text-5xl md:text-6xl font-black text-cat-dark mb-4">Pilihan Pakej Penginapan</h2>
          <div className="w-24 h-2 bg-cat-accent mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-6 items-end">
          {/* Package A */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 text-center border border-cat-primary hover:shadow-2xl transition-all duration-500 group">
            <div className="w-16 h-16 bg-cat-primary rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:rotate-12 transition-transform shadow-inner">🏡</div>
            <h3 className="text-xl font-black mb-1 text-cat-dark">Package A</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">Simple & Cozy</p>
            <div className="text-cat-accent font-black text-5xl mb-8">RM15 <span className="text-xs text-gray-400 font-medium tracking-normal">/ day</span></div>
            <ul className="text-left text-xs space-y-4 mb-8 border-t border-cat-primary pt-6 font-medium">
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Saiz sangkar: 2x2x2.5</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Makanan sendiri</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Air bersih 24 jam</li>
            </ul>
            <Link href="/book" className="block w-full py-4 rounded-xl border-2 border-cat-primary text-cat-dark font-black hover:bg-cat-primary transition-all tracking-wide text-sm">Pilih Basic</Link>
          </div>

          {/* Package B */}
          <div className="bg-cat-dark rounded-[3rem] shadow-2xl p-8 text-center relative md:scale-105 z-10 border-4 border-cat-accent transform hover:scale-[1.07] transition-all duration-500">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cat-accent text-white px-6 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] shadow-xl">TERLARIS</div>
            <div className="w-16 h-16 bg-cat-accent rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-lg">🏘️</div>
            <h3 className="text-2xl font-black mb-1 text-white">Package B</h3>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-6">The Comfort Choice</p>
            <div className="text-cat-accent font-black text-6xl mb-1">RM20 <span className="text-xs text-white/30 font-medium tracking-normal">/ day</span></div>
            <p className="text-[9px] font-black text-white/40 mb-8 uppercase tracking-widest">+ RM10 seekor (tambahan)</p>
            <ul className="text-left text-xs space-y-4 mb-8 border-t border-white/10 pt-6 font-medium">
              <li className="flex items-center gap-3 text-white/80"><span className="w-5 h-5 bg-cat-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Saiz sangkar: 2.5x2x2.5</li>
              <li className="flex items-center gap-3 text-white/80"><span className="w-5 h-5 bg-cat-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Makanan sendiri</li>
              <li className="flex items-center gap-3 text-white/80"><span className="w-5 h-5 bg-cat-accent text-white rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Pasir kucing disediakan</li>
            </ul>
            <Link href="/book" className="block w-full py-4.5 rounded-xl bg-cat-accent text-white font-black hover:bg-white hover:text-cat-accent transition-all shadow-xl shadow-cat-accent/30 text-sm">Tempah Sekarang</Link>
          </div>

          {/* Package C */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 text-center border border-cat-primary hover:shadow-2xl transition-all duration-500 group">
            <div className="w-16 h-16 bg-cat-primary rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:-rotate-12 transition-transform shadow-inner">🏰</div>
            <h3 className="text-xl font-black mb-1 text-cat-dark">Package C</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">Exclusive Mansion</p>
            <div className="text-cat-accent font-black text-5xl mb-1">RM25 <span className="text-xs text-gray-400 font-medium tracking-normal">/ day</span></div>
            <p className="text-[9px] font-black text-gray-400 mb-8 uppercase tracking-widest">+ RM10 seekor (tambahan)</p>
            <ul className="text-left text-xs space-y-4 mb-8 border-t border-cat-primary pt-6 font-medium">
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Saiz sangkar: 3x2x2.5</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Makanan sendiri</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Pasir kucing disediakan</li>
            </ul>
            <Link href="/book" className="block w-full py-4 rounded-xl border-2 border-cat-primary text-cat-dark font-black hover:bg-cat-primary transition-all tracking-wide text-sm">Pilih Royal</Link>
          </div>

          {/* Package D */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-8 text-center border border-cat-primary hover:shadow-2xl transition-all duration-500 group">
            <div className="w-16 h-16 bg-cat-primary rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:rotate-12 transition-transform shadow-inner">👑</div>
            <h3 className="text-xl font-black mb-1 text-cat-dark">Package D</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-6">VIP Penthouse</p>
            <div className="text-cat-accent font-black text-5xl mb-1">RM30 <span className="text-xs text-gray-400 font-medium tracking-normal">/ day</span></div>
            <p className="text-[9px] font-black text-gray-400 mb-8 uppercase tracking-widest">+ RM10 seekor (tambahan)</p>
            <ul className="text-left text-xs space-y-4 mb-8 border-t border-cat-primary pt-6 font-medium">
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Saiz bilik: 4x3x2.5</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Makanan sendiri</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold">✓</span> Pasir kucing disediakan</li>
            </ul>
            <Link href="/book" className="block w-full py-4 rounded-xl border-2 border-cat-primary text-cat-dark font-black hover:bg-cat-primary transition-all tracking-wide text-sm">Pilih VIP</Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="px-4 max-w-6xl mx-auto py-24">
        <div className="text-center mb-20">
          <span className="text-cat-accent font-black text-xs uppercase tracking-[0.3em] mb-4 block">Visual Tour</span>
          <h2 className="text-5xl md:text-6xl font-black text-cat-dark mb-4">Galeri Kami</h2>
          <div className="w-20 h-1.5 bg-cat-accent/20 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[250px]">
          <div className="md:col-span-2 md:row-span-2 relative overflow-hidden rounded-[3rem] group shadow-2xl">
            <img 
              src="/gallery/cat1.jpg" 
              alt="Cat 1" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat2.jpg" 
              alt="Cat 2" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat3.jpg" 
              alt="Cat 3" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="md:col-span-2 relative overflow-hidden rounded-[2.5rem] group shadow-xl">
            <img 
              src="/gallery/cat4.jpg" 
              alt="Cat 4" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat5.jpg" 
              alt="Cat 5" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="relative overflow-hidden rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat6.jpg" 
              alt="Cat 6" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat7.jpg" 
              alt="Cat 7" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
          <div className="md:col-span-2 relative overflow-hidden rounded-[2rem] group shadow-xl">
            <img 
              src="/gallery/cat8.jpg" 
              alt="Cat 8" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cat-dark py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 text-9xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-9xl">🐾</div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-4">Mudahnya Guna RumahKucing</h2>
            <p className="text-white/40 font-medium">Langkah demi langkah untuk keselesaan si bulu anda.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { step: "01", title: "Tempah Online", desc: "Pilih tarikh dan pakej yang sesuai melalui portal kami." },
              { step: "02", title: "Pengesahan", desc: "Kami akan hantar pengesahan slot dalam masa singkat." },
              { step: "03", title: "Hantar Kucing", desc: "Bawa kucing anda ke lokasi kami yang selesa." },
              { step: "04", title: "Update Harian", desc: "Dapatkan video dan foto kucing anda setiap hari." }
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="text-5xl font-black text-cat-accent/30 mb-6 group-hover:text-cat-accent transition-colors">{step.step}</div>
                <h3 className="text-xl font-bold mb-3 text-cat-accent">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

