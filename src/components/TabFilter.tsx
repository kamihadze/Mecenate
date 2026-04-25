import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';

export type FeedFilter = 'all' | 'free' | 'paid';

interface Tab {
  value: FeedFilter;
  label: string;
}

const TABS: Tab[] = [
  { value: 'all', label: 'Все' },
  { value: 'free', label: 'Бесплатные' },
  { value: 'paid', label: 'Платные' },
];

interface Props {
  value: FeedFilter;
  onChange: (value: FeedFilter) => void;
}

export const TabFilter: React.FC<Props> = ({ value, onChange }) => (
  <View style={styles.outer}>
    <View style={styles.container}>
      {TABS.map((tab) => {
        const active = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.value)}
            style={({ pressed }) => [
              styles.segment,
              active && styles.segmentActive,
              pressed && !active ? styles.segmentPressed : null,
            ]}
          >
            <Text
              numberOfLines={1}
              style={active ? styles.labelActive : styles.labelInactive}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    backgroundColor: colors.screenBg,
  },
  container: {
    flexDirection: 'row',
    height: 38,
    borderRadius: 999,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.tabBorder,
    overflow: 'hidden',
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentPressed: {
    opacity: 0.85,
  },
  labelActive: {
    ...typography.tabActive,
    color: colors.onPrimary,
  },
  labelInactive: {
    ...typography.tabInactive,
    color: colors.textSecondary,
  },
});
