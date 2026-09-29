import { fetchApi } from './apiClient';

export interface DashboardSummary {
  scheduled: number | null;
  present: number | null;
  fieldDuty: number | null;
  officeDuty: number | null;
  leave: number | null;
  offDuty: number | null;
  verificationDue: number | null;
  verificationMissed: number | null;
}

export const getDashboardSummary = async (): Promise<DashboardSummary | null> => {
  return fetchApi<DashboardSummary>('/dashboard/summary');
};
