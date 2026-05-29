"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";

const ADMIN_PASSWORD = "As821966";

const PACKAGE_LABELS: Record<string, string> = {
  "15": "Package A — RM15/hari",
  "20": "Package B — RM20/hari",
  "25": "Package C — RM25/hari",
  "30": "Package D — RM30/hari",
};

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700 border-amber-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
};

const STATUS_DOT: Record<string, string> = {
  pending:   "bg-amber-400",
  confirmed: "bg-green-500",
  cancelled: "bg-red-400",
};

type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  suitePrice: string;
  numberOfRooms: number;
  numberOfCats: number;
  totalPrice: number;
  amountToPay: number;
  paymentType: string;
  days: number;
  notes?: string;
  status: string;
  bookingId: string;
  createdAt?: any;
};

export default function AdminPage() {
  const [password, setPassword]           = useState("");
  const [isAuth, setIsAuth]               = useState(false);
  const [authError, setAuthError]         = useState(false);
  const [bookings, setBookings]           = useState<Booking[]>([]);
  const [loading, setLoading]             = useState(false);
  const [filter, setFilter]               = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId]       = useState<string | null>(null);
  const [toast, setToast]                 = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async () => {
    if (!db) return;
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "bookings"));
      const list: Booking[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Booking));
      // Sort newest first (by bookingId or createdAt)
      list.sort((a, b) => b.bookingId?.localeCompare(a.bookingId ?? "") ?? 0);
      setBookings(list);
    } catch (e) {
      showToast("Gagal memuatkan senarai tempahan.", "err");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuth) fetchBookings();
  }, [isAuth]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuth(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleApprove = async (booking: Booking) => {
    if (!db) return;
    setActionLoading(booking.id);
    try {
      await updateDoc(doc(db, "bookings", booking.id), { status: "confirmed" });
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status: "confirmed" } : b))
      );
      showToast(`Tempahan ${booking.bookingId} disahkan! ✅`);
    } catch (e) {
      showToast("Gagal mengesahkan tempahan.", "err");
    }
    setActionLoading(null);
  };

  const handleCancel = async (booking: Booking) => {
    if (!db) return;
    setActionLoading(booking.id + "-cancel");
    try {
      await updateDoc(doc(db, "bookings", booking.id), { status: "cancelled" });
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status: "cancelled" } : b))
      );
      showToast(`Tempahan ${booking.bookingId} dibatalkan.`);
    } catch (e) {
      showToast("Gagal membatalkan tempahan.", "err");
    }
    setActionLoading(null);
  };

  const handleDelete = async (booking: Booking) => {
    if (!confirm(`Padam tempahan ${booking.bookingId} secara kekal?`)) return;
    if (!db) return;
    setActionLoading(booking.id + "-delete");
    try {
      await deleteDoc(doc(db, "bookings", booking.id));
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      showToast(`Tempahan ${booking.bookingId} dipadam.`);
    } catch (e) {
      showToast("Gagal memadam tempahan.", "err");
    }
    setActionLoading(null);
  };

  const filtered = bookings.filter((b) =>
    filter === "all" ? true : b.status === filter
  );

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  // ─── Login Screen ────────────────────────────────────────────────────────────
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-cat-primary flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 md:mb-10">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-cat-accent rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl mx-auto mb-4 md:mb-6 shadow-xl shadow-cat-accent/30">
              🐾
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-cat-dark">Admin Portal</h1>
            <p className="text-gray-500 text-xs md:text-sm mt-1">Purrfect Boarding Management</p>
          </div>

          <form
            onSubmit={handleLogin}
            className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-2xl border border-cat-secondary space-y-5 md:space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-black text-cat-dark block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setAuthError(false); }}
                placeholder="••••••••"
                className={`w-full p-3 md:p-4 rounded-xl md:rounded-2xl border-2 outline-none font-bold transition-colors text-sm md:text-base ${
                  authError
                    ? "border-red-300 bg-red-50 text-red-700"
                    : "border-cat-primary focus:border-cat-accent"
                }`}
              />
              {authError && (
                <p className="text-xs text-red-500 font-bold ml-1">
                  ❌ Password salah. Cuba lagi.
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-cat-accent text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:bg-cat-accent/90 transition-all shadow-xl shadow-cat-accent/20"
            >
              Log Masuk →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 md:top-6 right-4 md:right-6 z-50 px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl shadow-2xl font-bold text-xs md:text-sm animate-fade-in flex items-center gap-2 md:gap-3 ${
            toast.type === "ok"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          <span>{toast.type === "ok" ? "✅" : "❌"}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-cat-dark shadow-2xl px-4 md:px-6 py-4 md:py-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-11 md:h-11 bg-cat-accent rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg">
            🐾
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black text-white">Admin Dashboard</h1>
            <p className="text-white/40 text-[10px] md:text-xs">Purrfect Boarding — Pengurusan Tempahan</p>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={fetchBookings}
            disabled={loading}
            className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-1.5 md:gap-2 disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}>🔄</span>
            Refresh
          </button>
          <button
            onClick={() => setIsAuth(false)}
            className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg md:rounded-xl text-xs md:text-sm font-bold transition-all"
          >
            Log Keluar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`p-4 md:p-5 rounded-xl md:rounded-2xl border-2 text-left transition-all ${
                filter === s
                  ? "border-cat-accent bg-cat-accent/5 shadow-lg"
                  : "border-cat-primary bg-white hover:shadow-md"
              }`}
            >
              <div className="text-2xl md:text-3xl font-black text-cat-dark">{counts[s]}</div>
              <div className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-400 mt-1 capitalize">
                {s === "all" ? "Semua" : s === "pending" ? "Menunggu" : s === "confirmed" ? "Disahkan" : "Dibatalkan"}
              </div>
            </button>
          ))}
        </div>

        {/* Booking List */}
        {loading ? (
          <div className="text-center py-16 md:py-24">
            <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-cat-primary border-t-cat-accent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
            <p className="text-gray-400 font-bold text-sm md:text-base">Memuatkan tempahan...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 md:py-24 bg-white rounded-2xl md:rounded-3xl border border-cat-secondary">
            <div className="text-4xl md:text-6xl mb-3 md:mb-4">🐱</div>
            <p className="text-gray-400 font-bold text-base md:text-lg">Tiada tempahan dijumpai.</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filtered.map((booking) => {
              const isExpanded = expandedId === booking.id;
              const isAct = actionLoading?.startsWith(booking.id);
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl md:rounded-3xl border border-cat-secondary shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Row Header */}
                  <div
                    className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 cursor-pointer"
                    onClick={() => setExpandedId(isExpanded ? null : booking.id)}
                  >
                    {/* Left info */}
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-cat-primary rounded-xl md:rounded-2xl flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                        🐱
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                          <span className="font-black text-cat-dark text-base md:text-lg">{booking.name}</span>
                          <span className="text-[10px] bg-cat-primary text-cat-accent font-black px-2.5 md:px-3 py-0.5 md:py-1 rounded-full flex-shrink-0">
                            {booking.bookingId}
                          </span>
                          <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-wider px-2.5 md:px-3 py-0.5 md:py-1 rounded-full border flex-shrink-0 ${STATUS_STYLES[booking.status] ?? STATUS_STYLES.pending}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${STATUS_DOT[booking.status] ?? STATUS_DOT.pending}`}></span>
                            {booking.status}
                          </span>
                        </div>
                        <div className="text-[10px] md:text-xs text-gray-400 font-medium mt-1 flex items-center gap-2 md:gap-3 flex-wrap">
                          <span>📅 {booking.checkInDate} → {booking.checkOutDate}</span>
                          <span>🏠 {PACKAGE_LABELS[booking.suitePrice] ?? `RM${booking.suitePrice}/hari`}</span>
                          <span>🛏 {booking.numberOfRooms} bilik</span>
                          <span>🐱 {booking.numberOfCats} kucing</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: price + actions */}
                    <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-3 flex-shrink-0 w-full md:w-auto">
                      <div className="text-right md:mr-2 flex-1 md:flex-none">
                        <div className="text-xl md:text-2xl font-black text-cat-accent">
                          RM{booking.amountToPay?.toFixed(2)}
                        </div>
                        <div className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold">
                          {booking.paymentType === "deposit" ? "deposit" : "full payment"}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 md:gap-2 w-full md:w-auto">
                        {booking.status === "pending" && (
                          <>
                            <button
                              disabled={isAct}
                              onClick={(e) => { e.stopPropagation(); handleApprove(booking); }}
                              className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                              {actionLoading === booking.id ? (
                                <span className="w-2.5 h-2.5 md:w-3 md:h-3 border border-white/30 border-t-white rounded-full animate-spin"></span>
                              ) : "✅"} Sahkan
                            </button>
                            <button
                              disabled={isAct}
                              onClick={(e) => { e.stopPropagation(); handleCancel(booking); }}
                              className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all disabled:opacity-50"
                            >
                              ⛔ Batal
                            </button>
                          </>
                        )}

                        {booking.status === "confirmed" && (
                          <button
                            disabled={isAct}
                            onClick={(e) => { e.stopPropagation(); handleCancel(booking); }}
                            className="flex-1 md:flex-none px-3 md:px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all disabled:opacity-50"
                          >
                            ⛔ Batal
                          </button>
                        )}

                        <button
                          disabled={isAct}
                          onClick={(e) => { e.stopPropagation(); handleDelete(booking); }}
                          className="px-3 md:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black transition-all disabled:opacity-50"
                        >
                          {actionLoading === booking.id + "-delete" ? (
                            <span className="w-2.5 h-2.5 md:w-3 md:h-3 border border-red-300 border-t-red-500 rounded-full animate-spin inline-block"></span>
                          ) : "🗑️"} Padam
                        </button>

                        <span className={`text-gray-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""} self-center`}>
                          ▼
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="border-t border-cat-primary bg-cat-primary/20 px-4 md:px-6 py-4 md:py-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                      <div className="space-y-2 md:space-y-3">
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Maklumat Pemilik</p>
                        <div className="space-y-1 text-xs md:text-sm">
                          <p className="font-bold text-cat-dark">{booking.name}</p>
                          <p className="text-gray-500">📞 {booking.phone}</p>
                          <p className="text-gray-500">✉️ {booking.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Maklumat Tempahan</p>
                        <div className="space-y-1 text-xs md:text-sm text-gray-600">
                          <p>📅 Check-in: <span className="font-bold text-cat-dark">{booking.checkInDate}</span></p>
                          <p>📅 Check-out: <span className="font-bold text-cat-dark">{booking.checkOutDate}</span></p>
                          <p>⏱ Tempoh: <span className="font-bold text-cat-dark">{booking.days} hari</span></p>
                          <p>🏠 Pakej: <span className="font-bold text-cat-dark">{PACKAGE_LABELS[booking.suitePrice] ?? `RM${booking.suitePrice}/hari`}</span></p>
                          <p>🛏 Bilik: <span className="font-bold text-cat-dark">{booking.numberOfRooms}</span></p>
                          <p>🐱 Kucing: <span className="font-bold text-cat-dark">{booking.numberOfCats}</span></p>
                        </div>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Pembayaran</p>
                        <div className="space-y-1 text-xs md:text-sm text-gray-600">
                          <p>💰 Jumlah keseluruhan: <span className="font-bold text-cat-dark">RM{booking.totalPrice?.toFixed(2)}</span></p>
                          <p>💳 Jenis: <span className="font-bold text-cat-dark capitalize">{booking.paymentType}</span></p>
                          <p>✅ Bayar sekarang: <span className="font-black text-cat-accent text-sm md:text-base">RM{booking.amountToPay?.toFixed(2)}</span></p>
                          {booking.paymentType === "deposit" && (
                            <p>⏳ Baki: <span className="font-bold text-amber-600">RM{((booking.totalPrice ?? 0) - (booking.amountToPay ?? 0)).toFixed(2)}</span></p>
                          )}
                        </div>
                        {booking.notes && (
                          <div className="mt-2 md:mt-3 p-2.5 md:p-3 bg-white rounded-lg md:rounded-xl border border-cat-secondary text-[10px] md:text-xs text-gray-500">
                            <span className="font-bold text-cat-dark block mb-1">Nota Khas:</span>
                            {booking.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
