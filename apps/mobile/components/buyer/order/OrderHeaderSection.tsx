import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import truckFillIcon from '@/assets/icons/truck-fill.png';
import { AppText } from '@/components/common/AppText';
import { TRACK_ORDER_SCREEN } from '@/constants/order';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from '@/theme';

interface OrderHeaderSectionProps {
  orderId?: string;
  placedDate?: string;
  confirmedText?: string;
  deliveryWindow?: string;
  noticeText?: string;
}

export function OrderHeaderSection({
  orderId = TRACK_ORDER_SCREEN.defaultOrderId,
  placedDate = TRACK_ORDER_SCREEN.defaultPlacedDate,
  confirmedText = TRACK_ORDER_SCREEN.confirmedBadge,
  deliveryWindow = TRACK_ORDER_SCREEN.defaultDeliveryWindow,
  noticeText = TRACK_ORDER_SCREEN.outForDeliveryNotice,
}: OrderHeaderSectionProps) {
  return (
    <View style={styles.container}>
      {/* Order ID & Confirmed Status Header */}
      <View style={styles.orderIdHeaderRow}>
        <View style={styles.orderIdCol}>
          <AppText style={styles.orderIdLabel}>{TRACK_ORDER_SCREEN.orderIdLabel}</AppText>

          <AppText style={styles.orderIdValue}>{orderId}</AppText>

          <AppText style={styles.placedDateText}>
            {TRACK_ORDER_SCREEN.placedOnPrefix} {placedDate}
          </AppText>
        </View>

        {/* Confirmed Badge */}
        <View style={styles.confirmedBadge}>
          <Ionicons name="checkmark-circle" size={18} color={COLORS.green.dark} />
          <AppText style={styles.confirmedText}>{confirmedText}</AppText>
        </View>
      </View>

      {/* Delivery At Banner (Rectangle 366) */}
      <View style={styles.deliveryBanner}>
        <Image source={truckFillIcon} style={styles.truckIcon} resizeMode="contain" />

        <View style={styles.deliveryBannerTextCol}>
          <AppText style={styles.deliveryAtLabel}>{TRACK_ORDER_SCREEN.deliveryAtLabel}</AppText>
          <AppText style={styles.deliveryWindowText}>{deliveryWindow}</AppText>
        </View>
      </View>

      {/* Subtitle Notification */}
      <AppText style={styles.deliveryNotice}>{noticeText}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },

  orderIdHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },

  orderIdCol: {
    gap: 2,
  },

  orderIdLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.subtitle,
    color: COLORS.black,
  },

  orderIdValue: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: FONT_SIZE.title,
    lineHeight: LINE_HEIGHT.lg,
    color: COLORS.black,
    marginTop: 2,
  },

  placedDateText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.category,
    color: COLORS.black,
    marginTop: 2,
  },

  confirmedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  confirmedText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.amount,
    color: COLORS.green.dark,
  },

  deliveryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(204, 93, 40, 0.20)',
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    gap: SPACING.md,
    minHeight: 64,
  },

  truckIcon: {
    width: 32,
    height: 32,
  },

  deliveryBannerTextCol: {
    gap: 2,
  },

  deliveryAtLabel: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 13,
    color: COLORS.text.primary,
  },

  deliveryWindowText: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 14,
    lineHeight: 17,
    color: COLORS.orange.normal,
  },

  deliveryNotice: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.category,
    color: COLORS.black,
    marginTop: -4,
  },
});
