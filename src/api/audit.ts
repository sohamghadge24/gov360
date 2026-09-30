import { fetchApi } from '@/lib/api/client';

export interface AuditLog {
  id: string;
  event: string;
  user: string;
  ip: string;
  resource: string;
  timestamp: string;
  severity?: string;
  details?: Record<string, any>;
}

export const auditService = {
  getLogs: (filters?: { timeframe?: string, action?: string, severity?: string }) => {
    const query = filters ? new URLSearchParams(filters as any).toString() : '';
    return fetchApi<AuditLog[]>(`/api/v1/audit${query ? `?${query}` : ''}`);
  }
};
