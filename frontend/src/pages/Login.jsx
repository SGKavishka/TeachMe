import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form);
      const fallback = user.role === "teacher" ? "/teacher/dashboard" : user.role === "admin" ? "/admin" : "/student/dashboard";
      navigate(location.state?.from?.pathname || fallback, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Login</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Access your learning or tutoring dashboard.</p>
        {error ? <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{error}</div> : null}
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input icon={Mail} label="Email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input icon={Lock} label="Password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
          <div className="flex items-center justify-between text-sm">
            <Link to="/forgot-password" className="font-semibold text-brand-700 dark:text-brand-100">Forgot password?</Link>
            <Link to="/register" className="font-semibold text-slate-700 dark:text-slate-200">Create account</Link>
          </div>
          <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</Button>
        </form>
      </section>
    </main>
  );
};

