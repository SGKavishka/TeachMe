import { useEffect, useState } from "react";
import { ArrowDownToLine, Clock3, CreditCard, DollarSign, ReceiptText } from "lucide-react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";
import { Select } from "../components/common/Select.jsx";
import { StatCard } from "../components/common/StatCard.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatMoney, humanStatus, paymentStatusTone } from "../utils/payments.js";

export const WalletDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState({});
  const [withdrawal, setWithdrawal] = useState({ amount: "", type: "bank_transfer", accountName: "", accountLast4: "", provider: "" });
  const [notice, setNotice] = useState("");

  const loadWallet = () => {
    api.get("/payments/wallet").then(({ data }) => setSummary(data.data || {})).catch(() => setSummary({}));
  };

  useEffect(() => {
    loadWallet();
  }, []);

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    setNotice("");
    try {
      await api.post("/payments/withdrawals", {
        amount: Number(withdrawal.amount),
        currency: summary.wallet?.currency || "USD",
        method: {
          type: withdrawal.type,
          accountName: withdrawal.accountName,
          accountLast4: withdrawal.accountLast4,
          provider: withdrawal.provider
        }
      });
      setWithdrawal({ amount: "", type: "bank_transfer", accountName: "", accountLast4: "", provider: "" });
      setNotice("Withdrawal requested.");
      loadWallet();
    } catch (err) {
      setNotice(err.response?.data?.message || "Withdrawal request failed.");
    }
  };

  const currency = summary.wallet?.currency || "USD";
  const transactions = summary.transactions || summary.recentTransactions || [];
  const payments = summary.payments || [];

  return (
    <DashboardLayout title={user?.role === "teacher" ? "Wallet" : user?.role === "admin" ? "Platform payments" : "Payment history"} subtitle="Track held funds, releases, refunds, withdrawals, and receipts.">
      {user?.role === "teacher" ? (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard icon={Clock3} label="Pending" value={formatMoney(summary.wallet?.pendingBalance, currency)} tone="bg-cobalt-500" />
            <StatCard icon={DollarSign} label="Available" value={formatMoney(summary.wallet?.availableBalance, currency)} tone="bg-brand-600" />
            <StatCard icon={ReceiptText} label="Completed" value={formatMoney(summary.wallet?.completedEarnings, currency)} tone="bg-slate-700" />
            <StatCard icon={ArrowDownToLine} label="Withdrawn" value={formatMoney(summary.wallet?.lifetimeWithdrawn, currency)} tone="bg-coral-500" />
          </div>

          <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white">Withdraw earnings</h2>
            {notice ? <p className="mt-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{notice}</p> : null}
            <form onSubmit={submitWithdrawal} className="mt-5 grid gap-4 md:grid-cols-5">
              <Input label="Amount" type="number" min="1" step="0.01" value={withdrawal.amount} onChange={(event) => setWithdrawal({ ...withdrawal, amount: event.target.value })} />
              <Select label="Method" value={withdrawal.type} onChange={(event) => setWithdrawal({ ...withdrawal, type: event.target.value })}>
                <option value="bank_transfer">Bank transfer</option>
                <option value="digital_wallet">Digital wallet</option>
              </Select>
              <Input label="Account name" value={withdrawal.accountName} onChange={(event) => setWithdrawal({ ...withdrawal, accountName: event.target.value })} />
              <Input label="Last 4" maxLength="4" value={withdrawal.accountLast4} onChange={(event) => setWithdrawal({ ...withdrawal, accountLast4: event.target.value })} />
              <div className="flex items-end">
                <Button type="submit" className="w-full">Request</Button>
              </div>
            </form>
          </section>
        </>
      ) : null}

      {user?.role === "admin" ? (
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={CreditCard} label="Open disputes" value={summary.openDisputes || 0} tone="bg-amber-500" />
          <StatCard icon={ArrowDownToLine} label="Pending withdrawals" value={summary.pendingWithdrawals || 0} tone="bg-cobalt-500" />
          <StatCard icon={DollarSign} label="Payments loaded" value={summary.payments?.length || 0} tone="bg-brand-600" />
        </div>
      ) : null}

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">{user?.role === "student" ? "Student payment history" : "Recent payments"}</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Refunded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{payment.booking?.subject || "Lesson"}</td>
                  <td className="px-4 py-3"><Badge tone={paymentStatusTone(payment.status)}>{humanStatus(payment.status)}</Badge></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(payment.amounts?.lessonAmount, payment.amounts?.currency)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(payment.amounts?.platformFee, payment.amounts?.currency)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(payment.amounts?.finalPayable, payment.amounts?.currency)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(payment.amounts?.refundedAmount, payment.amounts?.currency)}</td>
                </tr>
              ))}
              {!payments.length ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No payment records yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold text-slate-950 dark:text-white">Transaction table</h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Direction</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3 font-medium capitalize text-slate-950 dark:text-white">{humanStatus(item.type)}</td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{item.direction}</td>
                  <td className="px-4 py-3"><Badge tone={paymentStatusTone(item.status)}>{humanStatus(item.status)}</Badge></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(item.amount, item.currency)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {!transactions.length ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No transactions yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};
