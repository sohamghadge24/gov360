"use client";

import React from "react";
import { Plane } from "lucide-react";

export default function LeaveOfficialDutyPage() {
  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <nav className="text-sm font-medium text-gray-500 mb-1">
            <span className="hover:text-gray-900 cursor-pointer">Operations</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Leave & Exceptions</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">Leave & Official Duty</h1>
          <p className="text-sm text-gray-500 mt-1">Manage employee leave requests and official duty logs.</p>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900">Leave & Official Duty</h2>
          <p className="text-gray-500 mt-2">Leave and official duty tracking will be built here.</p>
        </div>
      </div>
    </div>
  );
}
