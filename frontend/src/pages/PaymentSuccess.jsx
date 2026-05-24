import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, ReceiptText } from "lucide-react";
import { Button } from "../components/common/Button.jsx";

export const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const bookingId = params.get("booking");

  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
          <CheckCircle2 className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">Payment received</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">The lesson payment is on hold until the class is completed and confirmed.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button as={Link} to="/student/wallet">
            <ReceiptText className="h-4 w-4" />
            View receipt
          </Button>
          <Button as={Link} to={bookingId ? `/bookings/${bookingId}/confirm` : "/student/dashboard"} variant="outline">Booking details</Button>
        </div>
      </section>
    </main>
  );
};
