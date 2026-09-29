import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "lucide-react";
import { ShiftTemplate } from "@/api/shifts";

// Mock data until API is fully ready
const MOCK_SHIFTS: ShiftTemplate[] = [
  { id: "1", name: "Morning Shift", code: "MORN", startTime: "06:00", endTime: "14:00", isOvernight: false, breakDurationMinutes: 60, effectiveFrom: "2026-01-01", status: "Active" },
  { id: "2", name: "Evening Shift", code: "EVE", startTime: "14:00", endTime: "22:00", isOvernight: false, breakDurationMinutes: 60, effectiveFrom: "2026-01-01", status: "Active" },
  { id: "3", name: "Night Shift", code: "NIGHT", startTime: "22:00", endTime: "06:00", isOvernight: true, breakDurationMinutes: 60, effectiveFrom: "2026-01-01", status: "Active" },
];

export const ShiftTemplatesList = () => {
  const [shifts, setShifts] = useState<ShiftTemplate[]>(MOCK_SHIFTS);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-900">Shift Templates</h2>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none">
          <Plus className="w-4 h-4" />
          Create Shift
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name & Code</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timing</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective From</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shifts.map((shift) => (
              <tr key={shift.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{shift.name}</div>
                  <div className="text-sm text-gray-500">{shift.code}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{shift.startTime} - {shift.endTime}</div>
                  {shift.isOvernight && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">Overnight</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {shift.effectiveFrom}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${shift.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {shift.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <button className="text-gray-400 hover:text-gray-900" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900" title="Deactivate">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shifts.length === 0 && (
          <div className="p-12 text-center text-gray-500">
            No shift templates found.
          </div>
        )}
      </div>
    </div>
  );
};
