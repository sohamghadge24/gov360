import React, { useState } from "react";
import { exceptionService } from "@/api/approvals";

interface Props {
  action: 'Approve' | 'Reject' | 'Reopen';
  exceptionId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ActionModal = ({ action, exceptionId, onClose, onSuccess }: Props) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Reason is required.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (action === 'Approve') {
        await exceptionService.approve(exceptionId, { reason });
      } else if (action === 'Reject') {
        await exceptionService.reject(exceptionId, { reason });
      } else if (action === 'Reopen') {
        await exceptionService.reopen(exceptionId, { reason });
      }
      onSuccess();
    } catch (err: any) {
      setError(err?.message || "Failed to process request.");
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => `${action} Exception`;
  const getButtonText = () => loading ? 'Processing...' : action;
  const getButtonClass = () => {
    if (action === 'Approve') return 'bg-green-600 hover:bg-green-700 text-white';
    if (action === 'Reject') return 'bg-red-600 hover:bg-red-700 text-white';
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">{getTitle()}</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          {action === 'Reopen' && (
             <div className="mb-4 p-3 bg-amber-50 text-amber-800 rounded text-sm border border-amber-200">
               Warning: This will reopen a previously processed exception and create a new auditable workflow action.
             </div>
          )}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-800 rounded text-sm border border-red-200">
              {error}
            </div>
          )}
          <label className="block text-sm font-medium text-gray-700 mb-2">{action} Reason <span className="text-red-500">*</span></label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={`Please provide a reason to ${action.toLowerCase()}...`}
          />
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button 
            disabled={loading}
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            disabled={loading}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 ${getButtonClass()}`}
          >
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};
