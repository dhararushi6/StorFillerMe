import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, RADIUS, SPACING, useResponsive } from '@/theme';

interface ProductDetailRowProps {
  label: string;
  expanded?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
}

export function ProductDetailRow({
  label,
  expanded = false,
  onToggle,
  children,
}: ProductDetailRowProps) {
  const { product } = useResponsive();

  const hasContent = expanded && React.Children.count(children) > 0;

  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [
          styles.header,
          {
            minHeight: product.detailRowHeight,
          },
          pressed && styles.pressed,
        ]}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={label}
      >
        <AppText variant="bodyMedium" color="primary" style={styles.label}>
          {label}
        </AppText>

        <AppIcon
          name={expanded ? 'chevronDown' : 'chevronRight'}
          size="md"
          color={COLORS.text.primary}
        />
      </Pressable>

      {hasContent && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: RADIUS.xs,
    backgroundColor: COLORS.surface,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  label: {
    fontFamily: FONT_FAMILY.medium,
  },

  body: {
    gap: SPACING.md,
    paddingBottom: SPACING.md,
  },

  pressed: {
    opacity: 0.85,
  },
});
