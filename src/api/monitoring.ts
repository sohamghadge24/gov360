import { fetchApi } from './apiClient';

export interface MonitoringSummary {
  present: number;
  presentTrend: string;
  onDuty: number;
  fieldDuty: number;
  verificationDue: number;
  dueWithinMins: number;
  missed: number;
  exceptions: number;
  urgentExceptions: number;
  outsideZone: number;
}

export type EmployeeStatusType = 
  | 'Verified' 
  | 'Verification Due' 
  | 'Missed' 
  | 'Outside Zone' 
  | 'Identity Review' 
  | 'Offline' 
  | 'Checked Out' 
  | 'On Duty' 
  | 'Off Duty';

export interface MonitoringEmployeeStatus {
  id: string;
  employeeId: string;
  name: string;
  duty: 'Field' | 'Office';
  location: string;
  status: EmployeeStatusType;
  lastVerifiedTime: string | null;
  gpsAccuracyMeters: number | null;
  lastUpdate: string;
}

export interface MonitoringMapPoint {
  employeeId: string;
  name: string;
  latitude: number;
  longitude: number;
  duty: 'Field' | 'Office';
  locationName: string;
  status: EmployeeStatusType;
  lastVerifiedTime: string | null;
  gpsAccuracyMeters: number | null;
}

export interface DueVerification {
  employeeId: string;
  name: string;
  location: string;
  dueTime: string;
  status: 'Due' | 'Missed';
  missedByMins?: number;
}

export interface OperationalException {
  id: string;
  employeeId: string;
  name: string;
  location: string;
  type: string; // e.g. "Verification missed", "Outside assigned zone"
  severity: 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedTime: string;
  details?: string;
  status: 'Open' | 'Resolved';
}

export interface TimelineEvent {
  id: string;
  time: string;
  type: 'Check-in' | 'Duty started' | 'Verification' | 'Verification due' | 'Verification missed' | 'Exception created' | 'Check-out';
  result: 'Passed' | 'Failed' | 'Due' | 'Missed' | 'Info';
  details?: string;
}

export interface FieldCoverage {
  ward: string;
  percentage: number;
}

export interface RealtimeToken {
  token: string;
  endpoint: string;
}

export const monitoringService = {
  getSummary: () => 
    fetchApi<MonitoringSummary>('/v1/monitoring/summary'),
    
  getStatusList: (params?: { search?: string, status?: string }) => {
    const qs = params ? new URLSearchParams(params as any).toString() : '';
    return fetchApi<MonitoringEmployeeStatus[]>(`/v1/monitoring/status${qs ? `?${qs}` : ''}`);
  },
    
  getMapPoints: () => 
    fetchApi<MonitoringMapPoint[]>('/v1/monitoring/map'),
    
  getDueVerifications: () => 
    fetchApi<DueVerification[]>('/v1/monitoring/due-verifications'),
    
  getEmployeeTimeline: (id: string) => 
    fetchApi<TimelineEvent[]>(`/v1/monitoring/employee/${id}/timeline`),
    
  getFieldCoverage: () => 
    fetchApi<FieldCoverage[]>('/v1/monitoring/field-coverage'),
    
  getRealtimeToken: () => 
    fetchApi<RealtimeToken>('/v1/realtime/token'),
    
  getExceptions: () => 
    fetchApi<OperationalException[]>('/v1/exceptions'),
};
