import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/axios.js";
import { Button } from "../components/common/Button.jsx";
import { Select } from "../components/common/Select.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";

export const ReportIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [form, setForm] = useState({ reason: "class_not_held", description: "" });
  const [notice, setNotice] = useState("");

  useEffect(() => {
    api.get(`/bookings/${id}`).then(({ data }) => setBooking(data.data)).catch(() => setBooking(null));
  }, [id]);

  const submit = async (event) => {
    event.preventDefault();
    setNotice("");
    try {
      await api.post(`/payments/bookings/${id}/disputes`, form);
      navigate("/student/disputes");
    } catch (err) {
      setNotice(err.response?.data?.message || "Issue could not be reported.");
    }
  };

  return (
    <DashboardLayout title="Report issue" subtitle={booking ? `${booking.subject}${booking.topic ? ` - ${booking.topic}` : ""}` : "Booking dispute"}>
      <section className="max-w-2xl rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {notice ? <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-500/10 dark:text-amber-100">{notice}</p> : null}
        <form onSubmit={submit} className="grid gap-4">
          <Select label="Reason" value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })}>
            <option value="class_not_held">Class did not happen</option>
            <option value="teacher_absent">Teacher was absent</option>
            <option value="quality_issue">Quality issue</option>
            <option value="other">Other</option>
          </Select>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">Details</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="focus-ring min-h-36 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              required
            />
          </label>
          <Button type="submit">Submit issue</Button>
        </form>
      </section>
    </DashboardLayout>
  );
};
