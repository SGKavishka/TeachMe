import { useEffect, useState } from "react";
import { Clock3, DollarSign, ReceiptText, WalletCards } from "lucide-react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { StatCard } from "../components/common/StatCard.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { formatMoney, humanStatus, paymentStatusTone } from "../utils/payments.js";

export const EarningsDashboard = () => {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    api.get("/payments/wallet").then(({ data }) => setSummary(data.data || {})).catch(() => setSummary({}));
  }, []);

  const wallet = summary.wallet || {};
  const currency = wallet.currency || "USD";
  const payments = summary.payments || [];

  return (
    <DashboardLayout title="Earnings" subtitle="Review pending escrow, completed earnings, and released session payments.">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Clock3} label="Pending balance" value={formatMoney(wallet.pendingBalance, currency)} tone="bg-cobalt-500" />
        <StatCard icon={WalletCards} label="Available balance" value={formatMoney(wallet.availableBalance, currency)} tone="bg-brand-600" />
        <StatCard icon={DollarSign} label="Completed earnings" value={formatMoney(wallet.completedEarnings, currency)} tone="bg-slate-700" />
        <StatCard icon={ReceiptText} label="Sessions paid" value={payments.length} tone="bg-coral-500" />
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Earnings ledger</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Pending/Released</th>
                <th className="px-4 py-3">Paid by student</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{payment.booking?.subject || "Lesson"}</td>
                  <td className="px-4 py-3"><Badge tone={paymentStatusTone(payment.status)}>{humanStatus(payment.status)}</Badge></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(payment.amounts?.teacherAmount, payment.amounts?.currency)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(payment.amounts?.finalPayable, payment.amounts?.currency)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {!payments.length ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No earnings yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};
