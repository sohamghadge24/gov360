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
      <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen">
        <div className="bg-white border-b px-8 py-6 flex items-start justify-between shadow-sm sticky top-0 z-10 shrink-0">
          <div>
            <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
              <span className="hover:text-gray-900 cursor-pointer">Administration</span>
              <span>/</span>
              <span className="text-gray-900 font-semibold">Roles & Permissions</span>
            </nav>
            <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1 mb-1">Roles & Permissions</h1>
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
    <div className="flex flex-col h-full bg-[#F7F8FA] min-h-screen">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6 flex items-start justify-between shadow-sm sticky top-0 z-10 shrink-0">
        <div>
          <nav className="text-[13px] font-medium text-gray-500 mb-1 flex items-center gap-2">
            <span className="hover:text-gray-900 cursor-pointer">Administration</span>
            <span>/</span>
            <span className="text-gray-900 font-semibold">Roles & Permissions</span>
          </nav>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mt-1 mb-1">Roles & Permissions</h1>
          <p className="text-sm text-gray-500">Manage system access, permissions and organizational data scopes.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <div className="relative hidden md:block">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-48 lg:w-64"
            />
          </div>
          <button 
            onClick={handleCreateClick}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm focus:outline-none flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Role
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="p-8 max-w-[1440px] mx-auto w-full flex-1 space-y-6">
        
        {/* KPI Cards */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Roles</p>
                <h3 className="text-2xl font-bold text-gray-900">{roles.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Roles</p>
                <h3 className="text-2xl font-bold text-gray-900">{activeRolesCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Permissions</p>
                <h3 className="text-2xl font-bold text-gray-900">{permissions.length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Pending Changes</p>
                <h3 className="text-2xl font-bold text-gray-900">{pendingChangesCount}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {/* Tabs & Filters */}
          <div className="px-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50 pt-3">
            <div className="flex items-center">
              <Tabs
                tabs={[
                  { id: 'roles', label: 'Roles' },
                  { id: 'permissions', label: 'Permission Catalog' },
                  { id: 'changes', label: 'Access Changes' }
                ]}
                activeId={activeTab}
                onChange={(id) => setActiveTab(id as any)}
                className="border-none space-x-6"
                tabClassName="pb-4"
              />
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5">
                Status <ChevronDown className="w-3 h-3" />
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-50 flex items-center gap-1.5">
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
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-[#FAFAFA]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                    <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Users</th>
                    <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Permissions</th>
                    <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Scope</th>
                    <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {roles.map((role) => (
                    <tr key={role.id} onClick={() => handleRoleClick(role)} className="hover:bg-gray-50/70 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-[14px] font-bold text-gray-900 mb-0.5">{role.name}</div>
                        <div className="text-[12px] text-gray-500 max-w-[200px] truncate">{role.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">{role.assignedUsersCount}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-gray-600">{(role.permissions || []).length}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[13px] font-medium text-gray-600">{role.scopeType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                          role.status === 'Active' ? 'text-green-700' :
                          role.status === 'Pending' ? 'text-amber-700' :
                          'text-gray-600'
                        }`}>
                          {role.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                          {role.status === 'Pending' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                          {role.status === 'Inactive' && <span className="w-1.5 h-1.5 rounded-full border border-gray-400"></span>}
                          {role.status === 'Archived' && <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>}
                          {role.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <span className="text-gray-400 group-hover:text-blue-600 font-semibold text-[13px] transition-colors">View</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : activeTab === 'permissions' ? (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(groupedPermissions).map(([module, perms]) => (
                  <div key={module} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">{module}</h3>
                    </div>
                    <ul className="divide-y divide-gray-100">
                      {perms.map(p => (
                        <li key={p.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="font-semibold text-gray-900 text-sm mb-1">{p.name}</div>
                          <div className="text-xs text-gray-500">{p.description}</div>
                          <code className="text-[10px] text-gray-400 mt-2 block bg-gray-100 px-1.5 py-0.5 rounded w-max">{p.code}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-[#FAFAFA]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Actor</th>
                      <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                      <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Change</th>
                      <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {changes.map(change => (
                      <tr key={change.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-gray-500">{change.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-gray-900">{change.actor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[13px] font-bold text-gray-700">{change.roleName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-[13px] font-medium text-gray-600">{change.change}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                            change.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            change.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                           }`}>
                            {change.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROLE DETAIL DRAWER */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-gray-900/60 backdrop-blur-sm">
          <div className="bg-white shadow-2xl w-full md:max-w-[500px] h-full flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-bold text-gray-900">{isEditMode ? (selectedRole ? 'Edit Role' : 'Create Role') : selectedRole?.name}</h2>
                {selectedRole && !isEditMode && (
                   <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    selectedRole.status === 'Active' ? 'text-green-700 bg-green-50' :
                    selectedRole.status === 'Pending' ? 'text-amber-700 bg-amber-50' :
                    'text-gray-600 bg-gray-100'
                  }`}>
                    {selectedRole.status === 'Active' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                    {selectedRole.status}
                  </span>
                )}
              </div>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-gray-50/50">
              {isEditMode ? (
                <div className="p-6 space-y-8">
                  {/* Form section */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Basic Information</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role Name *</label>
                      <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g. Supervisor" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                      <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20" placeholder="Briefly describe the role's purpose..."></textarea>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Data Scope</h3>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Scope Level</label>
                      <select value={formData.scopeType || 'Global'} onChange={e => setFormData({...formData, scopeType: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="Global">Global</option>
                        <option value="Organization">Organization</option>
                        <option value="Department">Department</option>
                        <option value="Ward">Ward</option>
                        <option value="Unit">Unit</option>
                        <option value="Police Station">Police Station</option>
                        <option value="Assigned Team">Assigned Team</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">Determines which geographic or organizational data this role can access.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4">Permissions</h3>
                    
                    {Object.entries(groupedPermissions).map(([module, perms]) => (
                      <div key={module} className="mb-4">
                        <label className="flex items-center gap-2 mb-2">
                          <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4" checked={perms.every(p => formData.permissions?.includes(p.code))} onChange={() => toggleModulePermissions(perms)} />
                          <span className="font-semibold text-gray-900 text-sm">{module}</span>
                        </label>
                        <div className="ml-6 space-y-2 border-l-2 border-gray-100 pl-4 py-1">
                          {perms.map(p => (
                            <label key={p.code} className="flex items-start gap-2">
                              <input type="checkbox" className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 mt-0.5" checked={formData.permissions?.includes(p.code)} onChange={() => togglePermission(p.code)} />
                              <span className="text-sm text-gray-700">{p.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedRole ? (
                <div className="p-6 space-y-8">
                  {/* View mode */}
                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Role Information</h3>
                    <p className="text-sm text-gray-700">{selectedRole.description}</p>
                    <div className="flex items-center gap-6 pt-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Users</p>
                        <p className="font-semibold text-gray-900 text-lg">{selectedRole.assignedUsersCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Permissions</p>
                        <p className="font-semibold text-gray-900 text-lg">{(selectedRole.permissions || []).length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Scope</p>
                        <p className="font-semibold text-gray-900 text-lg">{selectedRole.scopeType}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Permissions Access</h3>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      {Object.entries(groupedPermissions)
                        .filter(([_, perms]) => perms.some(p => (selectedRole.permissions || []).includes(p.code)))
                        .map(([module, perms]) => (
                        <div key={module} className="border-b border-gray-100 last:border-0 p-4">
                          <h4 className="font-bold text-gray-900 text-sm mb-2">{module}</h4>
                          <div className="space-y-1.5 pl-2">
                            {perms.filter(p => (selectedRole.permissions || []).includes(p.code)).map(p => (
                              <div key={p.code} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                                {p.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Data Access Scope</h3>
                    <div className="bg-white border border-gray-200 rounded-xl p-4 font-mono text-sm text-gray-700">
                       Organization<br/>
                       {selectedRole.scopeType !== 'Global' && selectedRole.scopeType !== 'Organization' && (
                         <>└─ {selectedRole.scopeType}<br/></>
                       )}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="p-5 border-t border-gray-200 bg-white shrink-0 flex items-center justify-between">
              {isEditMode ? (
                <>
                  <button onClick={closeDrawer} className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2">
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {selectedRole ? 'Save Changes' : 'Create Role'}
                  </button>
                </>
              ) : (
                <>
                  <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2">
                    <Archive className="w-4 h-4" /> Deactivate
                  </button>
                  <button onClick={() => setIsEditMode(true)} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm flex items-center gap-2">
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
