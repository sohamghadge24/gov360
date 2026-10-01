"use client";

import React, { useEffect, useState } from "react";
import { getTodayAttendance, checkIn, checkOut, AttendanceSession } from "@/api/attendance";
import { Loader2, Calendar, CheckCircle } from "lucide-react";

export const TodayView = ({ refreshKey }: { refreshKey: number }) => {
  const [data, setData] = useState<AttendanceSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getTodayAttendance()
      .then((res) => {
        if (!mounted) return;
        setData(res);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [refreshKey]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await checkIn({ timestamp: new Date().toISOString() }, `ci-${Date.now()}`);
      setData(res);
    } catch (err) {
      alert("Failed to check in.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await checkOut({ timestamp: new Date().toISOString() }, `co-${Date.now()}`);
      setData(res);
    } catch (err) {
      alert("Failed to check out.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-5">
        <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
        <p className="text-[14px] text-[var(--color-neutral)] font-medium">Loading today's attendance session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card bg-red-50/40 p-8 border-red-200/50">
        <h3 className="font-display text-[22px] text-red-800 mb-2 font-medium">Error Loading Session</h3>
        <p className="text-[14px] text-red-700/80">Unable to fetch today's active attendance session.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center p-12 glass-card">
        <div className="w-16 h-16 bg-white/60 shadow-[0_2px_8px_rgba(58,42,32,0.06)] rounded-full flex items-center justify-center mb-6 border border-white">
          <Calendar className="w-7 h-7 text-[var(--color-muted)]" />
        </div>
        <h3 className="text-[24px] font-display text-[var(--color-deep-navy)] mb-3 text-center tracking-tight">No Active Session</h3>
        <p className="text-[14px] text-[var(--color-neutral)] max-w-sm text-center leading-relaxed mb-8">
          Attendance data will appear here once you check in at a designated kiosk or mobile app today.
        </p>
        <button onClick={handleCheckIn} disabled={actionLoading} className="btn-primary group disabled:opacity-50 flex items-center gap-2">
          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check In"}
          {!actionLoading && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
        </button>
      </div>
    );
  }

  return (
    <div className="glass-card p-8">
      <h2 className="text-[20px] font-display text-[var(--color-deep-navy)] mb-6">Current Attendance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-5 bg-white/40 rounded-[14px] border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-neutral)] uppercase block mb-3">Status</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-wide bg-green-100/80 text-green-800 shadow-sm border border-green-200/50">
            {data.status}
          </span>
        </div>
        <div className="p-5 bg-white/40 rounded-[14px] border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-neutral)] uppercase block mb-3">Check-in</span>
          <span className="text-[18px] font-medium text-[var(--color-deep-navy)] tracking-tight">{data.check_in_time || '—'}</span>
        </div>
        <div className="p-5 bg-white/40 rounded-[14px] border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-neutral)] uppercase block mb-3">Check-out</span>
          <span className="text-[18px] font-medium text-[var(--color-deep-navy)] tracking-tight">{data.check_out_time || '—'}</span>
        </div>
        <div className="p-5 bg-white/40 rounded-[14px] border border-white/50 shadow-sm">
          <span className="text-[11px] font-bold tracking-[0.12em] text-[var(--color-neutral)] uppercase block mb-3">Session ID</span>
          <span className="text-[14px] font-mono font-medium text-[var(--color-muted)]">{data.id}</span>
        </div>
      </div>
      
      {!data.check_out_time && (
        <div className="mt-8 flex justify-end">
          <button onClick={handleCheckOut} disabled={actionLoading} className="btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50 flex items-center gap-2">
            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check Out"}
          </button>
        </div>
      )}
    </div>
  );
};
