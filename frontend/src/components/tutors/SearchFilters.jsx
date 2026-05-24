import { Search, SlidersHorizontal } from "lucide-react";
import { categories } from "../../mocks/tutors.js";
import { Button } from "../common/Button.jsx";
import { Input } from "../common/Input.jsx";
import { Select } from "../common/Select.jsx";

export const SearchFilters = ({ filters, setFilters, onSubmit, compact = false }) => {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <div className={compact ? "grid gap-3 md:grid-cols-[1fr_auto]" : "grid gap-3 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.8fr_auto]"}>
        <Input
          icon={Search}
          placeholder="Search subject, topic, lecture, or tutor"
          value={filters.search || ""}
          onChange={(event) => update("search", event.target.value)}
        />
        {!compact ? (
          <>
            <Select value={filters.category || ""} onChange={(event) => update("category", event.target.value)} aria-label="Category">
              <option value="">All categories</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </Select>
            <Input placeholder="Location" value={filters.location || ""} onChange={(event) => update("location", event.target.value)} />
            <Select value={filters.mode || ""} onChange={(event) => update("mode", event.target.value)} aria-label="Class mode">
              <option value="">Any mode</option>
              <option value="online">Online</option>
              <option value="physical">Physical</option>
            </Select>
          </>
        ) : null}
        <Button type="submit">
          <SlidersHorizontal className="h-4 w-4" />
          Search
        </Button>
      </div>

      {!compact ? (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Input type="number" min="0" placeholder="Min price" value={filters.minPrice || ""} onChange={(event) => update("minPrice", event.target.value)} />
          <Input type="number" min="0" placeholder="Max price" value={filters.maxPrice || ""} onChange={(event) => update("maxPrice", event.target.value)} />
          <Select value={filters.minRating || ""} onChange={(event) => update("minRating", event.target.value)} aria-label="Minimum rating">
            <option value="">Any rating</option>
            <option value="4">4 stars and up</option>
            <option value="4.5">4.5 stars and up</option>
          </Select>
        </div>
      ) : null}
    </form>
  );
};
