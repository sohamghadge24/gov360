import { fetchApi } from './apiClient';

export interface VerificationSlot {
  id: string;
  dutyId: string;
  name: string;
  expectedTime: string;
  toleranceMinutes: number;
  requiredEvidence: ('GPS' | 'Selfie' | 'QR' | 'WiFi' | 'NFC')[];
  status: 'Pending' | 'Due' | 'In progress' | 'Verified' | 'Missed' | 'Failed' | 'Expired';
  allowRetry?: boolean;
  retryLimit?: number;
  result?: string;
  exceptionId?: string;
}

export interface VerificationEvidence {
  type: 'GPS' | 'Selfie' | 'QR' | 'WiFi' | 'NFC';
  data: any;
  timestamp: string;
}

export interface VerificationResult {
  status: 'Verified' | 'Failed' | 'Retry' | 'Exception';
  message?: string;
  nextStep?: string;
  time?: string;
  methods?: string[];
}

export const verificationService = {
  getNextSlot: () => 
    fetchApi<VerificationSlot>('/v1/verification/next'),
    
  getSlots: (date?: string) => 
    fetchApi<VerificationSlot[]>(`/v1/verification/slots${date ? `?date=${date}` : ''}`),
    
  getVerificationDetail: (id: string) => 
    fetchApi<VerificationSlot>(`/v1/verification/${id}`),
    
  startVerification: (slotId: string) => 
    fetchApi<any>('/v1/verification/start', {
      method: 'POST',
      body: JSON.stringify({ slotId }),
    }),
    
  submitLocation: (payload: any) => 
    fetchApi<any>('/v1/verification/location', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    
  initSelfie: () => 
    fetchApi<any>('/v1/verification/selfie/init', { method: 'POST' }),
    
  completeSelfie: (payload: any) => 
    fetchApi<any>('/v1/verification/selfie/complete', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    
  submitQR: (payload: any) => 
    fetchApi<any>('/v1/verification/qr', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    
  submitWiFi: (payload: any) => 
    fetchApi<any>('/v1/verification/wifi', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    
  submitNFC: (payload: any) => 
    fetchApi<any>('/v1/verification/nfc', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    
  completeVerification: (slotId: string, evidence: VerificationEvidence[]) => 
    fetchApi<VerificationResult>('/v1/verification/complete', {
      method: 'POST',
      body: JSON.stringify({ slotId, evidence }),
    }),
    
  retryVerification: (id: string) => 
    fetchApi<any>(`/v1/verification/${id}/retry`, { method: 'POST' }),
};
