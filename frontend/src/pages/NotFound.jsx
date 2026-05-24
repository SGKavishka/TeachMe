import { Link } from "react-router-dom";
import { Button } from "../components/common/Button.jsx";

export const NotFound = () => {
  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 dark:bg-slate-950">
      <section className="max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-brand-700 dark:text-brand-100">404</p>
        <h1 className="mt-3 text-3xl font-black text-slate-950 dark:text-white">Page not found</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-300">The page you requested does not exist.</p>
        <Button as={Link} to="/" className="mt-6">Go home</Button>
      </section>
    </main>
  );
};

