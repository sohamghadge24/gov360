export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface RequestOptions extends RequestInit {
  requireAuth?: boolean;
}

export const fetchApi = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const { requireAuth = true, ...init } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type') && typeof FormData !== 'undefined' && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  } else if (!headers.has('Content-Type') && typeof FormData === 'undefined') {
    headers.set('Content-Type', 'application/json');
  }
  if (!headers.has('X-Request-ID')) {
    headers.set('X-Request-ID', crypto.randomUUID());
  }

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
    if (response.status === 404) {
      console.warn(`API Not Found (404): ${url}. Returning null.`);
      return null as any;
    }
    const errorData = await response.json().catch(() => null);
    if (errorData?.error) {
      // Blueprint error envelope
      throw new Error(errorData.error.message || `API error: ${response.status}`);
    }
    throw new Error(errorData?.message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return null as any;
  }

  return response.json() as Promise<T>;
};
