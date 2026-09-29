import React from 'react';
import { Employee } from '@/api/employees';
import { MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

interface EmployeeTableProps {
  data: Employee[];
  loading: boolean;
  error: boolean;
  category: string;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, loading, error, category }) => {
  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center h-full space-y-4">
        <div className="flex flex-col items-center gap-3 w-full max-w-lg">
          <div className="h-10 w-full bg-gray-100 animate-pulse rounded"></div>
          <div className="h-10 w-full bg-gray-50 animate-pulse rounded"></div>
          <div className="h-10 w-full bg-gray-100 animate-pulse rounded"></div>
          <div className="h-10 w-full bg-gray-50 animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-sm text-red-600 flex flex-col items-center justify-center h-full">
        <p>Failed to load employees.</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center h-full">
        <p>
          {category === 'active' ? 'No active employees found.' :
           category === 'inactive' ? 'No inactive employees found.' :
           category === 'supervisors' ? 'No supervisors found.' :
           category === 'verification' ? 'No verification policies assigned.' :
           category === 'devices' ? 'No registered devices available.' :
           'No employees found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto flex-1">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500 sticky top-0 z-10">
            <th className="px-6 py-4 font-medium">Employee</th>
            <th className="px-6 py-4 font-medium">Department</th>
            <th className="px-6 py-4 font-medium">Unit</th>
            <th className="px-6 py-4 font-medium">Supervisor</th>
            <th className="px-6 py-4 font-medium">Duty</th>
            <th className="px-6 py-4 font-medium">Verification</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((emp) => (
            <tr key={emp.id} className="hover:bg-gray-50 transition-colors group">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <Link href={`/employees/${emp.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600 hover:underline">
                      {emp.name}
                    </Link>
                    <div className="text-xs text-gray-500 mt-0.5">{emp.employee_id}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{emp.department || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{emp.unit || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{emp.supervisor || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{emp.duty_type || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{emp.verification_status || '-'}</td>
              <td className="px-6 py-4">
                <span className={clsx(
                  "px-2.5 py-1 text-xs font-medium rounded-full",
                  emp.status === 'Active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                )}>
                  {emp.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
