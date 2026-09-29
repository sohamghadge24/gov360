"use client";

import React, { useState, useEffect } from "react";
import { Upload, Plus, Search } from "lucide-react";
import { getEmployees, Employee } from "@/api/employees";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
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
    <div className="flex flex-col h-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Employees</h1>
            <p className="text-sm text-gray-500 mt-1">Manage employees, assignments, supervisors, verification policies and workforce status.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            />
          </div>
          {/* Mock filters for demonstration of structure */}
          <select className="border border-gray-300 text-gray-700 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Department</option>
          </select>
          <select className="border border-gray-300 text-gray-700 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Unit</option>
          </select>
          <select className="border border-gray-300 text-gray-700 rounded-md text-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Status</option>
          </select>
        </div>

        {/* Category Navigation */}
        <nav className="flex space-x-6 overflow-x-auto border-b border-gray-200 mt-2" aria-label="Tabs">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.id);
                setPage(1); // Reset page on category change
              }}
              className={clsx(
                "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                activeCategory === category.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {category.label}
            </button>
          ))}
        </nav>
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
    </div>
  );
}
