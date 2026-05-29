"use client";

import { useState, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";

const WHATSAPP_NUMBER = "60139267512";

const PACKAGE_LABELS: Record<string, string> = {
  "15": "Package A (RM15/hari)",
  "20": "Package B (RM20/hari)",
  "25": "Package C (RM25/hari)",
  "30": "Package D (RM30/hari)",
};

function PaymentContent() {
  const { bookingId } = useParams();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get booking details from query params
  const totalAmount = parseFloat(searchParams.get("total") || "0"); 
  const amountToPay = parseFloat(searchParams.get("amount") || searchParams.get("total") || "0");
  const paymentType = searchParams.get("paymentType") || "full";
  const days = searchParams.get("days") || "0";
  const rooms = searchParams.get("rooms") || "1";
  const name = searchParams.get("name") || "Pelanggan";
  const checkIn = searchParams.get("checkIn") || "-";
  const checkOut = searchParams.get("checkOut") || "-";
  const pkg = searchParams.get("pkg") || "20";
  const packageLabel = PACKAGE_LABELS[pkg] || `RM${pkg}/hari`;

  const handleConfirm = () => {
    setIsSubmitting(true);

    const message = 
      `Assalamualaikum, saya *${name}* telah membuat tempahan di Purrfect Boarding.\n\n` +
      `📋 *Maklumat Tempahan:*\n` +
      `• Booking ID: *${bookingId}*\n` +
      `• Pakej: *${packageLabel}*\n` +
      `• Bilik: *${rooms} bilik*\n` +
      `• Tarikh Masuk: *${checkIn}*\n` +
      `• Tarikh Keluar: *${checkOut}*\n` +
      `• Tempoh: *${days} hari*\n` +
      `• Jumlah: *RM${totalAmount.toFixed(2)}*\n` +
      `• Bayaran: *${paymentType === "deposit" ? `Deposit RM${amountToPay.toFixed(2)}` : `Full RM${amountToPay.toFixed(2)}`}*\n\n` +
      `Sila sahkan tempahan saya. Terima kasih! 🐱`;

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-cat-primary text-cat-accent rounded-full mb-4 shadow-inner">
          <span className="text-2xl">💳</span>
        </div>
        <h1 className="text-4xl font-black text-cat-dark mb-2">Finalize Booking</h1>
        <p className="text-gray-500">Review your booking and proceed to confirmation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Summary Side */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-cat-secondary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cat-primary/50 rounded-bl-full -mr-4 -mt-4"></div>
            
            <h2 className="text-xl font-bold mb-6 text-cat-dark relative z-10">Booking Summary</h2>
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center py-3 border-b border-cat-primary border-dashed">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Booking ID</span>
                <span className="font-bold text-cat-dark">{bookingId}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cat-primary border-dashed">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Package</span>
                <span className="font-bold text-cat-dark">{packageLabel}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cat-primary border-dashed">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Number of Rooms</span>
                <span className="font-bold text-cat-dark">{rooms} Room(s)</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cat-primary border-dashed">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Check-in</span>
                <span className="font-bold text-cat-dark">{checkIn}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cat-primary border-dashed">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Check-out</span>
                <span className="font-bold text-cat-dark">{checkOut}</span>
              </div>

              <div className="flex justify-between items-center py-3 border-b border-cat-primary border-dashed">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Stay ({days} days)</span>
                <span className="font-bold text-cat-dark">RM{totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-cat-primary border-dashed">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Payment Plan</span>
                <span className="font-bold text-cat-dark capitalize">{paymentType}</span>
              </div>
              
              <div className="pt-4">
                <div className="bg-cat-primary p-4 rounded-2xl flex justify-between items-center border border-cat-secondary shadow-sm">
                  <div>
                    <div className="text-[10px] font-black text-cat-accent uppercase tracking-tighter">Amount Due Now</div>
                    <div className="text-2xl font-black text-cat-dark">RM{amountToPay.toFixed(2)}</div>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg">💰</div>
                </div>
                {paymentType === "deposit" && (
                  <div className="mt-4 p-3 bg-cat-primary/50 rounded-xl border border-cat-secondary flex justify-center items-center gap-2">
                    <span className="text-xs font-black text-cat-dark uppercase tracking-wider">Balance to pay:</span>
                    <span className="text-sm font-black text-cat-accent">RM{(totalAmount - amountToPay).toFixed(2)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Side */}
        <div className="md:col-span-3">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-cat-secondary space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-cat-dark">Ready to Confirm?</h2>
              <p className="text-gray-500 leading-relaxed">
                Klik butang di bawah untuk hantar maklumat tempahan terus kepada kami melalui <span className="font-bold text-green-600">WhatsApp</span>. Kami akan sahkan tempahan anda secepat mungkin.
              </p>
            </div>

            <div className="p-6 bg-green-50 rounded-2xl border-2 border-dashed border-green-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-xl">💬</div>
                <div className="text-sm text-gray-600">
                  <p className="font-bold text-cat-dark mb-1">Cara Pengesahan:</p>
                  <ul className="list-disc ml-4 space-y-1 text-xs">
                    <li>Klik <span className="font-bold text-green-600">"Hantar ke WhatsApp"</span> di bawah</li>
                    <li>Mesej akan diisi secara automatik dengan ID tempahan anda</li>
                    <li>Tekan <span className="font-bold">Send</span> dalam WhatsApp</li>
                    <li>Kami akan balas untuk mengesahkan tempahan!</li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              onClick={handleConfirm}
              disabled={isSubmitting} 
              className="w-full bg-green-500 text-white p-5 rounded-2xl font-black text-xl hover:bg-green-600 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-green-500/20 disabled:opacity-50 group flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Opening WhatsApp...
                </span>
              ) : (
                <>
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Hantar ke WhatsApp
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </>
              )}
            </button>
            
            <a 
              href="/"
              className="block w-full text-center text-gray-400 font-bold text-sm hover:text-cat-dark transition-colors"
            >
              Kembali ke Laman Utama
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading payment details...</div>}>
      <PaymentContent />
    </Suspense>
  );
}

