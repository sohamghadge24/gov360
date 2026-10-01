"use client";

import React, { useState } from "react";
import { PendingApprovalsQueue } from "./PendingApprovalsQueue";
import { ExceptionQueue } from "./ExceptionQueue";
import { EscalationRules } from "./EscalationRules";
import { ExceptionDetailDrawer } from "./ExceptionDetailDrawer";
import { Tabs } from "@/components/ui/Tabs";

export const ApprovalsDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'exceptions' | 'escalated' | 'rules'>('pending');
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(null);

  const tabs = [
    { id: 'pending', label: 'Pending Approvals' },
    { id: 'exceptions', label: 'Exception Queue' },
    { id: 'escalated', label: 'Escalated' },
    { id: 'rules', label: 'Escalation Rules (Admin)' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen pb-10">
      <div className="px-10 pt-10 pb-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">WORKFLOW</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">APPROVALS</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Review exceptions, approval requests and escalated workflow actions within your authorized scope.
            </p>
          </div>
          <div className="flex bg-white/40 p-1.5 rounded-[16px] border border-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] backdrop-blur-md">
            <Tabs
              tabs={tabs as any}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as any)}
              variant="pill"
              className="w-full !border-none !bg-transparent"
            />
          </div>
        </div>
      </div>

      <div className="px-10 pb-10 w-full max-w-7xl mx-auto relative z-10">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Pending Approvals</p>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-[36px] tracking-tight leading-[1] font-display text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors duration-[400ms] mb-1 font-light">—</h3>
              <p className="text-[12px] text-[var(--color-muted)]">requires action</p>
            </div>
          </div>

          <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-amber-500/15 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Exceptions</p>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-[36px] tracking-tight leading-[1] font-display text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors duration-[400ms] mb-1 font-light">—</h3>
              <p className="text-[12px] text-[var(--color-muted)]">flagged</p>
            </div>
          </div>

          <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-red-500/10 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
              <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Escalated</p>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-[36px] tracking-tight leading-[1] font-display text-red-600 mb-1 font-light">—</h3>
              <p className="text-[12px] text-[var(--color-muted)]">urgent</p>
            </div>
          </div>

          <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-violet-500/15 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
              <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Awaiting Reply</p>
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-[36px] tracking-tight leading-[1] font-display text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors duration-[400ms] mb-1 font-light">—</h3>
              <p className="text-[12px] text-[var(--color-muted)]">explanation requested</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'pending' && <PendingApprovalsQueue onViewDetail={setSelectedExceptionId} />}
        {activeTab === 'exceptions' && <ExceptionQueue onViewDetail={setSelectedExceptionId} />}
        {activeTab === 'escalated' && <ExceptionQueue filterStatus="Escalated" onViewDetail={setSelectedExceptionId} />}
        {activeTab === 'rules' && <EscalationRules />}
      </div>

      {selectedExceptionId && (
        <ExceptionDetailDrawer 
          exceptionId={selectedExceptionId} 
          onClose={() => setSelectedExceptionId(null)} 
        />
      )}
    </div>
  );
};
