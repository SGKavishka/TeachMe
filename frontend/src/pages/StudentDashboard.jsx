import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, BookOpen, CalendarCheck, CheckCircle2, CreditCard, Heart } from "lucide-react";
import { api } from "../api/axios.js";
import { Button } from "../components/common/Button.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { StatCard } from "../components/common/StatCard.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { TutorCard } from "../components/tutors/TutorCard.jsx";
import { mockTutors } from "../mocks/tutors.js";
import { formatMoney, humanStatus, paymentStatusTone } from "../utils/payments.js";

export const StudentDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [notice, setNotice] = useState("");

  const loadDashboard = () => {
    api.get("/students/dashboard")
      .then(({ data }) => {
        setBookings(data.data.bookings || []);
        setFavoritesCount(data.data.favoritesCount || 0);
      })
      .catch(() => {
        setBookings([]);
        setFavoritesCount(0);
      });
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const confirmCompletion = async (bookingId) => {
    setNotice("");
    try {
      await api.post(`/payments/bookings/${bookingId}/confirm-completion`);
      setNotice("Class confirmed and payment released.");
      loadDashboard();
    } catch (err) {
      setNotice(err.response?.data?.message || "Completion could not be confirmed.");
    }
  };

  return (
    <DashboardLayout title="Student dashboard" subtitle="Track learning requests, saved teachers, and upcoming classes.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={BookOpen} label="Active requests" value={bookings.filter((item) => item.status === "pending").length} tone="bg-brand-600" />
        <StatCard icon={CalendarCheck} label="Accepted classes" value={bookings.filter((item) => item.status === "accepted").length} tone="bg-cobalt-500" />
        <StatCard icon={Heart} label="Favorites" value={favoritesCount} tone="bg-coral-500" />
        <StatCard icon={CreditCard} label="Escrow holds" value={bookings.filter((item) => item.paymentStatus === "on_hold").length} tone="bg-slate-700" />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Requested classes</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Recent booking requests and their status.</p>
          </div>
          <Button as={Link} to="/tutors" variant="outline">Find tutors</Button>
        </div>
        {notice ? <p className="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{notice}</p> : null}

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Tutor</th>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Mode</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.length ? bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{booking.teacher?.user?.name || "Tutor"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{booking.subject}</td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{booking.mode === "physical" ? "Offline" : booking.mode}</td>
                  <td className="px-4 py-3"><Badge tone={paymentStatusTone(booking.status)}>{humanStatus(booking.status)}</Badge></td>
                  <td className="px-4 py-3"><Badge tone={paymentStatusTone(booking.paymentStatus)}>{humanStatus(booking.paymentStatus)}</Badge></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(booking.price?.finalAmount || booking.price?.amount, booking.price?.currency)}</td>
                  <td className="px-4 py-3">
                    {["pending", "accepted", "payment_pending"].includes(booking.status) && booking.paymentStatus === "pending" ? (
                      <Button as={Link} to={`/bookings/${booking._id}/confirm`} variant="outline" className="min-h-9 px-3 py-1.5">
                        <CreditCard className="h-4 w-4" />
                        Pay
                      </Button>
                    ) : null}
                    {booking.status === "teacher_completed" ? (
                      <div className="flex flex-wrap gap-2">
                        <Button type="button" onClick={() => confirmCompletion(booking._id)} className="min-h-9 px-3 py-1.5">
                          <CheckCircle2 className="h-4 w-4" />
                          Confirm
                        </Button>
                        <Button as={Link} to={`/bookings/${booking._id}/dispute`} variant="outline" className="min-h-9 px-3 py-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          Issue
                        </Button>
                      </div>
                    ) : null}
                    {booking.status === "waiting_completion" ? <span className="text-xs text-slate-500 dark:text-slate-400">Awaiting class</span> : null}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No learning requests yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Recommended tutors</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {mockTutors.slice(0, 3).map((tutor) => <TutorCard key={tutor._id} tutor={tutor} />)}
        </div>
      </section>
    </DashboardLayout>
  );
};
