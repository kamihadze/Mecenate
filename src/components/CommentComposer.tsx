import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { colors, spacing, typography } from '../theme/tokens';
import { PaperPlaneIcon } from './icons/PaperPlaneIcon';

export interface CommentComposerHandle {
  focus: () => void;
}

interface Props {
  onSubmit: (text: string) => void | Promise<void>;
  pending?: boolean;
  placeholder?: string;
  maxLength?: number;
}

export const CommentComposer = forwardRef<CommentComposerHandle, Props>(({
  onSubmit,
  pending,
  placeholder = 'Ваш комментарий',
  maxLength = 500,
}, ref) => {
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));
  const [value, setValue] = useState('');
  const trimmed = value.trim();
  const canSend = trimmed.length > 0 && !pending;

  const handleSend = async () => {
    if (!canSend) return;
    try {
      await onSubmit(trimmed);
      setValue('');
    } catch {
      // error reported via QueryCache.onError → UIStore
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.inputWrap}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          style={styles.input}
          multiline
          maxLength={maxLength}
          editable={!pending}
          returnKeyType="send"
          blurOnSubmit
          onSubmitEditing={handleSend}
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Отправить комментарий"
        accessibilityState={{ disabled: !canSend }}
        onPress={handleSend}
        disabled={!canSend}
        style={({ pressed }) => [
          styles.send,
          pressed && canSend ? styles.sendPressed : null,
        ]}
      >
        {pending ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <PaperPlaneIcon
            size={30}
            color={canSend ? colors.primary : colors.primarySoft}
          />
        )}
      </Pressable>
    </View>
  );
});

CommentComposer.displayName = 'CommentComposer';

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    gap: 10,
    backgroundColor: colors.cardBg,
  },
  inputWrap: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.divider,
    paddingHorizontal: spacing.l,
    justifyContent: 'center',
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    paddingTop: 8,
    paddingBottom: 8,
  },
  send: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPressed: {
    opacity: 0.6,
  },
});
