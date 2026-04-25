import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { Post, PostTier } from '../api/types';
import { usePostsFeed } from '../hooks/usePostsFeed';
import { colors, spacing } from '../theme/tokens';
import { PostCard } from '../components/PostCard';
import { ErrorState } from '../components/ErrorState';
import { PostSkeleton } from '../components/PostSkeleton';
import { FeedFilter, TabFilter } from '../components/TabFilter';
import { RootStackParamList } from '../navigation/types';
import { useUIStore } from '../stores/StoreContext';

const filterToTier = (filter: FeedFilter): PostTier | undefined => {
  if (filter === 'all') return undefined;
  return filter;
};

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Feed'>;

export const FeedScreen: React.FC = observer(() => {
  const ui = useUIStore();
  const navigation = useNavigation<Navigation>();
  const [filter, setFilter] = useState<FeedFilter>('all');
  const query = usePostsFeed({ tier: filterToTier(filter) });

  const posts = useMemo<Post[]>(
    () => (query.data?.pages ?? []).flatMap((page) => page.posts),
    [query.data],
  );

  const handleEndReached = useCallback(() => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  const handleRefresh = useCallback(() => {
    query.refetch();
  }, [query]);

  const handleOpenPost = useCallback(
    (post: Post) => {
      navigation.navigate('PostDetail', { postId: post.id });
    },
    [navigation],
  );

  const handleOpenComments = useCallback(
    (post: Post) => {
      navigation.navigate('PostDetail', { postId: post.id, focusComposer: true });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => (
      <PostCard
        post={item}
        onPress={handleOpenPost}
        onCommentPress={handleOpenComments}
      />
    ),
    [handleOpenPost, handleOpenComments],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  const isFirstLoad = query.isPending && !query.isRefetching;
  const isBlockingError = query.isError && posts.length === 0;

  return (
    <SafeAreaView style={styles.wrap} edges={['top']}>
      <TabFilter value={filter} onChange={setFilter} />

      {isFirstLoad ? (
        <View style={styles.listContainer}>
          {Array.from({ length: 3 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </View>
      ) : isBlockingError ? (
        <ErrorState
          message="Не удалось загрузить публикации"
          actionLabel="Повторить"
          onRetry={() => query.refetch()}
          onBack={ui.forceError ? () => ui.clearError() : undefined}
        />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          onEndReachedThreshold={0.4}
          onEndReached={handleEndReached}
          refreshControl={
            <RefreshControl
              refreshing={query.isRefetching && !query.isFetchingNextPage}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListFooterComponent={
            query.isFetchingNextPage ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          removeClippedSubviews
          initialNumToRender={5}
          windowSize={7}
        />
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: colors.screenBg,
  },
  listContainer: {
    paddingTop: spacing.l,
    paddingBottom: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
});
