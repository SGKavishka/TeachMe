export const Select = ({ label, children, ...props }) => {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span> : null}
      <select
        className="focus-ring min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        {...props}
      >
        {children}
      </select>
    </label>
  );
};

