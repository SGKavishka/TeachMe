import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </span>
            TeachMe
          </div>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
            A tutor marketplace for students who need access to lessons, lectures, and topics beyond their current classroom.
          </p>
        </div>
        <div>
          <p className="font-semibold text-slate-950 dark:text-white">Platform</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/tutors">Tutors</Link>
            <Link to="/search">Search</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-slate-950 dark:text-white">Support</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <a href="mailto:support@teachme.local">support@teachme.local</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

