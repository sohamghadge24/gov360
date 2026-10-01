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
      <div className="px-10 pt-10 pb-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">DUTY OPERATIONS</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">ROSTER & DUTY</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Manage shifts, employee rosters, duty assignments, reassignments and checkpoints.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="btn-secondary group">
              <Download className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
              Import Roster
            </button>
            <button className="btn-primary group">
              <Plus className="w-4 h-4" />
              Create Roster
            </button>
            <button className="btn-primary group">
              <Briefcase className="w-4 h-4" />
              Assign Duty
            </button>
          </div>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="max-w-7xl mx-auto w-full px-10 grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 relative z-10">
        <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Today's Roster</p>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-[36px] tracking-tight leading-[1] font-display text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors duration-[400ms] mb-1 font-light">—</h3>
            <p className="text-[12px] text-[var(--color-muted)]">scheduled</p>
          </div>
        </div>

        <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-green-500/15 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Active Duties</p>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-[36px] tracking-tight leading-[1] font-display text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors duration-[400ms] mb-1 font-light">—</h3>
            <p className="text-[12px] text-[var(--color-muted)]">ongoing</p>
          </div>
        </div>

        <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-amber-500/15 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Roster Conflicts</p>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-[36px] tracking-tight leading-[1] font-display text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors duration-[400ms] mb-1 font-light">—</h3>
            <p className="text-[12px] text-[var(--color-muted)]">unresolved</p>
          </div>
        </div>

        <div className="glass-card group cursor-default h-[140px] p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br from-violet-500/15 to-transparent opacity-40 mix-blend-multiply rounded-full blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-80" />
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
            <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Pending</p>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="text-[36px] tracking-tight leading-[1] font-display text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors duration-[400ms] mb-1 font-light">—</h3>
            <p className="text-[12px] text-[var(--color-muted)]">requires action</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-10 pb-10 flex flex-col relative z-10 max-w-7xl mx-auto w-full">
          <div className="mb-6 border-b border-[var(--color-border)] pb-2">
            <Tabs
              tabs={tabs}
              activeId={activeTab}
              onChange={setActiveTab}
              variant="pill"
            />
          </div>

          <div className="flex-1 flex flex-col">
            {activeTab === "overview" && (
              <div className="glass-card flex-1 min-h-[500px] flex flex-col items-center justify-center p-12">
                <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
                  <Calendar className="w-7 h-7 text-[var(--color-muted)]" />
                </div>
                <h2 className="font-display text-[26px] text-[var(--color-deep-navy)] mb-3 font-medium">Today's Operational Roster</h2>
                <p className="text-[14px] text-[var(--color-neutral)] max-w-[320px] text-center leading-relaxed">
                  No roster assignments found for today. Create a roster or import an existing schedule.
                </p>
              </div>
            )}

            {activeTab === "roster" && (
               <div className="glass-card flex-1 min-h-[500px] flex flex-col p-8">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="font-display text-[26px] text-[var(--color-deep-navy)] font-medium">Roster Management</h2>
                   <div className="flex gap-3">
                       <button className="btn-secondary">Bulk Assignment</button>
                   </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border border-[var(--color-border)]/50 bg-white/30 rounded-[16px] p-12">
                  <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
                    <Users className="w-7 h-7 text-[var(--color-muted)]" />
                  </div>
                  <p className="font-display text-[22px] text-[var(--color-deep-navy)] mb-2 font-medium">No assignments found</p>
                  <p className="text-[14px] text-[var(--color-neutral)] max-w-[280px] text-center leading-relaxed">
                    There are no roster assignments matching your current filters.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "shifts" && (
              <div className="glass-card p-8 min-h-[500px]">
                <ShiftTemplatesList />
              </div>
            )}

            {activeTab === "duties" && (
               <div className="glass-card flex-1 min-h-[500px] flex flex-col p-8">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="font-display text-[26px] text-[var(--color-deep-navy)] font-medium">Duty Assignments</h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border border-[var(--color-border)]/50 bg-white/30 rounded-[16px] p-12">
                  <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
                    <Briefcase className="w-7 h-7 text-[var(--color-muted)]" />
                  </div>
                  <p className="font-display text-[22px] text-[var(--color-deep-navy)] mb-2 font-medium">No duties assigned</p>
                  <p className="text-[14px] text-[var(--color-neutral)] max-w-[280px] text-center leading-relaxed">
                    Assign duties to employees or groups to see them listed here.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "duty-types" && (
               <div className="glass-card flex-1 min-h-[500px] flex flex-col p-8">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="font-display text-[26px] text-[var(--color-deep-navy)] font-medium">Duty Types</h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border border-[var(--color-border)]/50 bg-white/30 rounded-[16px] p-12">
                  <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
                    <Settings className="w-7 h-7 text-[var(--color-muted)]" />
                  </div>
                  <p className="font-display text-[22px] text-[var(--color-deep-navy)] mb-2 font-medium">No duty types</p>
                  <p className="text-[14px] text-[var(--color-neutral)] max-w-[280px] text-center leading-relaxed">
                    Configure duty types (e.g. Field Patrol, Office Administration) in settings.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "conflicts" && (
               <div className="glass-card flex-1 min-h-[500px] flex flex-col p-8">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="font-display text-[26px] text-[var(--color-deep-navy)] font-medium">Conflict Management</h2>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center border border-[var(--color-border)]/50 bg-white/30 rounded-[16px] p-12">
                  <div className="w-16 h-16 rounded-full bg-white/60 shadow-sm flex items-center justify-center mb-6 border border-white">
                    <AlertTriangle className="w-7 h-7 text-[var(--color-muted)]" />
                  </div>
                  <p className="font-display text-[22px] text-[var(--color-deep-navy)] mb-2 font-medium">No conflicts detected</p>
                  <p className="text-[14px] text-[var(--color-neutral)] max-w-[280px] text-center leading-relaxed">
                    All schedules and duties are conflict-free. Check back later.
                  </p>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
