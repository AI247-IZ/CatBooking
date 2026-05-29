"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { DayPicker, DateRange } from "react-day-picker";
import { format, differenceInDays } from "date-fns";
import "react-day-picker/style.css";
import { db } from "@/lib/firebase";
import { collection, setDoc, doc, getDoc, getDocs, serverTimestamp } from "firebase/firestore";

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
  
  // Slots Configuration & Data
  const [bookings, setBookings] = useState<any[]>([]);
  const [suiteLimits, setSuiteLimits] = useState<Record<string, number>>({
    "15": 6,
    "20": 9,
    "25": 9,
    "30": 2
  });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const suitePrice = watch("suitePrice", "20");
  const numCats = parseInt(watch("numberOfCats") as any || "1");
  const numRooms = parseInt(watch("numberOfRooms") as any || "1");

  // Fetch bookings and settings from Firestore
  useEffect(() => {
    // Read from localStorage first for immediate local UI update
    if (typeof window !== "undefined") {
      const localLimits = localStorage.getItem("cat_hotel_suite_limits");
      if (localLimits) {
        try {
          setSuiteLimits(JSON.parse(localLimits));
        } catch (e) {
          console.error("Failed to parse localLimits:", e);
        }
      }
    }

    const fetchSettingsAndBookings = async () => {
      if (!db) return;
      try {
        // 1. Fetch suite limits config
        const settingsSnap = await getDoc(doc(db, "settings", "hotel"));
        if (settingsSnap.exists() && settingsSnap.data().suiteLimits) {
          const limits = settingsSnap.data().suiteLimits;
          setSuiteLimits(limits);
          if (typeof window !== "undefined") {
            localStorage.setItem("cat_hotel_suite_limits", JSON.stringify(limits));
          }
        }

        // 2. Fetch bookings
        const bookingsSnap = await getDocs(collection(db, "bookings"));
        const list: any[] = [];
        bookingsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.checkInDate && data.status !== "cancelled") {
            list.push({
              id: doc.id,
              ...data
            });
          }
        });
        setBookings(list);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchSettingsAndBookings();
  }, []);

  // Helper to count available slots for a specific date and package type (suitePrice)
  const getAvailableSlotsForDate = (date: Date, price: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    let bookedCount = 0;
    bookings.forEach((booking) => {
      // Check if booking has the same suitePrice (package type) and overlaps
      if (booking.suitePrice === price && dateStr >= booking.checkInDate && dateStr <= booking.checkOutDate) {
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

  // Calculate days and price
  let days = 0;
  if (range?.from && range?.to) {
    days = differenceInDays(range.to, range.from) + 1;
  }
  
  const basePrice = parseInt(suitePrice);
  // Extra cats: only counted if total cats exceed number of rooms
  const extraCats = Math.max(0, numCats - numRooms);
  const extraCatFee = basePrice === 15 ? 0 : 10;
  // Price per day = (basePrice * rooms) + (extraCats * extraCatFee)
  const pricePerDay = (basePrice * numRooms) + (extraCats * extraCatFee);
  const totalPrice = days * pricePerDay;
  const depositAmount = totalPrice < 60 ? 20 : 50;
  const amountToPay = paymentType === "deposit" ? depositAmount : totalPrice;

  // Check if range has enough slots for selected rooms
  let isRangeAvailable = true;
  let firstLimitingDate = "";
  let maxBookedRoomsOnLimitDate = 0;

  if (range?.from && range?.to) {
    const dates = getDatesInRange(range.from, range.to);
    for (const date of dates) {
      const dateStr = format(date, "yyyy-MM-dd");
      let bookedCount = 0;
      bookings.forEach((booking) => {
        // Compare package-specific limits
        if (booking.suitePrice === suitePrice && dateStr >= booking.checkInDate && dateStr <= booking.checkOutDate) {
          bookedCount += (booking.numberOfRooms || 1);
        }
      });
      const limit = suiteLimits[suitePrice] || 9;
      const available = limit - bookedCount;
      if (available < numRooms) {
        isRangeAvailable = false;
        firstLimitingDate = format(date, "dd/MM/yyyy");
        maxBookedRoomsOnLimitDate = bookedCount;
        break;
      }
    }
  }

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
        await setDoc(doc(db, "bookings", simpleId), {
          ...finalData,
          createdAt: serverTimestamp()
        });
        console.log("Booking saved with ID: ", simpleId);
        router.push(`/payment/${simpleId}?total=${totalPrice}&amount=${amountToPay}&days=${days}&paymentType=${paymentType}&rooms=${numRooms}&name=${encodeURIComponent(data.name)}&checkIn=${format(range.from, "dd/MM/yyyy")}&checkOut=${format(range.to, "dd/MM/yyyy")}&pkg=${suitePrice}`);
      } else {
        console.warn("Firebase not configured. Using mock redirection.");
        router.push(`/payment/${simpleId}?total=${totalPrice}&amount=${amountToPay}&days=${days}&paymentType=${paymentType}&rooms=${numRooms}&name=${encodeURIComponent(data.name)}&checkIn=${format(range.from, "dd/MM/yyyy")}&checkOut=${format(range.to, "dd/MM/yyyy")}&pkg=${suitePrice}`);
      }
    } catch (error) {
      console.error("Error adding booking: ", error);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-12">
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
                type="button"
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
              disabled={(date) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (date < today) return true;
                return getAvailableSlotsForDate(date, suitePrice) <= 0;
              }}
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Package Type</label>
                <select {...register("suitePrice", { required: true })} className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none bg-white transition-colors cursor-pointer appearance-none">
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
                    max="10" 
                    {...register("numberOfRooms", { required: true, min: 1 })} 
                    className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors font-bold" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cat-accent font-bold">Rooms</span>
                </div>
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase ml-1">1 Room = 1 Slot</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-cat-dark ml-1">Number of Cats</label>
                <div className="relative">
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    {...register("numberOfCats", { required: true, min: 1 })} 
                    className="w-full p-4 rounded-2xl border-2 border-cat-primary focus:border-cat-accent outline-none transition-colors font-bold" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cat-accent font-bold">Cats</span>
                </div>
                <p className={`text-[10px] font-bold text-gray-400 mt-1 uppercase ml-1 ${suitePrice === "15" ? "invisible" : ""}`}>
                  + RM10 each extra cat
                </p>
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
                Deposit (RM{depositAmount})
              </button>
            </div>
          </div>

          {/* Slot availability warning banner */}
          {!isRangeAvailable && (
            <div className="p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-sm font-bold flex items-start gap-3 animate-pulse">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-bold uppercase tracking-wider text-xs text-red-800">Slot Tidak Mencukupi</p>
                <p className="mt-1">
                  Pada tarikh <span className="underline font-black">{firstLimitingDate}</span>, hanya tinggal <span className="underline font-black">{(suiteLimits[suitePrice] || 9) - maxBookedRoomsOnLimitDate} bilik</span> sahaja yang kosong.
                </p>
                <p className="text-xs text-red-600/80 font-normal mt-0.5">Sila kurangkan bilangan bilik atau pilih tarikh lain.</p>
              </div>
            </div>
          )}

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
              <div className="text-[11px] text-white/40 mt-1">
                Kiraan: (RM{basePrice} × {numRooms} rooms){extraCats > 0 ? ` + (RM${extraCatFee} × ${extraCats} extra cats)` : ""} × {days} days
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col items-center md:items-end">
              <div className="text-5xl font-black text-cat-accent">
                RM{amountToPay}
              </div>
              <div className="text-[10px] text-white/40 font-bold uppercase mt-1 tracking-tighter">
                {paymentType === "deposit" ? `Due today` : "Include all taxes & fees"}
              </div>
              {paymentType === "deposit" && (
                <div className="mt-3 py-2 px-4 bg-cat-accent/20 rounded-xl border border-cat-accent/30">
                  <span className="text-xs font-black text-cat-accent uppercase tracking-wider">Balance to pay: RM{totalPrice - depositAmount}</span>
                </div>
              )}
            </div>
          </div>

          <button 
            disabled={isSubmitting || days <= 0 || !isRangeAvailable} 
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

      {/* Admin Slot Management Section */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-cat-secondary">
        <div className="flex justify-between items-center border-b border-cat-primary pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-cat-dark flex items-center gap-2">
              ⚙️ Pengurusan Slot Hotel
            </h2>
            <p className="text-sm text-gray-500 mt-1">Konfigurasi bilangan bilik tersedia & semak jadual tempahan.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminUnlocked(!isAdminUnlocked)}
            className="px-5 py-2.5 rounded-xl bg-cat-primary hover:bg-cat-primary/85 text-cat-dark font-black text-xs uppercase tracking-wider transition-all"
          >
            {isAdminUnlocked ? "Tutup Tetapan" : "Buka Tetapan"}
          </button>
        </div>

        {isAdminUnlocked && (
          <div className="space-y-8 animate-fade-in">
            {/* Setting Form */}
            <div className="bg-cat-primary/30 p-6 rounded-2xl border border-cat-primary space-y-6">
              <div>
                <h3 className="text-lg font-bold text-cat-dark">Had Slot Mengikut Pakej (Slots Limit per Package)</h3>
                <p className="text-xs text-gray-500 mt-1">Konfigurasi bilangan bilik tersedia untuk setiap pakej penginapan.</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { price: "15", label: "RM15 (Package A)" },
                  { price: "20", label: "RM20 (Package B)" },
                  { price: "25", label: "RM25 (Package C)" },
                  { price: "30", label: "RM30 (Package D)" }
                ].map((item) => (
                  <div key={item.price} className="space-y-2">
                    <label className="block text-xs font-bold text-cat-dark">{item.label}</label>
                    <input
                      type="number"
                      min="1"
                      value={suiteLimits[item.price] || 0}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setSuiteLimits(prev => ({
                          ...prev,
                          [item.price]: val
                        }));
                      }}
                      className="w-full p-4 rounded-xl border border-cat-secondary bg-white font-bold text-sm focus:border-cat-accent outline-none"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                disabled={isUpdatingSettings}
                onClick={async () => {
                  setIsUpdatingSettings(true);
                  if (typeof window !== "undefined") {
                    localStorage.setItem("cat_hotel_suite_limits", JSON.stringify(suiteLimits));
                  }
                  if (db) {
                    try {
                      await setDoc(doc(db, "settings", "hotel"), { suiteLimits }, { merge: true });
                      alert("Had slot berjaya dikemaskini!");
                    } catch (e) {
                      console.error("Firestore write failed, falling back to local storage:", e);
                      alert("Had slot berjaya disimpan secara lokal (Firebase tiada kebenaran write).");
                    }
                  } else {
                    alert("Had slot dikemaskini dalam browser sahaja.");
                  }
                  setIsUpdatingSettings(false);
                }}
                className="px-8 py-4 bg-cat-accent hover:bg-cat-accent/90 text-white rounded-xl font-black text-sm transition-all disabled:opacity-50"
              >
                {isUpdatingSettings ? "Mengemaskini..." : "Simpan Tetapan Slot"}
              </button>
            </div>

            {/* Booked dates summary */}
            <div>
              <h3 className="text-lg font-bold text-cat-dark mb-2">
                Jadual Penggunaan Slot - Pakej RM{suitePrice} (30 Hari Akan Datang)
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                Menunjukkan bilangan bilik yang ditempah bagi pakej RM{suitePrice} berbanding had limit ({suiteLimits[suitePrice] || 9} bilik).
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {Array.from({ length: 30 }).map((_, index) => {
                  const date = new Date();
                  date.setDate(date.getDate() + index);
                  const dateStr = format(date, "yyyy-MM-dd");
                  
                  // Count total booked slots for this date and package
                  let booked = 0;
                  bookings.forEach((booking) => {
                    if (booking.suitePrice === suitePrice && dateStr >= booking.checkInDate && dateStr <= booking.checkOutDate) {
                      booked += (booking.numberOfRooms || 1);
                    }
                  });
                  
                  const limit = suiteLimits[suitePrice] || 9;
                  const available = Math.max(0, limit - booked);
                  const isFull = available <= 0;
                  
                  return (
                    <div 
                      key={index} 
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        isFull 
                          ? "bg-red-50 border-red-200 text-red-700 animate-pulse-soft" 
                          : booked > 0 
                            ? "bg-amber-50 border-amber-200 text-amber-700" 
                            : "bg-gray-50 border-gray-100 text-gray-400"
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-wider">
                        {format(date, "EEE, MMM d")}
                      </div>
                      <div className="text-xl font-black mt-2">
                        {booked} / {limit}
                      </div>
                      <div className="text-[9px] font-bold uppercase mt-1">
                        {isFull ? "Penuh ❌" : `${available} Slot Kosong`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

