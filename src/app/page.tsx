"use client";

import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Building,
  CalendarOff,
  Clock,
  AlertTriangle,
  XCircle,
  Briefcase
} from "lucide-react";
import { getDashboardSummary, DashboardSummary } from "@/api/dashboard";

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getDashboardSummary()
      .then((res) => {
        if (!mounted) return;
        if (res === null) {
          setError(true);
        } else {
          setData(res);
        }
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const getMetricValue = (key: keyof DashboardSummary) => {
    if (loading) return "Loading...";
    if (error || !data || data[key] === null) return "—";
    return data[key];
  };

  const SUMMARY_METRICS = [
    { label: "Scheduled", value: getMetricValue("scheduled"), icon: Briefcase, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Present", value: getMetricValue("present"), icon: Users, color: "text-green-600", bg: "bg-green-50" },
    { label: "Field Duty", value: getMetricValue("fieldDuty"), icon: MapPin, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Office Duty", value: getMetricValue("officeDuty"), icon: Building, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Leave", value: getMetricValue("leave"), icon: CalendarOff, color: "text-gray-500", bg: "bg-gray-100" },
    { label: "Off Duty", value: getMetricValue("offDuty"), icon: Clock, color: "text-gray-400", bg: "bg-gray-50" },
    { label: "Verification Due", value: getMetricValue("verificationDue"), icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Verification Missed", value: getMetricValue("verificationMissed"), icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Operational summary</p>
        </div>
        <div className="flex gap-3">
          <select className="text-sm border-gray-300 rounded-md shadow-sm border py-2 px-3 bg-white text-gray-700 font-medium focus:ring-blue-500 focus:border-blue-500">
            <option>All Departments</option>
          </select>
          <select className="text-sm border-gray-300 rounded-md shadow-sm border py-2 px-3 bg-white text-gray-700 font-medium focus:ring-blue-500 focus:border-blue-500">
            <option>Today</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-4">
          Unable to load dashboard data. The server did not return a valid response.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_METRICS.map((metric, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${metric.bg}`}>
              <metric.icon className={`w-6 h-6 ${metric.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{metric.label}</p>
              {loading ? (
                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1"></div>
              ) : (
                <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm col-span-2">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Attendance Overview</h3>
          <div className="h-64 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
            {loading ? "Loading chart data..." : "No attendance data available for the selected period."}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Verification Compliance</h3>
          <div className="h-64 border-2 border-dashed border-gray-200 rounded flex items-center justify-center text-gray-400">
            {loading ? "Loading chart data..." : "No verification data available for the selected period."}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-900">Open Exceptions</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-200">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">Time</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    {loading ? "Loading exceptions..." : "No open exceptions."}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold text-gray-900">Field Operations</h3>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">Go to Control Room</button>
          </div>
          <div className="h-48 bg-gray-100 rounded border border-gray-200 overflow-hidden relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              {loading ? "Loading map..." : "No live location data available."}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Active Field</p>
              <p className="text-lg font-semibold text-gray-900">—</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">In Zone</p>
              <p className="text-lg font-semibold text-gray-600">—</p>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Anomalies</p>
              <p className="text-lg font-semibold text-gray-600">—</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
