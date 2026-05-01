"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const suitePrice = watch("suitePrice", "20");
  const checkIn = watch("checkInDate");
  const checkOut = watch("checkOutDate");
  const numCats = watch("numberOfCats", 1);

  // Calculate days and price
  let days = 0;
  if (checkIn && checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  }
  
  const basePrice = parseInt(suitePrice);
  const extraCats = Math.max(0, numCats - 1);
  const extraCatFee = basePrice === 15 ? 0 : 10;
  const pricePerDay = basePrice + (extraCats * extraCatFee);
  const totalPrice = days * pricePerDay;

  const onSubmit = async () => {
    setIsSubmitting(true);
    // In a real app, send to API route here
    // const res = await fetch('/api/book', { method: 'POST', body: JSON.stringify({...data, totalPrice}) });
    // const result = await res.json();
    
    // Simulating API call
    setTimeout(() => {
      // Mock ID
      router.push(`/payment/mock-id-123`);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Book a Stay</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-3xl shadow-lg space-y-6 border border-cat-secondary">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Check-in Date</label>
            <input type="date" {...register("checkInDate", { required: true })} className="w-full p-3 rounded-xl border focus:ring-cat-accent focus:border-cat-accent outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Check-out Date</label>
            <input type="date" {...register("checkOutDate", { required: true })} className="w-full p-3 rounded-xl border focus:ring-cat-accent focus:border-cat-accent outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Package Type</label>
            <select {...register("suitePrice", { required: true })} className="w-full p-3 rounded-xl border outline-none bg-white">
              <option value="15">Package A (RM15/day)</option>
              <option value="20">Package B (RM20/day)</option>
              <option value="25">Package C (RM25/day)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Number of Cats</label>
            <input type="number" min="1" max="5" {...register("numberOfCats", { required: true, min: 1 })} className="w-full p-3 rounded-xl border outline-none" />
            <p className={`text-xs text-gray-500 mt-1 ${suitePrice === "15" ? "invisible" : ""}`}>+ RM10 for each additional cat</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input type="text" {...register("name", { required: true })} className="w-full p-3 rounded-xl border outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" {...register("phone", { required: true })} className="w-full p-3 rounded-xl border outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input type="email" {...register("email", { required: true })} className="w-full p-3 rounded-xl border outline-none" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Special Instructions / Notes</label>
          <textarea {...register("notes")} className="w-full p-3 rounded-xl border outline-none min-h-[100px]" placeholder="Allergies, medication, habits..."></textarea>
        </div>

        <div className="bg-cat-primary p-6 rounded-2xl flex justify-between items-center">
          <div>
            <div className="text-sm font-medium text-cat-text/70">Total Summary</div>
            <div className="font-bold">{days} days at RM{pricePerDay}/day</div>
          </div>
          <div className="text-3xl font-black text-cat-accent">
            RM{totalPrice}
          </div>
        </div>

        <button disabled={isSubmitting || days <= 0} type="submit" className="w-full bg-cat-dark text-white p-4 rounded-xl font-bold text-lg hover:bg-black transition disabled:opacity-50">
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}
