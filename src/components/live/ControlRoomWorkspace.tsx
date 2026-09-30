"use client";

import React, { useState, useEffect } from "react";
import {
  Users, Map, Clock, AlertTriangle, Search, ChevronDown, CheckCircle,
  MapPin, X, Loader2, Navigation, Maximize2, ShieldAlert, FileText, WifiOff, RefreshCw
} from "lucide-react";
import {
  monitoringService,
  MonitoringSummary,
  MonitoringEmployeeStatus,
  DueVerification,
  OperationalException,
  MonitoringMapPoint,
  TimelineEvent,
  FieldCoverage
} from "@/api/monitoring";

export const ControlRoomWorkspace = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);

  const [summary, setSummary] = useState<MonitoringSummary | null>(null);
  const [statusList, setStatusList] = useState<MonitoringEmployeeStatus[]>([]);
  const [mapPoints, setMapPoints] = useState<MonitoringMapPoint[]>([]);
  const [dueList, setDueList] = useState<DueVerification[]>([]);
  const [exceptions, setExceptions] = useState<OperationalException[]>([]);
  const [fieldCoverage, setFieldCoverage] = useState<FieldCoverage[]>([]);

  const [connectionState, setConnectionState] = useState<'LIVE' | 'CONNECTING' | 'RECONNECTING' | 'OFFLINE'>('CONNECTING');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  useEffect(() => {
    fetchInitialData();
    // Simulate realtime connection lifecycle
    const tm = setTimeout(() => setConnectionState('LIVE'), 1000);
    return () => clearTimeout(tm);
  }, []);

  useEffect(() => {
    if (selectedEmployeeId) {
      fetchTimeline(selectedEmployeeId);
    }
  }, [selectedEmployeeId]);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);
    setConnectionState('CONNECTING');

    try {
      const [
        sumData, statData, mapData, dueData, excData, covData
      ] = await Promise.all([
        monitoringService.getSummary().catch(e => { if (e.status === 403) setForbidden(true); throw e; }),
        monitoringService.getStatusList().catch(() => []),
        monitoringService.getMapPoints().catch(() => []),
        monitoringService.getDueVerifications().catch(() => []),
        monitoringService.getExceptions().catch(() => []),
        monitoringService.getFieldCoverage().catch(() => [])
      ]);

      setSummary(sumData);
      setStatusList(Array.isArray(statData) ? statData : (statData as any)?.items || []);
      setMapPoints(Array.isArray(mapData) ? mapData : (mapData as any)?.items || []);
      setDueList(Array.isArray(dueData) ? dueData : (dueData as any)?.items || []);
      setExceptions(Array.isArray(excData) ? excData : (excData as any)?.items || []);
      setFieldCoverage(Array.isArray(covData) ? covData : (covData as any)?.items || []);

      setLastUpdated(new Date());
      setConnectionState('LIVE');
    } catch (err: any) {
      if (!forbidden && err.status !== 403) {
        setError("Unable to load control-room summary.");
        setConnectionState('OFFLINE');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeline = async (id: string) => {
    setIsTimelineLoading(true);
    try {
      const data = await monitoringService.getEmployeeTimeline(id);
      setTimeline(data || []);
    } catch {
      setTimeline([]);
    } finally {
      setIsTimelineLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchInitialData();
  };

  if (forbidden) {
    return (
      <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <nav className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-2">
              <span>Operations</span> <span>/</span> <span className="text-gray-900 font-semibold">Live Control Room</span>
            </nav>
            <h1 className="text-xl font-bold text-gray-900">Live Control Room</h1>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 border border-red-100">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-500 mb-6">You do not have permission to view this operational scope.</p>
        </div>
      </div>
    );
  }

  const selectedEmployeeStatus = selectedEmployeeId ? statusList.find(s => s.employeeId === selectedEmployeeId) : null;

  return (
    <div className="flex flex-col h-screen bg-[#F7F8FA] overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm shrink-0 z-10">
        <div>
          <nav className="text-[12px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span>Operations</span> <span>/</span> <span className="text-gray-900 font-semibold">Live Control Room</span>
          </nav>
          <h1 className="text-xl font-bold text-gray-900">Live Control Room</h1>
          <p className="text-[13px] text-gray-500">Real-time workforce, verification and field-duty monitoring.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <button className="px-3 py-1.5 border border-gray-200 rounded text-sm font-medium text-gray-700 bg-gray-50 flex items-center gap-1.5">
              Scope: Maharashtra <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search employee..."
                className="pl-9 pr-3 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
          </div>

          <button onClick={handleRefresh} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${connectionState === 'LIVE' ? 'bg-green-50 text-green-700 border border-green-100' :
              connectionState === 'CONNECTING' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                connectionState === 'RECONNECTING' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                  'bg-gray-100 text-gray-600 border border-gray-200'
            }`}>
            <span className={`w-2 h-2 rounded-full ${connectionState === 'LIVE' ? 'bg-green-500 animate-pulse' :
                connectionState === 'CONNECTING' ? 'bg-blue-500 animate-bounce' :
                  connectionState === 'RECONNECTING' ? 'bg-amber-500 animate-pulse' :
                    'bg-gray-400'
              }`}></span>
            {connectionState}
          </div>
        </div>
      </div>

      {connectionState === 'OFFLINE' && (
        <div className="bg-gray-800 text-white text-xs font-medium py-1.5 px-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5" /> Realtime connection lost. Showing the latest synchronized data.
          </div>
          <button onClick={handleRefresh} className="text-blue-300 hover:text-white underline">Reconnect</button>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col p-4 gap-4 max-w-[1600px] mx-auto w-full">
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase mb-1">Present</span>
            <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{loading ? '-' : summary?.present || 0}</div>
            <span className="text-xs text-gray-500 font-medium">{loading ? '...' : summary?.presentTrend || 'today'}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase mb-1">On Duty</span>
            <div className="text-2xl font-bold text-blue-600 leading-none mb-1">{loading ? '-' : summary?.onDuty || 0}</div>
            <span className="text-xs text-gray-500 font-medium">Field {loading ? '-' : summary?.fieldDuty || 0}</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase mb-1">Due</span>
            <div className="text-2xl font-bold text-amber-600 leading-none mb-1">{loading ? '-' : summary?.verificationDue || 0}</div>
            <span className="text-xs text-gray-500 font-medium">Next {loading ? '-' : summary?.dueWithinMins || 30} min</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase mb-1">Missed</span>
            <div className="text-2xl font-bold text-red-600 leading-none mb-1">{loading ? '-' : summary?.missed || 0}</div>
            <span className="text-xs text-gray-500 font-medium">Needs review</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase mb-1">Exceptions</span>
            <div className="text-2xl font-bold text-purple-600 leading-none mb-1">{loading ? '-' : summary?.exceptions || 0}</div>
            <span className="text-xs text-purple-600 font-medium">{loading ? '-' : summary?.urgentExceptions || 0} urgent</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm flex flex-col justify-center">
            <span className="text-[11px] font-bold text-gray-500 uppercase mb-1">Outside Zone</span>
            <div className="text-2xl font-bold text-orange-600 leading-none mb-1">{loading ? '-' : summary?.outsideZone || 0}</div>
            <span className="text-xs text-gray-500 font-medium">Review</span>
          </div>
        </div>

        {/* Main 3-column layout */}
        <div className="flex-1 flex gap-4 overflow-hidden">

          {/* Left Panel: Employee Status */}
          {!isMapExpanded && (
            <div className="w-[30%] min-w-[320px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Employee Status</h2>
                <div className="flex items-center gap-1">
                  <button className="text-[11px] font-bold px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50">All</button>
                  <button className="text-[11px] font-bold px-2 py-1 border border-transparent rounded text-gray-500 hover:bg-gray-100">Field</button>
                </div>
              </div>
              <div className="p-2 border-b border-gray-100 shrink-0">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input type="text" placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 text-gray-400 animate-spin" /></div>
                ) : statusList.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">No active workforce</div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {statusList.map(emp => (
                      <div
                        key={emp.employeeId}
                        onClick={() => setSelectedEmployeeId(emp.employeeId)}
                        className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedEmployeeId === emp.employeeId ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${emp.status === 'Missed' ? 'bg-red-500' :
                              emp.status === 'Outside Zone' ? 'bg-orange-500' :
                                emp.status === 'Verification Due' ? 'bg-amber-500' :
                                  emp.status === 'Verified' ? 'bg-green-500' :
                                    'bg-gray-400'
                            }`} />
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                              <span className="text-sm font-bold text-gray-900 truncate">{emp.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">{emp.employeeId}</span>
                            </div>
                            <div className="text-[12px] text-gray-600 mb-1">{emp.duty} · {emp.location}</div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className={`font-semibold ${emp.status === 'Missed' ? 'text-red-600' :
                                  emp.status === 'Outside Zone' ? 'text-orange-600' :
                                    emp.status === 'Verification Due' ? 'text-amber-600' :
                                      emp.status === 'Verified' ? 'text-green-600' :
                                        'text-gray-500'
                                }`}>{emp.status}</span>
                              <span className="text-gray-400">{emp.lastVerifiedTime ? `Verified ${emp.lastVerifiedTime}` : 'No verification'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Center Panel: Map Area */}
          <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden relative">
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-md px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white">Employees</button>
              <button className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-md px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white">Wards</button>
              <button className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-md px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white">Zones</button>
            </div>

            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setIsMapExpanded(!isMapExpanded)}
                className="bg-white/90 backdrop-blur shadow-sm border border-gray-200 rounded-md p-2 text-gray-700 hover:bg-white"
                title={isMapExpanded ? "Exit Map Mode" : "Expand Map"}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="flex-1 bg-[#E8F0F6] flex flex-col items-center justify-center relative">
              {/* Fake pins for illustration */}
              <div className="absolute top-[40%] left-[30%] flex flex-col items-center group cursor-pointer">
                <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-md"></div>
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-white rounded shadow-lg border border-gray-200 p-2 text-xs w-32 pointer-events-none transition-opacity z-20">
                  <div className="font-bold">Rahul Patil</div>
                  <div className="text-gray-500">Field Duty</div>
                  <div className="text-green-600 font-medium">Verified 10:42 AM</div>
                </div>
              </div>

              <div className="absolute top-[60%] left-[55%] flex flex-col items-center group cursor-pointer">
                <div className="bg-red-500 w-4 h-4 rounded-full border-2 border-white shadow-md animate-pulse"></div>
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-white rounded shadow-lg border border-gray-200 p-2 text-xs w-32 pointer-events-none transition-opacity z-20">
                  <div className="font-bold">Amit Sharma</div>
                  <div className="text-gray-500">Beat 04</div>
                  <div className="text-red-600 font-medium">Missed Verification</div>
                </div>
              </div>

              {!loading && (
                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-lg p-3 shadow-sm flex gap-4 overflow-x-auto text-xs">
                    <div className="font-bold text-gray-700 flex items-center shrink-0 border-r border-gray-200 pr-4">FIELD COVERAGE</div>
                    {fieldCoverage.map(cov => (
                      <div key={cov.ward} className="flex items-center gap-2 shrink-0">
                        <span className="text-gray-600 font-medium">{cov.ward}</span>
                        <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${cov.percentage > 90 ? 'bg-green-500' : cov.percentage > 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${cov.percentage}%` }}></div>
                        </div>
                        <span className="font-bold text-gray-900">{cov.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Alert Queue */}
          {!isMapExpanded && (
            <div className="w-[25%] min-w-[280px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Operational Queue</h2>
              </div>
              <div className="flex border-b border-gray-100 shrink-0">
                <button className="flex-1 py-2 text-xs font-bold text-blue-600 border-b-2 border-blue-600">All</button>
                <button className="flex-1 py-2 text-xs font-bold text-gray-500 border-b-2 border-transparent">Due</button>
                <button className="flex-1 py-2 text-xs font-bold text-gray-500 border-b-2 border-transparent">Missed</button>
                <button className="flex-1 py-2 text-xs font-bold text-gray-500 border-b-2 border-transparent">Exceptions</button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
                {loading ? (
                  <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 text-gray-400 animate-spin" /></div>
                ) : exceptions.length === 0 && dueList.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-900">All clear</p>
                    <p className="text-xs text-gray-500">No verification requires attention.</p>
                  </div>
                ) : (
                  <>
                    {exceptions.map(exc => (
                      <div key={exc.id} className="bg-white border border-red-200 rounded-md p-3 shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-[10px] font-bold text-red-600 uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> {exc.severity}
                          </span>
                          <span className="text-[10px] text-gray-400">{exc.detectedTime}</span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">{exc.type}</div>
                        <div className="text-xs text-gray-600 mt-0.5 mb-2">{exc.name} · {exc.location}</div>
                        <div className="flex justify-end">
                          <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800">Review</button>
                        </div>
                      </div>
                    ))}

                    {dueList.map(due => (
                      <div key={due.employeeId} className="bg-white border border-amber-200 rounded-md p-3 shadow-sm relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                        <div className="text-sm font-bold text-gray-900 mb-0.5">Verification {due.status}</div>
                        <div className="text-xs text-gray-600 mb-2">{due.name} · {due.location}</div>
                        <div className="flex justify-between items-end">
                          <div className="text-[11px] text-gray-500 font-medium">
                            {due.status === 'Missed' ? `Missed by ${due.missedByMins}m` : `Due at ${due.dueTime}`}
                          </div>
                          <button className="text-[11px] font-bold text-blue-600 hover:text-blue-800">View</button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Employee Drawer */}
      {selectedEmployeeId && selectedEmployeeStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl w-full md:max-w-[420px] h-full flex flex-col animate-in slide-in-from-right duration-200">

            <div className="p-5 border-b border-gray-200 flex justify-between items-start bg-white shrink-0">
              <div>
                <h2 className="text-[18px] font-bold text-gray-900 leading-tight">{selectedEmployeeStatus.name}</h2>
                <div className="text-xs font-mono text-gray-500 mb-2">{selectedEmployeeStatus.employeeId}</div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedEmployeeStatus.status === 'Verified' ? 'bg-green-50 text-green-700' :
                    selectedEmployeeStatus.status === 'Missed' ? 'bg-red-50 text-red-700' :
                      selectedEmployeeStatus.status === 'Verification Due' ? 'bg-amber-50 text-amber-700' :
                        'bg-gray-100 text-gray-700'
                  }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedEmployeeStatus.status === 'Verified' ? 'bg-green-500' :
                      selectedEmployeeStatus.status === 'Missed' ? 'bg-red-500' :
                        selectedEmployeeStatus.status === 'Verification Due' ? 'bg-amber-500' :
                          'bg-gray-500'
                    }`}></span>
                  {selectedEmployeeStatus.status}
                </span>
              </div>
              <button onClick={() => setSelectedEmployeeId(null)} className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gray-50/50">

              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Current Duty</h3>
                <div className="text-sm text-gray-900 font-medium">
                  {selectedEmployeeStatus.duty} · {selectedEmployeeStatus.location}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last Verification</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="text-sm font-bold text-gray-900 mb-1">{selectedEmployeeStatus.lastVerifiedTime || 'None'}</div>
                  <div className="text-xs text-gray-600 mb-1">GPS + Selfie</div>
                  {selectedEmployeeStatus.gpsAccuracyMeters && (
                    <div className="text-[11px] font-medium text-green-600">Accuracy ±{selectedEmployeeStatus.gpsAccuracyMeters}m</div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Location</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-0.5">{selectedEmployeeStatus.location}</div>
                    <div className="text-[11px] text-gray-500">Last verified 2 min ago</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Timeline</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  {isTimelineLoading ? (
                    <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 text-gray-400 animate-spin" /></div>
                  ) : timeline.length === 0 ? (
                    <div className="text-xs text-gray-500 text-center">No timeline events today.</div>
                  ) : (
                    <div className="relative border-l border-gray-200 ml-2 space-y-4">
                      {timeline.map((ev, i) => (
                        <div key={ev.id} className="relative pl-4">
                          <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border border-white ${ev.result === 'Passed' ? 'bg-green-500' :
                              ev.result === 'Missed' ? 'bg-red-500' :
                                ev.result === 'Due' ? 'bg-amber-500' :
                                  'bg-blue-500'
                            }`}></div>
                          <div className="flex justify-between items-start mb-0.5">
                            <span className="text-xs font-bold text-gray-900">{ev.type}</span>
                            <span className="text-[10px] text-gray-500 font-mono">{ev.time}</span>
                          </div>
                          {ev.details && <div className="text-[11px] text-gray-600">{ev.details}</div>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button className="text-[12px] font-bold text-blue-600 hover:text-blue-800 w-full text-left">View Full Timeline</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
