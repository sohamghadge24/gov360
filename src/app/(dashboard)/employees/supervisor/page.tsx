"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getEmployee, EmployeeDetail } from "@/api/employees";
import { ArrowLeft, MoreHorizontal, User, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { SupervisorTab } from "@/components/employees/SupervisorTab";
import { Tabs } from "@/components/ui/Tabs";

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'supervisor', label: 'Supervisor' },
  { id: 'verification', label: 'Verification' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'devices', label: 'Devices' }
];

export default function EmployeeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getEmployee(id)
      .then(res => {
        if (!mounted) return;
        setEmployee(res);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
          <div className="flex gap-4 items-center mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="space-y-3">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="h-10 w-full bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Link href="/employees" className="inline-flex items-center text-sm font-medium text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Employees
        </Link>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
          <p className="text-gray-500 mb-2">Unable to load employee details.</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline font-medium text-sm">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="px-6 py-4">
        <Link href="/employees" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Employees
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-t-lg border border-gray-200 shadow-sm overflow-hidden relative">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-2xl flex-shrink-0 border-4 border-white shadow-sm">
                {employee.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  {employee.name}
                  {employee.status === 'Active' && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </h1>
                <div className="flex items-center gap-3 mt-1.5 text-sm">
                  <span className="font-medium text-gray-600">{employee.employee_id}</span>
                  <span className="text-gray-300">•</span>
                  <span className={clsx(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    employee.status === 'Active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  )}>
                    {employee.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {employee.status === 'Active' ? (
                <button className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 hover:bg-red-50 rounded-md transition-colors w-full sm:w-auto text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Deactivate
                </button>
              ) : (
                <button className="px-4 py-2 text-sm font-medium text-green-700 bg-white border border-green-200 hover:bg-green-50 rounded-md transition-colors w-full sm:w-auto text-center shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Activate
                </button>
              )}
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Edit
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-50/50">
            <Tabs
              tabs={tabs}
              activeId={activeTab}
              onChange={setActiveTab}
              tabClassName="px-6"
            />
          </div>
        </div>

        {/* Tab Content Area */}
        <div className="bg-white rounded-b-lg border border-gray-200 border-t-0 shadow-sm p-6 sm:p-8 min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Employee Information</h3>
                <dl className="space-y-4 text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Full Name</dt>
                    <dd className="text-gray-900 col-span-2">{employee.name}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Employee ID</dt>
                    <dd className="text-gray-900 col-span-2">{employee.employee_id}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Email</dt>
                    <dd className="text-gray-900 col-span-2">{employee.email || '-'}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Phone</dt>
                    <dd className="text-gray-900 col-span-2">{employee.phone || '-'}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Source</dt>
                    <dd className="text-gray-900 col-span-2">{employee.source || 'GovTrack360'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Organization & Status</h3>
                <dl className="space-y-4 text-sm">
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Department</dt>
                    <dd className="text-gray-900 col-span-2">{employee.department || '-'}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Unit</dt>
                    <dd className="text-gray-900 col-span-2">{employee.unit || '-'}</dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Supervisor</dt>
                    <dd className="text-gray-900 col-span-2">
                      {employee.supervisor ? (
                        <span className="inline-flex items-center gap-1.5 text-blue-600 hover:underline cursor-pointer">
                          <User className="w-3.5 h-3.5" />
                          {employee.supervisor}
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">No supervisor assigned</span>
                      )}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <dt className="text-gray-500 font-medium">Created On</dt>
                    <dd className="text-gray-900 col-span-2">
                      {employee.created_at ? new Date(employee.created_at).toLocaleDateString() : '-'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'supervisor' && <SupervisorTab employeeId={id} />}

          {activeTab !== 'overview' && activeTab !== 'supervisor' && (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <MoreHorizontal className="w-6 h-6 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{tabs.find(t => t.id === activeTab)?.label} Information</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-md">
                This section displays {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} details fetched directly from the API.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
