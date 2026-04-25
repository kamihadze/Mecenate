import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionChip } from '../components/ActionChip';
import { AnimatedLikeChip } from '../components/AnimatedLikeChip';
import { Avatar } from '../components/Avatar';
import { BackIcon } from '../components/icons/BackIcon';
import { CommentIcon } from '../components/icons/CommentIcon';
import { CommentRow } from '../components/CommentRow';
import { CommentComposer } from '../components/CommentComposer';
import { ErrorState } from '../components/ErrorState';
import { Comment } from '../api/types';
import { usePostDetail } from '../hooks/usePostDetail';
import { usePostComments, useCreateComment } from '../hooks/usePostComments';
import { useToggleLike } from '../hooks/useToggleLike';
import { RootStackParamList } from '../navigation/types';
import { colors, spacing, typography } from '../theme/tokens';

type DetailRoute = RouteProp<RootStackParamList, 'PostDetail'>;

const pluralComments = (n: number): string => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} комментарий`;
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) {
    return `${n} комментария`;
  }
  return `${n} комментариев`;
};

export const PostDetailScreen: React.FC = () => {
  const route = useRoute<DetailRoute>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { postId } = route.params;

  const postQuery = usePostDetail(postId);
  const commentsQuery = usePostComments(postId);
  const toggleLike = useToggleLike(postId);
  const createComment = useCreateComment(postId);

  const comments = useMemo<Comment[]>(
    () => (commentsQuery.data?.pages ?? []).flatMap((p) => p.comments),
    [commentsQuery.data],
  );

  const handleEndReached = useCallback(() => {
    if (commentsQuery.hasNextPage && !commentsQuery.isFetchingNextPage) {
      commentsQuery.fetchNextPage();
    }
  }, [commentsQuery]);

  const renderItem: ListRenderItem<Comment> = useCallback(
    ({ item }) => <CommentRow comment={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Comment) => item.id, []);

  const post = postQuery.data;

  if (postQuery.isPending) {
    return (
      <SafeAreaView style={styles.wrap} edges={['top']}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} />
        </View>
        <FloatingBack onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  if (postQuery.isError || !post) {
    return (
      <SafeAreaView style={styles.wrap} edges={['top']}>
        <ErrorState
          message="Не удалось загрузить публикацию"
          actionLabel="Повторить"
          onRetry={() => postQuery.refetch()}
        />
        <FloatingBack onBack={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isPaid = post.tier === 'paid';

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}
      >
        <FlatList
          data={comments}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.contentCard}>
              <View style={styles.authorRow}>
                <Avatar uri={post.author.avatarUrl} size={40} />
                <Text style={styles.authorName} numberOfLines={1}>
                  {post.author.displayName}
                </Text>
              </View>

              <Image
                source={{ uri: post.coverUrl }}
                style={styles.cover}
                contentFit="cover"
                transition={200}
              />

              <View style={styles.textBlock}>
                <Text style={styles.title}>{post.title}</Text>
                {isPaid ? (
                  <Text style={styles.body} numberOfLines={2}>
                    {post.preview}
                  </Text>
                ) : (
                  <Text style={styles.body}>{post.body || post.preview}</Text>
                )}
              </View>

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

              <View style={styles.commentsHeader}>
                <Text style={styles.commentsCount}>
                  {pluralComments(post.commentsCount)}
                </Text>
                <Text style={styles.commentsSort}>Сначала новые</Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            commentsQuery.isPending ? (
              <View style={styles.commentsLoader}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : (
              <Text style={styles.emptyComments}>Пока нет комментариев</Text>
            )
          }
          ListFooterComponent={
            commentsQuery.isFetchingNextPage ? (
              <View style={styles.commentsLoader}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
        />

        <View style={{ paddingBottom: insets.bottom }}>
          <CommentComposer
            onSubmit={async (text) => {
              await createComment.mutateAsync(text);
            }}
            pending={createComment.isPending}
          />
        </View>
      </KeyboardAvoidingView>

      <FloatingBack onBack={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

const FloatingBack: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel="Назад"
    onPress={onBack}
    style={({ pressed }) => [styles.backBtn, pressed && styles.backPressed]}
    hitSlop={12}
  >
    <BackIcon />
  </Pressable>
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.cardBg,
  },
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  backBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.scrim,
  },
  backPressed: {
    opacity: 0.7,
  },
  listContent: {
    paddingBottom: spacing.l,
  },
  contentCard: {
    backgroundColor: colors.cardBg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
  },
  authorName: {
    ...typography.authorName,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.skeleton,
  },
  textBlock: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.s,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  body: {
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
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.s,
  },
  commentsCount: {
    ...typography.sectionLabel,
    color: colors.textMuted,
  },
  commentsSort: {
    ...typography.link,
    color: colors.primary,
  },
  commentsLoader: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
  emptyComments: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.l,
  },
});
