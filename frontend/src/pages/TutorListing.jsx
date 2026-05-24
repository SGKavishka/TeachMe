import { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import { SearchFilters } from "../components/tutors/SearchFilters.jsx";
import { TutorCard } from "../components/tutors/TutorCard.jsx";
import { mockTutors } from "../mocks/tutors.js";

export const TutorListing = ({ initialFilters = {} }) => {
  const [filters, setFilters] = useState({ search: "", category: "", location: "", mode: "", minPrice: "", maxPrice: "", minRating: "", ...initialFilters });
  const [tutors, setTutors] = useState(mockTutors);
  const [loading, setLoading] = useState(false);

  const loadTutors = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, value]) => value));
      const { data } = await api.get("/teachers", { params });
      setTutors(data.data?.length ? data.data : mockTutors);
    } catch {
      setTutors(mockTutors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTutors();
  }, []);

  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">Tutor listing</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Compare tutors by topic, class type, location, pricing, and rating.
          </p>
        </div>
        <SearchFilters filters={filters} setFilters={setFilters} onSubmit={loadTutors} />
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{loading ? "Loading tutors..." : `${tutors.length} tutors found`}</p>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tutors.map((tutor) => <TutorCard key={tutor._id} tutor={tutor} />)}
        </div>
      </section>
    </main>
  );
};
