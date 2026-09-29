import { fetchApi } from './client';

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  mfa_required?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions?: string[];
  employee_id?: string;
}

export const authApi = {
  login: (data: LoginRequest) => fetchApi<LoginResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    requireAuth: false,
  }),
  
  verifyMfa: (code: string) => fetchApi<LoginResponse>('/api/v1/auth/mfa/verify', {
    method: 'POST',
    body: JSON.stringify({ code }),
  }),
  
  me: () => fetchApi<AuthUser>('/api/v1/auth/me'),
  
  logout: () => fetchApi('/api/v1/auth/logout', { method: 'POST' }),
  
  sessions: () => fetchApi<any[]>('/api/v1/auth/sessions'),
};
