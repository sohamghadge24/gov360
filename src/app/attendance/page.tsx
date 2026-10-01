"use client";

import React, { useState } from "react";
import { RefreshCw, Filter, Calendar, MapPin, Building2, Search } from "lucide-react";
import { TodayView } from "@/components/attendance/TodayView";
import { SessionsView } from "@/components/attendance/SessionsView";
import { CurrentStatusView } from "@/components/attendance/CurrentStatusView";
import { CorrectionsView } from "@/components/attendance/CorrectionsView";
import { FinalizationView } from "@/components/attendance/FinalizationView";
import { Tabs } from "@/components/ui/Tabs";

type TabId = 'today' | 'sessions' | 'status' | 'corrections' | 'finalize';

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'status', label: 'Current Status' },
  { id: 'corrections', label: 'Corrections' },
  { id: 'finalize', label: 'Finalize' }
];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [refreshKey, setRefreshKey] = useState(0); // To trigger refetches

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      {/* Page Header */}
      <div className="px-8 pt-10 pb-2 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">WORKFORCE</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">ATTENDANCE</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Monitor workforce attendance sessions and status.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="btn-secondary group"
            >
              <RefreshCw className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              Refresh
            </button>
          </div>
        </div>

        {/* Global Filters */}
        <div className="max-w-7xl mx-auto flex items-center gap-4 mt-8">
          <div className="relative">
            <select className="btn-secondary appearance-none pr-10 border-[var(--color-border)] pl-10 text-[var(--color-deep-navy)]">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
            </select>
            <Calendar className="w-[18px] h-[18px] text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Search className="w-4 h-4 text-[var(--color-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-0" />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          <div className="relative">
            <select className="btn-secondary appearance-none pr-10 border-[var(--color-border)] pl-10 text-[var(--color-deep-navy)]">
              <option>All Organizations</option>
              <option>Ministry of Health</option>
            </select>
            <Building2 className="w-[18px] h-[18px] text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>

          <div className="relative">
            <select className="btn-secondary appearance-none pr-10 border-[var(--color-border)] pl-10 text-[var(--color-deep-navy)]">
              <option>All Departments</option>
              <option>Cardiology</option>
            </select>
            <MapPin className="w-[18px] h-[18px] text-[var(--color-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto mt-8 mb-4 border-b border-[var(--color-border)]">
          <Tabs
            tabs={TABS}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as TabId)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto h-full">
          {activeTab === 'today' && <TodayView refreshKey={refreshKey} />}
          {activeTab === 'sessions' && <SessionsView refreshKey={refreshKey} />}
          {activeTab === 'status' && <CurrentStatusView refreshKey={refreshKey} />}
          {activeTab === 'corrections' && <CorrectionsView refreshKey={refreshKey} />}
          {activeTab === 'finalize' && <FinalizationView refreshKey={refreshKey} />}
        </div>
      </div>
    </div>
  );
}
