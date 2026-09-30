"use client";

import React, { useState, useEffect } from "react";
import { Upload, Plus, Search } from "lucide-react";
import { getEmployees, Employee } from "@/api/employees";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { AddEmployeeModal } from "@/components/employees/AddEmployeeModal";
import { Tabs } from "@/components/ui/Tabs";
import clsx from "clsx";

const categories = [
  { id: 'all', label: 'All Employees' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'supervisors', label: 'Supervisors' },
  { id: 'verification', label: 'Verification' },
  { id: 'devices', label: 'Devices' },
];

export default function EmployeesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Data State
  const [data, setData] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const size = 25;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getEmployees(page, size, activeCategory, debouncedSearch)
      .then((res) => {
        if (!mounted) return;
        setData(res.items || []);
        setTotal(res.total || 0);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
      
    return () => { mounted = false; };
  }, [activeCategory, debouncedSearch, page]);

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 flex flex-col gap-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[26px] leading-tight font-black text-gray-900 tracking-tight">Employees</h1>
            <p className="text-[14px] text-gray-500 mt-1">Manage employees, assignments, supervisors, verification policies and workforce status.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-[13px] font-semibold text-gray-700 bg-white hover:bg-blue-50/50 hover:text-blue-700 hover:border-blue-300 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[13px] font-semibold hover:bg-blue-700 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-md group">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-[13px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
            />
          </div>
          <select className="border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium px-3 py-2 bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer">
            <option value="">Department</option>
          </select>
          <select className="border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium px-3 py-2 bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer">
            <option value="">Unit</option>
          </select>
          <select className="border border-gray-200 text-gray-700 rounded-lg text-[13px] font-medium px-3 py-2 bg-white hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer">
            <option value="">Status</option>
          </select>
        </div>

        {/* Category Navigation */}
        <div className="mt-2">
          <Tabs
            tabs={categories}
            activeId={activeCategory}
            onChange={(id) => {
              setActiveCategory(id);
              setPage(1);
            }}
            tabClassName="px-1"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex-1 flex flex-col overflow-hidden">
          <EmployeeTable 
            data={data} 
            loading={loading} 
            error={error} 
            category={activeCategory} 
          />
          {/* Pagination Controls could go here */}
          {!loading && !error && data.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-sm text-gray-500 flex justify-between items-center">
              <span>Showing {data.length} of {total} employees</span>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border rounded bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isAddModalOpen && (
        <AddEmployeeModal 
          onClose={() => setIsAddModalOpen(false)} 
          onSuccess={() => {
            setIsAddModalOpen(false);
            setPage(1); // Refresh data
            // To truly refresh we can trigger a refreshKey or just reload
            window.location.reload(); 
          }} 
        />
      )}
    </div>
  );
}
