const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8085/api/v1';

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const body = await res.json();

  if (!res.ok) {
    const msg = body?.error || `Error ${res.status}`;
    throw new Error(msg);
  }

  return body;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  health: () => api.get<{ status: string }>('/health'),
  version: () => api.get<{ version: string }>('/version'),
};
