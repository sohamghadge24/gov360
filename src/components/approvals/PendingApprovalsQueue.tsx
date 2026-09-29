import React, { useEffect, useState } from "react";
import { approvalsService, PendingApproval } from "@/api/approvals";
import { Loader2, AlertTriangle, Eye } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";

interface Props {
  onViewDetail: (id: string) => void;
}

export const PendingApprovalsQueue = ({ onViewDetail }: Props) => {
  const [data, setData] = useState<PendingApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    approvalsService.getPending()
      .then(res => {
        setData(res || []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Approval service unavailable.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
        <p>Loading pending approvals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-900 font-medium mb-1">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Retry</button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Eye className="w-6 h-6" />
        </div>
        <p className="text-gray-900 font-medium">No pending approvals.</p>
        <p className="text-gray-500 text-sm mt-1">You are all caught up.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waiting Since</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(item => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{item.exceptionId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.employeeName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reasonLabel}</td>
              <td className="px-6 py-4 whitespace-nowrap"><SeverityBadge severity={item.severity} /></td>
              <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.waitingSince).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onViewDetail(item.exceptionId)} className="text-blue-600 hover:text-blue-900 font-semibold px-3 py-1 hover:bg-blue-50 rounded">Review</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
