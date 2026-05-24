import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, Clock, CreditCard, MapPin, UserRound } from "lucide-react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { formatMoney, humanStatus, paymentStatusTone } from "../utils/payments.js";

export const BookingConfirmation = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(({ data }) => setBooking(data.data))
      .catch((err) => setError(err.response?.data?.message || "Booking could not be loaded."));
  }, [id]);

  if (error) return <main className="page-shell grid place-items-center bg-slate-50 px-4 text-slate-600 dark:bg-slate-950 dark:text-slate-300">{error}</main>;
  if (!booking) return <main className="page-shell grid place-items-center bg-slate-50 text-slate-500 dark:bg-slate-950">Loading...</main>;

  const currency = booking.price?.currency || "USD";
  const canPay = !["on_hold", "released", "refunded", "partially_refunded"].includes(booking.paymentStatus);

  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Booking summary</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.subject}{booking.topic ? ` - ${booking.topic}` : ""}</p>
            </div>
            <Badge tone={paymentStatusTone(booking.paymentStatus)}>{humanStatus(booking.paymentStatus)}</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <UserRound className="h-5 w-5 text-brand-600" />
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{booking.teacher?.user?.name || "Tutor"}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Teacher/Tutor</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <MapPin className="h-5 w-5 text-cobalt-500" />
              <div>
                <p className="font-semibold capitalize text-slate-950 dark:text-white">{booking.mode === "physical" ? "Offline" : booking.mode}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Class type</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <CalendarDays className="h-5 w-5 text-coral-500" />
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{booking.preferredSchedule?.date ? new Date(booking.preferredSchedule.date).toLocaleDateString() : "Date pending"}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">{booking.preferredSchedule?.time || "Time pending"}</p>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <Clock className="h-5 w-5 text-amber-500" />
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{booking.sessionDurationMinutes || 60} minutes</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">Session duration</p>
              </div>
            </div>
          </div>

          {booking.message ? (
            <div className="mt-6 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-950 dark:text-white">Student note</p>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{booking.message}</p>
            </div>
          ) : null}
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Price details</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex justify-between gap-3"><span>Lesson price</span><span>{formatMoney(booking.price?.amount, currency)}</span></div>
            <div className="flex justify-between gap-3"><span>Platform fee</span><span>{formatMoney(booking.price?.platformFee, currency)}</span></div>
            <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-base font-bold text-slate-950 dark:border-slate-800 dark:text-white">
              <span>Final payable</span><span>{formatMoney(booking.price?.finalAmount, currency)}</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            {canPay ? (
              <Button as={Link} to={`/checkout/${booking._id}`}>
                <CreditCard className="h-4 w-4" />
                Confirm and pay
              </Button>
            ) : (
              <Button as={Link} to="/student/wallet" variant="outline">View payment history</Button>
            )}
            <Button as={Link} to="/student/dashboard" variant="outline">Back to dashboard</Button>
          </div>
        </aside>
      </section>
    </main>
  );
};
