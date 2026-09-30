import { fetchApi } from '@/lib/api/client';

export interface RetentionPolicy {
  activeStorageYears: number;
  coldArchiveYears: number;
  selfiePurgeDays: number;
  locationTrailPurgeDays: number;
}

export interface Integration {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  lastSync?: string;
}

export const settingsService = {
  getRetentionPolicy: () => fetchApi<RetentionPolicy>('/api/v1/settings/retention'),
  updateRetentionPolicy: (payload: Partial<RetentionPolicy>) => fetchApi<RetentionPolicy>('/api/v1/settings/retention', {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  getIntegrations: () => fetchApi<Integration[]>('/api/v1/integrations'),
  getSettings: () => fetchApi<any>('/api/v1/settings')
};
