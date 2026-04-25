import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Post } from '../api/types';
import { useToggleLike } from '../hooks/useToggleLike';
import { colors, radii, spacing, typography } from '../theme/tokens';
import { Avatar } from './Avatar';
import { ActionChip } from './ActionChip';
import { AnimatedLikeChip } from './AnimatedLikeChip';
import { CommentIcon } from './icons/CommentIcon';
import { PaidLock } from './PaidLock';

interface Props {
  post: Post;
  onPress?: (post: Post) => void;
}

export const PostCard: React.FC<Props> = React.memo(({ post, onPress }) => {
  const isPaid = post.tier === 'paid';
  const handlePress = () => onPress?.(post);
  const toggleLike = useToggleLike(post.id);

  return (
    <Pressable
      onPress={handlePress}
      disabled={!onPress}
      style={({ pressed }) => [styles.card, pressed && onPress ? styles.pressed : null]}
      accessibilityRole="button"
    >
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
        <AnimatedLikeChip
          active={post.isLiked}
          count={post.likesCount}
          disabled={toggleLike.isPending}
          onPress={() => toggleLike.mutate()}
        />
        <ActionChip
          accessibilityLabel="Комментарии"
          count={post.commentsCount}
          icon={<CommentIcon color={colors.iconMuted} />}
        />
      </View>
    </Pressable>
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
  pressed: {
    opacity: 0.96,
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
