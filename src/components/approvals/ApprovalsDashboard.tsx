"use client";

import React, { useState } from "react";
import { PendingApprovalsQueue } from "./PendingApprovalsQueue";
import { ExceptionQueue } from "./ExceptionQueue";
import { EscalationRules } from "./EscalationRules";
import { ExceptionDetailDrawer } from "./ExceptionDetailDrawer";

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
    <div className="flex flex-col h-full bg-gray-50 min-h-screen pb-10">
      <div className="bg-white border-b px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm sticky top-0 z-10 gap-4">
        <div>
          <nav className="text-sm font-medium text-gray-500 mb-1">
            <span className="hover:text-gray-900 cursor-pointer">Workflow</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Approvals</span>
          </nav>
          <h1 className="text-2xl font-semibold text-gray-900">Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">Review exceptions, approval requests and escalated workflow actions within your authorized scope.</p>
        </div>

        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 w-full max-w-7xl mx-auto">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <p className="text-sm font-medium text-gray-500 mb-1">Pending Approvals</p>
             <h3 className="text-2xl font-bold text-gray-900">--</h3>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <p className="text-sm font-medium text-gray-500 mb-1">Exceptions</p>
             <h3 className="text-2xl font-bold text-gray-900">--</h3>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <p className="text-sm font-medium text-gray-500 mb-1">Escalated</p>
             <h3 className="text-2xl font-bold text-amber-600">--</h3>
          </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
             <p className="text-sm font-medium text-gray-500 mb-1">Awaiting Explanation</p>
             <h3 className="text-2xl font-bold text-gray-900">--</h3>
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
