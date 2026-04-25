import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { fetchPostById } from '../api/posts';
import { postsKeys } from '../api/queryKeys';
import { Post } from '../api/types';
import { useSessionStore } from '../stores/StoreContext';

export function usePostDetail(postId: string) {
  const session = useSessionStore();
  return useQuery({
    queryKey: postsKeys.detail(postId),
    enabled: !!session.token && !!postId,
    queryFn: ({ signal }) => fetchPostById(postId, session.token!, signal),
    staleTime: 30_000,
  });
}

export function useUpdatePostInCache() {
  const client = useQueryClient();
  return useCallback(
    (postId: string, patch: Partial<Post>) => {
      client.setQueryData<Post>(postsKeys.detail(postId), (prev) =>
        prev ? { ...prev, ...patch } : prev,
      );
    },
    [client],
  );
}
