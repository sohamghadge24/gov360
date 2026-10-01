"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Shield, ShieldAlert, Users, Key, MoreVertical, Plus, Search, Filter, ShieldCheck, Loader2, AlertTriangle, CheckCircle, Clock, X, Edit2, Archive, ChevronDown } from "lucide-react";
import { rolesService, Role, Permission, AccessChange } from "@/api/roles";
import { Tabs } from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/ToastProvider";

export const RolesWorkspace = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions' | 'changes'>('roles');
  
  // Data state
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [changes, setChanges] = useState<AccessChange[]>([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  
  // Drawer state
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState<Partial<Role>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setForbidden(false);
    
    try {
      const [rolesData, permsData, changesData] = await Promise.all([
        rolesService.getRoles().catch(e => {
          if (e.message?.includes('403') || e.status === 403) setForbidden(true);
          throw e;
        }),
        rolesService.getPermissions().catch(() => []),
        rolesService.getAccessChanges().catch(() => [])
      ]);
      
      setRoles(rolesData || []);
      setPermissions(permsData || []);
      setChanges(changesData || []);
    } catch (err: any) {
      if (!forbidden && (!err.status || err.status !== 403)) {
        setError(err.message || "Failed to load RBAC data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRoleClick = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      scopeType: role.scopeType,
      permissions: [...(role.permissions || [])]
    });
    setIsEditMode(false);
    setIsDrawerOpen(true);
  };
  
  const handleCreateClick = () => {
    setSelectedRole(null);
    setFormData({
      name: '',
      description: '',
      scopeType: 'Global',
      permissions: []
    });
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRole(null);
    setIsEditMode(false);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (selectedRole) {
        await rolesService.updateRole(selectedRole.id, formData as any);
        toast("Success", "Role updated successfully", "success");
      } else {
        await rolesService.createRole(formData as any);
        toast("Success", "Role created successfully", "success");
      }
      closeDrawer();
      fetchData();
    } catch (err: any) {
      toast("Error", err.message || "Failed to save role", "error");
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (code: string) => {
    setFormData(prev => {
      const perms = prev.permissions || [];
      if (perms.includes(code)) {
        return { ...prev, permissions: perms.filter(p => p !== code) };
      }
      return { ...prev, permissions: [...perms, code] };
    });
  };

  const toggleModulePermissions = (modulePerms: Permission[]) => {
    setFormData(prev => {
      const perms = prev.permissions || [];
      const moduleCodes = modulePerms.map(p => p.code);
      const allSelected = moduleCodes.every(code => perms.includes(code));
      
      if (allSelected) {
        return { ...prev, permissions: perms.filter(p => !moduleCodes.includes(p)) };
      } else {
        const newPerms = new Set([...perms, ...moduleCodes]);
        return { ...prev, permissions: Array.from(newPerms) };
      }
    });
  };

  const activeRolesCount = roles.filter(r => r.status === 'Active').length;
  const pendingChangesCount = changes.filter(c => c.status === 'Pending').length;

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    permissions.forEach(p => {
      if (!groups[p.module]) groups[p.module] = [];
      groups[p.module].push(p);
    });
    return groups;
  }, [permissions]);

  if (forbidden) {
    return (
      <div className="flex flex-col h-full bg-transparent min-h-screen">
        <div className="px-10 pt-8 pb-4 relative z-10 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">ADMINISTRATION</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">ROLES & PERMISSIONS</h1>
          </div>
        </div>
      </div>
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 border border-red-100">
            <ShieldAlert className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-500 mb-6">You do not have permission to manage roles and permissions. Contact your Security Administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-transparent min-h-screen">
      {/* Header */}
      <div className="px-10 pt-8 pb-4 relative z-10 shrink-0">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="text-[11px] font-display font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">ADMINISTRATION</div>
            <h1 className="font-display text-[42px] md:text-[46px] font-light leading-[1.1] text-[var(--color-deep-navy)] tracking-[-0.035em] font-light">ROLES & PERMISSIONS</h1>
            <p className="text-[15px] text-[var(--color-neutral)] mt-4 max-w-sm leading-relaxed">
              Manage system access, permissions and organizational data scopes.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-[var(--color-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2.5 bg-white/40 border border-white rounded-[14px] text-[13px] text-[var(--color-deep-navy)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border)] w-48 lg:w-64 backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
              />
            </div>
            <button 
              onClick={handleCreateClick}
              className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Create Role
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="px-10 pb-10 max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-5 relative z-10">
        
        {/* KPI Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden">
              <span className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Total Roles</span>
              <div className="font-display text-[32px] text-[var(--color-deep-navy)] leading-none font-light">{roles.length}</div>
            </div>
            <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden">
              <span className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Active Roles</span>
              <div className="font-display text-[32px] text-green-600 leading-none font-light">{activeRolesCount}</div>
            </div>
            <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden">
              <span className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Permissions</span>
              <div className="font-display text-[32px] text-purple-600 leading-none font-light">{permissions.length}</div>
            </div>
            <div className="glass-card p-6 flex flex-col justify-center relative overflow-hidden">
              <span className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Pending Changes</span>
              <div className="font-display text-[32px] text-amber-600 leading-none font-light">{pendingChangesCount}</div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="glass-card flex flex-col min-h-[500px]">
          {/* Tabs & Filters */}
          <div className="px-8 border-b border-[var(--color-border)]/50 flex flex-wrap items-center justify-between gap-4 bg-white/20 pt-4">
            <div className="flex items-center">
              <Tabs
                tabs={[
                  { id: 'roles', label: 'Roles' },
                  { id: 'permissions', label: 'Permission Catalog' },
                  { id: 'changes', label: 'Access Changes' }
                ]}
                activeId={activeTab}
                onChange={(id) => setActiveTab(id as any)}
                className="border-none space-x-8"
                tabClassName="pb-4 text-[12px] uppercase tracking-[0.05em] font-bold"
              />
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <button className="px-4 py-2 bg-white/40 border border-white rounded-[10px] text-[12px] font-bold text-[var(--color-deep-navy)] hover:bg-white/60 flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors">
                Status <ChevronDown className="w-3 h-3" />
              </button>
              <button className="px-4 py-2 bg-white/40 border border-white rounded-[10px] text-[12px] font-bold text-[var(--color-deep-navy)] hover:bg-white/60 flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-colors">
                Scope <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {/* Main List */}
          <div className="flex-1 overflow-x-auto relative min-h-[300px]">
            {loading ? (
              <div className="absolute inset-0 flex flex-col">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="flex items-center gap-6 px-6 py-4 border-b border-gray-100 animate-pulse">
                     <div className="w-48 h-5 bg-gray-200 rounded"></div>
                     <div className="w-24 h-5 bg-gray-200 rounded"></div>
                     <div className="w-32 h-5 bg-gray-200 rounded"></div>
                     <div className="w-20 h-5 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
                <p className="text-gray-900 font-semibold mb-1">Roles could not be loaded.</p>
                <p className="text-gray-500 text-sm mb-4">{error}</p>
                <button onClick={fetchData} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">Retry</button>
              </div>
            ) : activeTab === 'roles' && roles.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Shield className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-gray-900 font-semibold mb-1">No roles configured</p>
                <p className="text-gray-500 text-sm mb-4">No system roles are currently available in your scope.</p>
                <button onClick={handleCreateClick} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Create Role</button>
              </div>
            ) : activeTab === 'roles' ? (
              <table className="min-w-full divide-y divide-[var(--color-border)]/50">
                <thead className="bg-white/30">
                  <tr>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Role</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Users</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Permissions</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Scope</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Status</th>
                    <th scope="col" className="px-8 py-4 text-right text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/30">
                  {roles.map((role) => (
                    <tr key={role.id} onClick={() => handleRoleClick(role)} className="hover:bg-white/40 transition-colors cursor-pointer group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="text-[14px] font-bold text-[var(--color-deep-navy)] mb-0.5">{role.name}</div>
                        <div className="text-[12px] text-[var(--color-muted)] max-w-[200px] truncate">{role.description}</div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-[var(--color-deep-navy)] bg-white/60 border border-white px-3 py-1 rounded-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">{role.assignedUsersCount}</span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-[var(--color-neutral)]">{(role.permissions || []).length}</span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-[var(--color-neutral)]">{role.scopeType}</span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.05em] shadow-sm border border-white ${
                          role.status === 'Active' ? 'bg-[#E1F7E9]/80 text-[#0A5D2C]' :
                          role.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-white/60 text-[var(--color-muted)]'
                        }`}>
                          {role.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right text-sm font-medium">
                        <span className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] font-bold text-[13px] transition-colors">View</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'permissions' ? (
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/10">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module} className="glass-card flex flex-col">
                    <div className="bg-white/30 px-5 py-4 border-b border-[var(--color-border)]/50">
                      <h3 className="font-bold text-[var(--color-deep-navy)] text-[13px] uppercase tracking-[0.1em]">{module}</h3>
                    </div>
                    <ul className="divide-y divide-[var(--color-border)]/30 p-2">
                      {perms.map(p => (
                        <li key={p.id} className="p-4 hover:bg-white/40 transition-colors rounded-[12px] mx-2 my-1">
                          <div className="font-bold text-[var(--color-deep-navy)] text-[14px] mb-1">{p.name}</div>
                          <div className="text-[12px] text-[var(--color-muted)]">{p.description}</div>
                          <code className="text-[10px] text-[var(--color-neutral)] font-bold mt-3 block bg-white/60 border border-white px-2 py-1 rounded-[6px] w-max shadow-[0_1px_2px_rgba(0,0,0,0.02)]">{p.code}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <table className="min-w-full divide-y divide-[var(--color-border)]/50">
                <thead className="bg-white/30">
                  <tr>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Date</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Actor</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Role</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Change</th>
                    <th scope="col" className="px-8 py-4 text-left text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/30">
                  {changes.map(change => (
                    <tr key={change.id} className="hover:bg-white/40 transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap text-[13px] font-bold text-[var(--color-muted)]">{change.date}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-[13px] font-bold text-[var(--color-deep-navy)]">{change.actor}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-[13px] font-bold text-[var(--color-neutral)]">{change.roleName}</td>
                      <td className="px-8 py-5 whitespace-nowrap text-[13px] font-bold text-[var(--color-neutral)]">{change.change}</td>
                      <td className="px-8 py-5 whitespace-nowrap">
                         <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.05em] shadow-sm border border-white ${
                          change.status === 'Approved' ? 'bg-[#E1F7E9]/80 text-[#0A5D2C]' :
                          change.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-800'
                         }`}>
                          {change.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ROLE DETAIL DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-[var(--color-deep-navy)]/40 backdrop-blur-sm">
          <div className="glass-card shadow-2xl w-full md:max-w-[500px] h-full flex flex-col animate-in slide-in-from-right duration-200 rounded-none md:rounded-l-[24px] border-r-0 my-0 border-y-0">
            <div className="p-6 border-b border-[var(--color-border)]/50 flex justify-between items-center bg-white/40">
              <div className="flex items-center gap-3">
                <h2 className="text-[20px] font-bold text-[var(--color-deep-navy)]">{isEditMode ? (selectedRole ? 'Edit Role' : 'Create Role') : selectedRole?.name}</h2>
                {selectedRole && !isEditMode && (
                   <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] text-[11px] font-bold uppercase tracking-[0.05em] shadow-sm border border-white ${
                    selectedRole.status === 'Active' ? 'bg-[#E1F7E9]/80 text-[#0A5D2C]' :
                    selectedRole.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    'bg-white/60 text-[var(--color-muted)]'
                  }`}>
                    {selectedRole.status}
                  </span>
                )}
              </div>
              <button onClick={closeDrawer} className="text-[var(--color-muted)] hover:text-[var(--color-deep-navy)] p-2 rounded-[10px] hover:bg-white/60 transition-colors shadow-sm"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {isEditMode ? (
                <div className="p-8 space-y-8">
                  {/* Form section */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Basic Information</h3>
                    <div>
                      <label className="block text-[13px] font-bold text-[var(--color-deep-navy)] mb-2">Role Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-deep-navy)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]" placeholder="e.g. Supervisor" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-bold text-[var(--color-deep-navy)] mb-2">Description</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-deep-navy)] h-24 shadow-[0_2px_8px_rgba(0,0,0,0.02)]" placeholder="Briefly describe the role's purpose..."></textarea>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Data Scope</h3>
                    <div>
                      <label className="block text-[13px] font-bold text-[var(--color-deep-navy)] mb-2">Scope Level</label>
                      <select value={formData.scopeType || 'Global'} onChange={e => setFormData({...formData, scopeType: e.target.value as any})} className="w-full px-4 py-3 bg-white/40 border border-white rounded-[14px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-[var(--color-deep-navy)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <option value="Global">Global</option>
                        <option value="Organization">Organization</option>
                        <option value="Department">Department</option>
                        <option value="Ward">Ward</option>
                        <option value="Unit">Unit</option>
                        <option value="Police Station">Police Station</option>
                        <option value="Assigned Team">Assigned Team</option>
                      </select>
                      <p className="text-[12px] text-[var(--color-muted)] mt-2 font-medium">Determines which geographic or organizational data this role can access.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-4">Permissions</h3>
                    
                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                      <div key={module} className="mb-6">
                        <label className="flex items-center gap-3 mb-3 cursor-pointer">
                          <input type="checkbox" className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4 bg-white/40 border-white" checked={perms.every(p => formData.permissions?.includes(p.code))} onChange={() => toggleModulePermissions(perms)} />
                          <span className="font-bold text-[var(--color-deep-navy)] text-[14px] uppercase tracking-wide">{module}</span>
                        </label>
                        <div className="ml-7 space-y-2 border-l border-[var(--color-border)]/50 pl-4 py-1">
                          {perms.map(p => (
                            <label key={p.code} className="flex items-start gap-3 cursor-pointer py-1">
                              <input type="checkbox" className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-4 h-4 mt-0.5 bg-white/40 border-white" checked={formData.permissions?.includes(p.code)} onChange={() => togglePermission(p.code)} />
                              <span className="text-[13px] font-bold text-[var(--color-neutral)]">{p.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedRole ? (
                <div className="p-8 space-y-8">
                  {/* View mode */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Role Information</h3>
                    <p className="text-[14px] text-[var(--color-neutral)] leading-relaxed">{selectedRole.description}</p>
                    <div className="flex items-center gap-6 pt-2">
                      <div className="bg-white/40 border border-white rounded-[14px] p-4 flex-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-wider mb-1">Users</p>
                        <p className="font-display text-[28px] text-[var(--color-deep-navy)]">{selectedRole.assignedUsersCount}</p>
                      </div>
                      <div className="bg-white/40 border border-white rounded-[14px] p-4 flex-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-wider mb-1">Permissions</p>
                        <p className="font-display text-[28px] text-[var(--color-deep-navy)]">{(selectedRole.permissions || []).length}</p>
                      </div>
                      <div className="bg-white/40 border border-white rounded-[14px] p-4 flex-1 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                        <p className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-wider mb-1">Scope</p>
                        <p className="font-bold text-[16px] text-[var(--color-deep-navy)] mt-2">{selectedRole.scopeType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Permissions Access</h3>
                    <div className="bg-white/40 border border-white rounded-[14px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      {Object.entries(groupedPermissions)
                        .filter(([_, perms]) => perms.some(p => (selectedRole.permissions || []).includes(p.code)))
                        .map(([module, perms]) => (
                        <div key={module} className="border-b border-[var(--color-border)]/50 last:border-0 p-5">
                          <h4 className="font-bold text-[var(--color-deep-navy)] text-[13px] uppercase tracking-wide mb-3">{module}</h4>
                          <div className="space-y-2 pl-2">
                            {perms.filter(p => (selectedRole.permissions || []).includes(p.code)).map(p => (
                              <div key={p.code} className="flex items-center gap-2.5 text-[13px] font-bold text-[var(--color-neutral)]">
                                <CheckCircle className="w-4 h-4 text-[#0A5D2C]" />
                                {p.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-[var(--color-neutral)] uppercase tracking-[0.12em] mb-2">Data Access Scope</h3>
                    <div className="bg-white/40 border border-white rounded-[14px] p-5 font-mono text-[13px] font-bold text-[var(--color-deep-navy)] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                       Organization<br/>
                       {selectedRole.scopeType !== 'Global' && selectedRole.scopeType !== 'Organization' && (
                         <><span className="text-[var(--color-muted)]">└─</span> {selectedRole.scopeType}<br/></>
                       )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-6 border-t border-[var(--color-border)]/50 bg-white/40 shrink-0 flex items-center justify-between">
              {isEditMode ? (
                <>
                  <button onClick={closeDrawer} className="px-5 py-2.5 border border-white bg-white/60 rounded-[14px] text-[13px] font-bold text-[var(--color-deep-navy)] hover:bg-white transition-colors shadow-sm">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold hover:bg-blue-700 shadow-md flex items-center gap-2 transition-colors">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {selectedRole ? 'Save Changes' : 'Create Role'}
                  </button>
                </>
              ) : (
                <>
                  <button className="px-5 py-2.5 bg-white/60 border border-white text-red-600 rounded-[14px] text-[13px] font-bold hover:bg-red-50 flex items-center gap-2 transition-colors shadow-sm">
                    <Archive className="w-4 h-4" /> Deactivate
                  </button>
                  <button onClick={() => setIsEditMode(true)} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-[14px] text-[13px] font-bold hover:bg-blue-700 shadow-md flex items-center gap-2 transition-colors">
                    <Edit2 className="w-4 h-4" /> Edit Role
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};
