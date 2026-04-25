export type PostTier = 'free' | 'paid';

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
}

export interface PostsFeedPage {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface ApiEnvelope<T> {
  ok?: boolean;
  data: T;
  error?: { code: string; message: string };
}

export interface PostsQuery {
  limit?: number;
  cursor?: string | null;
  tier?: PostTier;
  simulateError?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommentsQuery {
  postId: string;
  limit?: number;
  cursor?: string | null;
}

export interface LikeResult {
  isLiked: boolean;
  likesCount: number;
}
