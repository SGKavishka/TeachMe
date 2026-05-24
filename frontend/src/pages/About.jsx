import { Award, Globe2, Handshake, Users } from "lucide-react";

export const About = () => {
  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-black text-slate-950 dark:text-white">About TeachMe</h1>
            <p className="mt-5 text-base leading-7 text-slate-600 dark:text-slate-300">
              TeachMe connects students with tutors who can teach unavailable lessons, difficult lectures, specialized topics, and exam-focused material.
            </p>
            <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
              The platform supports online and physical classes, topic-based discovery, learning requests, reviews, and direct messaging between students and teachers.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
            alt="Tutor helping students"
            className="h-[360px] w-full rounded-lg object-cover shadow-soft"
          />
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[
            { icon: Users, label: "Students first" },
            { icon: Award, label: "Qualified tutors" },
            { icon: Globe2, label: "Online access" },
            { icon: Handshake, label: "Trusted requests" }
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <item.icon className="h-6 w-6 text-brand-600" />
              <p className="mt-4 font-bold text-slate-950 dark:text-white">{item.label}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

