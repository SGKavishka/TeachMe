import { NavLink } from "react-router-dom";
import { BookOpen, CalendarCheck, Heart, LayoutDashboard, MessageCircle, Settings, Users } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext.jsx";

const roleLinks = {
  student: [
    { to: "/student/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/tutors", label: "Find tutors", icon: BookOpen },
    { to: "/messages", label: "Messages", icon: MessageCircle },
    { to: "/student/dashboard", label: "Favorites", icon: Heart }
  ],
  teacher: [
    { to: "/teacher/dashboard", label: "Overview", icon: LayoutDashboard },
    { to: "/teacher/dashboard", label: "Requests", icon: CalendarCheck },
    { to: "/messages", label: "Messages", icon: MessageCircle },
    { to: "/teacher/dashboard", label: "Profile", icon: Settings }
  ],
  admin: [
    { to: "/admin", label: "Analytics", icon: LayoutDashboard },
    { to: "/admin", label: "Users", icon: Users },
    { to: "/admin", label: "Moderation", icon: Settings }
  ]
};

export const DashboardLayout = ({ title, subtitle, children }) => {
  const { user } = useAuth();
  const links = roleLinks[user?.role || "student"];

  return (
    <main className="page-shell bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="border-b border-slate-100 px-3 pb-3 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as</p>
            <p className="truncate font-semibold text-slate-950 dark:text-white">{user?.name}</p>
          </div>
          <nav className="mt-3 grid gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={`${link.to}-${link.label}`}
                  to={link.to}
                  className={({ isActive }) => clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition",
                    isActive ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <section>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-950 dark:text-white">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
          </div>
          {children}
        </section>
      </div>
    </main>
  );
};

