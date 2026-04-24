import React, { useState } from 'react';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ApiError } from '../api/client';
import { useUIStore } from '../stores/StoreContext';

interface Props {
  children: React.ReactNode;
}

const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 500;
const BACKOFF_MAX_MS = 15_000;

const shouldRetry = (failureCount: number, error: unknown) => {
  if (error instanceof ApiError) {
    if (error.status >= 400 && error.status < 500) return false;
  }
  return failureCount < MAX_RETRIES;
};

const retryDelay = (attempt: number) =>
  Math.min(BACKOFF_BASE_MS * 2 ** attempt, BACKOFF_MAX_MS);

const describeError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message || `Ошибка ${error.status}`;
  }
  if (error instanceof Error) return error.message;
  return 'Неизвестная ошибка';
};

export const QueryProvider: React.FC<Props> = ({ children }) => {
  const ui = useUIStore();

  const [client] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            ui.reportError(describeError(error));
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            ui.reportError(describeError(error));
          },
        }),
        defaultOptions: {
          queries: {
            retry: shouldRetry,
            retryDelay,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            staleTime: 30_000,
            gcTime: 5 * 60_000,
          },
          mutations: {
            retry: shouldRetry,
            retryDelay,
          },
        },
      }),
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
