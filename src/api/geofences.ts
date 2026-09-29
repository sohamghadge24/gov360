import { fetchApi } from './apiClient';

export type GeofenceType = 'Circle' | 'Polygon' | 'RouteCorridor';
export type GeofenceStatus = 'Active' | 'Draft' | 'Inactive' | 'Expired';

export interface GeofenceGeometry {
  type: string;
  coordinates: any;
  radius?: number; // for Circle
}

export interface Geofence {
  id: string;
  name: string;
  type: GeofenceType;
  status: GeofenceStatus;
  effectiveFrom: string;
  effectiveTo?: string;
  tolerance: number;
  scope: string;
  geometrySummary?: string;
  geometry?: GeofenceGeometry;
}

export interface GISLayer {
  id: string;
  name: string;
  active: boolean;
}

export interface LocationPolicy {
  collection: string;
  purpose: string;
  scope: string;
}

export interface RouteCheckpoint {
  id: string;
  name: string;
  sequence: number;
  status?: string;
  geometry: GeofenceGeometry;
}

export const geofenceService = {
  getGeofences: () => fetchApi<Geofence[]>('/v1/geofences'),
  getGeofence: (id: string) => fetchApi<Geofence>(`/v1/geofences/${id}`),
  createGeofence: (payload: Partial<Geofence>) => fetchApi<Geofence>('/v1/geofences', { method: 'POST', body: JSON.stringify(payload) }),
  updateGeofence: (id: string, payload: Partial<Geofence>) => fetchApi<Geofence>(`/v1/geofences/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  validateGeofence: (id: string, payload: { lat: number, lng: number }) => fetchApi<{ result: string, tolerance: number, timestamp: string }>(`/v1/geofences/${id}/validate`, { method: 'POST', body: JSON.stringify(payload) })
};

export const gisService = {
  getLayers: () => fetchApi<GISLayer[]>('/v1/gis/layers'),
  importGIS: (formData: FormData) => {
    // mock implementation since standard fetchApi uses application/json
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'Processing', jobId: 'job-123' });
      }, 1000);
    });
  }
};

export const locationService = {
  getMapConfig: (id: string) => fetchApi<any>(`/v1/locations/${id}/map-config`),
  getLocationPolicy: () => fetchApi<LocationPolicy>('/v1/location-policy')
};

export const routeService = {
  getRouteCheckpoints: (id: string) => fetchApi<RouteCheckpoint[]>(`/v1/routes/${id}/checkpoints`)
};

export const locationEventService = {
  submitBatch: (payload: any) => fetchApi<any>('/v1/location-events/batch', { method: 'POST', body: JSON.stringify(payload) })
};
