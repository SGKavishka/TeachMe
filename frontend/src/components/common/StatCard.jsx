export const StatCard = ({ icon: Icon, label, value, tone = "bg-brand-500" }) => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <span className={`flex h-11 w-11 items-center justify-center rounded-lg ${tone} text-white`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 break-words text-xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
};
