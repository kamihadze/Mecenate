import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, sizes, typography } from '../theme/tokens';
import { useUIStore } from '../stores/StoreContext';
import { DonateIcon } from './icons/DonateIcon';
import { DonateModal } from './DonateModal';

export const PaidLock: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const ui = useUIStore();

  return (
    <View style={styles.overlay} accessibilityRole="summary">
      <View style={styles.iconWrap}>
        <DonateIcon size={30} color="#FFFFFF" />
      </View>
      <Text style={styles.message}>
        Контент скрыт пользователем.{'\n'}Доступ откроется после доната
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setModalVisible(true)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Text style={styles.buttonLabel}>Отправить донат</Text>
      </Pressable>
      <DonateModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={() => ui.triggerError()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.paidMessage,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 12,
    height: sizes.primaryButtonHeight,
    borderRadius: radii.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    maxWidth: 239,
    width: '80%',
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonLabel: {
    ...typography.buttonLarge,
    color: '#FFFFFF',
  },
});
