import { Link } from "react-router-dom";
import { Bookmark, MapPin, Monitor, School, ShieldCheck } from "lucide-react";
import { Badge } from "../common/Badge.jsx";
import { Button } from "../common/Button.jsx";
import { RatingStars } from "./RatingStars.jsx";

export const TutorCard = ({ tutor, onFavorite }) => {
  const primarySubject = tutor.subjects?.[0];
  const avatar = tutor.photo || tutor.user?.avatar || "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80";

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex-1">
        <div className="flex gap-4">
          <img src={avatar} alt={tutor.user?.name || "Tutor"} className="h-20 w-20 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link to={`/tutors/${tutor._id}`} className="truncate text-lg font-bold text-slate-950 hover:text-brand-700 dark:text-white">
                  {tutor.user?.name || "Tutor"}
                </Link>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{tutor.headline}</p>
              </div>
              <button
                type="button"
                onClick={() => onFavorite?.(tutor)}
                className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-brand-600 dark:border-slate-700"
                aria-label="Save tutor"
              >
                <Bookmark className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone="green">{primarySubject?.subject || "General"}</Badge>
              {tutor.isVerified ? (
                <Badge tone="blue">
                  <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                  Verified
                </Badge>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-slate-400" />
            {tutor.location?.city || "Remote"}
          </span>
          <span className="flex items-center gap-2">
            {tutor.classModes?.physical ? <School className="h-4 w-4 text-slate-400" /> : <Monitor className="h-4 w-4 text-slate-400" />}
            {tutor.classModes?.online && tutor.classModes?.physical ? "Online and physical" : tutor.classModes?.physical ? "Physical" : "Online"}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {(primarySubject?.topics || []).slice(0, 3).map((topic) => (
            <Badge key={topic}>{topic}</Badge>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
        <div>
          <RatingStars value={tutor.ratingAverage} count={tutor.ratingCount} />
          <p className="mt-1 text-sm font-semibold text-slate-950 dark:text-white">
            {tutor.pricing?.currency || "USD"} {tutor.pricing?.hourlyRate || 0}/hr
          </p>
        </div>
        <Button as={Link} to={`/tutors/${tutor._id}`} className="min-w-28">
          View
        </Button>
      </div>
    </article>
  );
};
