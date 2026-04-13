import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, sizes, typography } from '../theme/tokens';

interface Props {
  active?: boolean;
  count: number;
  icon: React.ReactNode;
  iconActive?: React.ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export const ActionChip: React.FC<Props> = ({
  active = false,
  count,
  icon,
  iconActive,
  onPress,
  accessibilityLabel,
}) => {
  const bg = active ? colors.likeActive : colors.chipBg;
  const textColor = active ? colors.likeActiveText : colors.textSecondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={styles.icon}>{active && iconActive ? iconActive : icon}</View>
      <Text style={[styles.count, { color: textColor }]}>{count}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    width: sizes.actionChip.width,
    height: sizes.actionChip.height,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  icon: {
    width: sizes.icon,
    height: sizes.icon,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    ...typography.chip,
    marginLeft: 4,
    textAlign: 'center',
    minWidth: 17,
  },
});
