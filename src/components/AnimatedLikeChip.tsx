import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, radii, sizes, typography } from '../theme/tokens';
import { LikeIcon, LikeIconSolid } from './icons/LikeIcon';

interface Props {
  active: boolean;
  count: number;
  disabled?: boolean;
  onPress: () => void;
}

const SPRING_BUMP = { damping: 9, stiffness: 240, mass: 0.55 };
const SPRING_REST = { damping: 14, stiffness: 180, mass: 0.6 };

export const AnimatedLikeChip: React.FC<Props> = ({
  active,
  count,
  disabled,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const countOffset = useSharedValue(0);
  const countOpacity = useSharedValue(1);
  const prevCount = useRef(count);

  useEffect(() => {
    if (prevCount.current === count) return;
    const increased = count > prevCount.current;
    countOffset.value = increased ? 12 : -12;
    countOpacity.value = 0;
    countOffset.value = withTiming(0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    countOpacity.value = withTiming(1, { duration: 200 });
    prevCount.current = count;
  }, [count, countOffset, countOpacity]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const countStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: countOffset.value }],
    opacity: countOpacity.value,
  }));

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSequence(
      withSpring(1.3, SPRING_BUMP),
      withSpring(1, SPRING_REST),
    );
    Haptics.impactAsync(
      active
        ? Haptics.ImpactFeedbackStyle.Light
        : Haptics.ImpactFeedbackStyle.Medium,
    ).catch(() => {});
    onPress();
  };

  const bg = active ? colors.likeActive : colors.chipBg;
  const textColor = active ? colors.likeActiveText : colors.textSecondary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Лайк"
      accessibilityState={{ selected: active, disabled }}
      onPress={handlePress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: bg, opacity: disabled ? 0.6 : pressed ? 0.85 : 1 },
      ]}
    >
      <Animated.View style={[styles.icon, iconStyle]}>
        {active ? (
          <LikeIconSolid color={colors.likeActiveText} />
        ) : (
          <LikeIcon color={colors.iconMuted} />
        )}
      </Animated.View>
      <Animated.Text style={[styles.count, { color: textColor }, countStyle]}>
        {count}
      </Animated.Text>
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
    overflow: 'hidden',
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
