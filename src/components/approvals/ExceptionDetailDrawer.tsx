import React, { useEffect, useState } from "react";
import { exceptionService, ExceptionDetail } from "@/api/approvals";
import { Loader2, AlertTriangle, X, CheckCircle, Clock, Shield, History, MapPin } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { StatusBadge } from "./StatusBadge";
import { ActionModal } from "./ActionModals";

interface Props {
  exceptionId: string;
  onClose: () => void;
}

export const ExceptionDetailDrawer = ({ exceptionId, onClose }: Props) => {
  const [data, setData] = useState<ExceptionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeModal, setActiveModal] = useState<'Approve' | 'Reject' | 'Reopen' | null>(null);
  const [escalating, setEscalating] = useState(false);

  const [explanationText, setExplanationText] = useState("");
  const [submittingExplanation, setSubmittingExplanation] = useState(false);

  const loadData = () => {
    setLoading(true);
    exceptionService.getException(exceptionId)
      .then(res => {
        setData(res);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError(err?.message || "Failed to load exception details.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [exceptionId]);

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      await exceptionService.escalate(exceptionId);
      loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to escalate");
    } finally {
      setEscalating(false);
    }
  };

  const handleAddExplanation = async () => {
    if (!explanationText.trim()) return;
    setSubmittingExplanation(true);
    try {
      await exceptionService.addExplanation(exceptionId, { text: explanationText });
      setExplanationText("");
      loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to add explanation");
    } finally {
      setSubmittingExplanation(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 overflow-hidden">
      <div className="w-full max-w-4xl bg-gray-50 flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
             <h2 className="text-xl font-bold text-gray-900">Exception #{exceptionId}</h2>
             {data && <StatusBadge status={data.status} />}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-600" />
              <p>Loading details...</p>
            </div>
          ) : error || !data ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
              <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
              <p className="text-gray-900 font-medium mb-1">{error}</p>
            </div>
          ) : (
            <>
              {/* Left Column - Details */}
              <div className="flex-1 space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-gray-200 bg-gray-50/50 font-semibold text-gray-800">
                     Exception Details
                   </div>
                   <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                     <div>
                       <span className="block text-gray-500 mb-1">Employee</span>
                       <span className="font-medium text-gray-900">{data.employeeName} ({data.employeeId})</span>
                     </div>
                     <div>
                       <span className="block text-gray-500 mb-1">Reason</span>
                       <span className="font-medium text-gray-900">{data.reasonLabel}</span>
                     </div>
                     <div>
                       <span className="block text-gray-500 mb-1">Severity</span>
                       <SeverityBadge severity={data.severity} />
                     </div>
                     <div>
                       <span className="block text-gray-500 mb-1">Created At</span>
                       <span className="font-medium text-gray-900">{new Date(data.createdAt).toLocaleString()}</span>
                     </div>
                   </div>
                </div>

                {data.attendanceEvidence && (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                     <div className="p-4 border-b border-gray-200 bg-gray-50/50 font-semibold text-gray-800 flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-gray-500" /> Attendance Evidence
                     </div>
                     <div className="p-5 grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                       {data.attendanceEvidence.checkIn && (
                         <div>
                           <span className="block text-gray-500 mb-1">Check In</span>
                           <span className="font-medium text-gray-900">{data.attendanceEvidence.checkIn}</span>
                         </div>
                       )}
                       {data.attendanceEvidence.checkOut && (
                         <div>
                           <span className="block text-gray-500 mb-1">Check Out</span>
                           <span className="font-medium text-gray-900">{data.attendanceEvidence.checkOut}</span>
                         </div>
                       )}
                       {data.attendanceEvidence.verificationStatus && (
                         <div>
                           <span className="block text-gray-500 mb-1">Verification Status</span>
                           <span className="font-medium text-gray-900">{data.attendanceEvidence.verificationStatus}</span>
                         </div>
                       )}
                     </div>
                  </div>
                )}

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-gray-200 bg-gray-50/50 font-semibold text-gray-800">
                     Explanation History
                   </div>
                   <div className="p-5 space-y-5">
                     {data.explanations.length === 0 ? (
                       <p className="text-gray-500 text-sm">No explanations provided.</p>
                     ) : (
                       data.explanations.map(exp => (
                         <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                           <div className="flex justify-between items-start mb-1">
                             <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                               {exp.actor}
                               <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase">{exp.role}</span>
                             </div>
                             <span className="text-xs text-gray-500">{new Date(exp.createdAt).toLocaleString()}</span>
                           </div>
                           <p className="text-sm text-gray-700 whitespace-pre-wrap">{exp.text}</p>
                         </div>
                       ))
                     )}
                   </div>
                   
                   {/* Add Explanation Form */}
                   <div className="p-4 border-t border-gray-200 bg-gray-50">
                     <textarea
                       className="w-full border border-gray-300 rounded p-3 text-sm mb-3 focus:ring-blue-500 focus:border-blue-500"
                       rows={3}
                       placeholder="Add an explanation..."
                       value={explanationText}
                       onChange={(e) => setExplanationText(e.target.value)}
                     />
                     <div className="flex justify-end">
                       <button 
                         disabled={submittingExplanation || !explanationText.trim()}
                         onClick={handleAddExplanation}
                         className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                       >
                         {submittingExplanation ? 'Submitting...' : 'Submit Explanation'}
                       </button>
                     </div>
                   </div>
                </div>

              </div>

              {/* Right Column - Workflow & Actions */}
              <div className="w-full lg:w-80 flex flex-col gap-6">
                
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-gray-200 bg-gray-50/50 font-semibold text-gray-800">
                     Workflow Actions
                   </div>
                   <div className="p-4 space-y-3">
                     <div className="mb-4">
                       <span className="block text-xs font-semibold text-gray-500 uppercase mb-1">Current Authority</span>
                       <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                         <Shield className="w-4 h-4 text-blue-500" />
                         {data.currentAuthority}
                       </span>
                     </div>
                     
                     {['Pending', 'Under Review', 'Escalated'].includes(data.status) && (
                       <>
                         <button onClick={() => setActiveModal('Approve')} className="w-full px-4 py-2 bg-green-600 text-white rounded text-sm font-medium hover:bg-green-700">Approve</button>
                         <button onClick={() => setActiveModal('Reject')} className="w-full px-4 py-2 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700">Reject</button>
                         <button disabled={escalating} onClick={handleEscalate} className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50 disabled:opacity-50">
                           {escalating ? 'Escalating...' : 'Escalate'}
                         </button>
                       </>
                     )}
                     
                     {['Approved', 'Rejected'].includes(data.status) && (
                        <button onClick={() => setActiveModal('Reopen')} className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded text-sm font-medium hover:bg-gray-50">
                           Reopen
                        </button>
                     )}
                   </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                   <div className="p-4 border-b border-gray-200 bg-gray-50/50 font-semibold text-gray-800 flex items-center gap-2">
                     <History className="w-4 h-4 text-gray-500" /> Audit Timeline
                   </div>
                   <div className="p-5">
                      <div className="relative border-l-2 border-gray-200 ml-2 space-y-6 py-2">
                        {data.auditHistory.map(audit => (
                          <div key={audit.id} className="relative pl-6">
                            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gray-300 border-2 border-white"></div>
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-semibold text-gray-900 text-sm">{audit.action}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{new Date(audit.timestamp).toLocaleString()} by {audit.actor}</div>
                            {audit.reason && <p className="text-xs text-gray-700 mt-1 italic">"{audit.reason}"</p>}
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {activeModal && (
        <ActionModal 
          action={activeModal} 
          exceptionId={exceptionId} 
          onClose={() => setActiveModal(null)}
          onSuccess={() => {
            setActiveModal(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};
