"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function DutyTypesPage() {
  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <nav className="text-sm font-medium text-gray-500 mb-1">
            <span className="hover:text-gray-900 cursor-pointer">Administration</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Duty Types</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">Duty Types</h1>
          <p className="text-sm text-gray-500 mt-1">Manage duty categories and verification requirements.</p>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-gray-900">Duty Types Configuration</h2>
          <p className="text-gray-500 mt-2">The duty types configuration will be built here.</p>
        </div>
      </div>
    </div>
  );
}
