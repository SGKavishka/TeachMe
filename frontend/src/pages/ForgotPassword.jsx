import { useState } from "react";
import { Mail } from "lucide-react";
import { api } from "../api/axios.js";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/forgot-password", { email });
    setMessage(data.message);
    setResetToken(data.resetToken || "");
  };

  return (
    <main className="page-shell grid place-items-center bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Reset password</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Input icon={Mail} label="Account email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Button type="submit">Send reset link</Button>
        </form>
        {message ? <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-100">{message}</p> : null}
        {resetToken ? <p className="mt-3 break-all text-xs text-slate-500 dark:text-slate-400">Development token: {resetToken}</p> : null}
      </section>
    </main>
  );
};

