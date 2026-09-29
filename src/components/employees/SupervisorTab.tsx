import React, { useState, useEffect } from "react";
import { getEmployeeSupervisor, updateEmployeeSupervisor, SupervisorData } from "@/api/employees";
import { User, ShieldAlert, CheckCircle2, Search, X } from "lucide-react";

interface SupervisorTabProps {
  employeeId: string;
}

export const SupervisorTab: React.FC<SupervisorTabProps> = ({ employeeId }) => {
  const [supervisor, setSupervisor] = useState<SupervisorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newSupervisorId, setNewSupervisorId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSupervisor = () => {
    let mounted = true;
    setLoading(true);
    getEmployeeSupervisor(employeeId)
      .then(res => {
        if (!mounted) return;
        setSupervisor(res);
      })
      .catch(() => {
        if (mounted) setError(true);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  };

  useEffect(() => {
    fetchSupervisor();
  }, [employeeId]);

  const handleChangeSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupervisorId.trim()) return;

    setSubmitting(true);
    setSubmitError("");
    setSuccessMessage("");

    try {
      await updateEmployeeSupervisor(employeeId, newSupervisorId, reason);
      setSuccessMessage("Supervisor updated successfully.");
      setIsDrawerOpen(false);
      fetchSupervisor(); // Refresh data
    } catch (err: any) {
      setSubmitError("Unable to update supervisor. The selected supervisor would create an invalid reporting hierarchy or does not exist.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 animate-pulse space-y-6">
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
        <div className="h-24 w-full max-w-2xl bg-gray-100 rounded-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 mb-4">Unable to load supervisor information.</p>
        <button onClick={fetchSupervisor} className="text-blue-600 hover:underline">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Reporting Supervisor</h3>
        <p className="text-sm text-gray-500 mb-6">Manage the primary reporting line for this employee.</p>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3 text-green-800">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Current Supervisor</p>
              {supervisor ? (
                <>
                  <p className="text-lg font-bold text-gray-900">{supervisor.name}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                    <span>{supervisor.department || 'No department'}</span>
                    <span className="text-gray-300">•</span>
                    <span>{supervisor.team || 'No team'}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-900 font-medium italic">No supervisor assigned</p>
              )}
            </div>
          </div>

          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap"
          >
            Change Supervisor
          </button>
        </div>
      </div>

      {/* Change Supervisor Drawer / Modal */}
      {isDrawerOpen && (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Change Supervisor</h2>
              <button 
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3 text-red-800">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{submitError}</p>
                </div>
              )}

              <form id="change-supervisor-form" onSubmit={handleChangeSupervisor} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Supervisor ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={newSupervisorId}
                      onChange={e => setNewSupervisorId(e.target.value)}
                      placeholder="Search by Employee ID..."
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Enter the exact Employee ID of the new supervisor.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for Change <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    rows={4}
                    placeholder="Provide a reason for the reporting line change..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="change-supervisor-form"
                disabled={submitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
