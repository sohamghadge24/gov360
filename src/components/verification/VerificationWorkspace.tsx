"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, Loader2, MapPin, Camera, QrCode, Wifi, Smartphone, RefreshCw, XCircle, ChevronDown, Clock3, ArrowRight, X, Clock as HistoryIcon } from "lucide-react";
import { verificationService, VerificationSlot, VerificationEvidence, VerificationResult } from "@/api/verification";

type FlowState = 'IDLE' | 'LOADING_SLOT' | 'READY_TO_START' | 'STARTING' | 'GATHERING_EVIDENCE' | 'SUBMITTING' | 'RESULT' | 'ERROR';

export const VerificationWorkspace = () => {
  const [flowState, setFlowState] = useState<FlowState>('LOADING_SLOT');
  const [slot, setSlot] = useState<VerificationSlot | null>(null);
  const [slots, setSlots] = useState<VerificationSlot[]>([]);
  const [evidence, setEvidence] = useState<VerificationEvidence[]>([]);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [selectedHistorySlot, setSelectedHistorySlot] = useState<VerificationSlot | null>(null);

  const fetchDashboard = async () => {
    setFlowState('LOADING_SLOT');
    setError(null);
    try {
      const [nextData, slotsData] = await Promise.all([
        verificationService.getNextSlot().catch(() => null),
        verificationService.getSlots().catch(() => [])
      ]);
      
      setSlots(slotsData || []);
      
      if (nextData) {
        setSlot(nextData);
        setFlowState('READY_TO_START');
      } else {
        setSlot(null);
        setFlowState('IDLE');
      }
    } catch (err) {
      setError("Unable to load verification status.");
      setFlowState('ERROR');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleStart = async () => {
    if (!slot) return;
    setFlowState('STARTING');
    setIsDrawerOpen(true);
    setError(null);
    try {
      await verificationService.startVerification(slot.id);
      setFlowState('GATHERING_EVIDENCE');
    } catch (err) {
      setError("Failed to start verification.");
      setFlowState('ERROR');
    }
  };

  const handleCollectEvidence = (type: VerificationEvidence['type']) => {
    // Simulated collection. In a real app this would trigger GPS/Camera/NFC hardware APIs.
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
        // Refresh dashboard in background
        fetchDashboard();
      } else {
        throw new Error("Empty response");
      }
    } catch (err) {
      setError("Failed to complete verification.");
      setFlowState('ERROR');
    }
  };

  const renderIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gps': case 'location': return <MapPin className="w-4 h-4" />;
      case 'selfie': return <Camera className="w-4 h-4" />;
      case 'qr': return <QrCode className="w-4 h-4" />;
      case 'wifi': return <Wifi className="w-4 h-4" />;
      case 'nfc': return <Smartphone className="w-4 h-4" />;
      default: return null;
    }
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    if (flowState === 'RESULT') {
      setFlowState('IDLE');
      setSlot(null);
      setEvidence([]);
      setResult(null);
      fetchDashboard();
    }
  };

  const completedSlots = slots.filter(s => s.status === 'Verified' || s.status === 'Failed' || s.status === 'Missed' || s.status === 'Expired');
  const pendingSlots = slots.filter(s => s.status === 'Pending' || s.status === 'Due' || s.status === 'In progress');

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      <div className="px-10 pt-10 pb-6 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">DUTY OPERATIONS</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">VERIFICATION</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Complete scheduled verification for the current duty assignment.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/40 border border-white rounded-[14px] shadow-sm text-[13px] font-medium text-[var(--color-deep-navy)] backdrop-blur-md">
              <span>Today, {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-10 pb-10 max-w-7xl mx-auto w-full space-y-6 relative z-10">
        
        {/* TOP ROW: CURRENT VERIFICATION & TIMELINE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CURRENT VERIFICATION */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="glass-card flex-1 p-8 relative overflow-hidden h-[360px]">
              <div className="absolute -left-10 -top-10 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-transparent opacity-60 mix-blend-multiply rounded-full blur-3xl pointer-events-none" />
              
              {flowState === 'LOADING_SLOT' ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                  <div className="h-8 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-64 bg-gray-200 rounded"></div>
                </div>
              ) : flowState === 'IDLE' ? (
                <div className="flex flex-col items-center justify-center text-center h-full py-6 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-white/60 flex items-center justify-center mb-4 border border-white shadow-sm">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-display text-[26px] text-[var(--color-deep-navy)] mb-2 font-medium">You're all caught up</h3>
                  <p className="text-[14px] text-[var(--color-neutral)] mb-6 max-w-[280px]">No active verification required at this time.</p>
                  <button onClick={fetchDashboard} className="btn-secondary group">
                    <RefreshCw className="w-4 h-4 text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" /> Refresh
                  </button>
                </div>
              ) : slot ? (
                <div className="flex flex-col h-full relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Verification</h3>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div>
                      REQUIRED NOW
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-[28px] font-bold text-gray-900 leading-tight mb-1">{new Date(slot.expectedTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    <p className="text-gray-600 font-medium">{slot.name || "Scheduled Verification"}</p>
                    <p className="text-sm text-red-600 font-medium mt-1">Due soon</p>
                  </div>
                  
                  <div className="mt-auto">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Required Methods</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {slot.requiredEvidence.map(req => (
                        <div key={req} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-700">
                          {renderIcon(req)} {req}
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={handleStart}
                      className="btn-primary"
                    >
                      Start Verification <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          
          {/* TODAY'S PLAN */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="glass-card flex-1 p-8 flex flex-col h-[360px]">
              <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-6">Today's Plan</h3>
              
              <div className="relative border-l-[3px] border-gray-100 ml-3 space-y-6 flex-1 overflow-y-auto max-h-[220px]">
                {slots.length === 0 ? (
                  <p className="text-sm text-gray-500 pl-4">No verifications scheduled today.</p>
                ) : (
                  slots.map((s, idx) => {
                    let dotClass = "bg-gray-200 border-white";
                    let textClass = "text-gray-500";
                    let icon = null;
                    
                    if (s.status === 'Verified') {
                      dotClass = "bg-[#E1F7E9] border-white";
                      icon = <CheckCircle className="w-3 h-3 text-[#0A5D2C]" />;
                      textClass = "text-[#0A5D2C]";
                    } else if (s.status === 'Due' || s.status === 'In progress') {
                      dotClass = "bg-white border-blue-500";
                      icon = <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />;
                      textClass = "text-blue-600";
                    } else if (s.status === 'Failed' || s.status === 'Missed') {
                      dotClass = "bg-red-50 border-white";
                      icon = <XCircle className="w-3 h-3 text-red-500" />;
                      textClass = "text-red-600";
                    }
                    
                    return (
                      <div key={s.id} className="relative pl-6">
                        <div className={`absolute -left-[10.5px] top-0 w-5 h-5 rounded-full flex items-center justify-center border-[3px] shadow-sm ${dotClass}`}>
                          {icon}
                        </div>
                        <div className="flex justify-between items-start mb-0.5">
                          <span className={`text-[12px] font-bold w-10 mt-0.5 ${textClass}`}>
                            {new Date(s.expectedTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                          <div className="flex-1 ml-2">
                            <h4 className={`font-semibold text-sm ${s.status === 'Due' ? 'text-gray-900' : 'text-gray-700'}`}>{s.name}</h4>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                              {s.requiredEvidence.join(' + ')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* EVIDENCE TRACKER (IF SLOT IS ACTIVE) */}
        {slot && (
          <div className="glass-card p-8">
            <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-6">Verification Evidence</h3>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {['GPS', 'Selfie', 'QR', 'NFC'].map(type => {
                const isRequired = slot.requiredEvidence.includes(type as any);
                const isCollected = evidence.some(e => e.type === type);
                
                return (
                  <div key={type} className={`flex items-center gap-2 ${isRequired ? 'opacity-100' : 'opacity-40'}`}>
                    {isCollected ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : isRequired ? (
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400" />
                    ) : (
                      <div className="w-4 h-4 flex items-center justify-center text-gray-300">—</div>
                    )}
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{type === 'GPS' ? 'Location' : type}</div>
                      <div className={`text-[11px] font-medium uppercase tracking-wider ${isCollected ? 'text-green-600' : isRequired ? 'text-blue-600' : 'text-gray-400'}`}>
                        {isCollected ? 'Verified' : isRequired ? 'Pending' : 'Not required'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VERIFICATION HISTORY */}
        <div className="glass-card overflow-hidden">
          <div className="px-8 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="font-display text-[22px] text-[var(--color-deep-navy)] font-medium">Verification History</h3>
            <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">Status <ChevronDown className="w-3 h-3" /></span>
              <span className="flex items-center gap-1 cursor-pointer hover:text-gray-900">Method <ChevronDown className="w-3 h-3" /></span>
            </div>
          </div>
          
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-white">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date / Time</th>
                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Duty</th>
                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Method</th>
                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {completedSlots.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <HistoryIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No verification history available.</p>
                  </td>
                </tr>
              ) : (
                completedSlots.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors group cursor-pointer" onClick={() => setSelectedHistorySlot(s)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-[13px] font-bold text-gray-900">{new Date(s.expectedTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                      <div className="text-[12px] text-gray-500 font-medium">{new Date(s.expectedTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">{s.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-xs text-gray-600 font-medium">{s.requiredEvidence.join(' + ')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {s.status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-[13px] font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* VERIFICATION WORKFLOW DRAWER */}
      {isDrawerOpen && slot && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl w-full md:max-w-md h-full flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-bold text-gray-900">Verification</h2>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                <span className={flowState === 'GATHERING_EVIDENCE' || flowState === 'STARTING' ? 'text-blue-600' : 'text-gray-400'}>1 Evidence</span>
                <span className="text-gray-300">─────</span>
                <span className={flowState === 'SUBMITTING' ? 'text-blue-600' : 'text-gray-400'}>2 Review</span>
                <span className="text-gray-300">─────</span>
                <span className={flowState === 'RESULT' ? 'text-blue-600' : 'text-gray-400'}>3 Complete</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{slot.name}</h3>
              <p className="text-xs text-gray-500">Collect all required evidence to proceed.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              {flowState === 'STARTING' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-sm font-medium text-gray-600">Initializing verification...</p>
                </div>
              )}
              
              {flowState === 'ERROR' && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Verification Error</h3>
                  <p className="text-sm text-gray-500 mb-6">{error || "Something went wrong."}</p>
                  <button onClick={handleStart} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-sm">Try Again</button>
                </div>
              )}

              {flowState === 'GATHERING_EVIDENCE' && (
                <div className="space-y-4">
                  {slot.requiredEvidence.map(type => {
                    const isCollected = evidence.some(e => e.type === type);
                    return (
                      <div key={type} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${isCollected ? 'border-green-200' : 'border-gray-200'}`}>
                        <div className="p-4 flex items-center justify-between border-b border-gray-50">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isCollected ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                              {renderIcon(type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">{type === 'GPS' ? 'Location' : type}</h4>
                              <p className={`text-[11px] font-bold uppercase tracking-wider ${isCollected ? 'text-green-600' : 'text-amber-600'}`}>
                                {isCollected ? 'Verified' : 'Pending Action'}
                              </p>
                            </div>
                          </div>
                          {isCollected && <CheckCircle className="w-5 h-5 text-green-500" />}
                        </div>
                        
                        {!isCollected && (
                          <div className="p-4 bg-gray-50/50">
                            {type === 'GPS' && (
                              <div className="text-center">
                                <div className="h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                                  <MapPin className="w-6 h-6 text-gray-400" />
                                </div>
                                <button onClick={() => handleCollectEvidence(type)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm">Capture Location</button>
                              </div>
                            )}
                            {type === 'Selfie' && (
                              <div className="text-center">
                                <p className="text-xs text-gray-500 mb-3">Position your face within the frame and follow liveness instructions.</p>
                                <button onClick={() => handleCollectEvidence(type)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2"><Camera className="w-4 h-4"/> Start Camera</button>
                              </div>
                            )}
                            {type === 'QR' && (
                              <div className="text-center">
                                <p className="text-xs text-gray-500 mb-3">Scan the secure QR code at the checkpoint.</p>
                                <button onClick={() => handleCollectEvidence(type)} className="w-full py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 shadow-sm flex items-center justify-center gap-2"><QrCode className="w-4 h-4"/> Scan QR</button>
                              </div>
                            )}
                            {type === 'NFC' && (
                              <div className="text-center">
                                <p className="text-xs text-gray-500 mb-3">Hold your device near the NFC checkpoint.</p>
                                <button onClick={() => handleCollectEvidence(type)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2"><Smartphone className="w-4 h-4"/> Tap to verify</button>
                              </div>
                            )}
                            {type === 'WiFi' && (
                              <div className="text-center">
                                <p className="text-xs text-gray-500 mb-3">Checking registered network presence...</p>
                                <button onClick={() => handleCollectEvidence(type)} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center justify-center gap-2"><Wifi className="w-4 h-4"/> Detect Network</button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {(flowState === 'SUBMITTING' || flowState === 'RESULT') && result && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  {flowState === 'SUBMITTING' ? (
                    <>
                      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Verifying...</h3>
                      <p className="text-sm text-gray-500">Evaluating collected evidence safely.</p>
                    </>
                  ) : result.status === 'Verified' ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-100 shadow-sm">
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Complete</h3>
                      <p className="text-gray-500 text-sm mb-6">{result.message || "Your attendance and duty checkpoint have been recorded successfully."}</p>
                    </>
                  ) : result.status === 'Failed' ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 border border-red-100 shadow-sm">
                        <XCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h3>
                      <p className="text-gray-500 text-sm mb-6">{result.message || "Evidence verification failed. Please contact your supervisor."}</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-4 border border-amber-100 shadow-sm">
                        <RefreshCw className="w-8 h-8 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Please Retry</h3>
                      <p className="text-gray-500 text-sm mb-6">{result.message || "Something wasn't quite right. Please try collecting evidence again."}</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
              {flowState === 'GATHERING_EVIDENCE' && (
                <button 
                  disabled={evidence.length < slot.requiredEvidence.length}
                  onClick={handleSubmit}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Complete Verification
                </button>
              )}
              {flowState === 'RESULT' && (
                <button 
                  onClick={result?.status === 'Retry' ? () => { setEvidence([]); setFlowState('GATHERING_EVIDENCE'); } : closeDrawer}
                  className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {result?.status === 'Retry' ? 'Retry Capture' : 'Close'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* HISTORY DETAIL DRAWER */}
      {selectedHistorySlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl w-full md:max-w-md h-full flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-bold text-gray-900">Verification Detail</h2>
              <button onClick={() => setSelectedHistorySlot(null)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedHistorySlot.status === 'Verified' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {selectedHistorySlot.status === 'Verified' ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertTriangle className="w-6 h-6 text-red-600" />}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedHistorySlot.name}</h3>
                  <p className="text-sm text-gray-500">{new Date(selectedHistorySlot.expectedTime).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 space-y-4">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                  <p className={`font-semibold text-sm ${selectedHistorySlot.status === 'Verified' ? 'text-green-700' : 'text-red-700'}`}>{selectedHistorySlot.status}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Required Evidence</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedHistorySlot.requiredEvidence.map(req => (
                      <span key={req} className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-700">
                        <CheckCircle className="w-3 h-3 text-green-500" /> {req}
                      </span>
                    ))}
                  </div>
                </div>
                {selectedHistorySlot.result && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Result Notes</p>
                    <p className="text-sm text-gray-800">{selectedHistorySlot.result}</p>
                  </div>
                )}
              </div>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-800 font-medium flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  Detailed biometric and location evidence is retained securely and can only be accessed by authorized auditors.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
