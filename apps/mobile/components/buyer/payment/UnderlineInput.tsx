import React from 'react';
import { StyleSheet, TextInput, type TextInputProps, View, type ViewStyle } from 'react-native';

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
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.sm + 1,
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingVertical: SPACING.xs + 2,
    fontSize: FONT_SIZE.md,
    fontFamily: FONT_FAMILY.medium,
    color: COLORS.text.primary,
  },
});
