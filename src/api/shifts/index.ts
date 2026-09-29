import { fetchApi } from '../apiClient';

export interface ShiftTemplate {
  id: string;
  name: string;
  code: string;
  startTime: string; // e.g. "22:00"
  endTime: string; // e.g. "06:00"
  isOvernight: boolean;
  breakDurationMinutes: number;
  effectiveFrom: string;
  effectiveTo?: string;
  status: 'Active' | 'Inactive';
  description?: string;
}

export const shiftService = {
  list: () => fetchApi<ShiftTemplate[]>('/v1/shifts'),
  get: (id: string) => fetchApi<ShiftTemplate>(`/v1/shifts/${id}`),
  create: (data: Partial<ShiftTemplate>) => 
    fetchApi<ShiftTemplate>('/v1/shifts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<ShiftTemplate>) => 
    fetchApi<ShiftTemplate>(`/v1/shifts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
