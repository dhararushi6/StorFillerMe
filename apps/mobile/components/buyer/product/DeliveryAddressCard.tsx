import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, RADIUS, SPACING } from '@/theme';

interface DeliveryAddressCardProps {
  name: string;
  address: string;
  changeLabel: string;
  deliveryWindow: string;
  onChangePress?: () => void;
}

export function DeliveryAddressCard({
  name,
  address,
  changeLabel,
  deliveryWindow,
  onChangePress,
}: DeliveryAddressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.addressRow}>
        <AppIcon name="location" size="md" color={COLORS.orange.normal} />

        <View style={styles.addressText}>
          <AppText variant="bodyMedium" color="primary" numberOfLines={1}>
            {name}
          </AppText>

          <AppText variant="body" color="muted" numberOfLines={1} style={styles.addressLine}>
            {address}
          </AppText>
        </View>

        <Pressable
          onPress={onChangePress}
          accessibilityRole="button"
          accessibilityLabel="Change delivery address"
          hitSlop={8}
        >
          <AppText variant="caption" style={styles.changeLabel}>
            {changeLabel}
          </AppText>
        </Pressable>
      </View>

      <View style={styles.deliveryBanner}>
        <AppText variant="caption" style={styles.deliveryText}>
          {deliveryWindow}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },

  addressText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: SPACING.sm,
  },

  addressLine: {
    flexShrink: 1,
  },

  changeLabel: {
    color: COLORS.orange.normal,
  },

  deliveryBanner: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.successLight,
  },

  deliveryText: {
    color: COLORS.success,
  },
});
