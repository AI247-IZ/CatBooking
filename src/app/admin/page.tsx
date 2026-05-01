"use client";

import { useState } from "react";

// Mock data
const mockBookings = [
  { id: "1", name: "Alice Smith", checkIn: "2026-06-01", checkOut: "2026-06-05", cats: 2, total: 250, status: "pending_payment", paymentType: "deposit", receiptUrl: null },
  { id: "2", name: "Bob Jones", checkIn: "2026-06-10", checkOut: "2026-06-12", cats: 1, total: 50, status: "deposit_paid", paymentType: "deposit", receiptUrl: "mock.jpg" },
];

export default function AdminDashboard() {
  const [bookings, setBookings] = useState(mockBookings);
  const [filter, setFilter] = useState("all");

  const handleApprove = (id: string, type: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: type === 'deposit' ? 'deposit_paid' : 'fully_paid' } : b));
    alert(`Booking ${id} approved!`);
  };

  const handleReject = (id: string) => {
    if(confirm("Are you sure you want to reject this booking?")) {
      setBookings(bookings.filter(b => b.id !== id));
    }
  };

  const filteredBookings = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <select 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded-xl outline-none focus:ring-cat-accent"
        >
          <option value="all">All Bookings</option>
          <option value="pending_payment">Pending Verification</option>
          <option value="deposit_paid">Deposit Paid</option>
          <option value="fully_paid">Fully Paid</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="p-4 font-medium text-gray-500">ID / Name</th>
                <th className="p-4 font-medium text-gray-500">Dates</th>
                <th className="p-4 font-medium text-gray-500">Cats / Price</th>
                <th className="p-4 font-medium text-gray-500">Status</th>
                <th className="p-4 font-medium text-gray-500">Receipt</th>
                <th className="p-4 font-medium text-gray-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold">{b.name}</div>
                    <div className="text-xs text-gray-500">#{b.id}</div>
                  </td>
                  <td className="p-4">
                    <div>{b.checkIn} to</div>
                    <div>{b.checkOut}</div>
                  </td>
                  <td className="p-4">
                    <div>{b.cats} cat(s)</div>
                    <div className="font-bold">${b.total}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      b.status === 'fully_paid' ? 'bg-green-100 text-green-700' :
                      b.status === 'deposit_paid' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {b.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    {b.receiptUrl ? (
                      <button className="text-blue-500 hover:underline text-sm">View Receipt</button>
                    ) : (
                      <span className="text-gray-400 text-sm">No receipt</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {b.status === 'pending_payment' && (
                      <button onClick={() => handleApprove(b.id, b.paymentType)} className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600">
                        Approve
                      </button>
                    )}
                    <button onClick={() => handleReject(b.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
