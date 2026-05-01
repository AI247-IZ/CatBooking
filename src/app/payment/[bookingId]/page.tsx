"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [paymentType, setPaymentType] = useState<"deposit" | "full">("deposit");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // In a real app, fetch booking details from API
  const totalAmount = 150; 
  const depositAmount = totalAmount * 0.3;

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a receipt to upload");
    
    setIsSubmitting(true);
    // Simulate upload
    setTimeout(() => {
      alert("Receipt uploaded successfully! Waiting for admin verification.");
      router.push("/");
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-cat-secondary mb-8">
        <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Booking ID</span>
          <span className="font-medium">{bookingId}</span>
        </div>
        <div className="flex justify-between py-2 border-b">
          <span className="text-gray-600">Total Amount</span>
          <span className="font-medium text-lg">RM{totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between py-2 font-bold text-cat-accent">
          <span>Deposit (30%)</span>
          <span>RM{depositAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-bold">1. Choose Payment Type</h2>
          <div className="flex gap-4">
            <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer text-center ${paymentType === 'deposit' ? 'border-cat-accent bg-cat-primary' : 'border-gray-200'}`}>
              <input type="radio" name="ptype" className="hidden" checked={paymentType === 'deposit'} onChange={() => setPaymentType('deposit')} />
              <div className="font-bold">Pay Deposit</div>
              <div className="text-sm text-gray-500">RM{depositAmount.toFixed(2)}</div>
            </label>
            <label className={`flex-1 border-2 rounded-xl p-4 cursor-pointer text-center ${paymentType === 'full' ? 'border-cat-accent bg-cat-primary' : 'border-gray-200'}`}>
              <input type="radio" name="ptype" className="hidden" checked={paymentType === 'full'} onChange={() => setPaymentType('full')} />
              <div className="font-bold">Pay Full</div>
              <div className="text-sm text-gray-500">RM{totalAmount.toFixed(2)}</div>
            </label>
          </div>

          <h2 className="text-xl font-bold mt-8">2. Transfer Details</h2>
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-sm text-gray-500 mb-2">Bank Transfer (Maybank)</p>
            <p className="font-bold text-lg">1122 3344 5566</p>
            <p className="text-sm font-medium">ASMAJU JAYA ENT.</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border text-center">
            <p className="text-sm text-gray-500 mb-2">Or Scan DuitNow QR</p>
            <div className="w-32 h-32 bg-gray-200 mx-auto flex items-center justify-center rounded">QR Placeholder</div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6">3. Upload Receipt</h2>
          <form onSubmit={handleUpload} className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cat-primary file:text-cat-accent hover:file:bg-cat-secondary"
              />
            </div>
            {file && <p className="text-sm text-green-600 text-center">Selected: {file.name}</p>}
            <button disabled={!file || isSubmitting} className="w-full bg-cat-accent text-white py-3 rounded-xl font-bold hover:bg-cat-accent/90 disabled:opacity-50">
              {isSubmitting ? "Uploading..." : "Submit Payment Proof"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
