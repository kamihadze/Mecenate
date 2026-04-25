import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useCallback } from 'react';
import { createComment, fetchComments } from '../api/posts';
import { commentsKeys, postsKeys } from '../api/queryKeys';
import { Comment, CommentsPage, Post } from '../api/types';
import { useSessionStore } from '../stores/StoreContext';

const PAGE_SIZE = 20;

export function usePostComments(postId: string) {
  const session = useSessionStore();
  return useInfiniteQuery({
    queryKey: commentsKeys.list(postId),
    enabled: !!session.token && !!postId,
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      fetchComments(
        { postId, cursor: pageParam, limit: PAGE_SIZE },
        session.token!,
        signal,
      ),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    staleTime: 15_000,
  });
}

export function usePrependCommentToCache() {
  const client = useQueryClient();
  return useCallback(
    (postId: string, comment: Comment) => {
      client.setQueryData<InfiniteData<CommentsPage>>(
        commentsKeys.list(postId),
        (prev) => {
          if (!prev || prev.pages.length === 0) {
            return {
              pages: [{ comments: [comment], nextCursor: null, hasMore: false }],
              pageParams: [null],
            };
          }
          const [first, ...rest] = prev.pages;
          if (first.comments.some((c) => c.id === comment.id)) return prev;
          return {
            ...prev,
            pages: [
              { ...first, comments: [comment, ...first.comments] },
              ...rest,
            ],
          };
        },
      );
    },
    [client],
  );
}

export function useCreateComment(postId: string) {
  const session = useSessionStore();
  const client = useQueryClient();
  const prepend = usePrependCommentToCache();

  return useMutation({
    mutationFn: (text: string) => createComment(postId, text, session.token!),
    onSuccess: (comment) => {
      prepend(postId, comment);
      client.setQueryData<Post>(postsKeys.detail(postId), (prev) =>
        prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : prev,
      );
      client.invalidateQueries({ queryKey: postsKeys.feeds() });
    },
  });
}
