export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const fetchApi = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { requireAuth = true, ...init } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  if (requireAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && requireAuth) {
      // Handle token refresh or redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return null as any;
  }

  return response.json() as Promise<T>;
};
