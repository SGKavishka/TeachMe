import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";

export const Contact = () => {
  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <h1 className="text-4xl font-black text-slate-950 dark:text-white">Contact</h1>
          <p className="mt-4 max-w-xl leading-7 text-slate-600 dark:text-slate-300">
            Reach the platform team for support, tutor verification, partnership questions, or student account help.
          </p>
          <div className="mt-8 grid gap-4">
            <p className="flex items-center gap-3 text-slate-700 dark:text-slate-200"><Mail className="h-5 w-5 text-brand-600" /> support@teachme.local</p>
            <p className="flex items-center gap-3 text-slate-700 dark:text-slate-200"><Phone className="h-5 w-5 text-brand-600" /> +1 555 0182</p>
            <p className="flex items-center gap-3 text-slate-700 dark:text-slate-200"><MapPin className="h-5 w-5 text-brand-600" /> Remote support desk</p>
          </div>
        </div>
        <form className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4">
            <Input label="Name" required />
            <Input label="Email" type="email" required />
            <Input label="Subject" required />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Message</span>
              <textarea className="focus-ring min-h-36 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" required />
            </label>
            <Button type="submit">Send message</Button>
          </div>
        </form>
      </section>
    </main>
  );
};

