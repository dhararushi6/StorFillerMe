import React from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, SPACING } from '@/theme';

interface UnderlineInputProps extends TextInputProps {
  label: string;
  containerStyle?: ViewStyle;
}

export function UnderlineInput({ label, containerStyle, style, ...props }: UnderlineInputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      <AppText variant="bodyMedium" color="primary" style={styles.label}>
        {label}
      </AppText>

      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={COLORS.text.muted}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.xs,
  },

  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: 17,
    color: COLORS.text.primary,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 0,
    paddingVertical: SPACING.xs + 2,
    paddingHorizontal: 0,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text.primary,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
      } as Record<string, unknown>,
    }),
  },
});
