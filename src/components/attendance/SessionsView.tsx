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
      .then((res) => {
        if (!mounted) return;
        setData(res.items);
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
      {/* Sessions Toolbar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search employee or session ID..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm">
          <Filter className="w-4 h-4" />
          More Filters
        </button>
      </div>

      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
              <th className="px-6 py-3 font-medium">Employee</th>
              <th className="px-6 py-3 font-medium">Session ID</th>
              <th className="px-6 py-3 font-medium">Check-in</th>
              <th className="px-6 py-3 font-medium">Check-out</th>
              <th className="px-6 py-3 font-medium">Duration</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Source</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                  No attendance sessions found.
                </td>
              </tr>
            ) : (
              data.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{session.employee_name}</div>
                    <div className="text-xs text-gray-500">{session.employee_id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded">{session.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{session.check_in_time || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{session.check_out_time || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{session.duration_minutes ? `${Math.floor(session.duration_minutes / 60)}h ${session.duration_minutes % 60}m` : '—'}</td>
                  <td className="px-6 py-4">
                    <span className={clsx(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      session.status === 'Completed' ? "bg-gray-100 text-gray-800" :
                      session.status === 'Present' ? "bg-green-100 text-green-800" :
                      session.status === 'Exception' ? "bg-red-100 text-red-800" :
                      "bg-blue-100 text-blue-800"
                    )}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">{session.source || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-200 flex items-center justify-between bg-white text-sm text-gray-500">
        <div>Showing 1 to {data.length} of {data.length} sessions</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Previous</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
};
