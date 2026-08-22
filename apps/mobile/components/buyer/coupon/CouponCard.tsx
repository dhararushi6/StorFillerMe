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
  const accentColor = coupon.variant === 'success' ? COLORS.success : COLORS.danger;
  const iconSource = coupon.variant === 'success' ? sealPercentGreenIcon : sealPercentRedIcon;

  return (
    <View style={styles.card}>
      {/* Top Row: Icon + Code + Discount & Apply Action */}
      <View style={styles.topRow}>
        <View style={styles.badgeGroup}>
          <Image source={iconSource} style={styles.badgeIcon} resizeMode="contain" />

          <View style={styles.codeGroup}>
            <AppText variant="bodyMedium" color="primary" style={styles.codeText}>
              {coupon.code}
            </AppText>

            <AppText variant="caption" style={[styles.discountText, { color: accentColor }]}>
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
          <AppText variant="bodyMedium" color="primary" style={styles.applyText}>
            {COUPON_SCREEN.applyButton}
          </AppText>
        </Pressable>
      </View>

      {/* Minimum Order Value */}
      <AppText variant="caption" color="primary" style={styles.minOrderText}>
        {coupon.minOrderText}
      </AppText>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom Row: Validity & T&C */}
      <View style={styles.bottomRow}>
        <AppText variant="caption" style={[styles.validityText, { color: accentColor }]}>
          {coupon.validityText}
        </AppText>

        <Pressable
          onPress={() => onTermsPress?.(coupon)}
          accessibilityRole="link"
          accessibilityLabel={`${coupon.code} terms and conditions`}
          hitSlop={8}
        >
          <AppText variant="caption" style={[styles.termsText, { color: accentColor }]}>
            {COUPON_SCREEN.termsLabel}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
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
    gap: SPACING.xs / 2,
  },

  codeText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.md,
  },

  discountText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.sm,
  },

  applyText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.sm,
  },

  minOrderText: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.sm + 2,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  validityText: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.xs,
  },

  termsText: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: FONT_SIZE.xs,
    textDecorationLine: 'underline',
  },

  pressed: {
    opacity: 0.7,
  },
});
