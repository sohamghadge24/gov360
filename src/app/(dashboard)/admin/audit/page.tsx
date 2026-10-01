"use client";

import React, { useState, useEffect } from "react";
import { History, Search, Filter, Download, ArrowRight, User, Terminal, Database, Lock, AlertTriangle, Loader2 } from "lucide-react";
import { auditService, AuditLog } from "@/api/audit";
import { Tabs } from "@/components/ui/Tabs";

const iconMap: Record<string, any> = {
  'User': User,
  'RBAC': Lock,
  'System': Terminal,
  'Database': Database,
};

const getIcon = (resource: string) => {
  return iconMap[resource] || Terminal;
};

const getColorClass = (severity: string | undefined) => {
  switch (severity?.toLowerCase()) {
    case 'high': return { text: 'text-red-600', bg: 'bg-red-50' };
    case 'medium': return { text: 'text-amber-600', bg: 'bg-amber-50' };
    case 'low': return { text: 'text-blue-600', bg: 'bg-blue-50' };
    default: return { text: 'text-gray-600', bg: 'bg-gray-100' };
  }
};

export default function AuditLogPage() {
  const [activeTab, setActiveTab] = useState('system');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [timeframe, setTimeframe] = useState('');
  const [action, setAction] = useState('');
  const [severity, setSeverity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = () => {
    setLoading(true);
    auditService.getLogs({ timeframe, action, severity })
      .then(data => {
        setLogs(data || []);
        setError(null);
      })
      .catch(err => setError("Unable to load audit logs."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [timeframe, action, severity, activeTab]);

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
            <div className="-mb-4">
              <Tabs
                tabs={[
                  { id: 'system', label: 'System Events' },
                  { id: 'access', label: 'Access Logs' },
                  { id: 'data', label: 'Data Changes' }
                ]}
                activeId={activeTab}
                onChange={setActiveTab}
                variant="line"
                tabClassName="pb-4"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  onChange={(e) => setAction(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-2 border rounded-lg text-[13px] font-medium flex items-center gap-2 ${showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                <Filter className="w-4 h-4" /> Filter
              </button>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="px-6 py-4 bg-white border-b border-gray-100 flex gap-4">
              <select value={timeframe} onChange={e => setTimeframe(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option value="">Any Timeframe</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
              <select value={severity} onChange={e => setSeverity(e.target.value)} className="px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option value="">Any Severity</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          )}
          
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                      Loading logs...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-red-500">
                      <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                      {error}
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No logs found matching your criteria.
                    </td>
                  </tr>
                ) : logs.map((log) => {
                  const Icon = getIcon(log.resource);
                  const colors = getColorClass(log.severity);
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[14px] font-bold text-gray-900">{log.id}</div>
                        <div className="text-[12px] text-gray-500 font-medium">{log.timestamp}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
                            <Icon className={`w-4 h-4 ${colors.text}`} />
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
