import { API_BASE_URL } from './client';
import { Comment } from './types';

export type WSEvent =
  | { type: 'ping' }
  | { type: 'like_updated'; postId: string; likesCount: number }
  | { type: 'comment_added'; postId: string; comment: Comment };

export const buildWsUrl = (token: string): string => {
  const base = API_BASE_URL.replace(/^http(s?):\/\//i, (_m, s) => `ws${s}://`);
  const trimmed = base.replace(/\/$/, '');
  return `${trimmed}/ws?token=${encodeURIComponent(token)}`;
};

export const parseEvent = (raw: string): WSEvent | null => {
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data.type !== 'string') return null;
    return data as WSEvent;
  } catch {
    return null;
  }
};
