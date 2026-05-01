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
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-2xl font-bold text-cat-accent hover:opacity-80 transition">
                🐾 RumahKucing
              </Link>
            </div>
            <nav className="hidden md:flex gap-6 font-medium">
              <Link href="/" className="hover:text-cat-accent transition">Home</Link>
              <Link href="#services" className="hover:text-cat-accent transition">Services</Link>
              <Link href="#gallery" className="hover:text-cat-accent transition">Gallery</Link>
              <Link href="/admin" className="hover:text-cat-accent transition">Admin</Link>
            </nav>
            <Link href="/book" className="bg-cat-accent text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-cat-accent/90 transition hover:-translate-y-1">
              Book Now
            </Link>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-cat-dark text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2026 Purrfect Cat Boarding. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
