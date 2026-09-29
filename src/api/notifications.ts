import { fetchApi } from './apiClient';

export interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  type: string;
  read: boolean;
  context?: any;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: string;
  language: string;
  subject: string;
  message: string;
  status: string;
  version: number;
}

export interface NotificationRule {
  id: string;
  name: string;
  trigger: string;
  status: string;
  policyId?: string;
}

export interface NotificationDelivery {
  id: string;
  notificationId: string;
  channel: string;
  status: string;
  createdAt: string;
  completedAt?: string;
  providerDetails?: any;
}

export const notificationService = {
  getNotifications: (cursor?: string) => 
    fetchApi<{ data: Notification[], nextCursor?: string }>(`/v1/notifications${cursor ? `?cursor=${cursor}` : ''}`),
  
  markAsRead: (id: string) => 
    fetchApi<any>(`/v1/notifications/${id}/read`, { method: 'POST' }),
  
  getTemplates: () => fetchApi<NotificationTemplate[]>('/v1/notification-templates'),
  createTemplate: (payload: Partial<NotificationTemplate>) => 
    fetchApi<NotificationTemplate>('/v1/notification-templates', { method: 'POST', body: JSON.stringify(payload) }),
    
  getRules: () => fetchApi<NotificationRule[]>('/v1/notification-rules'),
  createRule: (payload: Partial<NotificationRule>) => 
    fetchApi<NotificationRule>('/v1/notification-rules', { method: 'POST', body: JSON.stringify(payload) }),
    
  broadcast: (payload: any) => 
    fetchApi<any>('/v1/notifications/broadcast', { method: 'POST', body: JSON.stringify(payload) }),
    
  getDeliveries: () => fetchApi<NotificationDelivery[]>('/v1/notification-deliveries'),
  
  registerPushToken: (payload: { token: string }) => 
    fetchApi<any>('/v1/push/register-token', { method: 'POST', body: JSON.stringify(payload) }),
  
  removePushToken: () => 
    fetchApi<any>('/v1/push/register-token', { method: 'DELETE' })
};
