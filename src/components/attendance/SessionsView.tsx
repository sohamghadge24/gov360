"use client";

import React, { useEffect, useState } from "react";
import { getAttendanceSessions, AttendanceSession } from "@/api/attendance";
import { Loader2, Search, Filter } from "lucide-react";
import clsx from "clsx";

export const SessionsView = ({ refreshKey }: { refreshKey: number }) => {
  const [data, setData] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAttendanceSessions()
      .then((res: any) => {
        if (!mounted) return;
        setData(res?.items || (Array.isArray(res) ? res : []));
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-500">Loading attendance sessions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-md border border-red-100">
        <h3 className="font-semibold text-sm">Error Loading Sessions</h3>
        <p className="text-sm mt-1">Unable to fetch attendance sessions.</p>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col h-full overflow-hidden">
      {/* Sessions Toolbar */}
      <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between bg-white/40">
        <div className="relative w-80">
          <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search employee or session ID..." 
            className="w-full pl-11 pr-4 py-2.5 text-[14px] bg-white/60 border border-[var(--color-border)] rounded-full focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all placeholder:text-[var(--color-muted)] text-[var(--color-deep-navy)]"
          />
        </div>
        <button className="btn-secondary group">
          <Filter className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
          More Filters
        </button>
      </div>

      <div className="overflow-auto flex-1 bg-white/20">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/40 text-[var(--color-neutral)] text-[11px] font-bold uppercase tracking-[0.12em] border-b border-[var(--color-border)]">
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Employee</th>
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Session ID</th>
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Check-in</th>
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Check-out</th>
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Duration</th>
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Status</th>
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Source</th>
              <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]/50">
            {(!data || data.length === 0) ? (
              <tr>
                <td colSpan={8} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center mb-4 border border-white">
                      <Filter className="w-5 h-5 text-[var(--color-muted)]" />
                    </div>
                    <p className="text-[15px] font-display text-[var(--color-deep-navy)] mb-1">No sessions found</p>
                    <p className="text-[13px] text-[var(--color-neutral)]">Try adjusting your filters or search terms.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((session) => (
                <tr key={session.id} className="hover:bg-white/60 transition-colors duration-300 group">
                  <td className="px-8 py-5">
                    <div className="text-[14px] font-semibold text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors cursor-pointer">{session.employee_name}</div>
                    <div className="text-[12px] text-[var(--color-neutral)] mt-0.5">{session.employee_id}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[12px] font-mono font-medium text-[var(--color-muted)] bg-white/60 border border-[var(--color-border)] px-2.5 py-1 rounded-md">{session.id}</span>
                  </td>
                  <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{session.check_in_time || '—'}</td>
                  <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{session.check_out_time || '—'}</td>
                  <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{session.duration_minutes ? `${Math.floor(session.duration_minutes / 60)}h ${session.duration_minutes % 60}m` : '—'}</td>
                  <td className="px-8 py-5">
                    <span className={clsx(
                      "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border shadow-sm",
                      session.status === 'Completed' ? "bg-slate-100/80 text-slate-700 border-slate-200/50" :
                      session.status === 'Present' ? "bg-green-100/80 text-green-800 border-green-200/50" :
                      session.status === 'Exception' ? "bg-red-100/80 text-red-800 border-red-200/50" :
                      "bg-blue-100/80 text-blue-800 border-blue-200/50"
                    )}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[13px] text-[var(--color-neutral)]">{session.source || '—'}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-[13px] font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
                      View Details →
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-[var(--color-border)] flex items-center justify-between bg-white/40 text-[13px] text-[var(--color-neutral)] font-medium">
        <div>Showing 1 to {data.length} of {data.length} sessions</div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary disabled:opacity-50">Previous</button>
          <button className="btn-secondary disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};
