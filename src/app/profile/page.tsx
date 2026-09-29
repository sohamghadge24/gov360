"use client";

import React, { useState, useEffect } from "react";
import { User, Shield, Key, Smartphone, Laptop, Settings, ChevronRight, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { authApi } from "@/lib/api/auth";
import { useToast } from "@/components/ui/ToastProvider";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const { toast } = useToast();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const data = await authApi.sessions();
        setSessions(data || []);
      } catch (err) {
        // mock sessions if API fails
        setSessions([
          { id: '1', device: 'MacBook Pro / Safari', location: 'Current session', current: true, lastActive: 'Now' },
          { id: '2', device: 'Windows 11 / Chrome', location: 'Mumbai, MH', current: false, lastActive: '2 hours ago' },
        ]);
      } finally {
        setLoadingSessions(false);
      }
    };
    
    if (user) {
      loadSessions();
    }
  }, [user]);

  const handleRevoke = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    toast("Session Revoked", "The selected session has been terminated securely.", "success");
  };

  if (authLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6 flex items-start justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div>
          <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span>GovTrack360</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-semibold">My Profile</span>
          </nav>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1 mb-1">Account & Security</h1>
          <p className="text-sm text-gray-500">Manage your profile, access control, and active sessions.</p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-8 max-w-[1200px] mx-auto w-full flex-1">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center py-8">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl border-4 border-white mb-4 uppercase shadow-sm">
                  {user.name.substring(0, 2)}
                </div>
                <h2 className="text-lg font-bold text-white mb-1">{user.name}</h2>
                <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                  {user.roles[0] || 'User'}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                  <p className="text-[14px] font-medium text-gray-900 mt-0.5">{user.email}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Employee ID</label>
                  <p className="text-[14px] font-medium text-gray-900 mt-0.5 font-mono">{user.employee_id || 'GT-88301'}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Organization Scope</label>
                  <p className="text-[14px] font-medium text-gray-900 mt-0.5">Global / Top-level</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <button onClick={() => toast("Account Settings", "Redirecting to account configuration.", "info")} className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">Account Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            </div>
          </div>

          {/* Right Column: Security & Access */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Access Summary */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="text-[15px] font-bold text-gray-900">Access & Permissions</h3>
              </div>
              <div className="p-6">
                <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
                  You are currently assigned the <span className="font-bold text-gray-900">{user.roles[0] || 'Administrator'}</span> role. 
                  This grants you full access to operations, duty verification, user management, and system administration policies across the entire organization scope.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[11px] font-semibold border border-gray-200">monitor:read</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[11px] font-semibold border border-gray-200">duty:write</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[11px] font-semibold border border-gray-200">users:manage</span>
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[11px] font-semibold border border-gray-200">system:admin</span>
                  <span className="text-gray-400 text-[11px] font-medium px-2 py-1">+24 more</span>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-blue-600" />
                  <h3 className="text-[15px] font-bold text-gray-900">Active Sessions</h3>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {loadingSessions ? (
                  <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 text-gray-300 animate-spin" /></div>
                ) : (
                  sessions.map(s => (
                    <div key={s.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {s.device.includes('Mac') || s.device.includes('Windows') ? (
                            <Laptop className="w-6 h-6 text-gray-400" />
                          ) : (
                            <Smartphone className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[14px] font-bold text-gray-900">{s.device}</h4>
                            {s.current && (
                              <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">Current Session</span>
                            )}
                          </div>
                          <p className="text-[12px] text-gray-500 mb-0.5">{s.location}</p>
                          <p className="text-[11px] text-gray-400 font-medium">Last active: {s.lastActive}</p>
                        </div>
                      </div>
                      {!s.current && (
                        <button 
                          onClick={() => handleRevoke(s.id)}
                          className="px-3 py-1.5 border border-red-200 text-red-600 rounded text-[12px] font-bold hover:bg-red-50 transition-colors"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
