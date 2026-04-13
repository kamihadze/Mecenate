import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Post } from '../api/types';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { Avatar } from './Avatar';
import { ActionChip } from './ActionChip';
import { LikeIcon, LikeIconSolid } from './icons/LikeIcon';
import { CommentIcon } from './icons/CommentIcon';
import { PaidLock } from './PaidLock';

interface Props {
  post: Post;
}

export const PostCard: React.FC<Props> = React.memo(({ post }) => {
  const isPaid = post.tier === 'paid';
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={post.author.avatarUrl} />
        <Text style={styles.authorName} numberOfLines={1}>
          {post.author.displayName}
        </Text>
      </View>

      <View style={styles.mediaWrap}>
        <Image
          source={{ uri: post.coverUrl }}
          style={styles.cover}
          contentFit="cover"
          transition={200}
        />
        {isPaid && <PaidLock />}
      </View>

      {!isPaid && (
        <View style={styles.textBlock}>
          <Text style={styles.title} numberOfLines={2}>
            {post.title}
          </Text>
          <Text style={styles.preview} numberOfLines={2}>
            {post.preview || post.body}
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <ActionChip
          accessibilityLabel="Лайк"
          active={post.isLiked}
          count={post.likesCount}
          icon={<LikeIcon color={colors.textSecondary} />}
          iconActive={<LikeIconSolid color={colors.likeActiveText} />}
        />
        <ActionChip
          accessibilityLabel="Комментарии"
          count={post.commentsCount}
          icon={<CommentIcon color={colors.textSecondary} />}
        />
      </View>
    </View>
  );
});

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.card,
    overflow: 'hidden',
    marginBottom: spacing.l,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
  },
  authorName: {
    ...typography.authorName,
    color: colors.textPrimary,
    marginLeft: spacing.m,
    flexShrink: 1,
  },
  mediaWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.skeleton,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  textBlock: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  preview: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.s,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.l,
    gap: 8,
  },
});
