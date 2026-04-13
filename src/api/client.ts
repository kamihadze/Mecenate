import { ApiEnvelope } from './types';

const DEFAULT_BASE_URL = 'https://k8s.mectest.ru/test-app';

export const API_BASE_URL =
  (process.env.EXPO_PUBLIC_API_BASE_URL as string | undefined) ?? DEFAULT_BASE_URL;

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST';
  query?: Record<string, string | number | boolean | null | undefined>;
  body?: unknown;
  token: string;
  signal?: AbortSignal;
};

const buildUrl = (path: string, query?: RequestOptions['query']): string => {
  const url = new URL(API_BASE_URL + path);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === null || value === undefined) continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
};

export async function request<T>(path: string, options: RequestOptions): Promise<T> {
  const { method = 'GET', query, body, token, signal } = options;
  const response = await fetch(buildUrl(path, query), {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });

  let json: ApiEnvelope<T> | undefined;
  try {
    json = (await response.json()) as ApiEnvelope<T>;
  } catch {
    json = undefined;
  }

  if (!response.ok) {
    const message = json?.error?.message ?? `Request failed with status ${response.status}`;
    throw new ApiError(response.status, message, json?.error?.code);
  }

  if (!json || json.data === undefined) {
    throw new ApiError(response.status, 'Malformed response');
  }

  return json.data;
}
