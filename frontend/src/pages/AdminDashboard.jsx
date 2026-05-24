import { useEffect, useState } from "react";
import { Ban, BarChart3, BookUser, GraduationCap, Users } from "lucide-react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { StatCard } from "../components/common/StatCard.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [users, setUsers] = useState([]);

  useEffect(() => {
    Promise.allSettled([api.get("/admin/analytics"), api.get("/admin/users")]).then(([analyticsResult, usersResult]) => {
      if (analyticsResult.status === "fulfilled") setAnalytics(analyticsResult.value.data.data);
      if (usersResult.status === "fulfilled") setUsers(usersResult.value.data.data || []);
    });
  }, []);

  const toggleStatus = async (target) => {
    const status = target.status === "active" ? "blocked" : "active";
    const { data } = await api.patch(`/admin/users/${target._id}/status`, { status });
    setUsers((items) => items.map((item) => (item._id === target._id ? data.data : item)));
  };

  return (
    <DashboardLayout title="Admin dashboard" subtitle="Manage users, tutors, reports, and platform analytics.">
      <div className="grid gap-4 md:grid-cols-5">
        <StatCard icon={Users} label="Users" value={analytics.users || 0} tone="bg-slate-700" />
        <StatCard icon={BookUser} label="Students" value={analytics.students || 0} tone="bg-brand-600" />
        <StatCard icon={GraduationCap} label="Tutors" value={analytics.teachers || 0} tone="bg-cobalt-500" />
        <StatCard icon={BarChart3} label="Bookings" value={analytics.bookings || 0} tone="bg-coral-500" />
        <StatCard icon={Ban} label="Reviews" value={analytics.reviews || 0} tone="bg-amber-500" />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Users</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{item.name}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.email}</td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{item.role}</td>
                  <td className="px-4 py-3"><Badge tone={item.status === "active" ? "green" : "amber"}>{item.status}</Badge></td>
                  <td className="px-4 py-3">
                    <Button type="button" variant="outline" onClick={() => toggleStatus(item)}>
                      {item.status === "active" ? "Block" : "Activate"}
                    </Button>
                  </td>
                </tr>
              ))}
              {!users.length ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No users loaded.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {["Tutor verification", "Reported messages", "Booking disputes"].map((title) => (
          <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Moderation queue placeholder for scalable admin workflows.</p>
          </div>
        ))}
      </section>
    </DashboardLayout>
  );
};

