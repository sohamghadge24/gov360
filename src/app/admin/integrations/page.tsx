"use client";

import React from "react";
import { Link2, Webhook, Key, ExternalLink, Settings, CheckCircle, AlertTriangle, RefreshCw, Box } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function IntegrationsPage() {
  const { toast } = useToast();
  
  const integrations = [
    { id: 'INT-01', name: 'Active Directory (LDAP)', type: 'Identity', status: 'Connected', lastSync: '10 mins ago', desc: 'Enterprise directory synchronization for user identities.', icon: Key, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: 'INT-02', name: 'HRIS Master System', type: 'Data Source', status: 'Connected', lastSync: '1 hr ago', desc: 'Primary employee and organization data source.', icon: Box, color: 'text-purple-600', bg: 'bg-purple-50' },
    { id: 'INT-03', name: 'Gov SMS Gateway', type: 'Messaging', status: 'Warning', lastSync: 'Failed', desc: 'Official SMS gateway for OTP and critical alerts.', icon: Webhook, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'INT-04', name: 'National ID Verification', type: 'Verification', status: 'Disconnected', lastSync: 'Never', desc: 'e-KYC and biometric identity verification service.', icon: Link2, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6 flex items-start justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div>
          <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span className="hover:text-gray-900 cursor-pointer">Administration</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Integrations</span>
          </nav>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1 mb-1">Integrations & APIs</h1>
          <p className="text-sm text-gray-500">Manage external system connections, webhooks, and API keys.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button 
            onClick={() => toast("Add Integration", "Opening Integration Catalog...", "info")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none flex items-center gap-2">
            <Link2 className="w-4 h-4" /> Add Integration
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-8 max-w-[1440px] mx-auto w-full flex-1">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {integrations.map(integration => (
            <div key={integration.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${integration.bg} flex items-center justify-center`}>
                  <integration.icon className={`w-6 h-6 ${integration.color}`} />
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                  integration.status === 'Connected' ? 'bg-green-50 text-green-700 border border-green-100' :
                  integration.status === 'Warning' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  {integration.status === 'Connected' && <CheckCircle className="w-3 h-3" />}
                  {integration.status === 'Warning' && <AlertTriangle className="w-3 h-3" />}
                  {integration.status}
                </span>
              </div>
              
              <h3 className="text-[17px] font-bold text-gray-900 mb-1">{integration.name}</h3>
              <p className="text-sm text-gray-500 mb-6 flex-1">{integration.desc}</p>
              
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Last Sync</span>
                  <span className="text-[13px] font-medium text-gray-700">{integration.lastSync}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toast("Sync Requested", `Requested sync for ${integration.name}`, "success")} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button onClick={() => toast("Settings", `Opening settings for ${integration.name}`, "info")} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* API Keys Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="text-[15px] font-bold text-gray-900">Developer API Keys</h3>
              <p className="text-[13px] text-gray-500 mt-1">Manage authentication tokens for custom integrations.</p>
            </div>
            <button onClick={() => toast("Generate Key", "Generating new API key...", "success")} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2">
              Generate New Key
            </button>
          </div>
          
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[250px]">
             <Key className="w-10 h-10 text-gray-300 mb-4" />
             <h4 className="text-sm font-semibold text-gray-900">No active API keys</h4>
             <p className="text-sm text-gray-500 mt-1 max-w-sm">Generate an API key to allow external scripts or services to authenticate securely with GovTrack360.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
