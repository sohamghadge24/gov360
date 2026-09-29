"use client";

import React from "react";
import { Archive, DatabaseBackup, Clock, Trash2, HardDrive, Shield, Download, FileText } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function RetentionGovernancePage() {
  const { toast } = useToast();
  return (
    <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6 flex items-start justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div>
          <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span className="hover:text-gray-900 cursor-pointer">Administration</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Retention & Governance</span>
          </nav>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1 mb-1">Retention & Governance</h1>
          <p className="text-sm text-gray-500">Configure data lifecycle policies, archiving rules, and privacy compliance.</p>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-8 max-w-[1440px] mx-auto w-full flex-1">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Policy Card 1 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <DatabaseBackup className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">Attendance Data Retention</h3>
                <p className="text-[12px] text-gray-500">Lifecycle rules for core tracking records.</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Active Storage Duration</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Time kept in hot database</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700">3 Years</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Cold Archive Duration</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Time kept in glacier storage</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-md text-sm font-medium text-gray-700">7 Years</div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button className="text-[13px] font-medium text-blue-600 hover:text-blue-700">Modify Policy</button>
              </div>
            </div>
          </div>

          {/* Policy Card 2 */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <Shield className="w-4 h-4 text-red-700" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">Biometric & Evidence Retention</h3>
                <p className="text-[12px] text-gray-500">Strict rules for PII and sensitive evidence.</p>
              </div>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Selfie / Photo Purge</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Automatic deletion of raw images</p>
                </div>
                <div className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-md text-sm font-medium text-red-700">90 Days</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Raw Location Trail Purge</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Automatic deletion of high-res GPS paths</p>
                </div>
                <div className="bg-red-50 border border-red-200 px-3 py-1.5 rounded-md text-sm font-medium text-red-700">180 Days</div>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button className="text-[13px] font-medium text-blue-600 hover:text-blue-700">Modify Policy</button>
              </div>
            </div>
          </div>
          
        </div>

        {/* Archiving Actions */}
        <h3 className="text-[15px] font-bold text-gray-900 mb-4">Manual Governance Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div onClick={() => toast("Archive Triggered", "Manual archive process has started.", "info")} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 transition-colors cursor-pointer group">
            <Archive className="w-8 h-8 text-gray-400 mb-4 group-hover:text-blue-600 transition-colors" />
            <h4 className="text-sm font-bold text-gray-900 mb-1">Trigger Manual Archive</h4>
            <p className="text-[13px] text-gray-500">Force records older than policy threshold into cold storage.</p>
          </div>
          <div onClick={() => toast("Data Subject Request", "Opening DSR flow...", "info")} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-blue-300 transition-colors cursor-pointer group">
            <Download className="w-8 h-8 text-gray-400 mb-4 group-hover:text-blue-600 transition-colors" />
            <h4 className="text-sm font-bold text-gray-900 mb-1">Data Subject Request</h4>
            <p className="text-[13px] text-gray-500">Export a complete data package for a specific user ID.</p>
          </div>
          <div onClick={() => toast("Erasure Request", "Requires elevated privileges. Verification needed.", "error")} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:border-red-300 transition-colors cursor-pointer group">
            <Trash2 className="w-8 h-8 text-gray-400 mb-4 group-hover:text-red-600 transition-colors" />
            <h4 className="text-sm font-bold text-gray-900 mb-1">Right to Erasure</h4>
            <p className="text-[13px] text-gray-500">Hard delete user records from both hot and cold storage.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
