export const fetchApi = async <T>(endpoint: string, options?: RequestInit): Promise<T | null> => {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `/api${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 404 || response.status >= 500) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }

    // if no content (204), return null
    if (response.status === 204) return null;

    return await response.json() as T;
  } catch (error) {
    console.error("fetchApi error:", error);
    return null;
  }
};
