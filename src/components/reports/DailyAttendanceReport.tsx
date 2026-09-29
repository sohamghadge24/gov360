import React, { useEffect, useState } from "react";
import { reportService, DailyAttendanceReport } from "@/api/reports";
import { ReportFilterBar } from "./ReportFilterBar";
import { ExportDrawer } from "./ExportDrawer";
import { Loader2, AlertTriangle, Users } from "lucide-react";

export const DailyAttendanceReportView = ({ filters }: { filters?: any }) => {
  const [data, setData] = useState<DailyAttendanceReport[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportOpen, setExportOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    reportService.getDailyAttendance(filters || {})
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
          <Users className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-900 font-medium">No attendance data available for this date.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Total Expected</p>
                 <h3 className="text-2xl font-bold text-gray-900">{summary.total}</h3>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Present</p>
                 <h3 className="text-2xl font-bold text-green-600">{summary.present}</h3>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Absent</p>
                 <h3 className="text-2xl font-bold text-red-600">{summary.absent}</h3>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Late</p>
                 <h3 className="text-2xl font-bold text-amber-600">{summary.late}</h3>
              </div>
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                 <p className="text-sm font-medium text-gray-500 mb-1">Exceptions</p>
                 <h3 className="text-2xl font-bold text-purple-600">{summary.exceptions}</h3>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
             <div className="p-4 border-b border-gray-200 bg-gray-50/50">
               <h3 className="font-semibold text-gray-800">Attendance Log</h3>
             </div>
             <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                 <tr>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-In</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Check-Out</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exceptions</th>
                 </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                 {data.map((item, idx) => (
                   <tr key={idx} className="hover:bg-gray-50">
                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.employeeName} <span className="text-gray-500 text-xs ml-1">({item.employeeId})</span></td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.date).toLocaleDateString()}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.checkIn || '-'}</td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.checkOut || '-'}</td>
                     <td className="px-6 py-4 whitespace-nowrap">
                       <span className={`px-2 py-1 rounded text-xs font-medium ${
                         item.status === 'Present' ? 'bg-green-100 text-green-800' :
                         item.status === 'Absent' ? 'bg-red-100 text-red-800' :
                         item.status === 'Late' ? 'bg-amber-100 text-amber-800' :
                         'bg-gray-100 text-gray-800'
                       }`}>
                         {item.status}
                       </span>
                     </td>
                     <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                       {item.exceptions.length > 0 ? item.exceptions.join(', ') : '-'}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        </div>
      )}

      {exportOpen && <ExportDrawer reportType="Daily Attendance" filters={filters} onClose={() => setExportOpen(false)} />}
    </div>
  );
};
