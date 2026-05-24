import { useEffect, useState } from "react";
import { CalendarCheck, Check, DollarSign, Users, X } from "lucide-react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";
import { Select } from "../components/common/Select.jsx";
import { StatCard } from "../components/common/StatCard.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";

export const TeacherDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    Promise.allSettled([api.get("/teachers/me"), api.get("/bookings")]).then(([profileResult, bookingsResult]) => {
      if (profileResult.status === "fulfilled") setProfile(profileResult.value.data.data);
      if (bookingsResult.status === "fulfilled") setBookings(bookingsResult.value.data.data || []);
    });
  }, []);

  const updateStatus = async (bookingId, status) => {
    const { data } = await api.patch(`/bookings/${bookingId}/status`, { status });
    setBookings((items) => items.map((item) => (item._id === bookingId ? data.data : item)));
  };

  const updateProfile = async (event) => {
    event.preventDefault();
    const { data } = await api.patch("/teachers/me", profile);
    setProfile(data.data);
    setNotice("Profile saved.");
  };

  return (
    <DashboardLayout title="Teacher dashboard" subtitle="Manage profile details, learning requests, pricing, and availability.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Students" value={bookings.length} tone="bg-brand-600" />
        <StatCard icon={CalendarCheck} label="Pending" value={bookings.filter((item) => item.status === "pending").length} tone="bg-cobalt-500" />
        <StatCard icon={Check} label="Accepted" value={bookings.filter((item) => item.status === "accepted").length} tone="bg-slate-700" />
        <StatCard icon={DollarSign} label="Hourly" value={`${profile?.pricing?.currency || "USD"} ${profile?.pricing?.hourlyRate || 0}`} tone="bg-coral-500" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Student requests</h2>
          <div className="mt-5 grid gap-3">
            {bookings.length ? bookings.map((booking) => (
              <div key={booking._id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-semibold text-slate-950 dark:text-white">{booking.student?.name || "Student"}</p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{booking.subject} {booking.topic ? `- ${booking.topic}` : ""}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{booking.message}</p>
                  </div>
                  <Badge tone={booking.status === "accepted" ? "green" : booking.status === "rejected" ? "amber" : "slate"}>{booking.status}</Badge>
                </div>
                {booking.status === "pending" ? (
                  <div className="mt-4 flex gap-2">
                    <Button type="button" onClick={() => updateStatus(booking._id, "accepted")}>
                      <Check className="h-4 w-4" />
                      Accept
                    </Button>
                    <Button type="button" variant="outline" onClick={() => updateStatus(booking._id, "rejected")}>
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                ) : null}
              </div>
            )) : <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No requests yet.</p>}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-950 dark:text-white">Tutor profile</h2>
          {notice ? <p className="mt-3 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-100">{notice}</p> : null}
          <form onSubmit={updateProfile} className="mt-5 grid gap-4">
            <Input label="Headline" value={profile?.headline || ""} onChange={(event) => setProfile({ ...profile, headline: event.target.value })} />
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Bio</span>
              <textarea
                value={profile?.bio || ""}
                onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                className="focus-ring min-h-28 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              />
            </label>
            <Input
              label="Hourly rate"
              type="number"
              min="0"
              value={profile?.pricing?.hourlyRate || 0}
              onChange={(event) => setProfile({ ...profile, pricing: { ...(profile?.pricing || {}), hourlyRate: Number(event.target.value) } })}
            />
            <Select value={profile?.profileStatus || "draft"} label="Profile status" onChange={(event) => setProfile({ ...profile, profileStatus: event.target.value })}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </Select>
            <Button type="submit" disabled={!profile}>Save profile</Button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
};

