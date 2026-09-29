"use client";

import React, { useState } from "react";
import { Calendar, Users, FileSpreadsheet, AlertTriangle, Briefcase, Settings, Plus, Download } from "lucide-react";
import { ShiftTemplatesList } from "@/components/shifts/ShiftTemplatesList";

export default function RosterDutyPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
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
           <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none">
            <Download className="w-4 h-4" />
            Import Roster
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none">
            <Plus className="w-4 h-4" />
            Create Roster
          </button>
           <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none">
            <Briefcase className="w-4 h-4" />
            Assign Duty
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 pb-0">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-medium text-gray-500">Today's Roster</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">--</span>
                <span className="text-sm text-gray-500">Scheduled</span>
            </div>
             <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-medium text-gray-500">Active Duties</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">--</span>
                <span className="text-sm text-gray-500">Ongoing</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-medium text-gray-500">Roster Conflicts</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">--</span>
                <span className="text-sm text-gray-500">Unresolved</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
            <span className="text-sm font-medium text-gray-500">Pending Assignments</span>
            <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">--</span>
                <span className="text-sm text-gray-500">Requires Action</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">No data available</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
          <div className="flex space-x-1 mb-6 bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "overview" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Calendar className="w-4 h-4" /> Overview
            </button>
            <button
              onClick={() => setActiveTab("roster")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "roster" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Users className="w-4 h-4" /> Roster
            </button>
             <button
              onClick={() => setActiveTab("shifts")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "shifts" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Calendar className="w-4 h-4" /> Shifts
            </button>
            <button
              onClick={() => setActiveTab("duties")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "duties" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Briefcase className="w-4 h-4" /> Duties
            </button>
            <button
              onClick={() => setActiveTab("duty-types")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "duty-types" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <Settings className="w-4 h-4" /> Duty Types
            </button>
            <button
              onClick={() => setActiveTab("conflicts")}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === "conflicts" ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <AlertTriangle className="w-4 h-4" /> Conflicts
            </button>
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
