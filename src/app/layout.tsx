import type { Metadata } from "next";
import Link from "next/link";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Purrfect Boarding | Premium Cat Care",
  description: "Book your cat's stay at our premium boarding facility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksand.variable} antialiased min-h-screen flex flex-col`}>
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-cat-secondary">
          <div className="max-w-6xl mx-auto px-4 h-16 grid grid-cols-3 items-center">
            {/* Left: Logo */}
            <div className="flex justify-start">
              <Link href="/" className="text-2xl font-bold text-cat-accent hover:opacity-80 transition flex items-center gap-2">
                🐾 <span className="hidden sm:inline">RumahKucing</span>
              </Link>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden md:flex gap-8 font-bold justify-center text-sm tracking-wide">
              <Link href="/" className="text-cat-dark hover:text-cat-accent transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cat-accent transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#services" className="text-cat-dark hover:text-cat-accent transition-colors relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cat-accent transition-all group-hover:w-full"></span>
              </Link>
              <Link href="#gallery" className="text-cat-dark hover:text-cat-accent transition-colors relative group">
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cat-accent transition-all group-hover:w-full"></span>
              </Link>
            </nav>

            {/* Right: Action Button */}
            <div className="flex justify-end">
              <Link href="/book" className="bg-cat-accent text-white px-8 py-2.5 rounded-full font-black text-sm shadow-lg shadow-cat-accent/20 hover:bg-cat-accent/90 transition hover:-translate-y-0.5 active:translate-y-0">
                Book Now
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-cat-dark text-white py-8 mt-12">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>&copy; 2026 Purrfect Cat Boarding. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
