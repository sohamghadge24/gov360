import { fetchApi } from '@/lib/api/client';
import { PaginatedResponse } from './types';

// ============================================================================
// Types
// ============================================================================

export interface AttendanceSession {
  id: string;
  employee_id: string;
  employee_name: string;
  organization_id?: string;
  department_id?: string;
  department?: string;
  status: string; // "Present", "Checked in", "Checked out", "Absent", "On leave", "Off duty", "Pending", "Exception"
  check_in_time?: string;
  check_out_time?: string;
  duration_minutes?: number;
  source?: string;
  duty_type?: string;
}

export interface AttendanceEvent {
  id: string;
  session_id: string;
  timestamp: string;
  event_type: string; // 'check_in', 'check_out', 'heartbeat', 'verification'
  verification_status?: string;
  source?: string;
  device_metadata?: any;
  location_metadata?: any;
}

export interface AttendanceSessionDetail extends AttendanceSession {
  events: AttendanceEvent[];
  correction_history?: any[];
  is_finalized?: boolean;
}

export interface AttendanceCurrentStatus {
  employee_id: string;
  employee_name: string;
  status: string;
  check_in_time?: string;
  check_out_time?: string;
  current_session_id?: string;
  last_update: string;
}

export interface CorrectionRequestPayload {
  reason: string;
  requested_correction_details: string;
}

export interface FinalizeSessionPayload {
  notes?: string;
}

export interface CheckInPayload {
  timestamp: string;
  location?: { lat: number; lng: number };
}

export interface CheckOutPayload {
  timestamp: string;
  location?: { lat: number; lng: number };
}

export interface AttendanceEventPayload {
  event_type: string;
  timestamp: string;
  signed_payload?: string;
}

export interface OfflineSyncPayload {
  events: AttendanceEventPayload[];
}

export interface SessionFilters {
  page?: number;
  size?: number;
  date?: string;
  organization_id?: string;
  department_id?: string;
  unit_id?: string;
  employee_id?: string;
  status?: string;
}

// ============================================================================
// API Functions
// ============================================================================

export const getTodayAttendance = async (): Promise<AttendanceSession | null> => {
  return fetchApi<AttendanceSession | null>(`/api/v1/attendance/today`);
};

export const getCurrentAttendanceStatus = async (): Promise<AttendanceCurrentStatus[]> => {
  return fetchApi<AttendanceCurrentStatus[]>(`/api/v1/attendance/status/current`);
};

export const getAttendanceSessions = async (
  filters: SessionFilters = {}
): Promise<PaginatedResponse<AttendanceSession>> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, String(value));
    }
  });
  return fetchApi<PaginatedResponse<AttendanceSession>>(`/api/v1/attendance/sessions?${params.toString()}`);
};

export const getAttendanceSession = async (id: string): Promise<AttendanceSessionDetail> => {
  return fetchApi<AttendanceSessionDetail>(`/api/v1/attendance/sessions/${id}`);
};

export const requestAttendanceCorrection = async (
  id: string,
  payload: CorrectionRequestPayload
): Promise<any> => {
  return fetchApi<any>(`/api/v1/attendance/sessions/${id}/correction-request`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const finalizeAttendanceSession = async (
  id: string,
  payload: FinalizeSessionPayload
): Promise<any> => {
  return fetchApi<any>(`/api/v1/attendance/sessions/${id}/finalize`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const checkIn = async (
  payload: CheckInPayload,
  idempotencyKey: string
): Promise<AttendanceSession> => {
  return fetchApi<AttendanceSession>(`/api/v1/attendance/check-in`, {
    method: 'POST',
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
};

export const checkOut = async (
  payload: CheckOutPayload,
  idempotencyKey: string
): Promise<AttendanceSession> => {
  return fetchApi<AttendanceSession>(`/api/v1/attendance/check-out`, {
    method: 'POST',
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
};

export const postAttendanceEvent = async (payload: AttendanceEventPayload): Promise<any> => {
  return fetchApi<any>(`/api/v1/attendance/events`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const offlineSync = async (
  payload: OfflineSyncPayload,
  idempotencyKey: string
): Promise<any> => {
  return fetchApi<any>(`/api/v1/attendance/offline-sync`, {
    method: 'POST',
    headers: {
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify(payload),
  });
};
