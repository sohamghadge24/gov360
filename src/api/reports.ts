import { fetchApi } from './apiClient';

export interface DailyAttendanceReport {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'Present' | 'Absent' | 'Late' | 'Incomplete';
  verification: string;
  exceptions: string[];
  duty: string;
}

export interface VerificationComplianceReport {
  employeeId: string;
  employeeName: string;
  requiredSlots: number;
  completedSlots: number;
  missedSlots: number;
  compliancePercentage: number;
  status: 'Compliant' | 'Non-Compliant';
}

export interface MissedVerificationReport {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  verificationSlot: string;
  reason: string;
  status: 'Unapproved' | 'Approved Miss';
  approvalReference?: string;
}

export interface LocationExceptionReport {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  exceptionType: 'Outside Zone' | 'Low Accuracy' | 'Mock Location';
  locationName: string;
  accuracy: number;
  status: 'Pending' | 'Resolved';
  resolution?: string;
}

export interface FieldDutyReport {
  id: string;
  employeeId: string;
  employeeName: string;
  dutyType: string;
  zone: string;
  site: string;
  startTime: string;
  endTime: string | null;
  taskStatus: 'Pending' | 'In Progress' | 'Completed';
  completionPercentage: number;
}

export interface AnalyticsDashboard {
  attendanceTrend: { date: string; present: number; absent: number }[];
  complianceTrend: { date: string; compliance: number }[];
  exceptionTrend: { date: string; exceptions: number }[];
  fieldDutyCompletion: { date: string; completion: number }[];
}

export interface ReportJob {
  id: string;
  reportType: string;
  format: 'PDF' | 'XLSX' | 'CSV';
  status: 'Queued' | 'Processing' | 'Completed' | 'Failed';
  requestedAt: string;
  requestedBy: string;
  downloadUrl?: string;
}

export interface ScheduledReport {
  id: string;
  reportType: string;
  frequency: string;
  recipients: string[];
  format: 'PDF' | 'XLSX' | 'CSV';
  status: 'Active' | 'Pending Approval' | 'Inactive';
  nextRun: string;
  createdBy: string;
}

const buildQuery = (params?: Record<string, any>) => {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value.toString());
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

export const reportService = {
  getDailyAttendance: (params?: any) => fetchApi<{ data: DailyAttendanceReport[], summary?: any }>(`/api/v1/reports/daily-attendance${buildQuery(params)}`),
  getMonthlyAttendance: (params?: any) => fetchApi<any>(`/api/v1/reports/monthly-attendance${buildQuery(params)}`),
  getVerificationCompliance: (params?: any) => fetchApi<{ data: VerificationComplianceReport[], summary?: any }>(`/api/v1/reports/verification-compliance${buildQuery(params)}`),
  getMissedVerifications: (params?: any) => fetchApi<MissedVerificationReport[]>(`/api/v1/reports/missed-verifications${buildQuery(params)}`),
  getLocationExceptions: (params?: any) => fetchApi<LocationExceptionReport[]>(`/api/v1/reports/location-exceptions${buildQuery(params)}`),
  getFieldDuty: (params?: any) => fetchApi<FieldDutyReport[]>(`/api/v1/reports/field-duty${buildQuery(params)}`),
  getEmployeeReport: (id: string, params?: any) => fetchApi<any>(`/api/v1/reports/employee/${id}${buildQuery(params)}`),
};

export const analyticsService = {
  getDashboard: (params?: any) => fetchApi<AnalyticsDashboard>(`/api/v1/analytics/dashboard${buildQuery(params)}`),
};

export const reportJobService = {
  createJob: (payload: { reportType: string; format: string; filters?: any }) => fetchApi<ReportJob>('/api/v1/exports', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getJob: (id: string) => fetchApi<ReportJob>(`/api/v1/exports/${id}`),
  download: (id: string) => fetchApi<{ downloadUrl: string }>(`/api/v1/exports/${id}/download`),
  getHistory: () => fetchApi<ReportJob[]>('/api/v1/exports')
};

export const scheduledReportService = {
  getScheduledReports: (params?: any) => fetchApi<ScheduledReport[]>(`/api/v1/scheduled-reports${buildQuery(params)}`),
  createScheduledReport: (payload: any) => fetchApi<ScheduledReport>('/api/v1/scheduled-reports', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
