import { fetchApi } from '@/lib/api/client';

export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  type: 'System' | 'Custom';
  status: 'Active' | 'Inactive' | 'Pending' | 'Archived';
  scopeType: 'Global' | 'Organization' | 'Department' | 'Ward' | 'Unit' | 'Police Station' | 'Assigned Team';
  scopeValue?: string;
  assignedUsersCount: number;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RoleSummary {
  totalRoles: number;
  activeRoles: number;
  totalPermissions: number;
  pendingChanges: number;
}

export interface RoleCreatePayload {
  name: string;
  description?: string;
  scopeType: Role['scopeType'];
  scopeValue?: string;
  permissions: string[];
}

export interface RoleUpdatePayload {
  name?: string;
  description?: string;
  scopeType?: Role['scopeType'];
  scopeValue?: string;
  permissions?: string[];
  status?: Role['status'];
}

export interface AccessChange {
  id: string;
  date: string;
  actor: string;
  roleId: string;
  roleName: string;
  change: string;
  scope: string;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export const rolesService = {
  getRoles: () => 
    fetchApi<Role[]>('/api/v1/roles'),
    
  getRole: (id: string) => 
    fetchApi<Role>(`/api/v1/roles/${id}`),
    
  createRole: (payload: RoleCreatePayload) => 
    fetchApi<Role>('/api/v1/roles', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    
  updateRole: (id: string, payload: RoleUpdatePayload) => 
    fetchApi<Role>(`/api/v1/roles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  deleteRole: (id: string) => 
    fetchApi<void>(`/api/v1/roles/${id}`, {
      method: 'DELETE',
    }),
    
  getPermissions: () => 
    fetchApi<Permission[]>('/api/v1/permissions'),
    
  getAccessChanges: () => 
    fetchApi<AccessChange[]>('/api/v1/roles/changes'),
};
