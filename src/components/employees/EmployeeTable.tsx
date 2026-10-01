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
      <div className="p-12 flex flex-col items-center justify-center h-full space-y-6">
        <div className="flex flex-col gap-4 w-full max-w-4xl mt-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-[72px] w-full bg-white/40 border border-[var(--color-border)]/50 animate-pulse rounded-[14px]"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-16 flex flex-col items-center justify-center h-full">
        <div className="w-16 h-16 rounded-[18px] bg-red-50/50 flex items-center justify-center mb-6 border border-red-200/50 shadow-sm">
          <MoreHorizontal className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="font-display text-[26px] text-red-800 mb-2 font-medium">Failed to load employees</h3>
        <p className="text-[14px] text-red-700/80 mb-8 max-w-[320px] text-center leading-relaxed">There was an error communicating with the server. Please verify your connection and try again.</p>
        <button onClick={() => window.location.reload()} className="btn-secondary">
          Retry Connection
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-16 flex flex-col items-center justify-center h-full">
        <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center mb-6 border border-white shadow-sm">
          <svg className="w-7 h-7 text-[var(--color-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="font-display text-[26px] text-[var(--color-deep-navy)] mb-2 font-medium">
          {category === 'active' ? 'No active employees' :
           category === 'inactive' ? 'No inactive employees' :
           category === 'supervisors' ? 'No supervisors found' :
           category === 'verification' ? 'No verification policies' :
           category === 'devices' ? 'No devices registered' :
           'No employees found'}
        </h3>
        <p className="text-[14px] text-[var(--color-neutral)] max-w-[320px] text-center leading-relaxed">
          {category === 'active' ? 'There are currently no active employees in the system.' :
           category === 'inactive' ? 'There are currently no inactive employees.' :
           'There are no records matching your current filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto flex-1 bg-white/20">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-white/40 text-[var(--color-neutral)] text-[11px] font-bold uppercase tracking-[0.12em] border-b border-[var(--color-border)]">
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Employee</th>
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Department</th>
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Unit</th>
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Supervisor</th>
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Duty</th>
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Verification</th>
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10">Status</th>
            <th className="px-8 py-5 font-bold sticky top-0 bg-white/80 backdrop-blur-md z-10 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]/50">
          {data.map((emp) => (
            <tr key={emp.id} className="hover:bg-white/60 transition-colors duration-300 group">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-deep-navy)] flex items-center justify-center font-bold text-[14px] flex-shrink-0 shadow-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <Link href={`/employees/${emp.id}`} className="text-[14px] font-semibold text-[var(--color-deep-navy)] hover:text-[var(--color-primary)] transition-colors cursor-pointer">
                      {emp.name}
                    </Link>
                    <div className="text-[12px] text-[var(--color-neutral)] mt-0.5">{emp.employee_id}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{emp.department || '—'}</td>
              <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{emp.unit || '—'}</td>
              <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{emp.supervisor || '—'}</td>
              <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{emp.duty_type || '—'}</td>
              <td className="px-8 py-5 text-[14px] text-[var(--color-neutral)]">{emp.verification_status || '—'}</td>
              <td className="px-8 py-5">
                <span className={clsx(
                  "inline-flex items-center px-3 py-1 text-[11px] font-bold tracking-wide rounded-full border shadow-sm",
                  emp.status === 'Active' ? "bg-green-100/80 text-green-800 border-green-200/50" : "bg-slate-100/80 text-slate-800 border-slate-200/50"
                )}>
                  {emp.status}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <button className="p-2 text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-blue-50/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <MoreHorizontal className="w-[18px] h-[18px]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
