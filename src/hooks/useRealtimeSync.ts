import {
  InfiniteData,
  useQueryClient,
} from '@tanstack/react-query';
import { useEffect } from 'react';
import { WSEvent } from '../api/ws';
import { commentsKeys, postsKeys } from '../api/queryKeys';
import { CommentsPage, Post, PostsFeedPage } from '../api/types';
import { useRealtimeStore, useSessionStore } from '../stores/StoreContext';

export function useRealtimeSync() {
  const realtime = useRealtimeStore();
  const session = useSessionStore();
  const client = useQueryClient();

  useEffect(() => {
    if (!session.token) return;
    realtime.connect(session.token);
    return () => realtime.disconnect();
  }, [realtime, session.token]);

  useEffect(() => {
    const unsub = realtime.subscribe((event: WSEvent) => {
      if (event.type === 'like_updated') {
        const { postId, likesCount } = event;
        client.setQueryData<Post>(postsKeys.detail(postId), (prev) =>
          prev ? { ...prev, likesCount } : prev,
        );
        client.setQueriesData<InfiniteData<PostsFeedPage>>(
          { queryKey: postsKeys.feeds() },
          (data) => {
            if (!data) return data;
            return {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                posts: page.posts.map((p) =>
                  p.id === postId ? { ...p, likesCount } : p,
                ),
              })),
            };
          },
        );
      }

      if (event.type === 'comment_added') {
        const { postId, comment } = event;
        client.setQueryData<InfiniteData<CommentsPage>>(
          commentsKeys.list(postId),
          (prev) => {
            if (!prev) return prev;
            const [first, ...rest] = prev.pages;
            if (!first) return prev;
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
        client.setQueryData<Post>(postsKeys.detail(postId), (prev) =>
          prev
            ? { ...prev, commentsCount: prev.commentsCount + 1 }
            : prev,
        );
      }
    });
    return unsub;
  }, [realtime, client]);
}
