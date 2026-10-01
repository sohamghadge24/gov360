"use client";

import React, { useState, useEffect } from "react";
import { 
  MapPin, Search, Layers, Plus, Upload, CheckCircle, 
  AlertTriangle, Crosshair, Map, Navigation, Maximize,
  Minus, FileText, Info, ShieldCheck
} from "lucide-react";
import { 
  geofenceService, gisService, locationService, routeService,
  Geofence, GeofenceStatus, GeofenceType, GISLayer, LocationPolicy
} from "@/api/geofences";

export const LocationsWorkspace = () => {
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [layers, setLayers] = useState<GISLayer[]>([]);
  const [policy, setPolicy] = useState<LocationPolicy | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const [valLat, setValLat] = useState("");
  const [valLng, setValLng] = useState("");
  const [valResult, setValResult] = useState<any>(null);
  
  // Create state
  const [newType, setNewType] = useState<GeofenceType>('Circle');
  const [newName, setNewName] = useState("");
  const [newEffectiveFrom, setNewEffectiveFrom] = useState("");
  const [newTolerance, setNewTolerance] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [gfRes, layersRes, policyRes] = await Promise.all([
        geofenceService.getGeofences().catch(() => []),
        gisService.getLayers().catch(() => []),
        locationService.getLocationPolicy().catch(() => null)
      ]);
      setGeofences(gfRes || []);
      setLayers(layersRes || []);
      setPolicy(policyRes || null);
    } catch (err: any) {
      setError("Geofence data could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const selectedGeofence = geofences.find(g => g.id === selectedId);

  const handleValidate = async () => {
    if (!selectedId || !valLat || !valLng) return;
    try {
      const res = await geofenceService.validateGeofence(selectedId, { lat: parseFloat(valLat), lng: parseFloat(valLng) });
      setValResult(res);
    } catch (err) {
      setValResult({ result: "API Error" });
    }
  };

  const handleCreate = async () => {
    if (!newName || !newEffectiveFrom) return;
    setIsSubmitting(true);
    try {
      await geofenceService.createGeofence({
        name: newName,
        type: newType,
        status: 'Active',
        effectiveFrom: newEffectiveFrom,
        tolerance: newTolerance,
        scope: 'Global'
      });
      setShowCreate(false);
      setNewName("");
      setNewEffectiveFrom("");
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to create location.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-transparent">
      
      {/* HEADER */}
      <div className="px-10 pt-8 pb-4 relative z-10 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">ADMINISTRATION</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">LOCATIONS</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Manage operational geo-fences, location geometry and GIS configuration.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <button 
              onClick={() => setShowImport(true)}
              className="px-4 py-2.5 bg-white/40 border border-white rounded-[14px] shadow-sm text-[13px] font-medium text-[var(--color-deep-navy)] backdrop-blur-md flex items-center gap-2 hover:bg-white/60 transition-colors"
            >
              <Upload className="w-4 h-4 text-[var(--color-muted)]" /> Import GIS
            </button>
            <button 
              onClick={() => setShowCreate(true)}
              className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Geofence
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 pt-4 gap-5 max-w-[1600px] mx-auto w-full relative z-10">
        
        {/* MAIN MAP AREA (65%) */}
        <div className="flex-1 relative glass-card flex flex-col overflow-hidden">
           {/* Map Toolbar Overlay */}
           <div className="absolute top-4 left-4 z-10 flex gap-2">
             <div className="bg-white/90 backdrop-blur border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] p-1 flex items-center">
               <div className="flex items-center px-3 border-r border-[var(--color-border)]/50">
                 <Search className="w-4 h-4 text-[var(--color-muted)] mr-2" />
                 <input type="text" placeholder="Search map..." className="text-[13px] outline-none w-48 bg-transparent text-[var(--color-deep-navy)]" />
               </div>
               <button className="p-2 hover:bg-white/50 text-[var(--color-neutral)] rounded flex items-center gap-2 text-[13px] font-medium px-4 transition-colors">
                 <Layers className="w-4 h-4" /> Layers
               </button>
             </div>
           </div>

           <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <div className="bg-white/90 backdrop-blur border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] flex flex-col overflow-hidden">
                <button className="p-3 hover:bg-white text-[var(--color-neutral)] border-b border-[var(--color-border)]/50 transition-colors"><Plus className="w-4 h-4" /></button>
                <button className="p-3 hover:bg-white text-[var(--color-neutral)] transition-colors"><Minus className="w-4 h-4" /></button>
              </div>
              <div className="bg-white/90 backdrop-blur border border-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[12px] flex flex-col mt-2 overflow-hidden">
                <button className="p-3 hover:bg-white text-[var(--color-neutral)] border-b border-[var(--color-border)]/50 transition-colors" title="Fit Bounds"><Crosshair className="w-4 h-4" /></button>
                <button className="p-3 hover:bg-white text-[var(--color-neutral)] transition-colors" title="Fullscreen"><Maximize className="w-4 h-4" /></button>
              </div>
           </div>

           {/* Placeholder Map rendering */}
           <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-transparent">
             {/* Fake map grid pattern */}
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--color-muted) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             
             <div className="text-center z-10 glass-card px-8 py-6 rounded-[20px] shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
               <MapPin className="w-8 h-8 text-[var(--color-primary)] mx-auto mb-3 opacity-90" />
               <p className="text-[var(--color-deep-navy)] font-semibold text-[15px] mb-1">Interactive Map Viewport</p>
               <p className="text-[var(--color-muted)] text-[13px]">Geo-fences and Checkpoints will render here.</p>
             </div>
             
             {/* Map Legend */}
             <div className="absolute bottom-6 left-6 glass-card p-4 text-[12px] flex flex-col gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
               <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full bg-[var(--color-primary)] border border-blue-600"></div> <span className="text-[var(--color-neutral)] font-medium">Active Geofence</span></div>
               <div className="flex items-center gap-2.5"><div className="w-3 h-3 rounded-full border border-dashed border-[var(--color-muted)] bg-white/50"></div> <span className="text-[var(--color-neutral)] font-medium">Draft Geofence</span></div>
               <div className="flex items-center gap-2.5"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> <span className="text-[var(--color-neutral)] font-medium">Checkpoint</span></div>
             </div>
           </div>
        </div>

        {/* SIDE PANEL (35%) */}
        <div className="w-[420px] glass-card flex flex-col h-full overflow-hidden flex-shrink-0 z-20">
           
           {!selectedId && (
             <div className="flex flex-col h-full">
               <div className="p-6 border-b border-[var(--color-border)]/50 bg-white/20 flex items-center justify-between">
                 <h2 className="text-[12px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Geo-fences</h2>
                 <span className="text-[11px] bg-white/60 border border-white text-[var(--color-deep-navy)] px-3 py-1 rounded-[10px] font-bold shadow-[0_1px_2px_rgba(0,0,0,0.02)]">{geofences.length} total</span>
               </div>
               
               <div className="flex-1 overflow-y-auto p-4 space-y-3">
                 {loading ? (
                   <div className="space-y-3 animate-pulse">
                     {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>)}
                   </div>
                 ) : error ? (
                   <div className="text-center py-10 bg-red-50 rounded-xl border border-red-100">
                     <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
                     <p className="text-red-800 text-sm font-medium">{error}</p>
                     <button onClick={fetchData} className="mt-4 px-4 py-1.5 bg-white border border-red-200 text-red-600 text-sm rounded shadow-sm hover:bg-red-50">Retry</button>
                   </div>
                 ) : geofences.length === 0 ? (
                   <div className="text-center py-12 px-6 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                     <Map className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                     <h3 className="text-gray-900 font-semibold mb-1">No geo-fences configured</h3>
                     <p className="text-gray-500 text-sm mb-6">Create an operational boundary to begin managing location-based duty validation.</p>
                     <button 
                       onClick={() => setShowCreate(true)}
                       className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm"
                     >
                       Create Geofence
                     </button>
                   </div>
                 ) : (
                   geofences.map(gf => (
                     <div 
                       key={gf.id} 
                       onClick={() => setSelectedId(gf.id)}
                       className="group p-5 bg-white/40 border border-white hover:bg-white/60 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.04)] transition-all rounded-[16px] cursor-pointer"
                     >
                       <div className="flex items-start justify-between mb-2">
                         <div className="flex items-center gap-2.5">
                           <div className={`w-2 h-2 rounded-full ${gf.status === 'Active' ? 'bg-[#0A5D2C]' : gf.status === 'Draft' ? 'bg-amber-500' : 'bg-gray-400'}`}></div>
                           <h3 className="text-[15px] font-bold text-[var(--color-deep-navy)] group-hover:text-[var(--color-primary)] transition-colors">{gf.name}</h3>
                         </div>
                       </div>
                       <p className="text-[13px] text-[var(--color-neutral)] font-medium mb-1">{gf.type} · {gf.status}</p>
                       <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-[0.05em]">Effective: {new Date(gf.effectiveFrom).toLocaleDateString()}</p>
                     </div>
                   ))
                 )}
                 
                 {policy && (
                   <div className="mt-8 bg-white/30 border border-white shadow-sm rounded-[16px] p-5">
                     <h3 className="text-[12px] font-bold text-[var(--color-primary)] uppercase tracking-[0.1em] flex items-center gap-2 mb-3"><ShieldCheck className="w-4 h-4"/> Location Policy Active</h3>
                     <p className="text-[13px] text-[var(--color-neutral)] mb-2"><span className="font-semibold text-[var(--color-deep-navy)]">Collection:</span> {policy.collection}</p>
                     <p className="text-[13px] text-[var(--color-neutral)] mb-1"><span className="font-semibold text-[var(--color-deep-navy)]">Purpose:</span> {policy.purpose}</p>
                     <p className="text-[11px] text-[var(--color-muted)] mt-3 italic">Location collection is governed by the active duty policy.</p>
                   </div>
                 )}
               </div>
             </div>
           )}

           {selectedId && selectedGeofence && (
             <div className="flex flex-col h-full relative bg-transparent">
               
               {/* Detail Header */}
               <div className="p-6 border-b border-[var(--color-border)]/50 bg-white/20">
                 <button onClick={() => setSelectedId(null)} className="text-[13px] text-[var(--color-primary)] hover:underline font-bold mb-4 flex items-center gap-1.5">
                   &larr; Back to list
                 </button>
                 <div className="flex items-center justify-between mb-3">
                   <h2 className="font-display text-[28px] leading-tight text-[var(--color-deep-navy)]">{selectedGeofence.name}</h2>
                   <span className={`px-3 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.05em] shadow-sm border border-white ${selectedGeofence.status === 'Active' ? 'bg-[#E1F7E9]/80 text-[#0A5D2C]' : 'bg-white/60 text-[var(--color-muted)]'}`}>
                     {selectedGeofence.status}
                   </span>
                 </div>
                 <p className="text-[13px] text-[var(--color-neutral)] font-medium flex items-center gap-2">
                   {selectedGeofence.type === 'Circle' ? <MapPin className="w-4 h-4"/> : selectedGeofence.type === 'RouteCorridor' ? <Navigation className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                   {selectedGeofence.type}
                 </p>
               </div>
               
               <div className="flex-1 overflow-y-auto">
                 
                 {/* Metadata */}
                 <div className="p-6 border-b border-[var(--color-border)]/50">
                   <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Configuration</h3>
                   <div className="grid grid-cols-2 gap-5">
                     <div>
                       <p className="text-[12px] text-[var(--color-muted)] mb-1 font-medium">Effective Date</p>
                       <p className="text-[14px] font-bold text-[var(--color-deep-navy)]">{new Date(selectedGeofence.effectiveFrom).toLocaleDateString()}</p>
                     </div>
                     <div>
                       <p className="text-[12px] text-[var(--color-muted)] mb-1 font-medium">Scope</p>
                       <p className="text-[14px] font-bold text-[var(--color-deep-navy)]">{selectedGeofence.scope}</p>
                     </div>
                     <div>
                       <p className="text-[12px] text-[var(--color-muted)] mb-1 font-medium">Tolerance</p>
                       <p className="text-[14px] font-bold text-[var(--color-deep-navy)]">{selectedGeofence.tolerance} meters</p>
                     </div>
                     <div>
                       <p className="text-[12px] text-[var(--color-muted)] mb-1 font-medium">Geometry Summary</p>
                       <p className="text-[14px] font-bold text-[var(--color-deep-navy)] truncate">{selectedGeofence.geometrySummary || 'N/A'}</p>
                     </div>
                   </div>
                 </div>

                 {/* Validation Tool */}
                 <div className="p-6 border-b border-[var(--color-border)]/50 bg-white/20">
                   <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4 flex items-center gap-1.5"><Crosshair className="w-3.5 h-3.5"/> Validate Coordinate</h3>
                   
                   <div className="grid grid-cols-2 gap-4 mb-4">
                     <div>
                       <label className="text-[12px] font-bold text-[var(--color-neutral)] block mb-1.5">Latitude</label>
                       <input type="text" value={valLat} onChange={e => setValLat(e.target.value)} className="w-full bg-white/40 border border-white rounded-[10px] p-2 text-[13px] text-[var(--color-deep-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border)] backdrop-blur-md" placeholder="e.g. 19.0760" />
                     </div>
                     <div>
                       <label className="text-[12px] font-bold text-[var(--color-neutral)] block mb-1.5">Longitude</label>
                       <input type="text" value={valLng} onChange={e => setValLng(e.target.value)} className="w-full bg-white/40 border border-white rounded-[10px] p-2 text-[13px] text-[var(--color-deep-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border)] backdrop-blur-md" placeholder="e.g. 72.8777" />
                     </div>
                   </div>
                   
                   <button onClick={handleValidate} className="w-full py-2.5 bg-white/60 border border-white text-[var(--color-deep-navy)] text-[13px] font-bold rounded-[12px] shadow-sm hover:bg-white transition-colors">
                     Validate
                   </button>

                   {valResult && (
                     <div className={`mt-5 p-4 rounded-[12px] shadow-sm border flex items-start gap-3 ${valResult.result === 'Inside' ? 'bg-[#E1F7E9]/80 border-white text-[#0A5D2C]' : valResult.result === 'Outside' ? 'bg-red-50/80 border-white text-red-800' : 'bg-white/40 border-white text-[var(--color-deep-navy)]'}`}>
                       {valResult.result === 'Inside' ? <CheckCircle className="w-5 h-5 mt-0.5" /> : valResult.result === 'Outside' ? <AlertTriangle className="w-5 h-5 mt-0.5" /> : <Info className="w-5 h-5 mt-0.5"/>}
                       <div>
                         <p className="text-[14px] font-bold">{valResult.result === 'Inside' ? 'Inside Geofence' : valResult.result === 'Outside' ? 'Outside Geofence' : valResult.result}</p>
                         {valResult.tolerance && <p className="text-[12px] mt-1 opacity-80 font-medium">Within {valResult.tolerance}m tolerance</p>}
                       </div>
                     </div>
                   )}
                 </div>

               </div>
               
               <div className="p-5 border-t border-[var(--color-border)]/50 bg-white/20 grid grid-cols-2 gap-3 shrink-0">
                 <button className="py-2.5 bg-white/40 border border-white text-[var(--color-deep-navy)] rounded-[12px] shadow-sm text-[13px] font-bold hover:bg-white transition-colors">
                   View History
                 </button>
                 <button className="py-2.5 bg-blue-50/80 border border-white text-[var(--color-primary)] rounded-[12px] shadow-sm text-[13px] font-bold hover:bg-blue-50 transition-colors">
                   Edit Config
                 </button>
               </div>
             </div>
           )}
        </div>
      </div>

      {/* CREATE MODAL (Mockup) */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-bold text-gray-900">Create Geofence</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
               <div>
                 <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Type</label>
                 <div className="grid grid-cols-3 gap-3">
                   <div onClick={() => setNewType('Circle')} className={`border ${newType === 'Circle' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'} rounded-lg p-3 text-center cursor-pointer`}>
                     <MapPin className={`w-5 h-5 mx-auto mb-1 ${newType === 'Circle' ? 'text-blue-600' : 'text-gray-400'}`} />
                     <span className={`text-[11px] font-bold uppercase ${newType === 'Circle' ? 'text-blue-700' : 'text-gray-600'}`}>Circle</span>
                   </div>
                   <div onClick={() => setNewType('Polygon')} className={`border ${newType === 'Polygon' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'} rounded-lg p-3 text-center cursor-pointer`}>
                     <Map className={`w-5 h-5 mx-auto mb-1 ${newType === 'Polygon' ? 'text-blue-600' : 'text-gray-400'}`} />
                     <span className={`text-[11px] font-bold uppercase ${newType === 'Polygon' ? 'text-blue-700' : 'text-gray-600'}`}>Polygon</span>
                   </div>
                   <div onClick={() => setNewType('RouteCorridor')} className={`border ${newType === 'RouteCorridor' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'} rounded-lg p-3 text-center cursor-pointer`}>
                     <Navigation className={`w-5 h-5 mx-auto mb-1 ${newType === 'RouteCorridor' ? 'text-blue-600' : 'text-gray-400'}`} />
                     <span className={`text-[11px] font-bold uppercase ${newType === 'RouteCorridor' ? 'text-blue-700' : 'text-gray-600'}`}>Route</span>
                   </div>
                 </div>
               </div>
               <div>
                 <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Name *</label>
                 <input type="text" value={newName} onChange={e => setNewName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-[14px] outline-blue-500" placeholder="e.g. Ward 12 Boundary" />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Effective From *</label>
                   <input type="date" value={newEffectiveFrom} onChange={e => setNewEffectiveFrom(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2 text-[14px] outline-blue-500" />
                 </div>
                 <div>
                   <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Tolerance (m)</label>
                   <input type="number" value={newTolerance} onChange={e => setNewTolerance(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg p-2 text-[14px] outline-blue-500" />
                 </div>
               </div>
               <div>
                 <label className="text-[13px] font-semibold text-gray-700 block mb-1.5">Geometry Configuration</label>
                 <div className="w-full py-8 border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl text-center">
                   <Crosshair className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                   <p className="text-[13px] font-medium text-gray-600">Draw geometry on map</p>
                   <p className="text-[11px] text-gray-400">Map tools will activate after proceeding</p>
                 </div>
               </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowCreate(false)} className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button onClick={handleCreate} disabled={isSubmitting || !newName || !newEffectiveFrom} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors disabled:opacity-50">
                {isSubmitting ? 'Saving...' : 'Save Location'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT MODAL (Mockup) */}
      {showImport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="text-[16px] font-bold text-gray-900">Import GIS Data</h2>
              <button onClick={() => setShowImport(false)} className="text-gray-400 hover:text-gray-700">&times;</button>
            </div>
            <div className="p-6 space-y-4">
               <p className="text-[13px] text-gray-600">Upload approved GIS data files (.geojson, .kml) for spatial validation and import.</p>
               <div className="w-full py-12 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-blue-50 hover:border-blue-300 transition-colors rounded-xl text-center cursor-pointer">
                 <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                 <p className="text-[14px] font-semibold text-gray-700 mb-1">Drag & drop file here</p>
                 <p className="text-[12px] text-gray-500">or click to browse</p>
               </div>
               <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2 border border-blue-100 mt-2">
                 <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                 <p className="text-[11px] text-blue-800">Files will be validated asynchronously. You will be notified when the spatial processing is complete.</p>
               </div>
            </div>
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setShowImport(false)} className="px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
              <button className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-2">
                <Upload className="w-3.5 h-3.5" /> Start Import
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
