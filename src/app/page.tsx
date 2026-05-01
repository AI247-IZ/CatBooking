import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-cat-secondary to-cat-primary py-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6 text-cat-dark">
          Your Cat&apos;s <span className="text-cat-accent">Home</span> Away From Home
        </h1>

        <Link href="/book" className="inline-block bg-cat-accent text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-cat-accent/90 transition hover:scale-105">
          Book a Stay Now
        </Link>
      </section>

      <section id="services" className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Flexible Boarding Options</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Package A */}
          <div className="bg-white rounded-3xl shadow p-8 text-center border-2 border-transparent hover:border-cat-secondary transition">
            <h3 className="text-xl font-bold mb-2">Package A</h3>
            <div className="text-cat-accent font-black text-5xl mb-6">RM15 <span className="text-sm text-gray-500 font-medium">/ day</span></div>
            <ul className="text-left text-sm space-y-3 mb-8">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Cage size: 2x2x2.5</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Bring own food</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Free flow water supplied</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Cat litter supplied</li>
            </ul>
          </div>
          {/* Package B */}
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center border-2 border-cat-accent relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cat-accent text-white px-4 py-1 rounded-full text-xs font-bold">POPULAR</div>
            <h3 className="text-xl font-bold mb-2">Package B</h3>
            <div className="text-cat-accent font-black text-5xl mb-2">RM20 <span className="text-sm text-gray-500 font-medium">/ day</span></div>
            <p className="text-sm text-gray-500 mb-6">+ RM10 for each additional cat</p>
            <ul className="text-left text-sm space-y-3 mb-8">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Cage size: 2.5x2x2.5</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Bring own food</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Free flow water supplied</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Cat litter supplied</li>
            </ul>
          </div>
          {/* Package C */}
          <div className="bg-white rounded-3xl shadow p-8 text-center border-2 border-transparent hover:border-cat-secondary transition">
            <h3 className="text-xl font-bold mb-2">Package C</h3>
            <div className="text-cat-accent font-black text-5xl mb-2">RM25 <span className="text-sm text-gray-500 font-medium">/ day</span></div>
            <p className="text-sm text-gray-500 mb-6">+ RM10 for each additional cat</p>
            <ul className="text-left text-sm space-y-3 mb-8">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Cage size: 3x2x2.5</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Bring own food</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Free flow water supplied</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Cat litter supplied</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
