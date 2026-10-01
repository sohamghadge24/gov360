"use client";

import React, { useState } from "react";
import { Upload, Plus, Search, Filter } from "lucide-react";
import { OrganizationTree } from "@/components/organization/OrganizationTree";
import { MasterDataTabs } from "@/components/organization/MasterDataTabs";
import { EntityDetails } from "@/components/organization/EntityDetails";

export default function OrganizationLocationMaster() {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  return (
    <div className="flex flex-col h-screen bg-transparent overflow-hidden">
      {/* Header */}
      <div className="px-10 pt-8 pb-4 relative z-10 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">ADMINISTRATION</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">ORGANIZATION</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Manage organizational hierarchy, operational locations and master data.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button className="px-4 py-2.5 bg-white/40 border border-white rounded-[14px] shadow-sm text-[13px] font-medium text-[var(--color-deep-navy)] backdrop-blur-md flex items-center gap-2 hover:bg-white/60 transition-colors">
              <Upload className="w-4 h-4" />
              Import Masters
            </button>
            <button className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Entity
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden flex flex-col p-8 gap-5 max-w-[1600px] mx-auto w-full relative z-10">
        <div className="flex-1 flex gap-5 overflow-hidden">
          {/* Left: Organization Tree */}
          <div className="w-1/3 min-w-[320px] max-w-[400px] glass-card flex flex-col overflow-hidden shrink-0">
            <div className="px-6 py-5 border-b border-[var(--color-border)]/50 bg-white/20 shrink-0">
              <h2 className="text-[12px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Organization Tree</h2>
              <div className="relative">
                <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search organization..."
                  className="w-full pl-9 pr-4 py-2 bg-white/40 border border-white rounded-[12px] text-[13px] text-[var(--color-deep-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border)] backdrop-blur-md"
                />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <OrganizationTree onSelect={setSelectedNode} selectedNode={selectedNode} />
          </div>
        </div>

          {/* Right: Master Data Workspace */}
          <div className="flex-1 flex flex-col gap-5 overflow-hidden">
            {/* Selected Entity Details */}
            {selectedNode && (
              <div className="glass-card p-6">
                <EntityDetails node={selectedNode} />
              </div>
            )}

            {/* Master Data Tabs */}
            <div className="flex-1 glass-card flex flex-col overflow-hidden">
              <MasterDataTabs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
