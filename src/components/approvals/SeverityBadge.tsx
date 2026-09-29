import React from "react";
import { ExceptionSeverity } from "@/api/approvals";
import { AlertCircle, AlertTriangle, Info, ShieldAlert } from "lucide-react";

export const SeverityBadge = ({ severity }: { severity: ExceptionSeverity | string }) => {
  const getProps = () => {
    switch (severity) {
      case 'Critical': return { color: 'text-red-700 bg-red-50 border-red-200', icon: ShieldAlert };
      case 'High': return { color: 'text-orange-700 bg-orange-50 border-orange-200', icon: AlertTriangle };
      case 'Medium': return { color: 'text-amber-700 bg-amber-50 border-amber-200', icon: AlertCircle };
      case 'Low': return { color: 'text-blue-700 bg-blue-50 border-blue-200', icon: Info };
      default: return { color: 'text-gray-700 bg-gray-50 border-gray-200', icon: Info };
    }
  };

  const { color, icon: Icon } = getProps();

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3" />
      {severity}
    </span>
  );
};
