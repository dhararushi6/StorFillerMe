import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { type IconName } from '@/constants/icons';

import { COLORS, FONT_FAMILY, FONT_SIZE, SIZES, SPACING } from '@/theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;

  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  onFocusChange?: (focused: boolean) => void;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

const webInputStyle =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as TextStyle) : undefined;

export function AppInput({
  label,
  error,
  helperText,
  required = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  onFocusChange,
  containerStyle,
  inputContainerStyle,
  editable = true,
  ...textInputProps
}: AppInputProps) {
  const [focused, setFocused] = useState(false);

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

      <View style={[styles.inputContainer, inputContainerStyle]}>
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
            onFocusChange?.(true);
            textInputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onFocusChange?.(false);
            textInputProps.onBlur?.(event);
          }}
          style={[
            styles.input,
            textInputProps.multiline && styles.multiline,
            !editable && styles.disabledText,
            webInputStyle,
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
    marginLeft: SPACING.xs,
  },

  /*
   * AppInput itself has NO border.
   * Screens/components decide whether they need one.
   */
  inputContainer: {
    minHeight: SIZES.inputHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: SPACING.md,
  },

  /*
   * Actual TextInput is completely borderless.
   */
  input: {
    flex: 1,
    minHeight: SIZES.inputHeight,
    paddingVertical: 0,
    paddingHorizontal: SPACING.sm,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: COLORS.text.primary,
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
  },

  multiline: {
    paddingVertical: SPACING.md,
    minHeight: SIZES.reviewInputHeight,
    textAlignVertical: 'top',
  },

  disabledText: {
    color: COLORS.text.muted,
  },

  message: {
    marginTop: SPACING.xs,
  },
});
