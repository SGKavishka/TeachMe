import { Link, useLocation, useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "../components/common/Button.jsx";

export const PaymentFailure = () => {
  const location = useLocation();
  const [params] = useSearchParams();
  const bookingId = params.get("booking");
  const message = location.state?.message || "Payment could not be completed.";

  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">Payment failed</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          {bookingId ? <Button as={Link} to={`/checkout/${bookingId}`}>Try again</Button> : null}
          <Button as={Link} to="/student/dashboard" variant="outline">Dashboard</Button>
        </div>
      </section>
    </main>
  );
};
