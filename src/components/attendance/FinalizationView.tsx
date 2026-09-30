"use client";

import React, { useState, useEffect } from "react";
import { getAttendanceSessions, finalizeAttendanceSession, AttendanceSession } from "@/api/attendance";
import { Loader2, Check } from "lucide-react";

export const FinalizationView = ({ refreshKey }: { refreshKey: number }) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalizingId, setFinalizingId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // Fetch sessions that might need finalization
    getAttendanceSessions({ status: 'Completed' })
      .then((res: any) => {
        if (!mounted) return;
        setSessions(res?.items || (Array.isArray(res) ? res : []));
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [refreshKey]);

  const handleFinalize = async (id: string) => {
    try {
      setFinalizingId(id);
      await finalizeAttendanceSession(id, { notes: 'Finalized via web admin' });
      // Remove from list after finalization
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      alert('Failed to finalize session.');
    } finally {
      setFinalizingId(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-700">Finalization Workspace</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Sessions Require Finalization</h3>
            <p className="text-sm text-gray-500 max-w-sm text-center">
              All approved workflows have been processed and there are no sessions waiting for administrative finalization.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-3 font-medium">Session ID</th>
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{session.id}</td>
                  <td className="px-6 py-4 text-sm">{session.employee_name}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleFinalize(session.id)}
                      disabled={finalizingId === session.id}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {finalizingId === session.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                      Finalize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
