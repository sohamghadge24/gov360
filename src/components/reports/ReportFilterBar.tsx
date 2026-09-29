import React, { useState } from "react";
import { Filter, Download, Calendar } from "lucide-react";

interface Props {
  onApply: (filters: any) => void;
  onExport?: () => void;
  showDateRange?: boolean;
  showOrganization?: boolean;
  showEmployee?: boolean;
  showStatus?: boolean;
  showLocation?: boolean;
}

export const ReportFilterBar = ({ 
  onApply, 
  onExport,
  showDateRange = true,
  showOrganization = true,
  showEmployee = false,
  showStatus = false,
  showLocation = false
}: Props) => {
  const [filters, setFilters] = useState<any>({});

  const handleChange = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-wrap items-end gap-4">
      {showDateRange && (
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Date Range</label>
          <div className="relative">
             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
             <input type="date" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" onChange={(e) => handleChange('dateFrom', e.target.value)} />
          </div>
        </div>
      )}
      
      {showOrganization && (
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Organization</label>
          <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" onChange={(e) => handleChange('organization', e.target.value)}>
            <option value="">All Organizations</option>
            <option value="ORG-1">Headquarters</option>
            <option value="ORG-2">North Region</option>
          </select>
        </div>
      )}

      {showEmployee && (
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Employee ID</label>
          <input type="text" placeholder="Search..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" onChange={(e) => handleChange('employee', e.target.value)} />
        </div>
      )}

      {showStatus && (
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Status</label>
          <select className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" onChange={(e) => handleChange('status', e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>
      )}

      {showLocation && (
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Location</label>
          <input type="text" placeholder="Zone/Site..." className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500" onChange={(e) => handleChange('location', e.target.value)} />
        </div>
      )}

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onApply(filters)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Filter className="w-4 h-4" /> Apply
        </button>
        {onExport && (
          <button 
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        )}
      </div>
    </div>
  );
};
