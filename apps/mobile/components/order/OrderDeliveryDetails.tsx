import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import shopIcon from '@/assets/icons/shop.png';
import customerIcon from '@/assets/icons/customer.png';

import { AppText } from '@/components/common/AppText';

import type { OrderDeliveryDetails as DeliveryDetails } from '@/features/orders/orders.types';

import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SIZES, SPACING } from '@/theme';

interface OrderDeliveryDetailsProps {
  details: DeliveryDetails;
}

export function OrderDeliveryDetails({ details }: OrderDeliveryDetailsProps) {
  return (
    <View style={styles.container}>
      <AppText variant="bodyMedium" color="primary" style={styles.title}>
        Delivery Details
      </AppText>

      {/* Shop */}
      <View style={[styles.row, styles.shopRow]}>
        <View style={styles.iconContainer}>
          <Image source={shopIcon} style={styles.icon} resizeMode="contain" />
        </View>

        <View style={styles.textContainer}>
          <AppText
            variant="bodyMedium"
            color="primary"
            style={styles.primaryText}
            numberOfLines={1}
          >
            {details.shopName}
          </AppText>

          <AppText variant="caption" color="primary" style={styles.secondaryText} numberOfLines={1}>
            {details.shopAddress}
          </AppText>
        </View>
      </View>

      {/* Customer */}
      <View style={[styles.row, styles.customerRow]}>
        <View style={styles.iconContainer}>
          <Image source={customerIcon} style={styles.icon} resizeMode="contain" />
        </View>

        <View style={styles.textContainer}>
          <AppText
            variant="bodyMedium"
            color="primary"
            style={styles.primaryText}
            numberOfLines={1}
          >
            {details.customerName}
          </AppText>

          <AppText variant="caption" color="primary" style={styles.secondaryText} numberOfLines={1}>
            {details.customerPhone}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.md,
  },

  title: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.sm,
  },

  row: {
    height: SIZES.smallButtonHeight,
    paddingHorizontal: SPACING.sm,
    backgroundColor: COLORS.orange.card,
    flexDirection: 'row',
    alignItems: 'center',
  },

  shopRow: {
    borderTopLeftRadius: RADIUS.md,
    borderTopRightRadius: RADIUS.md,
  },

  customerRow: {
    borderBottomLeftRadius: RADIUS.md,
    borderBottomRightRadius: RADIUS.md,
    borderTopWidth: SIZES.borderThin,
    borderTopColor: COLORS.surface,
  },

  iconContainer: {
    width: SIZES.iconLarge,
    height: SIZES.iconLarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },

  icon: {
    width: SIZES.iconMedium,
    height: SIZES.iconMedium,
  },

  textContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  primaryText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.md,
    flexShrink: 0,
  },

  secondaryText: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.sm,
  },
});
