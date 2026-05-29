"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import "react-day-picker/style.css";
import { db } from "@/lib/firebase";
import { collection, setDoc, doc, serverTimestamp, getDocs, getDoc } from "firebase/firestore";

export default function BookingPage() {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      suitePrice: "20",
      numberOfCats: 1,
      numberOfRooms: 1,
      name: "",
      phone: "",
      email: "",
      notes: ""
    }
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const [paymentType, setPaymentType] = useState<"full" | "deposit">("full");
  const [bookings, setBookings] = useState<any[]>([]);
  const [suiteLimits, setSuiteLimits] = useState<Record<string, number>>({
    "15": 6,
    "20": 9,
    "25": 9,
    "30": 2
  });
  const [isRangeAvailable, setIsRangeAvailable] = useState(true);
  const [firstLimitingDate, setFirstLimitingDate] = useState("");
  const [maxBookedRoomsOnLimitDate, setMaxBookedRoomsOnLimitDate] = useState(0);

  const suitePrice = watch("suitePrice", "20");
  const numCats = parseInt(watch("numberOfCats") as any || "1");
  const numRooms = parseInt(watch("numberOfRooms") as any || "1");

  // Helper to count available slots for a specific date and package type
  const getAvailableSlotsForDate = (date: Date, price: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    let bookedCount = 0;
    bookings.forEach((booking) => {
      if (
        booking.suitePrice === price && 
        dateStr >= booking.checkInDate && 
        dateStr <= booking.checkOutDate &&
        booking.status !== "cancelled"
      ) {
        bookedCount += (booking.numberOfRooms || 1);
      }
    });
    const limit = suiteLimits[price] || 9;
    return Math.max(0, limit - bookedCount);
  };

  // Helper to get all dates in a range
  const getDatesInRange = (startDate: Date, endDate: Date) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Fetch bookings and settings from Firestore
  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;

      try {
        // Fetch suite limits config
        const settingsSnap = await getDoc(doc(db, "settings", "hotel"));
        if (settingsSnap.exists() && settingsSnap.data().suiteLimits) {
          const limits = settingsSnap.data().suiteLimits;
          setSuiteLimits(limits);
          if (typeof window !== "undefined") {
            localStorage.setItem("cat_hotel_suite_limits", JSON.stringify(limits));
          }
        }

        // Fetch bookings
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        const list: any[] = [];
        bookingsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.checkInDate && data.checkOutDate) {
            list.push({
              id: doc.id,
              ...data
            });
          }
        });
        setBookings(list);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  // Calculate days and price
  let days = 0;
  if (range?.from && range?.to) {
    days = differenceInDays(range.to, range.from) + 1;
  }

  // Check range availability whenever inputs change
  useEffect(() => {
    if (!range?.from || !range?.to) {
      setIsRangeAvailable(true);
      return;
    }

    const dates = getDatesInRange(range.from, range.to);
    let available = true;
    let limitingDate = "";
    let maxBookedRooms = 0;

    for (const date of dates) {
      const dateStr = format(date, "yyyy-MM-dd");
      let bookedCount = 0;
      bookings.forEach((booking) => {
        if (
          booking.suitePrice === suitePrice && 
          dateStr >= booking.checkInDate && 
          dateStr <= booking.checkOutDate &&
          booking.status !== "cancelled"
        ) {
          bookedCount += (booking.numberOfRooms || 1);
        }
      });

      const limit = suiteLimits[suitePrice] || 9;
      const availableRooms = limit - bookedCount;

      if (availableRooms < numRooms) {
        available = false;
        limitingDate = format(date, "dd/MM/yyyy");
        maxBookedRooms = bookedCount;
        break;
      }
    }

    setIsRangeAvailable(available);
    setFirstLimitingDate(limitingDate);
    setMaxBookedRoomsOnLimitDate(maxBookedRooms);
  }, [range, numRooms, suitePrice, bookings, suiteLimits]);
  
  const basePrice = parseInt(suitePrice);
  // Extra cats: only counted if total cats exceed number of rooms
  const extraCats = Math.max(0, numCats - numRooms);
  const extraCatFee = basePrice === 15 ? 0 : 10;
  // Price per day = (basePrice * rooms) + (extraCats * extraCatFee)
  const pricePerDay = (basePrice * numRooms) + (extraCats * extraCatFee);
  const totalPrice = days * pricePerDay;
  const depositAmount = totalPrice < 60 ? 20 : 50;
  const amountToPay = paymentType === "deposit" ? depositAmount : totalPrice;

  const onSubmit = async (data: any) => {
    if (!range?.from || !range?.to) {
      alert("Sila pilih tarikh masuk dan keluar.");
      return;
    }

    if (!isRangeAvailable) {
      alert("Slot tidak mencukupi untuk tarikh yang dipilih.");
      return;
    }

    setIsSubmitting(true);
    const simpleId = `CB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    
    console.log("DB instance:", db);
    console.log("Attempting to save booking...");
    
    try {
      const finalData = {
        ...data,
        numberOfRooms: parseInt(data.numberOfRooms || "1"),
        numberOfCats: parseInt(data.numberOfCats || "1"),
        checkInDate: format(range.from, "yyyy-MM-dd"),
        checkOutDate: format(range.to, "yyyy-MM-dd"),
        totalPrice,
        amountToPay,
        paymentType,
        days,
        bookingId: simpleId,
        status: "pending",
        createdAt: new Date()
      };

      if (db) {
        console.log("Saving to Firestore...");
        await setDoc(doc(db, "bookings", simpleId), {
          ...finalData,
          createdAt: serverTimestamp()
        });
        console.log("✅ Booking saved successfully with ID: ", simpleId);
        alert("Tempahan berjaya disimpan! Sila teruskan untuk menghantar ke WhatsApp.");
        router.push(`/payment/${simpleId}?total=${totalPrice}&amount=${amountToPay}&days=${days}&paymentType=${paymentType}&rooms=${numRooms}&name=${encodeURIComponent(data.name)}&checkIn=${format(range.from, "dd/MM/yyyy")}&checkOut=${format(range.to, "dd/MM/yyyy")}&pkg=${suitePrice}`);
      } else {
        console.warn("❌ Firebase DB is null!");
        alert("Firebase tidak dikonfigurasi. Sila pastikan fail .env.local wujud dan mempunyai butiran yang betul.");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      console.error("❌ Error adding booking: ", error);
      alert(`Ralat semasa menyimpan tempahan: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 md:py-12 px-4 space-y-8 md:space-y-12">
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-black mb-2 text-cat-dark">Book a Stay</h1>
        <p className="text-gray-500 text-sm md:text-base">Pick your dates and fill in the details for your furry friend.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
        {/* Calendar Side */}
        <div className="lg:col-span-5 bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-xl border border-cat-secondary flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-4 md:mb-6 px-2">
            <h2 className="text-lg md:text-xl font-bold text-cat-dark">1. Select Stay Period</h2>
            {range?.from && (
              <button 
                type="button"
                onClick={() => setRange(undefined)}
                className="text-xs font-bold text-cat-accent hover:underline cursor-pointer"
              >
                Clear Selection
              </button>
            )}
          </div>
          
          <div className="p-2 bg-cat-primary/30 rounded-xl md:rounded-2xl border border-cat-primary w-full flex justify-center overflow-x-auto">
            <DayPicker
              mode="range"
              selected={range}
              onSelect={setRange}
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (date < today) return true;
                const availableSlots = getAvailableSlotsForDate(date, suitePrice);
                return availableSlots < 1;
              }}
              footer={
                <div className="mt-4 md:mt-6 p-3 md:p-4 bg-cat-dark text-white rounded-xl md:rounded-2xl text-xs md:text-sm shadow-inner w-full">
                  {range?.from ? (
                    range.to ? (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-cat-accent rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl">📅</div>
                        <div>
                          <p className="text-white/70 text-[10px] md:text-xs uppercase font-bold tracking-wider">Stay Duration</p>
                          <p className="font-bold text-sm md:text-base">
                            {format(range.from, "MMM d")} — {format(range.to, "MMM d, yyyy")}
                          </p>
                          <p className="text-cat-accent text-[10px] md:text-xs font-black">{days} {days === 1 ? 'day' : 'days'}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center animate-pulse text-lg md:text-xl">✨</div>
                        <p className="font-medium text-white/90 text-xs md:text-sm underline decoration-cat-accent decoration-2 underline-offset-4">Please select the check-out date.</p>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl">👋</div>
                      <p className="font-medium text-white/90 text-xs md:text-sm">Welcome! Pick a start date to begin.</p>
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
                day_disabled: "text-gray-300 cursor-not-allowed opacity-50",
                chevron: "fill-cat-accent",
              }}
            />
          </div>
          
          <div className="mt-4 md:mt-6 grid grid-cols-2 gap-3 md:gap-4 w-full">
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl border border-dashed border-cat-secondary bg-white">
              <span className="block text-[9px] md:text-[10px] uppercase font-black text-gray-400 mb-1">Check-in</span>
              <span className="font-bold text-cat-dark text-sm md:text-base">{range?.from ? format(range.from, "dd/MM/yyyy") : "--/--/----"}</span>
            </div>
            <div className="p-3 md:p-4 rounded-xl md:rounded-2xl border border-dashed border-cat-secondary bg-white">
              <span className="block text-[9px] md:text-[10px] uppercase font-black text-gray-400 mb-1">Check-out</span>
              <span className="font-bold text-cat-dark text-sm md:text-base">{range?.to ? format(range.to, "dd/MM/yyyy") : "--/--/----"}</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl space-y-6 md:space-y-8 border border-cat-secondary">
          <div>
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cat-dark flex items-center gap-2">
              <span className="w-7 h-7 md:w-8 md:h-8 bg-cat-primary text-cat-accent rounded-full flex items-center justify-center text-xs md:text-sm">2</span>
              Booking Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Package Type</label>
                <select {...register("suitePrice", { required: true })} className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none bg-white transition-colors cursor-pointer appearance-none text-sm md:text-base">
                  <option value="15">Package A (RM15/day)</option>
                  <option value="20">Package B (RM20/day)</option>
                  <option value="25">Package C (RM25/day)</option>
                  <option value="30">Package D (RM30/day)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Number of Rooms</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1" 
                    max="9" 
                    onInput={(e) => {
                      const target = e.target as HTMLInputElement;
                      const value = target.value;
                      if (value.length > 1 || parseInt(value) > 9) {
                        target.value = value.slice(0, 1);
                      }
                    }}
                    {...register("numberOfRooms", { required: true, min: 1, max: 9 })} 
                    className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors font-bold text-sm md:text-base" 
                  />
                  <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-cat-accent font-bold text-sm md:text-base">Rooms</span>
                </div>
                <p className="text-[9px] md:text-[10px] font-bold text-gray-400 mt-1 uppercase ml-1">1 Room = 1 Slot</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Number of Cats</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    {...register("numberOfCats", { required: true, min: 1 })} 
                    className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors font-bold text-sm md:text-base" 
                  />
                  <span className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-cat-accent font-bold text-sm md:text-base">Cats</span>
                </div>
                <p className={`text-[9px] md:text-[10px] font-bold text-gray-400 mt-1 uppercase ml-1 ${suitePrice === "15" ? "invisible" : ""}`}>
                  + RM10 each extra cat
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-cat-dark flex items-center gap-2">
              <span className="w-7 h-7 md:w-8 md:h-8 bg-cat-primary text-cat-accent rounded-full flex items-center justify-center text-xs md:text-sm">3</span>
              Owner Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Full Name</label>
                <input type="text" {...register("name", { required: true })} placeholder="Your name" className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors text-sm md:text-base" />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Phone Number</label>
                <input type="tel" {...register("phone", { required: true })} placeholder="012-3456789" className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors text-sm md:text-base" />
              </div>
            </div>
            
            <div className="mt-4 md:mt-6 space-y-2">
              <label className="block text-sm font-bold text-cat-dark ml-1">Email Address</label>
              <input type="email" {...register("email", { required: true })} placeholder="hello@example.com" className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors text-sm md:text-base" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-cat-dark ml-1 flex items-center gap-2">
              Special Instructions 
              <span className="text-[9px] md:text-[10px] font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full uppercase">Optional</span>
            </label>
            <textarea {...register("notes")} className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none min-h-[100px] md:min-h-[120px] transition-colors resize-none text-sm md:text-base" placeholder="Allergies, medication, habits..."></textarea>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-bold text-cat-dark ml-1">Payment Option</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <button
                type="button"
                onClick={() => setPaymentType("full")}
                className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all text-sm md:text-base font-bold ${
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
                className={`p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all text-sm md:text-base font-bold ${
                  paymentType === "deposit" 
                    ? "border-cat-accent bg-cat-accent/5 text-cat-accent shadow-md" 
                    : "border-cat-primary bg-white text-gray-400 hover:border-cat-accent/30"
                }`}
              >
                Deposit (RM{depositAmount})
              </button>
            </div>
          </div>

          {/* Slot availability warning banner */}
          {!isRangeAvailable && (
            <div className="p-3 md:p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold flex items-start gap-3 animate-pulse">
              <span className="text-lg md:text-xl">⚠️</span>
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px] md:text-xs text-red-800">Slot Tidak Mencukupi</p>
                <p className="mt-1">
                  Pada tarikh <span className="underline font-black">{firstLimitingDate}</span>, hanya tinggal <span className="underline font-black">{(suiteLimits[suitePrice] || 9) - maxBookedRoomsOnLimitDate} bilik</span> sahaja yang kosong.
                </p>
                <p className="text-[10px] md:text-xs text-red-600/80 font-normal mt-0.5">Sila kurangkan bilangan bilik atau pilih tarikh lain.</p>
              </div>
            </div>
          )}


          <div className="bg-cat-dark p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] flex flex-col md:flex-row justify-between items-center gap-5 md:gap-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-full -mr-12 md:-mr-16 -mt-12 md:-mt-16 transition-transform group-hover:scale-150 duration-700"></div>
            <div className="absolute bottom-0 left-0 w-20 md:w-24 h-20 md:h-24 bg-cat-accent/10 rounded-full -ml-10 md:-ml-12 -mb-10 md:-mb-12 transition-transform group-hover:scale-150 duration-700 delay-100"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <div className="text-[10px] md:text-xs font-black text-white/50 uppercase tracking-widest mb-1">
                {paymentType === "deposit" ? "Deposit to Pay" : "Total to Pay"}
              </div>
              <div className="text-white font-medium text-sm md:text-lg">
                {paymentType === "deposit" ? (
                  <>Fixed Deposit <span className="text-white/30 mx-1">/</span> RM{totalPrice} Total</>
                ) : (
                  <>{days} days <span className="text-white/30 mx-1">×</span> RM{pricePerDay}</>
                )}
              </div>
              <div className="text-[10px] md:text-[11px] text-white/40 mt-1">
                Kiraan: (RM{basePrice} × {numRooms} rooms){extraCats > 0 ? ` + (RM${extraCatFee} × ${extraCats} extra cats)` : ""} × {days} days
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center md:items-end">
              <div className="text-3xl md:text-5xl font-black text-cat-accent">
                RM{amountToPay}
              </div>
              <div className="text-[9px] md:text-[10px] text-white/40 font-bold uppercase mt-1 tracking-tighter">
                {paymentType === "deposit" ? `Due today` : "Include all taxes & fees"}
              </div>
              {paymentType === "deposit" && (
                <div className="mt-2 md:mt-3 py-1.5 md:py-2 px-3 md:px-4 bg-cat-accent/20 rounded-lg md:rounded-xl border border-cat-accent/30">
                  <span className="text-[10px] md:text-xs font-black text-cat-accent uppercase tracking-wider">Balance to pay: RM{totalPrice - depositAmount}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            disabled={isSubmitting || days <= 0 || !isRangeAvailable} 
            type="submit" 
            className="w-full bg-cat-accent text-white p-4 md:p-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:bg-cat-accent/90 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-cat-accent/20 disabled:opacity-50 disabled:grayscale disabled:scale-100 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
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

