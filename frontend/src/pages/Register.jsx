import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, Phone, User } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";
import { Select } from "../components/common/Select.jsx";

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "student", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Create account</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Register as a student or tutor.</p>
        {error ? <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{error}</div> : null}
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input icon={User} label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input icon={Mail} label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input icon={Phone} label="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          <Select label="Role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
            <option value="student">Student</option>
            <option value="teacher">Teacher/Tutor</option>
          </Select>
          <Input icon={Lock} label="Password" type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Register"}</Button>
          <p className="text-center text-sm text-slate-600 dark:text-slate-300">
            Already registered? <Link to="/login" className="font-semibold text-brand-700 dark:text-brand-100">Login</Link>
          </p>
        </form>
      </section>
    </main>
  );
};

