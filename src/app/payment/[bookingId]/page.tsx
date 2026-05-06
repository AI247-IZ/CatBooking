"use client";

import { useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

function PaymentContent() {
  const { bookingId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get total and days from query params
  const totalAmount = parseFloat(searchParams.get("total") || "0"); 
  const amountToPay = parseFloat(searchParams.get("amount") || searchParams.get("total") || "0");
  const paymentType = searchParams.get("paymentType") || "full";
  const days = searchParams.get("days") || "0";

  const handleFinalize = async () => {
    setIsSubmitting(true);
    // Simulate process
    setTimeout(() => {
      alert("Booking confirmed! We will contact you soon.");
      router.push("/");
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* ... existing UI ... */}
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
                  <p className="text-[10px] text-gray-400 font-bold mt-2 text-center uppercase tracking-tighter">
                    Balance RM{(totalAmount - amountToPay).toFixed(2)} to be paid at check-in
                  </p>
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
                By clicking the button below, you agree to our terms of service and boarding policies. We will review your booking and get back to you shortly via phone or email.
              </p>
            </div>

            <div className="p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0 text-xl">ℹ️</div>
                <div className="text-sm text-gray-600">
                  <p className="font-bold text-cat-dark mb-1">Next Steps:</p>
                  <ul className="list-disc ml-4 space-y-1 text-xs">
                    <li>Booking enters "Pending" status</li>
                    <li>Admin verifies availability</li>
                    <li>Payment instructions sent via WhatsApp/Email</li>
                    <li>Drop-off your cat on the selected date!</li>
                  </ul>
                </div>
              </div>
            </div>

            <button 
              onClick={handleFinalize}
              disabled={isSubmitting} 
              className="w-full bg-cat-accent text-white p-5 rounded-2xl font-black text-xl hover:bg-cat-accent/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-cat-accent/20 disabled:opacity-50 disabled:grayscale group"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Confirming...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Confirm Booking Now
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </button>
            
            <button 
              onClick={() => router.back()}
              className="w-full text-gray-400 font-bold text-sm hover:text-cat-dark transition-colors"
            >
              Wait, I need to change something
            </button>
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

