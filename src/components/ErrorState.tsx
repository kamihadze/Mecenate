import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, radii, sizes, spacing, typography } from '../theme/tokens';

interface Props {
  message?: string;
  actionLabel?: string;
  onRetry: () => void;
  onBack?: () => void;
  backLabel?: string;
}

export const ErrorState: React.FC<Props> = ({
  message = 'Не удалось загрузить публикации',
  actionLabel = 'Повторить',
  onRetry,
  onBack,
  backLabel = 'Назад',
}) => (
  <View style={styles.wrap}>
    <Image
      source={require('../../assets/images/axolotl.png')}
      style={styles.illustration}
      contentFit="contain"
    />
    <Text style={styles.message}>{message}</Text>
    <Pressable
      accessibilityRole="button"
      onPress={onRetry}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
    >
      <Text style={styles.buttonLabel}>{actionLabel}</Text>
    </Pressable>
    {onBack && (
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
      >
        <Text style={styles.secondaryLabel}>{backLabel}</Text>
      </Pressable>
    )}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
  },
  illustration: {
    width: 160,
    height: 160,
  },
  message: {
    ...typography.paidMessage,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.l,
  },
  button: {
    marginTop: spacing.l,
    height: sizes.primaryButtonHeight,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: spacing.xl,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonLabel: {
    ...typography.buttonLarge,
    color: colors.onPrimary,
  },
  secondaryButton: {
    marginTop: spacing.s,
    height: sizes.primaryButtonHeight,
    borderRadius: radii.button,
    backgroundColor: colors.chipBg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: spacing.xl,
  },
  secondaryLabel: {
    ...typography.buttonLarge,
    color: colors.textPrimary,
  },
});
