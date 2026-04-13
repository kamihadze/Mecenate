import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { Post } from '../api/types';
import { usePostsFeed } from '../hooks/usePostsFeed';
import { colors, spacing } from '../theme/tokens';
import { PostCard } from '../components/PostCard';
import { ErrorState } from '../components/ErrorState';
import { PostSkeleton } from '../components/PostSkeleton';

export const FeedScreen: React.FC = observer(() => {
  const query = usePostsFeed();

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

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Post) => item.id, []);

  if (query.isPending && !query.isRefetching) {
    return (
      <View style={styles.listContainer}>
        {Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </View>
    );
  }

  if (query.isError && posts.length === 0) {
    return (
      <ErrorState
        message="Не удалось загрузить публикации"
        actionLabel="Повторить"
        onRetry={() => query.refetch()}
      />
    );
  }

  return (
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
  );
});

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: spacing.l,
    paddingBottom: spacing.xl,
  },
  footer: {
    paddingVertical: spacing.l,
    alignItems: 'center',
  },
});
