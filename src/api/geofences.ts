import { fetchApi } from '@/lib/api/client';

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
  getGeofences: () => fetchApi<Geofence[]>('/api/v1/locations'),
  getGeofence: (id: string) => fetchApi<Geofence>(`/api/v1/locations/${id}`),
  createGeofence: (payload: Partial<Geofence>) => fetchApi<Geofence>('/api/v1/locations', { method: 'POST', body: JSON.stringify(payload) }),
  updateGeofence: (id: string, payload: Partial<Geofence>) => fetchApi<Geofence>(`/api/v1/locations/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  validateGeofence: (id: string, payload: { lat: number, lng: number }) => fetchApi<{ result: string, tolerance: number, timestamp: string }>(`/api/v1/locations/${id}/validate`, { method: 'POST', body: JSON.stringify(payload) })
};

export const gisService = {
  getLayers: () => fetchApi<GISLayer[]>('/api/v1/gis/layers'),
  importGIS: (formData: FormData) => {
    return fetchApi<any>('/api/v1/gis/import', { method: 'POST', body: formData });
  }
};

export const locationService = {
  getMapConfig: (id: string) => fetchApi<any>(`/api/v1/locations/${id}/map-config`),
  getLocationPolicy: () => fetchApi<LocationPolicy>('/api/v1/location-policy')
};

export const routeService = {
  getRouteCheckpoints: (id: string) => fetchApi<RouteCheckpoint[]>(`/api/v1/routes/${id}/checkpoints`)
};

export const locationEventService = {
  submitBatch: (payload: any) => fetchApi<any>('/api/v1/location-events/batch', { method: 'POST', body: JSON.stringify(payload) })
};
