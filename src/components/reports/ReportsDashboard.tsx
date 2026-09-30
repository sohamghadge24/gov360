"use client";

import React, { useState, useEffect } from "react";
import { DailyAttendanceReportView } from "./DailyAttendanceReport";
import { VerificationComplianceReportView } from "./VerificationComplianceReport";
import { BarChart, Clock, ShieldCheck, MapPin, Map, FileText, Calendar, Download, RefreshCw } from "lucide-react";
import { ReportFilterBar } from "./ReportFilterBar";
import { ExportDrawer } from "./ExportDrawer";
import { analyticsService, AnalyticsDashboard } from "@/api/reports";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Tabs } from "@/components/ui/Tabs";

export const ReportsDashboard = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [exportOpen, setExportOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const [dashboardData, setDashboardData] = useState<AnalyticsDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    analyticsService.getDashboard(filters).then(res => {
      setDashboardData(res);
    }).catch(err => {
      console.error(err);
    }).finally(() => {
      setLoading(false);
    });
  }, [filters]);

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'verification', label: 'Verification' },
    { id: 'exceptions', label: 'Exceptions' },
    { id: 'field-duty', label: 'Field Duty' },
    { id: 'employees', label: 'Employees' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen pb-10">
      <div className="bg-white border-b px-8 py-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm sticky top-0 z-10 gap-4">
        <div>
          <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span className="hover:text-gray-900 cursor-pointer">Insights</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Reports & Analytics</span>
          </nav>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Operational reporting and workforce intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
          >
            <Calendar className="w-4 h-4 text-gray-500" /> Schedule Report
          </button>
          <button
            onClick={() => setExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="p-8 max-w-[1440px] mx-auto w-full space-y-6">

        {/* GLOBAL FILTERS */}
        <ReportFilterBar
          onApply={setFilters}
          showDateRange
          showOrganization
          showEmployee
          showStatus
        />

        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-white h-24 rounded-xl border border-gray-200"></div>)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 bg-white h-80 rounded-xl border border-gray-200"></div>
              <div className="lg:col-span-4 bg-white h-80 rounded-xl border border-gray-200"></div>
            </div>
          </div>
        ) : (
          <>
            {/* KPI SUMMARY */}
            {dashboardData && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Attendance</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {dashboardData.attendanceTrend.length > 0 ?
                      Math.round((dashboardData.attendanceTrend.reduce((acc, curr) => acc + curr.present, 0) /
                        dashboardData.attendanceTrend.reduce((acc, curr) => acc + curr.present + curr.absent, 0)) * 100) || 0 : 0}%
                  </h3>
                  <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">↗ vs last period</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Verification</p>
                  <h3 className="text-2xl font-bold text-blue-600">
                    {dashboardData.complianceTrend.length > 0 ? dashboardData.complianceTrend[dashboardData.complianceTrend.length - 1].compliance : 0}%
                  </h3>
                  <p className="text-xs font-medium text-green-600 mt-2 flex items-center gap-1">↗ compliance</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Exceptions</p>
                  <h3 className="text-2xl font-bold text-red-600">
                    {dashboardData.exceptionTrend.reduce((acc, curr) => acc + curr.exceptions, 0)}
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1">Total pending</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Field Duty</p>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {dashboardData.fieldDutyCompletion.length > 0 ? dashboardData.fieldDutyCompletion[dashboardData.fieldDutyCompletion.length - 1].completion : 0}%
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1">Completion rate</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Missed Verify</p>
                  <h3 className="text-2xl font-bold text-amber-600">
                    12
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-2 flex items-center gap-1">Requires review</p>
                </div>
              </div>
            )}

            {/* MAIN ANALYTICS */}
            {dashboardData && activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                  <h2 className="text-[14px] font-bold text-gray-900 mb-6">Attendance Trend</h2>
                  <div className="flex-1 min-h-[250px]">
                    {dashboardData.attendanceTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={dashboardData.attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                          <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="present" name="Present" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={40} />
                          <Bar dataKey="absent" name="Absent" fill="#F87171" radius={[4, 4, 0, 0]} maxBarSize={40} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">No trend data available</div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                  <h2 className="text-[14px] font-bold text-gray-900 mb-6">Verification Compliance</h2>
                  <div className="flex-1 min-h-[250px]">
                    {dashboardData.complianceTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dashboardData.complianceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Line type="monotone" dataKey="compliance" name="Compliance %" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm">No compliance data available</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TABS NAVIGATION */}
            <div className="mb-6">
              <Tabs
                tabs={tabs}
                activeId={activeTab}
                onChange={setActiveTab}
                variant="line"
              />
            </div>

            {/* TAB CONTENT */}
            <div className="min-h-[400px]">
              {activeTab === 'overview' && (
                <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
                    <BarChart className="w-6 h-6" />
                  </div>
                  <h2 className="text-[15px] font-bold text-gray-900">Overview Dashboard</h2>
                  <p className="text-sm text-gray-500 mt-2 max-w-md">Select a specific report tab above to view detailed records and tables for Attendance, Verification, or Exceptions.</p>
                </div>
              )}
              {activeTab === 'attendance' && <DailyAttendanceReportView filters={filters} />}
              {activeTab === 'verification' && <VerificationComplianceReportView filters={filters} />}
              {['exceptions', 'field-duty', 'employees'].includes(activeTab) && (
                <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center h-[400px]">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 text-gray-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h2 className="text-[15px] font-bold text-gray-900">{tabs.find(t => t.id === activeTab)?.label} Report</h2>
                  <p className="text-sm text-gray-500 mt-2">No report data available for the selected filters.</p>
                </div>
              )}
            </div>

            {/* EXPLORE REPORTS (Compact) */}
            <div className="pt-8">
              <h3 className="text-[13px] font-bold text-gray-900 mb-4 uppercase tracking-wider">Explore Reports</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { id: 'attendance', title: 'Attendance', icon: Clock },
                  { id: 'verification', title: 'Verification', icon: ShieldCheck },
                  { id: 'exceptions', title: 'Exceptions', icon: MapPin },
                  { id: 'missed-verify', title: 'Missed Verify', icon: RefreshCw },
                  { id: 'field-duty', title: 'Field Duty', icon: Map },
                  { id: 'employee', title: 'Employee', icon: FileText }
                ].map(report => (
                  <button
                    key={report.id}
                    onClick={() => {
                      if (['attendance', 'verification', 'exceptions', 'field-duty'].includes(report.id)) {
                        setActiveTab(report.id);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-3 p-3 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all rounded-lg text-left"
                  >
                    <div className="text-gray-400"><report.icon className="w-4 h-4" /></div>
                    <span className="text-[13px] font-semibold text-gray-700">{report.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {exportOpen && <ExportDrawer reportType={activeTab} filters={filters} onClose={() => setExportOpen(false)} />}
    </div>
  );
};
