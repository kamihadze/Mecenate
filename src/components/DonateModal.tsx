import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, sizes, spacing, typography } from '../theme/tokens';
import { DonateIcon } from './icons/DonateIcon';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export const DonateModal: React.FC<Props> = ({ visible, onClose, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.iconWrap}>
            <DonateIcon size={30} color={colors.onPrimary} />
          </View>
          <Text style={styles.title}>Поддержать автора</Text>
          <Text style={styles.message}>
            Ваш донат поможет автору создавать новый контент и откроет доступ к закрытой публикации.
          </Text>
          <Pressable
            accessibilityRole="button"
            onPress={handleConfirm}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.primaryLabel}>Отправить донат</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
          >
            <Text style={styles.secondaryLabel}>Отмена</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.cardBg,
    borderRadius: radii.card,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.m,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.s,
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: spacing.l,
    height: sizes.primaryButtonHeight,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  primaryLabel: {
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
  },
  secondaryLabel: {
    ...typography.buttonLarge,
    color: colors.textPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
});
