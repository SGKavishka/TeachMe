import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Lock } from "lucide-react";
import { api } from "../api/axios.js";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const { data } = await api.patch(`/auth/reset-password/${token}`, { password });
      setSession(data);
      navigate(data.user.role === "teacher" ? "/teacher/dashboard" : "/student/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">New password</h1>
        {error ? <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">{error}</p> : null}
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input icon={Lock} label="Password" type="password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button type="submit">Update password</Button>
        </form>
      </section>
    </main>
  );
};
