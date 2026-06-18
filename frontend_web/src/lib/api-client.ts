const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8885/api/v1';

interface ApiEnvelope<T> {
  data?: T;
  meta?: { requestId: string };
  errors?: Array<{ code: string; message: string; field?: string }>;
}

function hasApiEnvelope<T>(body: unknown): body is ApiEnvelope<T> {
  return Boolean(
    body &&
      typeof body === 'object' &&
      ('data' in body || 'meta' in body || 'errors' in body)
  );
}

function buildHeaders(headers?: HeadersInit) {
  const nextHeaders = new Headers(headers);
  nextHeaders.set('Content-Type', 'application/json');

  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('armora_token');
    if (token) {
      nextHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  return nextHeaders;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: buildHeaders(options?.headers),
  });

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    if (!res.ok) {
      throw new Error(`Error ${res.status}: el servidor no devolvio JSON`);
    }
    throw new Error('Respuesta inesperada del servidor');
  }

  if (!res.ok) {
    if (hasApiEnvelope<T>(body) && body.errors && body.errors.length > 0) {
      throw new Error(body.errors[0].message);
    }
    throw new Error(`Error ${res.status}`);
  }

  if (hasApiEnvelope<T>(body) && 'data' in body) {
    return body.data as T;
  }

  return body as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),
  post: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  put: <T>(endpoint: string, data: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: <T>(endpoint: string) =>
    request<T>(endpoint, { method: 'DELETE' }),
  health: () => api.get<{ status: string }>('/health'),
  version: () => api.get<{ version: string }>('/version'),
};
