"use client";

import React, { useEffect, useState } from "react";
import { getTodayAttendance, AttendanceSession } from "@/api/attendance";
import { Loader2 } from "lucide-react";

export const TodayView = ({ refreshKey }: { refreshKey: number }) => {
  const [data, setData] = useState<AttendanceSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-gray-500">Loading today's attendance session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-md border border-red-100">
        <h3 className="font-semibold text-sm">Error Loading Session</h3>
        <p className="text-sm mt-1">Unable to fetch today's active attendance session.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-gray-200">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Active Session</h3>
        <p className="text-sm text-gray-500 max-w-sm text-center">
          You do not have an active attendance session for today. Use a designated kiosk or your mobile app to check in.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Attendance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <span className="text-sm text-gray-500 block mb-1">Status</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {data.status}
          </span>
        </div>
        <div>
          <span className="text-sm text-gray-500 block mb-1">Check-in</span>
          <span className="text-sm font-medium text-gray-900">{data.check_in_time || '—'}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500 block mb-1">Check-out</span>
          <span className="text-sm font-medium text-gray-900">{data.check_out_time || '—'}</span>
        </div>
        <div>
          <span className="text-sm text-gray-500 block mb-1">Session ID</span>
          <span className="text-sm font-mono text-gray-900">{data.id}</span>
        </div>
      </div>
    </div>
  );
};

// Assuming lucide-react Calendar is needed above, let's import it.
import { Calendar } from "lucide-react";
