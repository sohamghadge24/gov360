import { fetchApi } from '@/lib/api/client';

import { PaginatedResponse } from './types';

export interface OrganizationNode {
  id: string;
  name: string;
  type: string;
  code: string;
  status: string;
  children?: OrganizationNode[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parent_id?: string;
  parent_name?: string;
  division_count: number;
  status: 'Active' | 'Inactive';
  description?: string;
  updated_at: string;
}

export interface Division {
  id: string;
  name: string;
  code: string;
  department_id: string;
  department_name: string;
  unit_count: number;
  status: 'Active' | 'Inactive';
}

export interface Unit {
  id: string;
  name: string;
  code: string;
  division_id: string;
  division_name: string;
  status: 'Active' | 'Inactive';
}

export interface Office {
  id: string;
  name: string;
  code: string;
  organization_id: string;
  address: string;
  geofence_id?: string;
  wifi_policy_id?: string;
  status: 'Active' | 'Inactive';
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  municipality_id: string;
  gis_reference?: string;
  status: 'Active' | 'Inactive';
}

export interface Zone {
  id: string;
  name: string;
  code: string;
  organization_id: string;
  operational_type: string;
  status: 'Active' | 'Inactive';
}

export interface PoliceStation {
  id: string;
  name: string;
  code: string;
  department_id: string;
  location: string;
  status: 'Active' | 'Inactive';
}

export interface Site {
  id: string;
  name: string;
  code: string;
  type: string;
  location: string;
  effective_date: string;
  expiry_date?: string;
  status: 'Active' | 'Inactive';
}

export const getOrganizationTree = async (): Promise<OrganizationNode[]> => {
  return fetchApi<OrganizationNode[]>('/api/v1/organization-tree');
};

export const getOrganizations = async (): Promise<OrganizationNode[]> => {
  return fetchApi<OrganizationNode[]>('/api/v1/organizations');
};

export const getDepartments = async (page = 1, size = 25, search = ''): Promise<PaginatedResponse<Department>> => {
  const query = new URLSearchParams({ page: page.toString(), size: size.toString() });
  if (search) query.append('search', search);
  return fetchApi<PaginatedResponse<Department>>(`/api/v1/departments?${query.toString()}`);
};

export const getDepartment = async (id: string): Promise<Department> => {
  return fetchApi<Department>(`/api/v1/departments/${id}`);
};

export const createDepartment = async (payload: Partial<Department>): Promise<Department> => {
  return fetchApi<Department>('/api/v1/departments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateDepartment = async (id: string, payload: Partial<Department>): Promise<Department> => {
  return fetchApi<Department>(`/api/v1/departments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

// Similar methods for others
export const getDivisions = async (page = 1, size = 25): Promise<PaginatedResponse<Division>> => {
  return fetchApi<PaginatedResponse<Division>>(`/api/v1/divisions?page=${page}&size=${size}`);
};
export const getUnits = async (page = 1, size = 25): Promise<PaginatedResponse<Unit>> => {
  return fetchApi<PaginatedResponse<Unit>>(`/api/v1/units?page=${page}&size=${size}`);
};
export const getOffices = async (page = 1, size = 25): Promise<PaginatedResponse<Office>> => {
  return fetchApi<PaginatedResponse<Office>>(`/api/v1/offices?page=${page}&size=${size}`);
};
export const getWards = async (page = 1, size = 25): Promise<PaginatedResponse<Ward>> => {
  return fetchApi<PaginatedResponse<Ward>>(`/api/v1/wards?page=${page}&size=${size}`);
};
export const getZones = async (page = 1, size = 25): Promise<PaginatedResponse<Zone>> => {
  return fetchApi<PaginatedResponse<Zone>>(`/api/v1/zones?page=${page}&size=${size}`);
};
export const getPoliceStations = async (page = 1, size = 25): Promise<PaginatedResponse<PoliceStation>> => {
  return fetchApi<PaginatedResponse<PoliceStation>>(`/api/v1/police-stations?page=${page}&size=${size}`);
};
export const getSites = async (page = 1, size = 25): Promise<PaginatedResponse<Site>> => {
  return fetchApi<PaginatedResponse<Site>>(`/api/v1/sites?page=${page}&size=${size}`);
};
