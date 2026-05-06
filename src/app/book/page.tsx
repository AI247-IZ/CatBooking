"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import "react-day-picker/style.css";
import { db } from "@/lib/firebase";
import { collection, setDoc, doc, serverTimestamp } from "firebase/firestore";

export default function BookingPage() {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      suitePrice: "20",
      numberOfCats: 1
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");

  const suitePrice = watch("suitePrice", "20");
  const numCats = watch("numberOfCats", 1);

  // Calculate days and price
  let days = 0;
  if (range?.from && range?.to) {
    // Inclusive: 6/5 to 10/5 is 5 days
    days = differenceInDays(range.to, range.from) + 1;
  }
  
  const basePrice = parseInt(suitePrice);
  const extraCats = Math.max(0, numCats - 1);
  const extraCatFee = basePrice === 15 ? 0 : 10;
  const pricePerDay = basePrice + (extraCats * extraCatFee);
  const totalPrice = days * pricePerDay;
  const amountToPay = paymentType === "deposit" ? 50 : totalPrice;

  const onSubmit = async (data: any) => {
    if (!range?.from || !range?.to) {
      alert("Please select a date range");
      return;
    }

    setIsSubmitting(true);
    
    // Generate a simple ID: CB-XXXX (e.g., CB-A7B2)
    const simpleId = `CB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    try {
      // Prepare the final data with dates
      const finalData = {
        ...data,
        checkInDate: format(range.from, "yyyy-MM-dd"),
        checkOutDate: format(range.to, "yyyy-MM-dd"),
        totalPrice,
        amountToPay,
        paymentType,
        days,
        bookingId: simpleId,
        status: "pending",
        createdAt: new Date() // Fallback to JS date if no serverTimestamp
      };

      if (db) {
        // Save to Firestore with the simple ID as document name
        await setDoc(doc(db, "bookings", simpleId), {
          ...finalData,
          createdAt: serverTimestamp()
        });
        console.log("Booking saved with ID: ", simpleId);
        router.push(`/payment/${simpleId}?total=${totalPrice}&amount=${amountToPay}&days=${days}&paymentType=${paymentType}`);
      } else {
        // Fallback: Just redirect with the generated simple ID
        console.warn("Firebase not configured. Using mock redirection.");
        router.push(`/payment/${simpleId}?total=${totalPrice}&amount=${amountToPay}&days=${days}&paymentType=${paymentType}`);
      }
    } catch (error) {
      console.error("Error adding booking: ", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black mb-2 text-cat-dark">Book a Stay</h1>
        <p className="text-gray-500">Pick your dates and fill in the details for your furry friend.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Calendar Side */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-xl border border-cat-secondary flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-bold text-cat-dark">1. Select Stay Period</h2>
            {range?.from && (
              <button 
                onClick={() => setRange(undefined)}
                className="text-xs font-bold text-cat-accent hover:underline cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>
          
          <div className="p-2 bg-cat-primary/30 rounded-2xl border border-cat-primary w-full flex justify-center">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={{ before: new Date() }}
              footer={
                <div className="mt-6 p-4 bg-cat-dark text-white rounded-2xl text-sm shadow-inner w-full">
                  {range?.from ? (
                    range.to ? (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cat-accent rounded-xl flex items-center justify-center text-xl">📅</div>
                        <div>
                          <p className="text-white/70 text-xs uppercase font-bold tracking-wider">Stay Duration</p>
                          <p className="font-bold">
                            {format(range.from, "MMM d")} — {format(range.to, "MMM d, yyyy")}
                          </p>
                          <p className="text-cat-accent text-xs font-black">{days} {days === 1 ? 'day' : 'days'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">✨</div>
                        <p className="font-medium text-white/90 underline decoration-cat-accent decoration-2 underline-offset-4">Please select the check-out date.</p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">👋</div>
                      <p className="font-medium text-white/90">Welcome! Pick a start date to begin.</p>
                    </div>
                  )}
                </div>
              }
              classNames={{
                day_selected: "bg-cat-accent text-white rounded-full",
                day_today: "font-bold text-cat-accent underline",
                day_range_middle: "bg-cat-primary text-cat-dark rounded-none",
                day_range_start: "bg-cat-accent text-white rounded-l-full",
                day_range_end: "bg-cat-accent text-white rounded-r-full",
                chevron: "fill-cat-accent",
              }}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4 w-full">
            <div className="p-4 rounded-2xl border border-dashed border-cat-secondary bg-white">
              <span className="block text-[10px] uppercase font-black text-gray-400 mb-1">Check-in</span>
              <span className="font-bold text-cat-dark">{range?.from ? format(range.from, "dd/MM/yyyy") : "--/--/----"}</span>
            </div>
            <div className="p-4 rounded-2xl border border-dashed border-cat-secondary bg-white">
              <span className="block text-[10px] uppercase font-black text-gray-400 mb-1">Check-out</span>
              <span className="font-bold text-cat-dark">{range?.to ? format(range.to, "dd/MM/yyyy") : "--/--/----"}</span>
            </div>
          </div>
        </div>


        {/* Form Side */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-xl space-y-8 border border-cat-secondary">
          <div>
            <h2 className="text-xl font-bold mb-6 text-cat-dark flex items-center gap-2">
              <span className="w-8 h-8 bg-cat-primary text-cat-accent rounded-full flex items-center justify-center text-sm">2</span>
              Booking Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Package Type</label>
                <select {...register("suitePrice", { required: true })} className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none bg-white transition-colors cursor-pointer appearance-none">
                  <option value="15">Package A (RM15/day)</option>
                  <option value="20">Package B (RM20/day)</option>
                  <option value="25">Package C (RM25/day)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Number of Cats</label>
                <div className="relative">
                  <input type="number" min="1" max="5" {...register("numberOfCats", { required: true, min: 1 })} className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors" defaultValue={1} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cat-accent font-bold">Cats</span>
                </div>
                <p className={`text-[10px] font-bold text-gray-400 mt-1 uppercase ml-1 ${suitePrice === "15" ? "invisible" : ""}`}>+ RM10 for each additional cat</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-6 text-cat-dark flex items-center gap-2">
              <span className="w-8 h-8 bg-cat-primary text-cat-accent rounded-full flex items-center justify-center text-sm">3</span>
              Owner Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Full Name</label>
                <input type="text" {...register("name", { required: true })} placeholder="Your name" className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Phone Number</label>
                <input type="tel" {...register("phone", { required: true })} placeholder="012-3456789" className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors" />
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <label className="block text-sm font-bold text-cat-dark ml-1">Email Address</label>
              <input type="email" {...register("email", { required: true })} placeholder="hello@example.com" className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-cat-dark ml-1 flex items-center gap-2">
              Special Instructions 
              <span className="text-[10px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">Optional</span>
            </label>
            <textarea {...register("notes")} className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none min-h-[120px] transition-colors resize-none" placeholder="Allergies, medication, habits..."></textarea>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-cat-dark ml-1">Payment Option</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentType("full")}
                className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${
                  paymentType === "full" 
                    ? "border-cat-accent bg-cat-accent/5 text-cat-accent shadow-md" 
                    : "border-cat-primary bg-white text-gray-400 hover:border-cat-accent/30"
                }`}
              >
                Full Payment
              </button>
              <button
                type="button"
                onClick={() => setPaymentType("deposit")}
                className={`p-4 rounded-2xl border-2 transition-all text-sm font-bold ${
                  paymentType === "deposit" 
                    ? "border-cat-accent bg-cat-accent/5 text-cat-accent shadow-md" 
                    : "border-cat-primary bg-white text-gray-400 hover:border-cat-accent/30"
                }`}
              >
                Deposit (RM50)
              </button>
            </div>
          </div>

          <div className="bg-cat-dark p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cat-accent/10 rounded-full -ml-12 -mb-12 transition-transform group-hover:scale-150 duration-700 delay-100"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <div className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">
                {paymentType === "deposit" ? "Deposit to Pay" : "Total to Pay"}
              </div>
              <div className="text-white font-medium text-lg">
                {paymentType === "deposit" ? (
                  <>Fixed Deposit <span className="text-white/30 mx-1">/</span> RM{totalPrice} Total</>
                ) : (
                  <>{days} days <span className="text-white/30 mx-1">×</span> RM{pricePerDay}</>
                )}
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center md:items-end">
              <div className="text-5xl font-black text-cat-accent">
                RM{amountToPay}
              </div>
              <div className="text-[10px] text-white/40 font-bold uppercase mt-1 tracking-tighter">
                {paymentType === "deposit" ? "Due today" : "Include all taxes & fees"}
              </div>
              {paymentType === "deposit" && (
                <div className="mt-2 py-1 px-3 bg-white/10 rounded-full border border-white/10">
                  <span className="text-[9px] font-black text-cat-accent uppercase">Balance: RM{totalPrice - 50}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            disabled={isSubmitting || days <= 0} 
            type="submit" 
            className="w-full bg-cat-accent text-white p-5 rounded-2xl font-black text-xl hover:bg-cat-accent/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-cat-accent/20 disabled:opacity-50 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Secure Booking 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </span>
            )}
          </button>
        </form>
      </div>
    </div>

  );
}

