import clsx from "clsx";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
  outline: "border border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
  danger: "bg-coral-500 text-white hover:bg-red-600"
};

export const Button = ({ as: Component = "button", variant = "primary", className, children, ...props }) => {
  return (
    <Component
      className={clsx(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

