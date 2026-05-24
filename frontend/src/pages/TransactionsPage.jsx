import { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { formatMoney, humanStatus, paymentStatusTone } from "../utils/payments.js";

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get("/payments/transactions")
      .then(({ data }) => setTransactions(data.data || []))
      .catch(() => setTransactions([]));
  }, []);

  return (
    <DashboardLayout title="Transactions" subtitle="Receipts, escrow holds, releases, refunds, and withdrawal movements.">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Direction</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td className="px-4 py-3 font-medium capitalize text-slate-950 dark:text-white">{humanStatus(transaction.type)}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{transaction.booking?.subject || "-"}</td>
                  <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{transaction.direction}</td>
                  <td className="px-4 py-3"><Badge tone={paymentStatusTone(transaction.status)}>{humanStatus(transaction.status)}</Badge></td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{formatMoney(transaction.amount, transaction.currency)}</td>
                  <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{transaction.reference}</td>
                </tr>
              ))}
              {!transactions.length ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No transactions found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};
