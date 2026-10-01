"use client";

import React from "react";
import { Settings as SettingsIcon, Bell, Lock, User } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F7F8FA] overflow-hidden">
      <div className="shrink-0 bg-white border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings & Preferences</h1>
        <p className="text-gray-500 mt-1">Manage your account and application preferences.</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="bg-gray-50 border-b border-gray-200 px-2 py-2">
            <Tabs 
              tabs={tabs} 
              activeId={activeTab} 
              onChange={setActiveTab} 
              variant="pill" 
              className="bg-transparent border-none p-0 gap-1 w-full"
              tabClassName="!px-4 !py-2"
            />
          </div>
          
          <div className="p-8 flex-1">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
                <p className="text-sm text-gray-500 mb-6">Manage your personal details and account info.</p>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="Admin User" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" defaultValue="admin@gov360.com" />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">Save Changes</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                <p className="text-sm text-gray-500 mb-6">Choose what alerts you want to receive.</p>
                <div className="space-y-4 max-w-md">
                   <label className="flex items-center gap-3">
                     <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                     <span className="text-sm font-medium text-gray-700">Email Alerts for Exceptions</span>
                   </label>
                   <label className="flex items-center gap-3">
                     <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                     <span className="text-sm font-medium text-gray-700">Push Notifications for Approvals</span>
                   </label>
                   <div className="pt-4 flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">Save Changes</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h2>
                <p className="text-sm text-gray-500 mb-6">Update your password and security questions.</p>
                
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input type="password" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input type="password" className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700">Update Password</button>
                    <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
