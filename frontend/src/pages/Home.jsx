import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, CalendarCheck, MessageCircle, Search, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "../api/axios.js";
import { Button } from "../components/common/Button.jsx";
import { Badge } from "../components/common/Badge.jsx";
import { SearchFilters } from "../components/tutors/SearchFilters.jsx";
import { TutorCard } from "../components/tutors/TutorCard.jsx";
import { mockTutors } from "../mocks/tutors.js";

const learnerImage = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80";
const featuredTutorLimit = 9;

const getFeaturedTutors = (tutors = []) => {
  return tutors.length >= featuredTutorLimit
    ? tutors.slice(0, featuredTutorLimit)
    : mockTutors.slice(0, featuredTutorLimit);
};

export const Home = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "" });
  const [featured, setFeatured] = useState(mockTutors.slice(0, featuredTutorLimit));

  useEffect(() => {
    api.get("/teachers", { params: { limit: featuredTutorLimit } })
      .then(({ data }) => setFeatured(getFeaturedTutors(data.data)))
      .catch(() => setFeatured(mockTutors.slice(0, featuredTutorLimit)));
  }, []);

  const submitSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
    navigate(`/search?${params.toString()}`);
  };

  return (
    <main className="bg-slate-50 dark:bg-slate-950">
      <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="absolute inset-y-0 right-0 hidden w-[46%] lg:block">
          <img src={learnerImage} alt="Students learning together" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/55 to-transparent dark:from-slate-950 dark:via-slate-950/50" />
        </div>
        <div className="relative mx-auto grid min-h-[560px] max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
            <Badge tone="green" className="mb-5">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              Tutor marketplace
            </Badge>
            <h1 className="max-w-3xl text-4xl font-black leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Find the right teacher for the lesson you cannot access yet.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Search by subject, lecture, topic, location, mode, budget, and rating. Request online or physical sessions from tutors who match your learning needs.
            </p>
            <div className="mt-8 max-w-4xl">
              <SearchFilters filters={filters} setFilters={setFilters} onSubmit={submitSearch} compact />
            </div>
            <div className="mt-6 grid gap-3 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-3">
              <span className="flex items-center gap-2"><Search className="h-4 w-4 text-brand-600" /> Topic search</span>
              <span className="flex items-center gap-2"><CalendarCheck className="h-4 w-4 text-cobalt-500" /> Session requests</span>
              <span className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-coral-500" /> Tutor chat</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white">Featured tutors</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">High-rated profiles across popular subjects.</p>
          </div>
          <Button as={Link} to="/tutors" variant="outline">
            Browse all
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((tutor) => <TutorCard key={tutor._id} tutor={tutor} />)}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: BookOpen, title: "Structured profiles", body: "Subjects, topics, pricing, availability, qualifications, and class modes in one place." },
            { icon: ShieldCheck, title: "Role-based access", body: "Student, teacher, and admin workflows are separated with protected routes and JWT APIs." },
            { icon: MessageCircle, title: "Live communication", body: "Socket.io messaging and notifications are wired for booking and chat updates." }
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
              <item.icon className="h-6 w-6 text-brand-600" />
              <h3 className="mt-4 font-bold text-slate-950 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
