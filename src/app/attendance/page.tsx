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
      <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sticky top-0 z-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[26px] leading-tight font-black text-gray-900 tracking-tight">Attendance</h1>
            <p className="text-[14px] text-gray-500 mt-1">Monitor workforce attendance sessions and status</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-semibold text-gray-700 bg-white hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Global Filters */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-lg text-[13px] text-gray-700 transition-all shadow-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <select className="bg-transparent border-none focus:ring-0 p-0 text-[13px] font-semibold text-gray-900 cursor-pointer outline-none min-w-[120px]">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-lg text-[13px] text-gray-700 transition-all shadow-sm">
            <Building2 className="w-4 h-4 text-blue-600" />
            <select className="bg-transparent border-none focus:ring-0 p-0 text-[13px] font-semibold text-gray-900 cursor-pointer outline-none min-w-[150px]">
              <option>All Organizations</option>
              <option>Ministry of Health</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 rounded-lg text-[13px] text-gray-700 transition-all shadow-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <select className="bg-transparent border-none focus:ring-0 p-0 text-[13px] font-semibold text-gray-900 cursor-pointer outline-none min-w-[140px]">
              <option>All Departments</option>
              <option>Cardiology</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6">
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
