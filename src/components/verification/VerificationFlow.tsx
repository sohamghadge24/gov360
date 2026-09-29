import React, { useState, useEffect } from "react";
import { Camera, MapPin, QrCode, Wifi, Smartphone, CheckCircle, XCircle, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import { verificationService, VerificationSlot, VerificationEvidence, VerificationResult } from "@/api/verification";

type FlowState = 'IDLE' | 'LOADING_SLOT' | 'READY_TO_START' | 'STARTING' | 'GATHERING_EVIDENCE' | 'SUBMITTING' | 'RESULT';

export const VerificationFlow = () => {
  const [flowState, setFlowState] = useState<FlowState>('IDLE');
  const [slot, setSlot] = useState<VerificationSlot | null>(null);
  const [evidence, setEvidence] = useState<VerificationEvidence[]>([]);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchNextSlot = async () => {
    setFlowState('LOADING_SLOT');
    setError(null);
    try {
      const data = await verificationService.getNextSlot();
      if (data) {
        setSlot(data);
        setFlowState('READY_TO_START');
      } else {
        setSlot(null);
        setFlowState('IDLE');
        setError("No upcoming verification slots found.");
      }
    } catch (err) {
      setError("Failed to load verification slot.");
      setFlowState('IDLE');
    }
  };

  useEffect(() => {
    fetchNextSlot();
  }, []);

  const handleStart = async () => {
    if (!slot) return;
    setFlowState('STARTING');
    setError(null);
    try {
      await verificationService.startVerification(slot.id);
      setFlowState('GATHERING_EVIDENCE');
    } catch (err) {
      setError("Failed to start verification.");
      setFlowState('READY_TO_START');
    }
  };

  const handleCollectEvidence = (type: VerificationEvidence['type']) => {
    // Mock collection of evidence
    const newEvidence: VerificationEvidence = {
      type,
      data: `mock_data_for_${type}`,
      timestamp: new Date().toISOString()
    };
    setEvidence(prev => {
      if (prev.some(e => e.type === type)) return prev;
      return [...prev, newEvidence];
    });
  };

  const handleSubmit = async () => {
    if (!slot) return;
    setFlowState('SUBMITTING');
    setError(null);
    try {
      const res = await verificationService.completeVerification(slot.id, evidence);
      if (res) {
        setResult(res);
        setFlowState('RESULT');
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      setError("Failed to complete verification.");
      setFlowState('GATHERING_EVIDENCE');
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'GPS': return <MapPin className="w-5 h-5" />;
      case 'Selfie': return <Camera className="w-5 h-5" />;
      case 'QR': return <QrCode className="w-5 h-5" />;
      case 'WiFi': return <Wifi className="w-5 h-5" />;
      case 'NFC': return <Smartphone className="w-5 h-5" />;
      default: return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 max-w-md mx-auto">
      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Duty Checkpoint Verification</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-start gap-2 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {flowState === 'LOADING_SLOT' && (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mb-2 text-blue-600" />
          <p>Checking for upcoming slots...</p>
        </div>
      )}

      {flowState === 'IDLE' && !error && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-900 font-medium">You are all caught up!</p>
          <p className="text-gray-500 text-sm mt-1">No pending verifications right now.</p>
          <button 
            onClick={fetchNextSlot}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Check Again
          </button>
        </div>
      )}

      {flowState === 'READY_TO_START' && slot && (
        <div className="py-4">
          <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-1">Upcoming Verification Slot</h3>
            <p className="text-sm text-blue-800">Expected Time: <span className="font-medium">{new Date(slot.expectedTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></p>
            <p className="text-sm text-blue-800 mt-1">Required: {slot.requiredEvidence.join(', ')}</p>
          </div>
          <button 
            onClick={handleStart}
            className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Start Verification
          </button>
        </div>
      )}

      {(flowState === 'GATHERING_EVIDENCE' || flowState === 'SUBMITTING' || flowState === 'STARTING') && slot && (
        <div className="py-2">
           <h3 className="text-sm font-medium text-gray-700 mb-3">Collect Required Evidence</h3>
           <div className="space-y-3 mb-6">
             {slot.requiredEvidence.map(type => {
               const isCollected = evidence.some(e => e.type === type);
               return (
                 <button 
                  key={type}
                  disabled={isCollected || flowState !== 'GATHERING_EVIDENCE'}
                  onClick={() => handleCollectEvidence(type)}
                  className={`w-full flex items-center justify-between p-3 border rounded-md transition-colors ${isCollected ? 'bg-green-50 border-green-200 text-green-800' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-700'}`}
                 >
                   <div className="flex items-center gap-3">
                     {renderIcon(type)}
                     <span className="font-medium">{type} Evidence</span>
                   </div>
                   {isCollected ? <CheckCircle className="w-5 h-5 text-green-600" /> : <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>}
                 </button>
               )
             })}
           </div>

           <button 
            disabled={evidence.length < slot.requiredEvidence.length || flowState !== 'GATHERING_EVIDENCE'}
            onClick={handleSubmit}
            className="w-full py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {flowState === 'SUBMITTING' ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Complete Verification'}
          </button>
        </div>
      )}

      {flowState === 'RESULT' && result && (
        <div className="text-center py-6">
          {result.status === 'Verified' ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Verified Successfully</h3>
              <p className="text-gray-500 mt-2">{result.message || "Your attendance and duty checkpoint have been recorded."}</p>
            </>
          ) : result.status === 'Failed' ? (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Verification Failed</h3>
              <p className="text-gray-500 mt-2">{result.message || "We could not verify your evidence. Please contact your supervisor."}</p>
            </>
          ) : result.status === 'Retry' ? (
            <>
              <RefreshCw className="w-16 h-16 text-amber-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Please Retry</h3>
              <p className="text-gray-500 mt-2">{result.message || "Something wasn't quite right. Please try collecting evidence again."}</p>
              <button 
                onClick={() => {
                  setEvidence([]);
                  setFlowState('GATHERING_EVIDENCE');
                }}
                className="mt-6 w-full py-2 bg-amber-100 text-amber-800 rounded-md font-medium hover:bg-amber-200 transition-colors"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900">Exception Raised</h3>
              <p className="text-gray-500 mt-2">{result.message || "An exception has been recorded for this checkpoint."}</p>
            </>
          )}

          {result.status !== 'Retry' && (
             <button 
              onClick={() => {
                setFlowState('IDLE');
                setSlot(null);
                setEvidence([]);
                setResult(null);
                fetchNextSlot();
              }}
              className="mt-8 w-full py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      )}

    </div>
  );
};
