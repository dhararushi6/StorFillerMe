import React, { useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { type IconName } from '@/constants/icons';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;

  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;

  containerStyle?: StyleProp<ViewStyle>;
}

export function AppInput({
  label,
  error,
  helperText,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  editable = true,
  ...textInputProps
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

  const hasError = Boolean(error);

  return (
    <View style={containerStyle}>
      {label && (
        <View style={styles.labelRow}>
          <AppText variant="caption" style={styles.label}>
            {label}
          </AppText>

          {required && (
            <AppText variant="caption" color="secondary" style={styles.required}>
              *
            </AppText>
          )}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          focused && styles.focused,
          hasError && styles.error,
          !editable && styles.disabled,
        ]}
      >
        {leftIcon && (
          <AppIcon
            name={leftIcon}
            size="md"
            color={focused ? COLORS.orange.normal : COLORS.text.secondary}
          />
        )}

        <TextInput
          {...textInputProps}
          editable={editable}
          placeholderTextColor={COLORS.text.muted}
          onFocus={(event) => {
            setFocused(true);
            textInputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            textInputProps.onBlur?.(event);
          }}
          style={[
            styles.input,
            textInputProps.multiline && styles.multiline,
            !editable && styles.disabledText,
            textInputProps.style,
          ]}
        />

        {rightIcon && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Input action"
            disabled={!onRightIconPress}
            onPress={onRightIconPress}
            hitSlop={8}
          >
            <AppIcon
              name={rightIcon}
              size="md"
              color={focused ? COLORS.orange.normal : COLORS.text.secondary}
            />
          </Pressable>
        )}
      </View>

      {error ? (
        <AppText variant="caption" color="danger" style={styles.message}>
          {error}
        </AppText>
      ) : helperText ? (
        <AppText variant="caption" color="secondary" style={styles.message}>
          {helperText}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  label: {
    color: COLORS.text.primary,
  },

  required: {
    marginLeft: 2,
  },

  inputContainer: {
    minHeight: SIZES.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
  },

  focused: {
    borderColor: COLORS.orange.normal,
  },

  error: {
    borderColor: COLORS.danger,
  },

  disabled: {
    backgroundColor: COLORS.yellow.lightActive,
    borderColor: COLORS.yellow.normalActive,
  },

  input: {
    flex: 1,
    minHeight: SIZES.inputHeight,
    paddingVertical: 0,
    paddingHorizontal: SPACING.sm,
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },

  multiline: {
    paddingVertical: SPACING.md,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  disabledText: {
    color: COLORS.text.muted,
  },

  message: {
    marginTop: SPACING.xs,
  },
});
