"use client";

import React, { useEffect, useState } from "react";
import { getCurrentAttendanceStatus, AttendanceCurrentStatus } from "@/api/attendance";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

export const CurrentStatusView = ({ refreshKey }: { refreshKey: number }) => {
  const [data, setData] = useState<AttendanceCurrentStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getCurrentAttendanceStatus()
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
        <p className="text-sm text-gray-500">Loading current attendance status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-md border border-red-100">
        <h3 className="font-semibold text-sm">Error Loading Status</h3>
        <p className="text-sm mt-1">Unable to fetch current attendance status data.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-700">Current Workforce Status</h2>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-3 font-medium">Employee</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Check-in</th>
              <th className="px-6 py-3 font-medium">Check-out</th>
              <th className="px-6 py-3 font-medium">Current Session</th>
              <th className="px-6 py-3 font-medium">Last Update</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(!data || data.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500">
                  No current attendance data available.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={row.employee_id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{row.employee_name}</div>
                    <div className="text-xs text-gray-500">{row.employee_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      row.status === 'Checked out' ? "bg-gray-100 text-gray-800" :
                      row.status === 'Present' || row.status === 'Checked in' ? "bg-green-100 text-green-800" :
                      row.status === 'Absent' ? "bg-red-100 text-red-800" :
                      "bg-yellow-100 text-yellow-800"
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.check_in_time || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{row.check_out_time || '—'}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-600">{row.current_session_id || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.last_update}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
