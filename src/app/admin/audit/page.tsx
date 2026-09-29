"use client";

import React, { useState } from "react";
import { History, Search, Filter, Download, ArrowRight, User, Terminal, Database, Lock } from "lucide-react";

export default function AuditLogPage() {
  const [activeTab, setActiveTab] = useState('system');

  const logs = [
    { id: 'AL-9002', event: 'User Login Success', user: 'admin@gov.in', ip: '192.168.1.105', resource: 'Authentication', timestamp: 'Just now', icon: User, color: 'text-green-600', bg: 'bg-green-50' },
    { id: 'AL-9001', event: 'Role Permission Modified', user: 's.sharma@gov.in', ip: '10.0.0.12', resource: 'RBAC', timestamp: '12 mins ago', icon: Lock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'AL-9000', event: 'Verification API Failed', user: 'System', ip: 'Internal', resource: 'Verification', timestamp: '1 hr ago', icon: Terminal, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'AL-8999', event: 'Geofence Perimeter Updated', user: 'a.kumar@gov.in', ip: '192.168.1.42', resource: 'Locations', timestamp: '3 hrs ago', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'AL-8998', event: 'Data Export Initiated', user: 'admin@gov.in', ip: '192.168.1.105', resource: 'Reports', timestamp: 'Yesterday', icon: Download, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6 flex items-start justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div>
          <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span className="hover:text-gray-900 cursor-pointer">Administration</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Audit Log</span>
          </nav>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1 mb-1">Audit Log</h1>
          <p className="text-sm text-gray-500">Review system events, security trails, and user activity.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm focus:outline-none flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-8 max-w-[1440px] mx-auto w-full flex-1">
        
        {/* Content Area */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          {/* Tabs & Actions */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('system')}
                className={`text-sm font-semibold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'system' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                System Events
              </button>
              <button 
                onClick={() => setActiveTab('access')}
                className={`text-sm font-semibold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'access' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                Access Logs
              </button>
              <button 
                onClick={() => setActiveTab('data')}
                className={`text-sm font-semibold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'data' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
              >
                Data Changes
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button className="px-3 py-2 border border-gray-200 rounded-lg text-[13px] font-medium text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-white">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Event ID & Timestamp</th>
                  <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Event Name</th>
                  <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actor</th>
                  <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Source IP</th>
                  <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Resource</th>
                  <th scope="col" className="px-6 py-4 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[14px] font-bold text-gray-900">{log.id}</div>
                      <div className="text-[12px] text-gray-500 font-medium">{log.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${log.bg} flex items-center justify-center`}>
                          <log.icon className={`w-4 h-4 ${log.color}`} />
                        </div>
                        <span className="text-[13px] font-semibold text-gray-800">{log.event}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[13px] font-medium text-gray-600">{log.user}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[12px] font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{log.ip}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-[12px] font-bold uppercase tracking-wider text-gray-500">{log.resource}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-end w-full gap-1">
                        View <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
