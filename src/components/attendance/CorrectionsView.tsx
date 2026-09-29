"use client";

import React from "react";

export const CorrectionsView = ({ refreshKey }: { refreshKey: number }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-700">Attendance Corrections</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No Corrections Found</h3>
        <p className="text-sm text-gray-500 max-w-sm text-center">
          There are no pending attendance correction requests that require your attention.
        </p>
      </div>
    </div>
  );
};
