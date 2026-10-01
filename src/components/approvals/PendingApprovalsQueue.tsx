import React, { useEffect, useState } from "react";
import { approvalsService, PendingApproval } from "@/api/approvals";
import { Loader2, AlertTriangle, Eye } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";

interface Props {
  onViewDetail: (id: string) => void;
}

export const PendingApprovalsQueue = ({ onViewDetail }: Props) => {
  const [data, setData] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    approvalsService.getPending()
      .then(res => {
        setData(Array.isArray(res) ? res : (res as any)?.items || []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Approval service unavailable.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="glass-card min-h-[400px] flex flex-col items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[var(--color-primary)]" />
        <p className="text-[14px] text-[var(--color-neutral)] font-medium tracking-wide">Loading approvals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-12">
        <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <p className="font-display text-[22px] text-[var(--color-deep-navy)] mb-2 font-medium">Service Unavailable</p>
        <p className="text-[14px] text-[var(--color-neutral)] mb-6 max-w-[280px] leading-relaxed">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-secondary">Retry Connection</button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="glass-card min-h-[400px] flex flex-col items-center justify-center text-center p-12">
        <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
          <Eye className="w-7 h-7 text-[var(--color-muted)]" />
        </div>
        <p className="font-display text-[26px] text-[var(--color-deep-navy)] mb-2 font-medium">No pending approvals</p>
        <p className="text-[14px] text-[var(--color-neutral)] max-w-[280px] leading-relaxed">You have reviewed all pending approval requests in your queue.</p>
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden overflow-x-auto min-h-[400px]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-white/40 backdrop-blur-md">
            <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.18em] sticky top-0 bg-white/80 backdrop-blur-md z-10 whitespace-nowrap">ID</th>
            <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.18em] sticky top-0 bg-white/80 backdrop-blur-md z-10 whitespace-nowrap">Employee</th>
            <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.18em] sticky top-0 bg-white/80 backdrop-blur-md z-10 whitespace-nowrap">Reason</th>
            <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.18em] sticky top-0 bg-white/80 backdrop-blur-md z-10 whitespace-nowrap">Severity</th>
            <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.18em] sticky top-0 bg-white/80 backdrop-blur-md z-10 whitespace-nowrap">Status</th>
            <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.18em] sticky top-0 bg-white/80 backdrop-blur-md z-10 whitespace-nowrap">Waiting Since</th>
            <th className="px-6 py-5 text-[10px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.18em] sticky top-0 bg-white/80 backdrop-blur-md z-10 whitespace-nowrap text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]/50">
          {data.map(item => (
            <tr key={item.id} className="hover:bg-white/40 transition-colors duration-[400ms] group">
              <td className="px-6 py-5 whitespace-nowrap">
                <span className="text-[13px] font-bold text-[var(--color-primary)]">{item.exceptionId}</span>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <span className="text-[14px] font-semibold text-[var(--color-deep-navy)]">{item.employeeName}</span>
              </td>
              <td className="px-6 py-5 whitespace-nowrap">
                <span className="text-[13px] text-[var(--color-muted)] font-medium">{item.reasonLabel}</span>
              </td>
              <td className="px-6 py-5 whitespace-nowrap"><SeverityBadge severity={item.severity} /></td>
              <td className="px-6 py-5 whitespace-nowrap"><StatusBadge status={item.status} /></td>
              <td className="px-6 py-5 whitespace-nowrap text-[13px] text-[var(--color-muted)] font-medium">{new Date(item.waitingSince).toLocaleString()}</td>
              <td className="px-6 py-5 whitespace-nowrap text-right">
                <button onClick={() => onViewDetail(item.exceptionId)} className="text-[13px] font-semibold text-[var(--color-primary)] hover:text-blue-800 transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50/50">
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
