import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPostsFeed } from '../api/posts';
import { useSessionStore, useUIStore } from '../stores/StoreContext';

const PAGE_SIZE = 10;

export interface UsePostsFeedOptions {
  simulateError?: boolean;
}

export const postsFeedQueryKey = (simulateError: boolean) =>
  ['posts', 'feed', { simulateError }] as const;

export function usePostsFeed(options: UsePostsFeedOptions = {}) {
  const session = useSessionStore();
  const ui = useUIStore();
  const simulateError = options.simulateError ?? ui.forceError;

  return useInfiniteQuery({
    queryKey: postsFeedQueryKey(simulateError),
    enabled: !!session.token,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      fetchPostsFeed(
        {
          limit: PAGE_SIZE,
          cursor: pageParam,
          simulateError,
        },
        session.token!,
        signal,
      ),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
  });
}
