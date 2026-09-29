import React, { useEffect, useState } from "react";
import { escalationService, EscalationRule } from "@/api/approvals";
import { Loader2, AlertTriangle, Plus } from "lucide-react";

export const EscalationRules = () => {
  const [data, setData] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    escalationService.getRules()
      .then(res => {
        setData(res || []);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError("Escalation rules service unavailable.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
        <p>Loading rules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-900 font-medium mb-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
         <h3 className="font-semibold text-gray-800">Escalation Thresholds</h3>
         <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 rounded text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
           <Plus className="w-4 h-4" />
           New Rule
         </button>
      </div>
      {data.length === 0 ? (
        <div className="p-12 text-center text-gray-500">
          No escalation rules configured.
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rule Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Threshold (Hrs)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Authority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Next Authority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Version</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map(item => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.thresholdHours}h</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentAuthority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{item.nextAuthority}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">v{item.version}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-gray-400 hover:text-gray-700">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
