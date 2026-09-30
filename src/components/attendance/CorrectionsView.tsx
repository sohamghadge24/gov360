"use client";

import React, { useState, useEffect } from "react";
import { getAttendanceSessions, requestAttendanceCorrection, AttendanceSession } from "@/api/attendance";
import { Loader2, Edit3, X } from "lucide-react";

export const CorrectionsView = ({ refreshKey }: { refreshKey: number }) => {
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [correctingId, setCorrectingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAttendanceSessions()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctingId) return;
    setIsSubmitting(true);
    try {
      await requestAttendanceCorrection(correctingId, { reason, requested_correction_details: details });
      alert("Correction requested successfully.");
      setCorrectingId(null);
      setReason("");
      setDetails("");
    } catch (err) {
      alert("Failed to submit correction request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-full overflow-hidden relative">
      <div className="p-4 border-b border-gray-200 bg-gray-50/50">
        <h2 className="text-sm font-semibold text-gray-700">Attendance Corrections</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 text-gray-400 animate-spin" /></div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Recent Sessions</h3>
            <p className="text-sm text-gray-500 max-w-sm text-center">
              There are no attendance sessions available to correct.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-3 font-medium">Session ID</th>
                <th className="px-6 py-3 font-medium">Employee</th>
                <th className="px-6 py-3 font-medium">Date/Time</th>
                <th className="px-6 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{session.id}</td>
                  <td className="px-6 py-4 text-sm">{session.employee_name}</td>
                  <td className="px-6 py-4 text-sm">{session.check_in_time || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setCorrectingId(session.id)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded hover:bg-gray-50"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Request Correction
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {correctingId && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Request Correction</h3>
              <button onClick={() => setCorrectingId(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <select 
                  required
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full border-gray-300 rounded-md shadow-sm border py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">Select a reason</option>
                  <option value="FORGOT_CHECKOUT">Forgot Check-out</option>
                  <option value="NETWORK_ISSUE">Network Issue</option>
                  <option value="DEVICE_ISSUE">Device Issue</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correction Details</label>
                <textarea
                  required
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="E.g., I actually checked out at 5:00 PM."
                  className="w-full border-gray-300 rounded-md shadow-sm border py-2 px-3 focus:ring-blue-500 focus:border-blue-500 text-sm h-24"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectingId(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
