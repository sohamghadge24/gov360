import React, { useEffect, useState } from "react";
import { exceptionService, ExceptionDetail } from "@/api/approvals";
import { Loader2, AlertTriangle, Filter } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";

interface Props {
  filterStatus?: string;
  onViewDetail: (id: string) => void;
}

export const ExceptionQueue = ({ filterStatus, onViewDetail }: Props) => {
  const [data, setData] = useState<ExceptionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    exceptionService.getExceptions({ status: filterStatus })
      .then(res => {
        setData(Array.isArray(res) ? res : (res as any)?.items || []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Exception service unavailable.");
      })
      .finally(() => setLoading(false));
  }, [filterStatus]);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
        <p>Loading exceptions...</p>
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
         <h3 className="font-semibold text-gray-800">Exception Records</h3>
         <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
           <Filter className="w-4 h-4" />
           Filters
         </button>
      </div>
      {data.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          No exceptions found.
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exception ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Severity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Authority</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.employeeName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.reasonLabel}</td>
                <td className="px-6 py-4 whitespace-nowrap"><SeverityBadge severity={item.severity} /></td>
                <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={item.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentAuthority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => onViewDetail(item.id)} className="text-blue-600 hover:text-blue-900 font-semibold px-3 py-1 hover:bg-blue-50 rounded">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
