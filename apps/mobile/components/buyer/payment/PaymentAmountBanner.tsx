import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { COLORS, FONT_FAMILY, FONT_SIZE, LINE_HEIGHT, RADIUS, SPACING } from '@/theme';

interface PaymentAmountBannerProps {
  label: string;
  amount: number;
}

export function PaymentAmountBanner({ label, amount }: PaymentAmountBannerProps) {
  return (
    <View style={styles.banner}>
      <AppText variant="bodyMedium" style={styles.label}>
        {label}
      </AppText>

      <AppText variant="bodyMedium" style={styles.amount}>
        ₹ {amount}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.payment.amountBanner,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
  },

  label: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.payment.amountText,
  },

  amount: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    color: COLORS.payment.amountText,
  },
});
