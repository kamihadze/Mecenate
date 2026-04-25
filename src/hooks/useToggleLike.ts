import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toggleLike } from '../api/posts';
import { postsKeys } from '../api/queryKeys';
import { LikeResult, Post, PostsFeedPage } from '../api/types';
import { useSessionStore } from '../stores/StoreContext';

interface OptimisticContext {
  previousDetail?: Post;
  previousFeeds: [readonly unknown[], InfiniteData<PostsFeedPage> | undefined][];
}

const patchPost = (post: Post): Post => ({
  ...post,
  isLiked: !post.isLiked,
  likesCount: post.likesCount + (post.isLiked ? -1 : 1),
});

const applyToFeed = (
  data: InfiniteData<PostsFeedPage> | undefined,
  postId: string,
): InfiniteData<PostsFeedPage> | undefined => {
  if (!data) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.map((p) => (p.id === postId ? patchPost(p) : p)),
    })),
  };
};

export function useToggleLike(postId: string) {
  const session = useSessionStore();
  const client = useQueryClient();

  return useMutation<LikeResult, unknown, void, OptimisticContext>({
    mutationFn: () => toggleLike(postId, session.token!),
    onMutate: async () => {
      await client.cancelQueries({ queryKey: postsKeys.detail(postId) });
      await client.cancelQueries({ queryKey: postsKeys.feeds() });

      const previousDetail = client.getQueryData<Post>(postsKeys.detail(postId));
      const previousFeeds = client.getQueriesData<InfiniteData<PostsFeedPage>>({
        queryKey: postsKeys.feeds(),
      });

      if (previousDetail) {
        client.setQueryData<Post>(postsKeys.detail(postId), patchPost(previousDetail));
      }
      for (const [key] of previousFeeds) {
        client.setQueryData<InfiniteData<PostsFeedPage>>(key, (data) =>
          applyToFeed(data, postId),
        );
      }

      return { previousDetail, previousFeeds };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      if (ctx.previousDetail) {
        client.setQueryData(postsKeys.detail(postId), ctx.previousDetail);
      }
      for (const [key, data] of ctx.previousFeeds) {
        client.setQueryData(key, data);
      }
    },
    onSuccess: (result) => {
      client.setQueryData<Post>(postsKeys.detail(postId), (prev) =>
        prev ? { ...prev, isLiked: result.isLiked, likesCount: result.likesCount } : prev,
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
                p.id === postId
                  ? { ...p, isLiked: result.isLiked, likesCount: result.likesCount }
                  : p,
              ),
            })),
          };
        },
      );
    },
  });
}
