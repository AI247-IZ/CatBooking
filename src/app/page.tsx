import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cat-secondary/40 via-cat-primary to-white py-24 px-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cat-accent/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cat-secondary/20 rounded-full -ml-48 -mb-48 blur-3xl"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black uppercase tracking-widest text-cat-accent bg-white rounded-full shadow-sm border border-cat-secondary">
            🐱 The #1 Cat Boarding in Town
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-8 text-cat-dark leading-tight">
            Premium Care for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cat-accent to-pink-400">Your Furry Family</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-12 leading-relaxed">
            Safe, clean, and loving environment for your cats. Whether it's a short getaway or a long vacation, we've got your back.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/book" className="group relative px-10 py-5 bg-cat-accent text-white rounded-2xl font-black text-xl shadow-2xl shadow-cat-accent/30 hover:scale-105 active:scale-95 transition-all overflow-hidden">
              <span className="relative z-10">Book a Stay Now</span>
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <a href="#services" className="px-10 py-5 text-cat-dark font-bold text-xl hover:text-cat-accent transition-colors">
              Explore Packages
            </a>
          </div>
        </div>
      </section>

      {/* Stats/Features Section */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: "Happy Cats", val: "500+" },
          { label: "Expert Care", val: "24/7" },
          { label: "Clean Cages", val: "100%" },
          { label: "Daily Updates", val: "Live" }
        ].map((stat, i) => (
          <div key={i} className="text-center p-6 bg-white rounded-3xl shadow-sm border border-cat-primary">
            <div className="text-3xl font-black text-cat-dark mb-1">{stat.val}</div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Services Section */}
      <section id="services" className="px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-cat-dark mb-4">Flexible Boarding Options</h2>
          <p className="text-gray-500">Choose the perfect suite for your cat's comfort.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-end">
          {/* Package A */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-10 text-center border border-cat-primary hover:border-cat-secondary transition group">
            <div className="w-16 h-16 bg-cat-primary rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:rotate-6 transition-transform">🏡</div>
            <h3 className="text-2xl font-black mb-1 text-cat-dark">Package A</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 italic">Essential Stay</p>
            <div className="text-cat-accent font-black text-6xl mb-8">RM15 <span className="text-sm text-gray-400 font-medium tracking-normal">/ day</span></div>
            <ul className="text-left text-sm space-y-4 mb-10 border-t border-cat-primary pt-8">
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Cage size: 2x2x2.5</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Bring own food</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Free flow water supplied</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Cat litter supplied</li>
            </ul>
            <Link href="/book" className="block w-full py-4 rounded-2xl border-2 border-cat-primary text-cat-dark font-bold hover:bg-cat-primary transition">Select Basic</Link>
          </div>

          {/* Package B */}
          <div className="bg-cat-dark rounded-[2.5rem] shadow-2xl p-10 text-center relative md:scale-110 z-10 border-4 border-cat-accent">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cat-accent text-white px-6 py-2 rounded-full text-xs font-black tracking-widest shadow-xl">MOST POPULAR</div>
            <div className="w-16 h-16 bg-cat-accent rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto">🏘️</div>
            <h3 className="text-2xl font-black mb-1 text-white">Package B</h3>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6 italic">Comfort Suite</p>
            <div className="text-cat-accent font-black text-6xl mb-2">RM20 <span className="text-sm text-white/30 font-medium tracking-normal">/ day</span></div>
            <p className="text-[10px] font-black text-white/50 mb-8 uppercase tracking-widest">+ RM10 for each additional cat</p>
            <ul className="text-left text-sm space-y-4 mb-10 border-t border-white/10 pt-8">
              <li className="flex items-center gap-3 text-white/80"><span className="w-5 h-5 bg-cat-accent text-white rounded-full flex items-center justify-center text-[10px]">✓</span> Cage size: 2.5x2x2.5</li>
              <li className="flex items-center gap-3 text-white/80"><span className="w-5 h-5 bg-cat-accent text-white rounded-full flex items-center justify-center text-[10px]">✓</span> Bring own food</li>
              <li className="flex items-center gap-3 text-white/80"><span className="w-5 h-5 bg-cat-accent text-white rounded-full flex items-center justify-center text-[10px]">✓</span> Free flow water supplied</li>
              <li className="flex items-center gap-3 text-white/80"><span className="w-5 h-5 bg-cat-accent text-white rounded-full flex items-center justify-center text-[10px]">✓</span> Cat litter supplied</li>
            </ul>
            <Link href="/book" className="block w-full py-4 rounded-2xl bg-cat-accent text-white font-black hover:bg-cat-accent/90 transition shadow-lg shadow-cat-accent/20">Book Popular</Link>
          </div>

          {/* Package C */}
          <div className="bg-white rounded-[2.5rem] shadow-xl p-10 text-center border border-cat-primary hover:border-cat-secondary transition group">
            <div className="w-16 h-16 bg-cat-primary rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:-rotate-6 transition-transform">🏰</div>
            <h3 className="text-2xl font-black mb-1 text-cat-dark">Package C</h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6 italic">Royal Mansion</p>
            <div className="text-cat-accent font-black text-6xl mb-2">RM25 <span className="text-sm text-gray-400 font-medium tracking-normal">/ day</span></div>
            <p className="text-[10px] font-black text-gray-400 mb-8 uppercase tracking-widest">+ RM10 for each additional cat</p>
            <ul className="text-left text-sm space-y-4 mb-10 border-t border-cat-primary pt-8">
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Cage size: 3x2x2.5</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Bring own food</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Free flow water supplied</li>
              <li className="flex items-center gap-3 text-gray-600"><span className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px]">✓</span> Cat litter supplied</li>
            </ul>
            <Link href="/book" className="block w-full py-4 rounded-2xl border-2 border-cat-primary text-cat-dark font-bold hover:bg-cat-primary transition">Select Royal</Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cat-dark py-24 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-12">
            {[
              { step: "01", title: "Book Online", desc: "Choose your dates and package via our portal." },
              { step: "02", title: "Confirmation", desc: "Wait for our team to verify and confirm your slot." },
              { step: "03", title: "Drop Off", desc: "Bring your furry friend to our premium location." },
              { step: "04", title: "Daily Updates", desc: "Receive photos and videos of your cat's stay." }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-black text-white/5 mb-4">{step.step}</div>
                <h3 className="text-xl font-bold mb-2 text-cat-accent">{step.title}</h3>
                <p className="text-sm text-white/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

