import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Bell, GraduationCap, LayoutDashboard, LogOut, Menu, Moon, Search, Sun, UserCircle, X } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useNotifications } from "../../context/NotificationContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import { Button } from "../common/Button.jsx";

const links = [
  { to: "/", label: "Home" },
  { to: "/tutors", label: "Tutors" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" }
];

const dashboardPath = (role) => {
  if (role === "teacher") return "/teacher/dashboard";
  if (role === "admin") return "/admin";
  return "/student/dashboard";
};

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const navClass = ({ isActive }) => clsx(
    "rounded-lg px-3 py-2 text-sm font-semibold transition",
    isActive ? "bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white" : "text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <GraduationCap className="h-5 w-5" />
          </span>
          TeachMe
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => <NavLink key={link.to} to={link.to} className={navClass}>{link.label}</NavLink>)}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button as={Link} to="/search" variant="secondary" className="h-10 min-h-10 px-3" aria-label="Search">
            <Search className="h-4 w-4" />
          </Button>
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <>
              <Link to="/messages" className="focus-ring relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                {unreadCount ? <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-coral-500 px-1 text-center text-xs font-bold text-white">{unreadCount}</span> : null}
              </Link>
              <Button as={Link} to={dashboardPath(user?.role)} variant="outline">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <button type="button" onClick={logout} className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-200" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="outline">Login</Button>
              <Button as={Link} to="/register">Register</Button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="focus-ring flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 lg:hidden dark:border-slate-800"
          aria-label="Open menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="grid gap-2">
            {links.map((link) => <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className={navClass}>{link.label}</NavLink>)}
            <NavLink to="/search" onClick={() => setOpen(false)} className={navClass}>Search</NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to={dashboardPath(user?.role)} onClick={() => setOpen(false)} className={navClass}>Dashboard</NavLink>
                <NavLink to="/messages" onClick={() => setOpen(false)} className={navClass}>Messages</NavLink>
                <button type="button" onClick={logout} className="rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-600 dark:text-slate-300">Logout</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button as={Link} to="/login" variant="outline" onClick={() => setOpen(false)}>Login</Button>
                <Button as={Link} to="/register" onClick={() => setOpen(false)}>Register</Button>
              </div>
            )}
            <button type="button" onClick={toggleTheme} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
};

