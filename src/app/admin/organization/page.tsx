"use client";

import React, { useState } from "react";
import { Upload, Plus, Search, Filter } from "lucide-react";
import { OrganizationTree } from "@/components/organization/OrganizationTree";
import { MasterDataTabs } from "@/components/organization/MasterDataTabs";
import { EntityDetails } from "@/components/organization/EntityDetails";

export default function OrganizationLocationMaster() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
        <div>
          <nav className="text-sm font-medium text-gray-500 mb-1">
            <span className="hover:text-gray-900 cursor-pointer">Administration</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Organization</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">Organization & Location Master</h1>
          <p className="text-sm text-gray-500 mt-1">Manage organizational hierarchy, operational locations and master data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Upload className="w-4 h-4" />
            Import Masters
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            <Plus className="w-4 h-4" />
            Add...
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex flex-1 p-6 gap-6 h-[calc(100vh-100px)]">
        {/* Left: Organization Tree */}
        <div className="w-1/3 flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Organization Tree</h2>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search organization..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <OrganizationTree onSelect={setSelectedNode} selectedNode={selectedNode} />
          </div>
        </div>

        {/* Right: Master Data Workspace */}
        <div className="flex-1 flex flex-col gap-6 overflow-hidden">
          {/* Selected Entity Details */}
          {selectedNode && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5">
              <EntityDetails node={selectedNode} />
            </div>
          )}

          {/* Master Data Tabs */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
            <MasterDataTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
