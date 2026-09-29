"use client";

import React, { useState } from "react";
import { RefreshCw, Filter, Calendar, MapPin, Building2, Search } from "lucide-react";
import { TodayView } from "@/components/attendance/TodayView";
import { SessionsView } from "@/components/attendance/SessionsView";
import { CurrentStatusView } from "@/components/attendance/CurrentStatusView";
import { CorrectionsView } from "@/components/attendance/CorrectionsView";
import { FinalizationView } from "@/components/attendance/FinalizationView";

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'sessions', label: 'Sessions' },
  { id: 'status', label: 'Current Status' },
  { id: 'corrections', label: 'Corrections' },
  { id: 'finalize', label: 'Finalize' }
] as const;

type TabId = typeof TABS[number]['id'];

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<TabId>('today');
  const [refreshKey, setRefreshKey] = useState(0); // To trigger refetches

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance</h1>
            <p className="text-sm text-gray-500 mt-1">Monitor workforce attendance sessions and status</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Global Filters */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium">
              <option>Today</option>
              <option>Yesterday</option>
              <option>Last 7 Days</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            <Building2 className="w-4 h-4 text-gray-400" />
            <select className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium">
              <option>All Organizations</option>
              <option>Ministry of Health</option>
            </select>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            <select className="bg-transparent border-none focus:ring-0 p-0 text-sm font-medium">
              <option>All Departments</option>
              <option>Cardiology</option>
            </select>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 mt-6 border-b border-gray-200">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
