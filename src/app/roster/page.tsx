"use client";

import React, { useState } from "react";
import { Calendar, Users, FileSpreadsheet, AlertTriangle, Briefcase, Settings, Plus, Download } from "lucide-react";
import { ShiftTemplatesList } from "@/components/shifts/ShiftTemplatesList";
import { Tabs } from "@/components/ui/Tabs";

export default function RosterDutyPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: Calendar },
    { id: "roster", label: "Roster", icon: Users },
    { id: "shifts", label: "Shifts", icon: Calendar },
    { id: "duties", label: "Duties", icon: Briefcase },
    { id: "duty-types", label: "Duty Types", icon: Settings },
    { id: "conflicts", label: "Conflicts", icon: AlertTriangle },
  ];

  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <nav className="text-sm font-medium text-gray-500 mb-1">
            <span className="hover:text-gray-900 cursor-pointer">Duty Operations</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Roster & Duty</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">Roster & Duty</h1>
          <p className="text-sm text-gray-500 mt-1">Manage shifts, employee rosters, duty assignments, reassignments and checkpoints.</p>
        </div>
        <div className="flex gap-3">
           <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-gray-700 hover:bg-blue-50/30 hover:text-blue-700 hover:border-blue-200 hover:shadow-md hover:-translate-y-[1px] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
            <Download className="w-4 h-4" />
            Import Roster
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1d4ed8] text-white rounded-lg text-[13px] font-semibold hover:bg-[#1e40af] hover:shadow-[0_4px_12px_rgba(29,78,216,0.25)] hover:-translate-y-[1px] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Create Roster
          </button>
           <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1d4ed8] text-white rounded-lg text-[13px] font-semibold hover:bg-[#1e40af] hover:shadow-[0_4px_12px_rgba(29,78,216,0.25)] hover:-translate-y-[1px] transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-[0.98] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed">
            <Briefcase className="w-4 h-4" />
            Assign Duty
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 pb-0">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] hover:border-blue-100 group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/40 group-hover:via-blue-500/60 group-hover:to-blue-500/40 transition-all duration-500"></div>
            <span className="text-sm font-medium text-gray-500 group-hover:text-blue-700 transition-colors duration-300">Today's Roster</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">--</span>
                <span className="text-sm text-gray-500">Scheduled</span>
            </div>
             <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] hover:border-blue-100 group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/40 group-hover:via-blue-500/60 group-hover:to-blue-500/40 transition-all duration-500"></div>
            <span className="text-sm font-medium text-gray-500 group-hover:text-blue-700 transition-colors duration-300">Active Duties</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">--</span>
                <span className="text-sm text-gray-500">Ongoing</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] hover:border-blue-100 group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/40 group-hover:via-blue-500/60 group-hover:to-blue-500/40 transition-all duration-500"></div>
            <span className="text-sm font-medium text-gray-500 group-hover:text-blue-700 transition-colors duration-300">Roster Conflicts</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">--</span>
                <span className="text-sm text-gray-500">Unresolved</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-[2px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.04)] hover:border-blue-100 group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/40 group-hover:via-blue-500/60 group-hover:to-blue-500/40 transition-all duration-500"></div>
            <span className="text-sm font-medium text-gray-500 group-hover:text-blue-700 transition-colors duration-300">Pending Assignments</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">--</span>
                <span className="text-sm text-gray-500">Requires Action</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
          <div className="mb-8">
            <Tabs
              tabs={tabs}
              activeId={activeTab}
              onChange={setActiveTab}
              variant="pill"
            />
          </div>

          {activeTab === "overview" && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Today's Operational Roster</h2>
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No roster assignments found
              </div>
            </div>
          )}

          {activeTab === "roster" && (
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-semibold text-gray-900">Roster Management</h2>
                 <div className="flex gap-2">
                     <button className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50">Bulk Assignment</button>
                 </div>
              </div>
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No roster assignments found
              </div>
            </div>
          )}

          {activeTab === "shifts" && (
            <div>
              <ShiftTemplatesList />
            </div>
          )}

          {activeTab === "duties" && (
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Duty Assignments</h2>
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                 No duty assignments found
              </div>
            </div>
          )}

          {activeTab === "duty-types" && (
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Duty Types</h2>
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                 No duty types available
              </div>
            </div>
          )}

          {activeTab === "conflicts" && (
             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 min-h-[400px]">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Conflict Management</h2>
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                 No conflicts detected
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
