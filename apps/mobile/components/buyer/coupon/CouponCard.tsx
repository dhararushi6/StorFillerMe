import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import sealPercentGreenIcon from '@/assets/icons/seal-percent-fill-1.png';
import sealPercentRedIcon from '@/assets/icons/seal-percent-fill-2.png';
import { AppText } from '@/components/common/AppText';
import { type Coupon, COUPON_SCREEN } from '@/constants/coupon';
import { COLORS, FONT_FAMILY, FONT_SIZE, RADIUS, SPACING } from '@/theme';

interface CouponCardProps {
  coupon: Coupon;
  onApply: (code: string) => void;
  onTermsPress?: (coupon: Coupon) => void;
}

export function CouponCard({ coupon, onApply, onTermsPress }: CouponCardProps) {
  const accentColor = coupon.variant === 'success' ? COLORS.green.dark : COLORS.text.danger;
  const iconSource = coupon.variant === 'success' ? sealPercentGreenIcon : sealPercentRedIcon;

  return (
    <View style={styles.card}>
      {/* Top Row: Icon + Code + Discount & Apply Action */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <Image source={iconSource} style={styles.badgeIcon} resizeMode="contain" />

          <View style={styles.codeGroup}>
            <AppText style={styles.codeText}>{coupon.code}</AppText>

            <AppText style={[styles.discountText, { color: accentColor }]}>
              {coupon.discount}
            </AppText>
          </View>
        </View>

        <Pressable
          onPress={() => onApply(coupon.code)}
          accessibilityRole="button"
          accessibilityLabel={`Apply coupon ${coupon.code}`}
          hitSlop={8}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <AppText style={styles.applyText}>{COUPON_SCREEN.applyButton}</AppText>
        </Pressable>
      </View>

      {/* Minimum Order Value */}
      <AppText style={styles.minOrderText}>{coupon.minOrderText}</AppText>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Row: Validity & T&C */}
      <View style={styles.bottomRow}>
        <AppText style={[styles.validityText, { color: accentColor }]}>
          {coupon.validityText}
        </AppText>

        <Pressable
          onPress={() => onTermsPress?.(coupon)}
          accessibilityRole="link"
          accessibilityLabel={`${coupon.code} terms and conditions`}
          hitSlop={8}
        >
          <AppText style={[styles.termsText, { color: accentColor }]}>
            {COUPON_SCREEN.termsLabel}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.coupon.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: SPACING.md,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  badgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  badgeIcon: {
    width: 36,
    height: 36,
  },

  codeGroup: {
    gap: 2,
  },

  codeText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: 17,
    color: COLORS.black,
  },

  discountText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: 17,
  },

  applyText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: 17,
    color: COLORS.black,
  },

  minOrderText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: 14,
    color: COLORS.black,
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: '#EFEFEF',
    marginVertical: 10,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  validityText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: 14,
  },

  termsText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.sm,
    lineHeight: 14,
    textDecorationLine: 'underline',
  },

  pressed: {
    opacity: 0.7,
  },
});
