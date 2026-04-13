import { request } from './client';
import { PostsFeedPage, PostsQuery } from './types';

export async function fetchPostsFeed(
  query: PostsQuery,
  token: string,
  signal?: AbortSignal,
): Promise<PostsFeedPage> {
  return request<PostsFeedPage>('/posts', {
    method: 'GET',
    token,
    signal,
    query: {
      limit: query.limit ?? 10,
      cursor: query.cursor ?? undefined,
      tier: query.tier,
      simulate_error: query.simulateError,
    },
  });
}
