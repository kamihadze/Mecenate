import { PostTier } from './types';

export interface PostsFeedParams {
  simulateError?: boolean;
  tier?: PostTier;
}

export const postsKeys = {
  all: ['posts'] as const,
  feeds: () => [...postsKeys.all, 'feed'] as const,
  feed: (params: PostsFeedParams = {}) =>
    [...postsKeys.feeds(), params] as const,
  details: () => [...postsKeys.all, 'detail'] as const,
  detail: (id: string) => [...postsKeys.details(), id] as const,
};
