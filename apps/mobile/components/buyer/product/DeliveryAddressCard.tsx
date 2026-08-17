import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppIcon } from '@/components/common/AppIcon';
import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, RADIUS, SPACING } from '@/theme';

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
    <View style={styles.wrapper}>
      <View style={styles.addressBox}>
        <AppIcon name="location" size="md" color={COLORS.orange.normal} />

        <View style={styles.addressText}>
          <AppText variant="bodyMedium" color="primary" style={styles.nameText}>
            {name}
          </AppText>

          <AppText variant="caption" color="secondary" numberOfLines={1} style={styles.addressLine}>
            {address}
          </AppText>
        </View>

        <Pressable
          onPress={onChangePress}
          accessibilityRole="button"
          accessibilityLabel="Change delivery address"
          hitSlop={8}
        >
          <AppText variant="caption" color="primary" style={styles.changeLabel}>
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
  wrapper: {
    gap: SPACING.xs,
  },

  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md - 2,
    borderWidth: 1,
    borderColor: COLORS.orange.lightActive,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },

  addressText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  nameText: {
    fontFamily: FONT_FAMILY.bold,
  },

  addressLine: {
    flexShrink: 1,
    fontFamily: FONT_FAMILY.regular,
    color: COLORS.text.secondary,
  },

  changeLabel: {
    fontFamily: FONT_FAMILY.medium,
    textDecorationLine: 'underline',
    color: COLORS.text.primary,
  },

  deliveryBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.successLight,
    borderRadius: RADIUS.xs,
  },

  deliveryText: {
    fontFamily: FONT_FAMILY.bold,
    color: COLORS.success,
    textAlign: 'center',
    fontSize: 12,
  },
});
