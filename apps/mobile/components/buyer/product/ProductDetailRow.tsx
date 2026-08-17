import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, RADIUS, SPACING, useResponsive } from '@/theme';

interface ProductDetailRowProps {
  label: string;
  onPress?: () => void;
}

export function ProductDetailRow({ label, onPress }: ProductDetailRowProps) {
  const { product } = useResponsive();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        {
          minHeight: product.detailRowHeight,
        },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <AppText variant="bodyMedium" color="primary" style={styles.label}>
        {label}
      </AppText>

      <AppIcon name="chevronRight" size="md" color={COLORS.text.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },

  label: {
    fontFamily: FONT_FAMILY.medium,
  },

  pressed: {
    opacity: 0.85,
  },
});
