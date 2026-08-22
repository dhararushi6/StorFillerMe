import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, SPACING } from '@/theme';

interface ProductSectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function ProductSectionHeader({
  title,
  actionLabel,
  onActionPress,
}: ProductSectionHeaderProps) {
  return (
    <View style={styles.container}>
      <AppText variant="subheading" color="primary">
        {title}
      </AppText>

      {actionLabel !== undefined && (
        <Pressable
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} ${title}`}
          hitSlop={8}
        >
          <AppText variant="caption" style={styles.actionLabel}>
            {actionLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },

  actionLabel: {
    color: COLORS.orange.normal,
  },
});
