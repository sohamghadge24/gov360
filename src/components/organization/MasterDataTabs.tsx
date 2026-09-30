"use client";

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { getDepartments, Department } from "@/api/organization";
import { MoreHorizontal, Plus } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";

const tabs = [
  { id: 'departments', label: 'Departments' },
  { id: 'divisions', label: 'Divisions' },
  { id: 'units', label: 'Units' },
  { id: 'offices', label: 'Offices' },
  { id: 'wards', label: 'Wards' },
  { id: 'zones', label: 'Zones' },
  { id: 'policeStations', label: 'Police Stations' },
  { id: 'sites', label: 'Sites' },
];

const DepartmentsTable = () => {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    getDepartments()
      .then(res => {
        if (!mounted) return;
        setData(res?.items || []);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-8 text-center text-sm text-gray-500 animate-pulse">Loading departments...</div>;
  if (error) return <div className="p-8 text-center text-sm text-red-600">Failed to load departments.</div>;
  if (data.length === 0) return <div className="p-8 text-center text-sm text-gray-500">No departments have been configured.</div>;

  return (
    <div className="w-full overflow-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
            <th className="px-4 py-3 font-medium">Department</th>
            <th className="px-4 py-3 font-medium">Code</th>
            <th className="px-4 py-3 font-medium">Parent Org</th>
            <th className="px-4 py-3 font-medium">Divisions</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((dept) => (
            <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{dept.name}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{dept.code}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{dept.parent_name || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{dept.division_count}</td>
              <td className="px-4 py-3">
                <span className={clsx(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  dept.status === 'Active' ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                )}>
                  {dept.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button className="text-gray-400 hover:text-gray-600">
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

export const MasterDataTabs = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4">
        <Tabs
          tabs={tabs}
          activeId={activeTab}
          onChange={setActiveTab}
          className="border-none"
          tabClassName="px-1"
        />
        <button className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors">
          <Plus className="w-4 h-4" />
          Add {tabs.find(t => t.id === activeTab)?.label.slice(0, -1)}
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'departments' && <DepartmentsTable />}
        {activeTab !== 'departments' && (
          <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center h-full">
            <p>Data grid for {tabs.find(t => t.id === activeTab)?.label} will appear here.</p>
            <p className="mt-2 text-xs text-gray-400">Implement following the DepartmentsTable pattern.</p>
          </div>
        )}
      </div>
    </div>
  );
};
