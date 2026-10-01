"use client";

import React, { useEffect, useState } from "react";
import { getEmployee, getEmployeeAttendanceSummary, updateEmployeeSupervisor, getSupervisorTeam, EmployeeDetail, AttendanceSummary, TeamMember } from "@/api/employees";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EmployeeDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [supervisorId, setSupervisorId] = useState("");
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    
    Promise.all([
      getEmployee(id).catch(() => null),
      getEmployeeAttendanceSummary(id).catch(() => null),
      getSupervisorTeam(id).catch(() => null)
    ]).then(([empData, sumData, teamData]) => {
      if (!mounted) return;
      if (empData) setEmployee(empData);
      else setError(true);
      if (sumData) setSummary(sumData);
      if (teamData) setTeam(teamData);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, [id]);

  const handleAssignSupervisor = async () => {
    if (!supervisorId) return;
    setAssigning(true);
    try {
      await updateEmployeeSupervisor(id, supervisorId);
      alert("Supervisor assigned successfully");
      const updated = await getEmployee(id);
      setEmployee(updated);
    } catch (err) {
      alert("Failed to assign supervisor");
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  if (error || !employee) {
    return <div className="p-8 text-center text-red-600">Failed to load employee details.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      <div className="bg-white border-b px-6 py-4 flex flex-col gap-4 shadow-sm">
        <Link href="/employees" className="text-sm text-blue-600 hover:underline flex items-center gap-1 w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Employees
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{employee.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{employee.employee_id} • {employee.department || "No Department"}</p>
          </div>
          <div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {employee.status}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6">
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block">Email</span> {employee.email || '-'}</div>
              <div><span className="text-gray-500 block">Phone</span> {employee.phone || '-'}</div>
              <div><span className="text-gray-500 block">Unit</span> {employee.unit || '-'}</div>
              <div><span className="text-gray-500 block">Current Supervisor</span> {employee.supervisor || '-'}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assign Supervisor</h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Supervisor ID" 
                value={supervisorId}
                onChange={e => setSupervisorId(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 flex-1 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={handleAssignSupervisor}
                disabled={assigning || !supervisorId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {assigning && <Loader2 className="w-4 h-4 animate-spin" />}
                Assign
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attendance Summary</h2>
            {summary ? (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Present</span>
                  <span className="font-semibold text-gray-900">{summary.present} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Leave</span>
                  <span className="font-semibold text-gray-900">{summary.leave} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Off Duty</span>
                  <span className="font-semibold text-gray-900">{summary.off_duty} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 text-red-500">Exceptions</span>
                  <span className="font-semibold text-red-600">{summary.exceptions}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No attendance data available.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Team View */}
      {team.length > 0 && (
        <div className="px-6 pb-6">
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Supervised Team</h2>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-3">Employee ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Duty</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono">{member.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{member.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{member.duty}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {member.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
