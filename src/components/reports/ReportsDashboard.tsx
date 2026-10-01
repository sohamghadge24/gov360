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
    <div className="flex flex-col h-full bg-transparent min-h-screen pb-10">
      <div className="px-10 pt-10 pb-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">INSIGHTS</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">REPORTS & ANALYTICS</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Operational reporting and workforce intelligence.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white/40 border border-white rounded-[14px] shadow-sm text-[13px] font-medium text-[var(--color-deep-navy)] backdrop-blur-md hover:bg-white/60 transition-colors"
            >
              <Calendar className="w-4 h-4 text-[var(--color-muted)]" /> Schedule Report
            </button>
            <button
              onClick={() => setExportOpen(true)}
              className="btn-primary"
            >
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
      </div>

      <div className="px-10 pb-10 max-w-7xl mx-auto w-full space-y-6 relative z-10">

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
                <div className="glass-card p-6 flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Attendance</p>
                  <div>
                    <h3 className="font-display text-[36px] tracking-tight leading-[1] text-[var(--color-deep-navy)] mb-2 font-light">
                      {dashboardData.attendanceTrend.length > 0 ?
                        Math.round((dashboardData.attendanceTrend.reduce((acc, curr) => acc + curr.present, 0) /
                          dashboardData.attendanceTrend.reduce((acc, curr) => acc + curr.present + curr.absent, 0)) * 100) || 0 : 0}%
                    </h3>
                    <p className="text-[12px] font-medium text-green-600 flex items-center gap-1">↗ vs last period</p>
                  </div>
                </div>
                <div className="glass-card p-6 flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Verification</p>
                  <div>
                    <h3 className="font-display text-[36px] tracking-tight leading-[1] text-[var(--color-primary)] mb-2 font-light">
                      {dashboardData.complianceTrend.length > 0 ? dashboardData.complianceTrend[dashboardData.complianceTrend.length - 1].compliance : 0}%
                    </h3>
                    <p className="text-[12px] font-medium text-green-600 flex items-center gap-1">↗ compliance</p>
                  </div>
                </div>
                <div className="glass-card p-6 flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Exceptions</p>
                  <div>
                    <h3 className="font-display text-[36px] tracking-tight leading-[1] text-red-600 mb-2 font-light">
                      {dashboardData.exceptionTrend.reduce((acc, curr) => acc + curr.exceptions, 0)}
                    </h3>
                    <p className="text-[12px] font-medium text-[var(--color-muted)] flex items-center gap-1">Total pending</p>
                  </div>
                </div>
                <div className="glass-card p-6 flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Field Duty</p>
                  <div>
                    <h3 className="font-display text-[36px] tracking-tight leading-[1] text-[var(--color-deep-navy)] mb-2 font-light">
                      {dashboardData.fieldDutyCompletion.length > 0 ? dashboardData.fieldDutyCompletion[dashboardData.fieldDutyCompletion.length - 1].completion : 0}%
                    </h3>
                    <p className="text-[12px] font-medium text-[var(--color-muted)] flex items-center gap-1">Completion rate</p>
                  </div>
                </div>
                <div className="glass-card p-6 flex flex-col justify-between">
                  <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Missed Verify</p>
                  <div>
                    <h3 className="font-display text-[36px] tracking-tight leading-[1] text-amber-600 mb-2 font-light">
                      12
                    </h3>
                    <p className="text-[12px] font-medium text-[var(--color-muted)] flex items-center gap-1">Requires review</p>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN ANALYTICS */}
            {dashboardData && activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 glass-card p-8 flex flex-col">
                  <h2 className="text-[12px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-6">Attendance Trend</h2>
                  <div className="flex-1 min-h-[250px]">
                    {dashboardData.attendanceTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={dashboardData.attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8A7B70', fontWeight: 600 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8A7B70', fontWeight: 600 }} />
                          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }} />
                          <Bar dataKey="present" name="Present" fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={32} />
                          <Bar dataKey="absent" name="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={32} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[var(--color-muted)] text-[14px]">No trend data available</div>
                    )}
                  </div>
                </div>
                <div className="lg:col-span-4 glass-card p-8 flex flex-col">
                  <h2 className="text-[12px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-6">Verification Compliance</h2>
                  <div className="flex-1 min-h-[250px]">
                    {dashboardData.complianceTrend.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={dashboardData.complianceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8A7B70', fontWeight: 600 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8A7B70', fontWeight: 600 }} domain={[0, 100]} />
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }} />
                          <Line type="monotone" dataKey="compliance" name="Compliance %" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: '#10B981' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-[var(--color-muted)] text-[14px]">No compliance data available</div>
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
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
                    <BarChart className="w-7 h-7 text-[var(--color-primary)]" />
                  </div>
                  <h2 className="font-display text-[26px] text-[var(--color-deep-navy)] mb-2 font-medium">Overview Dashboard</h2>
                  <p className="text-[14px] text-[var(--color-neutral)] max-w-md leading-relaxed">Select a specific report tab above to view detailed records and tables for Attendance, Verification, or Exceptions.</p>
                </div>
              )}
              {activeTab === 'attendance' && <DailyAttendanceReportView filters={filters} />}
              {activeTab === 'verification' && <VerificationComplianceReportView filters={filters} />}
              {['exceptions', 'field-duty', 'employees'].includes(activeTab) && (
                <div className="glass-card p-12 flex flex-col items-center justify-center text-center h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
                    <FileText className="w-7 h-7 text-[var(--color-muted)]" />
                  </div>
                  <h2 className="font-display text-[26px] text-[var(--color-deep-navy)] mb-2 font-medium">{tabs.find(t => t.id === activeTab)?.label} Report</h2>
                  <p className="text-[14px] text-[var(--color-neutral)] max-w-md leading-relaxed">No report data available for the selected filters.</p>
                </div>
              )}
            </div>

            {/* EXPLORE REPORTS (Compact) */}
            <div className="pt-8">
              <h3 className="text-[11px] font-display font-semibold text-[var(--color-neutral)] uppercase tracking-[0.15em] mb-4">Explore Reports</h3>
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
                    className="glass-card flex items-center gap-3 p-4 hover:bg-white/60 transition-colors duration-[400ms] text-left group"
                  >
                    <div className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors"><report.icon className="w-4 h-4" /></div>
                    <span className="text-[13px] font-bold text-[var(--color-deep-navy)]">{report.title}</span>
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
