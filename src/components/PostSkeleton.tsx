import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

export const PostSkeleton: React.FC = () => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.avatar} />
      <View style={styles.nameLine} />
    </View>
    <View style={styles.cover} />
    <View style={styles.body}>
      <View style={[styles.line, { width: '45%' }]} />
      <View style={[styles.line, { width: '100%', marginTop: 10 }]} />
    </View>
    <View style={styles.actions}>
      <View style={styles.chip} />
      <View style={styles.chip} />
    </View>
  </View>
);

const block = { backgroundColor: colors.skeleton } as const;

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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    ...block,
  },
  nameLine: {
    width: 120,
    height: 14,
    borderRadius: radii.skeleton,
    marginLeft: spacing.m,
    ...block,
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
    ...block,
  },
  body: {
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
  },
  line: {
    height: 16,
    borderRadius: radii.skeleton,
    ...block,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: spacing.l,
    paddingTop: spacing.l,
    paddingBottom: spacing.l,
    gap: 8,
  },
  chip: {
    width: 63,
    height: 36,
    borderRadius: 9999,
    ...block,
  },
});
