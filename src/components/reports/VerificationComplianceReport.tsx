import React, { useEffect, useState } from "react";
import { reportService, VerificationComplianceReport } from "@/api/reports";
import { ReportFilterBar } from "./ReportFilterBar";
import { ExportDrawer } from "./ExportDrawer";
import { Loader2, AlertTriangle, ShieldCheck } from "lucide-react";

export const VerificationComplianceReportView = ({ filters }: { filters?: any }) => {
  const [data, setData] = useState<VerificationComplianceReport[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    reportService.getVerificationCompliance(filters || {})
      .then(res => {
        setData(res?.data || []);
        setSummary(res?.summary || null);
        setError(null);
      })
      .catch(err => {
        setError("Report service unavailable.");
      })
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>

      {loading ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
          <p>Loading report data...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-900 font-medium mb-1">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 border rounded-md text-sm hover:bg-gray-50">Retry</button>
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
          <ShieldCheck className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-900 font-medium">No verification records found.</p>
          <p className="text-gray-500 text-sm mt-1">Adjust filters or select a different date range.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Overall Compliance</p>
                 <h3 className="text-3xl font-bold text-blue-600">{summary.compliancePercentage}%</h3>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Required</p>
                 <h3 className="text-2xl font-bold text-gray-900">{summary.requiredSlots}</h3>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                 <h3 className="text-2xl font-bold text-green-600">{summary.completedSlots}</h3>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Missed</p>
                 <h3 className="text-2xl font-bold text-red-600">{summary.missedSlots}</h3>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
             <div className="p-4 border-b border-gray-200 bg-gray-50/50">
               <h3 className="font-semibold text-gray-800">Compliance Details</h3>
             </div>
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Missed</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {data.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.employeeName} <span className="text-gray-500 text-xs ml-1">({item.employeeId})</span></td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.requiredSlots}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">{item.completedSlots}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{item.missedSlots}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.compliancePercentage}%</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${item.status === 'Compliant' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                         {item.status}
                       </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {exportOpen && <ExportDrawer reportType="Verification Compliance" filters={filters} onClose={() => setExportOpen(false)} />}
    </div>
  );
};
