import React from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';

import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT } from '@/theme';

type TextVariant =
  'display' | 'title' | 'heading' | 'subheading' | 'body' | 'bodyMedium' | 'caption' | 'button';

type TextColor = keyof typeof COLORS.text;

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: TextColor;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const VARIANT_STYLES: Record<TextVariant, TextStyle> = {
  display: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.display,
    lineHeight: LINE_HEIGHT.display,
  },

  title: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxxl,
    lineHeight: LINE_HEIGHT.display,
  },

  heading: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
  },

  subheading: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },

  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  bodyMedium: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  caption: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  button: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.lg,
  },
};

export function AppText({
  variant = 'body',
  color = 'primary',
  children,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      {...props}
      style={[styles.base, VARIANT_STYLES[variant], { color: COLORS.text[color] }, style]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
