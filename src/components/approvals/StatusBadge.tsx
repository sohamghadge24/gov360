import React from "react";
import { ExceptionStatus } from "@/api/approvals";

export const StatusBadge = ({ status }: { status: ExceptionStatus | string }) => {
  const getStyle = () => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Escalated': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Under Review': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Reopened': return 'bg-gray-200 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStyle()}`}>
      {status}
    </span>
  );
};
