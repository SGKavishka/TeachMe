import { Star } from "lucide-react";

export const RatingStars = ({ value = 0, count }) => {
  return (
    <div className="flex items-center gap-1 text-sm">
      {[1, 2, 3, 4, 5].map((item) => (
        <Star
          key={item}
          className={item <= Math.round(value) ? "h-4 w-4 fill-amber-400 text-amber-400" : "h-4 w-4 text-slate-300"}
        />
      ))}
      <span className="ml-1 font-medium text-slate-700 dark:text-slate-200">{Number(value).toFixed(1)}</span>
      {count !== undefined ? <span className="text-slate-500 dark:text-slate-400">({count})</span> : null}
    </div>
  );
};

