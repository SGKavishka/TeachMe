import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, CreditCard, ShieldCheck, Smartphone } from "lucide-react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { Select } from "../components/common/Select.jsx";
import { formatMoney, humanStatus, paymentStatusTone } from "../utils/payments.js";

export const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get(`/bookings/${id}`)
      .then(({ data }) => setBooking(data.data))
      .catch((err) => setError(err.response?.data?.message || "Checkout could not be loaded."));
  }, [id]);

  const idempotencyKey = useMemo(() => {
    const random = Math.random().toString(36).slice(2);
    return `checkout_${id}_${random}`;
  }, [id]);

  const pay = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError("");

    try {
      const { data } = await api.post(`/payments/bookings/${id}/pay`, {
        paymentMethod,
        paymentToken: paymentMethod === "demo" ? "" : "pm_demo_card",
        idempotencyKey
      });
      navigate(`/payments/success/${data.data._id}?booking=${id}`);
    } catch (err) {
      navigate(`/payments/failure?booking=${id}`, {
        state: { message: err.response?.data?.message || "Payment failed." }
      });
    } finally {
      setProcessing(false);
    }
  };

  if (error) return <main className="page-shell grid place-items-center bg-slate-50 px-4 text-slate-600 dark:bg-slate-950 dark:text-slate-300">{error}</main>;
  if (!booking) return <main className="page-shell grid place-items-center bg-slate-50 text-slate-500 dark:bg-slate-950">Loading...</main>;

  const currency = booking.price?.currency || "USD";

  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <form onSubmit={pay} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Secure checkout</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.subject}{booking.topic ? ` - ${booking.topic}` : ""}</p>
            </div>
            <Badge tone={paymentStatusTone(booking.paymentStatus)}>{humanStatus(booking.paymentStatus)}</Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`focus-ring rounded-lg border p-4 text-left ${paymentMethod === "card" ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-slate-200 dark:border-slate-800"}`}
            >
              <CreditCard className="h-5 w-5 text-brand-600" />
              <span className="mt-3 block font-semibold text-slate-950 dark:text-white">Card</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Credit/Debit</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("digital_wallet")}
              className={`focus-ring rounded-lg border p-4 text-left ${paymentMethod === "digital_wallet" ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-slate-200 dark:border-slate-800"}`}
            >
              <Smartphone className="h-5 w-5 text-cobalt-500" />
              <span className="mt-3 block font-semibold text-slate-950 dark:text-white">Digital wallet</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Provider token</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("demo")}
              className={`focus-ring rounded-lg border p-4 text-left ${paymentMethod === "demo" ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-slate-200 dark:border-slate-800"}`}
            >
              <BadgeCheck className="h-5 w-5 text-coral-500" />
              <span className="mt-3 block font-semibold text-slate-950 dark:text-white">Demo pay</span>
              <span className="mt-1 block text-sm text-slate-600 dark:text-slate-300">Development</span>
            </button>
          </div>

          <div className="mt-6 max-w-sm">
            <Select label="Payment method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="card">Credit/Debit card</option>
              <option value="digital_wallet">Digital wallet</option>
              <option value="demo">Demo payment</option>
            </Select>
          </div>

          {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{error}</p> : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={processing || booking.paymentStatus === "on_hold"}>
              <ShieldCheck className="h-4 w-4" />
              {processing ? "Processing..." : `Pay ${formatMoney(booking.price?.finalAmount, currency)}`}
            </Button>
            <Button as={Link} to={`/bookings/${id}/confirm`} variant="outline">Review summary</Button>
          </div>
        </form>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Order total</h2>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <div className="flex justify-between gap-3"><span>Teacher</span><span>{booking.teacher?.user?.name || "Tutor"}</span></div>
            <div className="flex justify-between gap-3"><span>Duration</span><span>{booking.sessionDurationMinutes || 60} min</span></div>
            <div className="flex justify-between gap-3"><span>Lesson</span><span>{formatMoney(booking.price?.amount, currency)}</span></div>
            <div className="flex justify-between gap-3"><span>Platform fee</span><span>{formatMoney(booking.price?.platformFee, currency)}</span></div>
            <div className="flex justify-between gap-3 border-t border-slate-200 pt-3 text-base font-bold text-slate-950 dark:border-slate-800 dark:text-white">
              <span>Payable</span><span>{formatMoney(booking.price?.finalAmount, currency)}</span>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
};
