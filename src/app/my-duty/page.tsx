"use client";

import React from "react";
import { VerificationFlow } from "@/components/verification/VerificationFlow";

export default function MyDutyPage() {
  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen pb-10">
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Duty</h1>
          <p className="text-sm text-gray-500 mt-1">View your current assignments and verifications.</p>
        </div>
      </div>
      
      <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Today's Duty</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Shift</p>
                <p className="text-base text-gray-900 font-medium mt-1">Morning Shift (06:00 - 14:00)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duty Type</p>
                <p className="text-base text-gray-900 font-medium mt-1">Ward Inspection</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-base text-gray-900 font-medium mt-1">Ward 12, Main Market</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Supervisor</p>
                <p className="text-base text-gray-900 font-medium mt-1">John Doe (EMP-1022)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <VerificationFlow />
        </div>
      </div>
    </div>
  );
}
