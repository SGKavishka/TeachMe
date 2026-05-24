import clsx from "clsx";

const tones = {
  green: "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-100",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
};

export const Badge = ({ tone = "slate", className, children }) => {
  return (
    <span className={clsx("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  );
};

