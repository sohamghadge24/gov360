"use client";

import { useEffect, useState } from "react";
import {
  Users,
  MapPin,
  Building,
  CalendarOff,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Inbox,
  CheckCircle,
  BarChart2,
  ShieldCheck,
  Activity,
  AlertTriangle
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

  const PRIMARY_METRICS = [
    { label: "Scheduled", value: getMetricValue("scheduled"), desc: "Employees scheduled", icon: Briefcase, color: "text-[var(--color-primary)]", bg: "bg-[var(--color-soft-blue)]" },
    { label: "Present", value: getMetricValue("present"), desc: "Currently checked in", icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Field Duty", value: getMetricValue("fieldDuty"), desc: "Active in field", icon: MapPin, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Office Duty", value: getMetricValue("officeDuty"), desc: "At headquarters", icon: Building, color: "text-sky-600", bg: "bg-sky-50" }
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
        <div>
          <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-neutral)] uppercase mb-2 opacity-80">INSIGHTS / OPERATIONS</div>
          <h1 className="font-display text-[44px] md:text-[48px] font-light leading-[1.05] text-[var(--color-deep-navy)] tracking-[-0.04em] font-light">DASHBOARD</h1>
          <p className="text-[15px] text-[var(--color-neutral)] mt-3 max-w-sm leading-relaxed font-medium">
            Operational reporting and workforce intelligence.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select className="btn-secondary appearance-none pr-10 border-[var(--color-border)]">
              <option>All Departments</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--color-neutral)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select className="btn-secondary appearance-none pr-10 border-[var(--color-border)]">
              <option>Today</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[var(--color-neutral)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 2. System status (Error State) */}
      {error && (
        <div className="bg-red-50 border border-red-100 px-4 py-3 rounded-[12px] text-sm mb-6 flex items-start gap-3 w-fit shadow-sm">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5" />
          <div className="flex-1 pr-8">
            <h4 className="font-semibold text-[13px] text-red-900">Dashboard data unavailable</h4>
            <p className="text-red-700 text-[12px] mt-0.5">Unable to retrieve the latest operational data.</p>
          </div>
          <button onClick={() => window.location.reload()} className="text-[12px] font-semibold text-red-700 hover:text-red-900 mt-0.5 transition-colors flex items-center">
            Retry <span className="ml-1">→</span>
          </button>
        </div>
      )}

      {/* 5. Compact KPI metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {PRIMARY_METRICS.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="premium-card p-6 flex flex-col justify-between group cursor-default">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-[10px] ${metric.bg} flex items-center justify-center`}>
                  <Icon className={`w-[18px] h-[18px] ${metric.color}`} />
                </div>
                <p className="text-[11px] font-display font-medium text-[var(--color-neutral)] uppercase tracking-[0.12em]">{metric.label}</p>
              </div>
              
              <div>
                {loading ? (
                  <div className="h-8 w-24 bg-gray-100 animate-pulse rounded mb-1"></div>
                ) : (
                  <div className="flex items-end gap-3 mb-1">
                    <h3 className="text-[38px] tracking-tight leading-[1] font-display font-light text-[var(--color-deep-navy)] font-light">{metric.value}</h3>
                    {metric.value !== "—" && (
                      <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center mb-1">
                        +2.4%
                      </span>
                    )}
                  </div>
                )}
                <p className="text-[13px] text-[var(--color-neutral)] font-medium">{metric.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* 3. Main Attendance Overview */}
        <div className="premium-card col-span-2 min-h-[380px] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display  text-[22px] text-[var(--color-deep-navy)] tracking-normal font-medium">Attendance Overview</h3>
              <p className="text-[14px] text-[var(--color-neutral)] font-medium mt-1">Daily workforce attendance & activity</p>
            </div>
            <button className="text-[var(--color-neutral)] hover:text-[var(--color-primary)] transition-colors p-2 rounded-full hover:bg-gray-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 rounded-[16px] bg-gray-50/50 border border-gray-100 border-dashed flex flex-col items-center justify-center text-center p-10">
            <div className="premium-icon-container mb-5 bg-white border border-[var(--color-border)] shadow-sm text-[var(--color-neutral)]">
              <CalendarOff className="w-6 h-6" />
            </div>
            <p className="font-display font-bold text-[18px] text-[var(--color-deep-navy)] mb-2">{loading ? "Loading activity..." : "No attendance activity yet"}</p>
            <p className="text-[14px] text-[var(--color-neutral)] max-w-[280px] leading-relaxed mb-6 font-medium">
              {loading ? "Please wait while we generate the overview." : "Today's workforce activity will appear here once employees begin checking in."}
            </p>
            {!loading && (
              <button className="text-[13px] font-semibold text-[var(--color-primary)] flex items-center hover:text-[var(--color-primary-hover)] transition-colors">
                View Attendance <span className="ml-1">→</span>
              </button>
            )}
          </div>
        </div>

        {/* 4. Verification Overview */}
        <div className="premium-card min-h-[380px] p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display  text-[22px] text-[var(--color-deep-navy)] tracking-normal font-medium">Verification</h3>
              <p className="text-[14px] text-[var(--color-neutral)] font-medium mt-1">Compliance status</p>
            </div>
          </div>
          
          <div className="flex-1 rounded-[16px] bg-gray-50/50 border border-gray-100 border-dashed flex flex-col items-center justify-center text-center p-8">
            <div className="premium-icon-container mb-5 bg-white border border-[var(--color-border)] shadow-sm text-[var(--color-neutral)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="font-display font-bold text-[18px] text-[var(--color-deep-navy)] mb-2">{loading ? "Loading data..." : "No policies active"}</p>
            <p className="text-[14px] text-[var(--color-neutral)] leading-relaxed font-medium">
              Data will appear once policies are verified.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7. Exceptions / alerts */}
        <div className="premium-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="premium-icon-container bg-red-50 text-red-600 border border-red-100">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display  text-[22px] text-[var(--color-deep-navy)] tracking-normal font-medium">Open Exceptions</h3>
                <p className="text-[13px] text-[var(--color-neutral)] font-medium mt-1">Action required</p>
              </div>
            </div>
            <button className="text-[13px] font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] bg-[var(--color-soft-blue)] px-4 py-2 rounded-lg transition-colors">View All</button>
          </div>
          
          <div className="min-h-[220px] rounded-[16px] bg-gray-50/50 border border-gray-100 border-dashed flex flex-col items-center justify-center p-8 text-center">
            <div className="premium-icon-container mb-4 bg-white border border-[var(--color-border)] shadow-sm text-[var(--color-neutral)]">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="font-display font-bold text-[18px] text-[var(--color-deep-navy)] mb-1">{loading ? "Loading exceptions" : "No open exceptions"}</p>
            <p className="text-[14px] text-[var(--color-neutral)] font-medium">You're all caught up! No action is required.</p>
          </div>
        </div>

        {/* 6. Recent operational activity (Replaces Field Operations map) */}
        <div className="premium-card p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="premium-icon-container bg-[var(--color-soft-blue)] text-[var(--color-primary)] border border-blue-100">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display  text-[22px] text-[var(--color-deep-navy)] tracking-normal font-medium">Operational Activity</h3>
                <p className="text-[13px] text-[var(--color-neutral)] font-medium mt-1">Recent updates</p>
              </div>
            </div>
          </div>
          
          <div className="min-h-[220px] rounded-[16px] bg-gray-50/50 border border-gray-100 border-dashed flex flex-col items-center justify-center p-8 text-center">
            <div className="premium-icon-container mb-4 bg-white border border-[var(--color-border)] shadow-sm text-[var(--color-neutral)]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <p className="font-display font-bold text-[18px] text-[var(--color-deep-navy)] mb-1">{loading ? "Loading activity..." : "No recent activity"}</p>
            <p className="text-[14px] text-[var(--color-neutral)] font-medium">Operational logs and updates will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
