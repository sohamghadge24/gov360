import { fetchApi } from './apiClient';

export type ExceptionStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Escalated' | 'Reopened';
export type ExceptionSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ExceptionReason {
  code: string;
  label: string;
}

export interface Explanation {
  id: string;
  actor: string;
  role: string;
  text: string;
  attachmentUrl?: string;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  reason?: string;
  timestamp: string;
}

export interface AttendanceEvidence {
  checkIn?: string;
  checkOut?: string;
  verificationStatus?: string;
  locationEvidenceStatus?: string;
  identityVerificationStatus?: string;
  sessionId?: string;
}

export interface ExceptionDetail {
  id: string;
  employeeId: string;
  employeeName: string;
  reasonCode: string;
  reasonLabel: string;
  severity: ExceptionSeverity;
  status: ExceptionStatus;
  createdAt: string;
  updatedAt: string;
  currentAuthority: string;
  explanations: Explanation[];
  auditHistory: AuditEvent[];
  attendanceEvidence?: AttendanceEvidence;
}

export interface PendingApproval {
  id: string;
  exceptionId: string;
  employeeName: string;
  exceptionType: string;
  reasonLabel: string;
  severity: ExceptionSeverity;
  submittedAt: string;
  status: ExceptionStatus;
  waitingSince: string;
}

export interface EscalationRule {
  id: string;
  name: string;
  thresholdHours: number;
  currentAuthority: string;
  nextAuthority: string;
  status: 'Active' | 'Inactive';
  version: number;
  effectiveFrom: string;
}

export const approvalsService = {
  getPending: () => fetchApi<PendingApproval[]>('/v1/approvals/pending')
};

export const exceptionService = {
  getExceptions: (filters?: any) => {
    const query = filters ? new URLSearchParams(filters).toString() : '';
    return fetchApi<ExceptionDetail[]>(`/v1/exceptions${query ? `?${query}` : ''}`);
  },
  getException: (id: string) => fetchApi<ExceptionDetail>(`/v1/exceptions/${id}`),
  addExplanation: (id: string, payload: { text: string, attachment?: File }) => fetchApi<any>(`/v1/exceptions/${id}/explanation`, {
    method: 'POST',
    body: JSON.stringify(payload) // Assuming JSON for text, multipart would require FormData
  }),
  approve: (id: string, payload: { reason: string, effectiveOutcome?: string }) => fetchApi<any>(`/v1/exceptions/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  reject: (id: string, payload: { reason: string }) => fetchApi<any>(`/v1/exceptions/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  escalate: (id: string) => fetchApi<any>(`/v1/exceptions/${id}/escalate`, { method: 'POST' }),
  reopen: (id: string, payload: { reason: string }) => fetchApi<any>(`/v1/exceptions/${id}/reopen`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

export const exceptionReasonService = {
  getReasons: () => fetchApi<ExceptionReason[]>('/v1/exception-reasons')
};

export const escalationService = {
  getRules: () => fetchApi<EscalationRule[]>('/v1/escalation-rules'),
  createRule: (payload: Partial<EscalationRule>) => fetchApi<EscalationRule>('/v1/escalation-rules', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
