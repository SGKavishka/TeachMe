import { useEffect, useState } from "react";
import { api } from "../api/axios.js";
import { Badge } from "../components/common/Badge.jsx";
import { Button } from "../components/common/Button.jsx";
import { Input } from "../components/common/Input.jsx";
import { Select } from "../components/common/Select.jsx";
import { DashboardLayout } from "../components/layout/DashboardLayout.jsx";
import { formatMoney, humanStatus, paymentStatusTone } from "../utils/payments.js";
import { useAuth } from "../context/AuthContext.jsx";

export const DisputeManagement = () => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [resolution, setResolution] = useState({});
  const [notice, setNotice] = useState("");

  const loadDisputes = () => {
    api.get("/payments/disputes").then(({ data }) => setDisputes(data.data || [])).catch(() => setDisputes([]));
  };

  useEffect(() => {
    loadDisputes();
  }, []);

  const updateResolution = (id, updates) => {
    setResolution((current) => ({ ...current, [id]: { resolution: "release", refundAmount: 0, adminNotes: "", ...(current[id] || {}), ...updates } }));
  };

  const resolve = async (id) => {
    setNotice("");
    try {
      await api.patch(`/payments/disputes/${id}/resolve`, resolution[id] || { resolution: "release", refundAmount: 0, adminNotes: "" });
      setNotice("Dispute resolved.");
      loadDisputes();
    } catch (err) {
      setNotice(err.response?.data?.message || "Dispute could not be resolved.");
    }
  };

  return (
    <DashboardLayout title="Disputes" subtitle="Review payment holds, refunds, and release decisions.">
      {notice ? <p className="mb-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">{notice}</p> : null}
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Tutor</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Resolution</th>
                {user?.role === "admin" ? <th className="px-4 py-3">Admin action</th> : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {disputes.map((dispute) => {
                const decision = resolution[dispute._id] || { resolution: "release", refundAmount: 0, adminNotes: "" };
                return (
                  <tr key={dispute._id} className="align-top">
                    <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{dispute.booking?.subject || "Lesson"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{dispute.student?.name || "Student"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{dispute.teacher?.user?.name || "Tutor"}</td>
                    <td className="px-4 py-3">
                      <p className="capitalize text-slate-700 dark:text-slate-200">{humanStatus(dispute.reason)}</p>
                      <p className="mt-1 line-clamp-2 max-w-xs text-xs text-slate-500 dark:text-slate-400">{dispute.description}</p>
                    </td>
                    <td className="px-4 py-3"><Badge tone={paymentStatusTone(dispute.status)}>{humanStatus(dispute.status)}</Badge></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                      {humanStatus(dispute.resolution)}
                      {dispute.refundAmount ? <span className="block text-xs">{formatMoney(dispute.refundAmount)}</span> : null}
                    </td>
                    {user?.role === "admin" ? (
                      <td className="px-4 py-3">
                        {["open", "under_review"].includes(dispute.status) ? (
                          <div className="grid min-w-64 gap-2">
                            <Select value={decision.resolution} onChange={(event) => updateResolution(dispute._id, { resolution: event.target.value })}>
                              <option value="release">Release payment</option>
                              <option value="partial_refund">Partial refund</option>
                              <option value="full_refund">Full refund</option>
                            </Select>
                            {decision.resolution === "partial_refund" ? (
                              <Input type="number" min="1" step="0.01" placeholder="Refund amount" value={decision.refundAmount} onChange={(event) => updateResolution(dispute._id, { refundAmount: Number(event.target.value) })} />
                            ) : null}
                            <Button type="button" onClick={() => resolve(dispute._id)}>Apply</Button>
                          </div>
                        ) : (
                          <span className="text-slate-500 dark:text-slate-400">Closed</span>
                        )}
                      </td>
                    ) : null}
                  </tr>
                );
              })}
              {!disputes.length ? (
                <tr>
                  <td colSpan={user?.role === "admin" ? 7 : 6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No disputes found.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
};
