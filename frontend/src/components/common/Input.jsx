import clsx from "clsx";

export const Input = ({ label, icon: Icon, className, error, ...props }) => {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span> : null}
      <span className="relative block">
        {Icon ? <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /> : null}
        <input
          className={clsx(
            "focus-ring min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
            Icon && "pl-10",
            error && "border-red-400",
            className
          )}
          {...props}
        />
      </span>
      {error ? <span className="mt-1 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
};

