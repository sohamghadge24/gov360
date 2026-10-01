"use client";

import React, { useState, useEffect } from "react";
import { Upload, Plus, Search } from "lucide-react";
import { getEmployees, Employee } from "@/api/employees";
import { getDepartments, getUnits, Department, Unit } from "@/api/organization";
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
  
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [departments, setDepartments] = useState<Department[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);

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
    Promise.all([getDepartments(1, 100), getUnits(1, 100)]).then(([deptRes, unitRes]) => {
      if (mounted) {
        setDepartments(deptRes?.items || []);
        setUnits(unitRes?.items || []);
      }
    }).catch(() => {});
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getEmployees(page, size, activeCategory, debouncedSearch, departmentFilter, unitFilter, statusFilter)
      .then((res) => {
        if (!mounted) return;
        setData(res?.items || []);
        setTotal(res?.total || 0);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [activeCategory, debouncedSearch, departmentFilter, unitFilter, statusFilter, page]);

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen relative">
      {/* Header */}
      <div className="px-10 pt-8 pb-4 relative z-10 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">WORKFORCE</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em]">EMPLOYEES</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Manage employees, assignments, supervisors, verification policies and workforce status.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[var(--color-border)] text-[var(--color-deep-navy)] rounded-[14px] text-[13px] font-bold shadow-sm hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 ease-out">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold shadow-md hover:bg-blue-700 active:scale-[0.98] transition-all duration-200 ease-out"
            >
              <Plus className="w-4 h-4" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <div className="px-10 shrink-0">
        <div className="max-w-[1600px] mx-auto pt-2 pb-0">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="relative w-full max-w-md group">
              <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-[var(--color-primary)] transition-colors" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-9 pr-4 py-2 bg-white/40 border border-[var(--color-border)] rounded-[12px] text-[13px] text-[var(--color-deep-navy)] placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              />
            </div>
            <select 
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1); }}
              className="bg-white/40 border border-[var(--color-border)] text-[var(--color-deep-navy)] rounded-[12px] text-[13px] font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 hover:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <option value="">Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select 
              value={unitFilter}
              onChange={(e) => { setUnitFilter(e.target.value); setPage(1); }}
              className="bg-white/40 border border-[var(--color-border)] text-[var(--color-deep-navy)] rounded-[12px] text-[13px] font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 hover:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <option value="">Unit</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-white/40 border border-[var(--color-border)] text-[var(--color-deep-navy)] rounded-[12px] text-[13px] font-medium px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 hover:bg-white transition-all shadow-[0_2px_8px_rgba(0,0,0,0.02)] cursor-pointer"
            >
              <option value="">Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="border-b border-[var(--color-border)]/50">
            <Tabs
              tabs={categories}
              activeId={activeCategory}
              onChange={(id) => {
                setActiveCategory(id);
                setPage(1);
              }}
              variant="line"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto px-10 pb-10 pt-6 max-w-[1600px] mx-auto w-full relative z-10">
        <div className="glass-card h-full overflow-hidden flex flex-col min-h-[500px]">
          <EmployeeTable
            data={data}
            loading={loading}
            error={error}
            category={activeCategory}
          />
          {/* Pagination Controls could go here */}
          {!loading && !error && data.length > 0 && (
            <div className="px-6 py-4 border-t border-[var(--color-border)]/50 bg-white/40 text-[13px] text-[var(--color-neutral)] flex justify-between items-center shrink-0">
              <span className="font-medium">Showing {data.length} of {total} employees</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 py-1 border border-[var(--color-border)] rounded-[8px] bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border border-[var(--color-border)] rounded-[8px] bg-white hover:bg-gray-50 transition-colors"
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
