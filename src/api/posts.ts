import { request } from './client';
import {
  Comment,
  CommentsPage,
  CommentsQuery,
  LikeResult,
  Post,
  PostsFeedPage,
  PostsQuery,
} from './types';

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

export async function fetchPostById(
  id: string,
  token: string,
  signal?: AbortSignal,
): Promise<Post> {
  const data = await request<{ post: Post }>(`/posts/${id}`, {
    method: 'GET',
    token,
    signal,
  });
  return data.post;
}

export async function fetchComments(
  query: CommentsQuery,
  token: string,
  signal?: AbortSignal,
): Promise<CommentsPage> {
  return request<CommentsPage>(`/posts/${query.postId}/comments`, {
    method: 'GET',
    token,
    signal,
    query: {
      limit: query.limit ?? 20,
      cursor: query.cursor ?? undefined,
    },
  });
}

export async function createComment(
  postId: string,
  text: string,
  token: string,
  signal?: AbortSignal,
): Promise<Comment> {
  const data = await request<{ comment: Comment }>(`/posts/${postId}/comments`, {
    method: 'POST',
    token,
    signal,
    body: { text },
  });
  return data.comment;
}

export async function toggleLike(
  postId: string,
  token: string,
  signal?: AbortSignal,
): Promise<LikeResult> {
  return request<LikeResult>(`/posts/${postId}/like`, {
    method: 'POST',
    token,
    signal,
  });
}
