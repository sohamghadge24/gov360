import { fetchApi } from '@/lib/api/client';

import { PaginatedResponse } from './types';

export interface Employee {
  id: string;
  name: string;
  employee_id: string;
  department?: string;
  unit?: string;
  supervisor?: string;
  duty_type?: string;
  verification_status?: string;
  status: 'Active' | 'Inactive';
}

export interface EmployeeDetail extends Employee {
  email?: string;
  phone?: string;
  source?: string;
  created_at: string;
  updated_at: string;
  // Assignment details
  assignment?: {
    department: string;
    division?: string;
    unit?: string;
    office?: string;
    duty_type: string;
    current_assignment: string;
    effective_date: string;
  };
}

export interface SupervisorData {
  id: string;
  name: string;
  department?: string;
  team?: string;
}

export interface VerificationPolicy {
  policy: string;
  effective_from: string;
  effective_until?: string;
  interval?: string;
  grace_period?: string;
  required_method?: string;
  status: string;
}

export interface Device {
  id: string;
  name: string;
  platform: string;
  registered_at: string;
  last_seen: string;
  status: string;
}

export interface AttendanceSummary {
  period: string;
  present: number;
  leave: number;
  off_duty: number;
  exceptions: number;
}

export interface TeamMember {
  id: string;
  name: string;
  duty: string;
  status: string;
  verification: string;
  last_activity?: string;
}

// APIs
export const getEmployees = async (
  page = 1,
  size = 25,
  category = 'all',
  search?: string
): Promise<PaginatedResponse<Employee>> => {
  const query = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (category && category !== 'all') query.append('category', category);
  if (search) query.append('search', search);
  return fetchApi<PaginatedResponse<Employee>>(`/api/v1/employees?${query.toString()}`);
};

export const createEmployee = async (payload: Partial<EmployeeDetail>): Promise<EmployeeDetail> => {
  return fetchApi<EmployeeDetail>('/api/v1/employees', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getEmployee = async (id: string): Promise<EmployeeDetail> => {
  return fetchApi<EmployeeDetail>(`/api/v1/employees/${id}`);
};

export const updateEmployee = async (id: string, payload: Partial<EmployeeDetail>): Promise<EmployeeDetail> => {
  return fetchApi<EmployeeDetail>(`/api/v1/employees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const activateEmployee = async (id: string): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/api/v1/employees/${id}/activate`, {
    method: 'POST',
  });
};

export const deactivateEmployee = async (id: string, reason: string): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/api/v1/employees/${id}/deactivate`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

export const getEmployeeSupervisor = async (id: string): Promise<SupervisorData | null> => {
  return fetchApi<SupervisorData | null>(`/api/v1/employees/${id}/supervisor`);
};

export const updateEmployeeSupervisor = async (id: string, supervisorId: string, reason?: string): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/api/v1/employees/${id}/supervisor`, {
    method: 'PUT',
    body: JSON.stringify({ supervisor_id: supervisorId, reason }),
  });
};

export const getVerificationPolicy = async (id: string): Promise<VerificationPolicy | null> => {
  return fetchApi<VerificationPolicy | null>(`/api/v1/employees/${id}/verification-policy`);
};

export const updateVerificationPolicy = async (id: string, payload: Partial<VerificationPolicy>): Promise<{ success: boolean }> => {
  return fetchApi<{ success: boolean }>(`/api/v1/employees/${id}/verification-policy`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const getEmployeeDevices = async (id: string): Promise<Device[]> => {
  return fetchApi<Device[]>(`/api/v1/employees/${id}/devices`);
};

export const getEmployeeAttendanceSummary = async (id: string, period?: string): Promise<AttendanceSummary> => {
  const query = period ? `?period=${encodeURIComponent(period)}` : '';
  return fetchApi<AttendanceSummary>(`/api/v1/employees/${id}/attendance-summary${query}`);
};

export const getSupervisorTeam = async (id: string): Promise<TeamMember[]> => {
  return fetchApi<TeamMember[]>(`/api/v1/supervisors/${id}/team`);
};

export const importEmployees = async (file: File): Promise<{ job_id: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  
  // Notice: using fetch directly or modifying fetchApi to accept FormData if needed
  return fetchApi<{ job_id: string }>('/api/v1/employees/import', {
    method: 'POST',
    body: formData, // the client fetchApi needs to support this
  });
};
