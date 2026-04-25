import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchPostsFeed } from '../api/posts';
import { postsKeys } from '../api/queryKeys';
import { PostTier } from '../api/types';
import { useSessionStore, useUIStore } from '../stores/StoreContext';

const PAGE_SIZE = 10;

export interface UsePostsFeedOptions {
  simulateError?: boolean;
  tier?: PostTier;
}

export function usePostsFeed(options: UsePostsFeedOptions = {}) {
  const session = useSessionStore();
  const ui = useUIStore();
  const simulateError = options.simulateError ?? ui.forceError;
  const tier = options.tier;

  return useInfiniteQuery({
    queryKey: postsKeys.feed({ simulateError, tier }),
    enabled: !!session.token,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      fetchPostsFeed(
        {
          limit: PAGE_SIZE,
          cursor: pageParam,
          simulateError,
          tier,
        },
        session.token!,
        signal,
      ),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    staleTime: 30_000,
  });
}

export function useInvalidatePostsFeed() {
  const client = useQueryClient();
  return useCallback(
    () => client.invalidateQueries({ queryKey: postsKeys.feeds() }),
    [client],
  );
}
